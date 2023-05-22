import express, { Request, Response, Router } from "express";
import crypto from "crypto";
import { Payout } from "../models/payout";
import { Campaign } from "../models/campaign";
import { User } from "../models/user";
import { CircleCryptoPayout } from "../helpers/circle/crypto/cryptoPayout";
import { CircleAPI } from "../config";
import { Types } from "mongoose";
import { Req, authenticatetoken } from "../middleware/authenticate";
import {
  CreatePayoutPayload,
  SupportedChains,
  SupportedCurrencies,
} from "../helpers/circle/crypto/interface";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;

  try {
    const docs = await Payout.find({})
      .populate<{ campaign: Omit<Campaign, "donations" | "comments"> }>(
        "campaign",
        "-donations -comments"
      )
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const docCount = await Payout.find({}).countDocuments();
    return res.status(200).send({
      success: true,
      data: docCount,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/date/:start/:end", async (req: Request, res: Response) => {
  try {
    const docs = await Payout.find({
      // within date range
      created_at: {
        $gte: new Date(new Date(req.params.start).setHours(0, 0, 0)),
        $lt: new Date(new Date(req.params.end).setHours(23, 59, 59)),
      },
    })
      .sort({ dateCreated: 1 })
      .populate<{
        recipient: Pick<
          User,
          "active" | "username" | "dateCreated" | "avatar" | "email"
        >;
      }>("recipient", [
        "id",
        "username",
        "email",
        "avatar",
        "active",
        "dateCreated",
      ]);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const doc = await Payout.findById(id)
      .populate<{
        recipient: Pick<
          User,
          "active" | "username" | "dateCreated" | "avatar" | "email"
        >;
      }>("recipient", [
        "id",
        "username",
        "email",
        "avatar",
        "active",
        "dateCreated",
      ])
      .populate("campaign");
    if (!doc) {
      return res.status(404).send({
        success: false,
        err: "Payout of specified id not found",
      });
    }
    const circlePayout = new CircleCryptoPayout(CircleAPI);
    const payout = await circlePayout.getPayoutById(doc.payoutId);

    return res.status(200).send({
      success: true,
      data: { doc, payout },
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;
  try {
    const docs = await Payout.find({ recipient: userId })
      .populate<{ campaign: Omit<Campaign, "donations" | "comments"> }>(
        "campaign",
        "-donations -comments "
      )
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/count", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const count = await Payout.find({ recipient: userId }).countDocuments();

    return res.status(200).send({
      success: true,
      data: count,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/sum", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const sum = await Payout.aggregate([
      {
        $match: {
          recipient: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          amount: {
            $sum: "$usdAmount",
          },
        },
      },
    ]);

    return res.status(200).send({
      success: true,
      data: sum[0] ? sum[0].amount : 0,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.post("/", authenticatetoken, async (req: Req, res: Response) => {
  const payoutPayload: Pick<
    Payout,
    "recipient" | "currency" | "campaign" | "recipientId"
  > = {
    recipient: req.user?.id,
    currency: req.body.currency,
    campaign: req.body.campaignId,
    recipientId: req.user?.payoutRecipientsIds as string,
  };
  try {
    const campaign = await Campaign.findById(payoutPayload.campaign);
    if (!campaign) {
      return res.status(404).send({
        success: false,
        err: "The campaign of specidied id was not found",
      });
    }
    if (campaign.payoutStatus || campaign.payout) {
      return res.status(400).send({
        success: false,
        err: "Payout already processed for campaign",
      });
    }
    if (!req.user?.payoutRecipientsIds) {
      return res.status(400).send({
        success: false,
        err: "Account does not have associated payout Id",
      });
    }

    const circlePayout = new CircleCryptoPayout(CircleAPI);
    const masterWalletId = await circlePayout.getMasterWalletId();
    const payload: CreatePayoutPayload = {
      idempotencyKey: crypto.randomUUID(),
      source: {
        type: "wallet",
        id: masterWalletId,
      },
      destination: {
        type: "address_book",
        id: req.user.payoutRecipientsIds as string,
      },
      amount: {
        amount: String((campaign.raised * 0.97).toFixed(2)),
        currency: "USD",
      },
      toAmount: {
        currency: payoutPayload.currency as SupportedCurrencies,
      },
    };
    const payout = await circlePayout.createPayout(payload);
    const doc = await Payout.create({
      recipient: payoutPayload.recipient,
      payoutId: payout.id,
      campaign: payoutPayload.campaign,
      currency: payoutPayload.currency,
      usdAmount: String((campaign.raised * 0.97).toFixed(2)),
      recipientId: payoutPayload.recipientId,
    });
    campaign.payout = doc._id;
    await campaign.save();
    return res.status(200).send({
      success: true,
      data: { doc, payout },
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

export const payout = router;
