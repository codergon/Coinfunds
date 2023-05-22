import express, { Router, Request, Response } from "express";
import crypto from "crypto";
import {
  Req,
  authenticatetoken,
  authenticatetokenOrAnonymous,
} from "../middleware/authenticate";
import { Donation } from "../models/donations";
import { Types } from "mongoose";
import { Campaign } from "../models/campaign";
import { User } from "../models/user";
import { CircleCryptoPayment } from "../helpers/circle/crypto/cryptoPayment";
import { CircleAPI } from "../config";
import {
  CreatePaymentIntentPayload,
  RefundPaymentIntentPayLoad,
  SupportedChains,
} from "../helpers/circle/crypto/interface";
import sha256 from "crypto-js/sha256";
import { Withdrawal } from "../models/withdrawal";
import { CircleCardPayment } from "../helpers/circle/card/cardPayment";
import {
  CreateCardPayload,
  CreateCardPaymentPayload,
  RefundPaymentPayload,
} from "../helpers/circle/card/types";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;

  try {
    const docs = await Donation.find({})
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
    const docCount = await Donation.find({}).countDocuments();
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
    const docs = await Donation.find({
      // within date range
      created_at: {
        $gte: new Date(new Date(req.params.start).setHours(0, 0, 0)),
        $lt: new Date(new Date(req.params.end).setHours(23, 59, 59)),
      },
    })
      .sort({ dateCreated: 1 })
      .populate<{
        donor: Pick<
          User,
          "active" | "username" | "dateCreated" | "avatar" | "email"
        >;
      }>("donor", [
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
    const doc = await Donation.findById(id)
      .populate<{
        donor: Pick<
          User,
          "active" | "username" | "dateCreated" | "avatar" | "email"
        >;
      }>("donor", [
        "id",
        "username",
        "email",
        "avatar",
        "active",
        "dateCreated",
      ])
      .populate("campaign")
      .populate("withdrawal");
    if (!doc) {
      return res.status(404).send({
        success: false,
        err: "Donation of specified id not found",
      });
    }
    const circlePayment = new CircleCryptoPayment(CircleAPI);
    const paymentIntent = doc.paymentIntentId
      ? await circlePayment.getPaymentIntentById(doc.paymentIntentId)
      : null;
    const circleCardPayment = new CircleCardPayment(CircleAPI);
    const payment = doc.paymentId
      ? await circleCardPayment.getPaymentById(doc.paymentId)
      : null;
    return res.status(200).send({
      success: true,
      data: { doc, paymentIntent, payment },
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/donated", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;
  try {
    const docs = await Donation.find({ donor: new Types.ObjectId(userId) })
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
    console.log(error);
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/donated/count", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const count = await Donation.find({
      donor: new Types.ObjectId(userId),
    }).countDocuments();

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

router.get("/user/:id/donated/sum", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const sum = await Donation.aggregate([
      {
        $match: {
          donor: new Types.ObjectId(userId),
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
    console.log(error);
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/received", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;
  try {
    const userCampaignsIds = (
      await Campaign.find({
        owner: new Types.ObjectId(userId),
      })
    ).map((campian) => new Types.ObjectId(campian._id));
    const userReceivedDonations = await Donation.find({
      campaign: { $in: userCampaignsIds },
    })
      .populate<{ campaign: Omit<Campaign, "donations" | "comments"> }>(
        "campaign",
        "-donations -comments"
      )
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    return res.status(200).send({
      success: true,
      data: userReceivedDonations[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/received/count", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const userCampaignsIds = (
      await Campaign.find({
        owner: new Types.ObjectId(userId),
      })
    ).map((campian) => new Types.ObjectId(campian._id));
    const userReceivedDonationsCount = await Donation.find({
      campaign: { $in: userCampaignsIds },
    }).countDocuments();

    return res.status(200).send({
      success: true,
      data: userReceivedDonationsCount,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/received/sum", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const userCampaignsIds = (
      await Campaign.find({
        owner: new Types.ObjectId(userId),
      })
    ).map((campian) => new Types.ObjectId(campian._id));

    const userCampaignsReceuvedSum = await Donation.aggregate([
      {
        $match: {
          $campaign: {
            $in: userCampaignsIds,
          },
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
      data: userCampaignsReceuvedSum,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.post("/card", authenticatetoken, async (req: Req, res: Response) => {
  /*
    Donate with card
    */
  const donatePayload: Pick<
    Donation,
    "donor" | "currency" | "campaign" | "method" | "amount" | "usdAmount"
  > = {
    donor: req.user?.id,
    currency: "USD",
    campaign: req.body.campaignId,
    usdAmount: Number(req.body.amount),
    method: "CARD",
    amount: req.body.amount,
  };
  if (!req.user?.cardIds) {
    return res.status(404).send({
      success: false,
      err: "No Card Details for user",
    });
  }
  const circlePayment = new CircleCardPayment(CircleAPI);
  try {
    const campaign = await Campaign.findById(donatePayload.campaign);
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
    const payload: CreateCardPaymentPayload = {
      idempotencyKey: crypto.randomUUID(),
      keyId: "key1",
      verification: "cvv",
      source: {
        id: req.user?.cardIds as string,
        type: "card",
      },
      encryptedData: req.body.encryptedData,
      amount: {
        amount: String(donatePayload.amount),
        currency: "USD",
      },
      description: req.body.description || "Donation At Coin Funds",
      metadata: {
        email: req.user.email,
        ipAddress: req.body.ipAddress,
        sessionId: sha256(req.user.token).toString(),
      },
    };

    const payment = await circlePayment.createCardPayment(payload);
    const donationDoc = await Donation.create({
      ...donatePayload,
      paymentId: payment.id,
    });
    campaign.donations.push(donationDoc._id);
    await campaign.save();
    return res.status(200).send({
      success: true,
      data: {
        donationDoc,
        payment,
      },
    });
  } catch (error) {}
});

router.post(
  "/crypto",
  authenticatetokenOrAnonymous,
  async (req: Req, res: Response) => {
    /*
    Donate with crypto
    User creates a payment intent that is to be processed 
    Create a donation object with specified params
    webhook to receive notifications
   */

    const donatePayload: Pick<
      Donation,
      "donor" | "currency" | "campaign" | "method" | "amount"
    > & { chain: SupportedChains } = {
      donor: req.user?.id,
      currency: req.body.currency,
      campaign: new Types.ObjectId(req.body.campaignId),
      method: "CRYPTO",
      amount: String(req.body.amount),
      chain: req.body.chain,
    };

    try {
      const circlePayment = new CircleCryptoPayment(CircleAPI);
      const campaign = await Campaign.findById(donatePayload.campaign);
      if (!campaign) {
        return res.status(404).send({
          success: false,
          err: "The campaign of specified id was not found",
        });
      }
      if (campaign.payoutStatus || campaign.payout) {
        return res.status(400).send({
          success: false,
          err: "Payout already processed for campaign",
        });
      }
      const payload: CreatePaymentIntentPayload = {
        idempotencyKey: crypto.randomUUID(),
        amount: {
          amount: String(donatePayload.amount),
          currency: donatePayload.currency,
        },
        settlementCurrency: "USD",
        paymentMethods: [
          {
            chain: donatePayload.chain,
            type: "blockchain",
          },
        ],
      };
      const paymentIntent = await circlePayment.createPaymenIntent(payload);
      const donationDoc = await Donation.create({
        ...donatePayload,
        paymentIntentId: paymentIntent.id,
      });
      campaign.donations.push(donationDoc._id);
      await campaign.save();
      return res.status(200).send({
        success: true,
        data: {
          donationDoc,
          paymentIntent,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        err: error,
      });
    }
  }
);

router.post(
  "/:id/withdraw",
  authenticatetoken,
  async (req: Req, res: Response) => {
    /* 
    To Withdraw
    A user must be logged in, must have been logged in to withdraw
    must specify id of donation they are trying to withdraw
    // check if donation id exists, if the logged in users is the owner,the status of the donation is confirmed, the withdrew status is false and there is a withdrawalId.
    //Check that payout status of campaign is false
    //update donation status
    //update 
    */

    try {
      const donationId = req.params.id;

      const donation = await Donation.findOne({
        _id: new Types.ObjectId(donationId),
        withdrew: false, //it has not been withdrawn
        status: 2, //it has been confirmed
      });
      if (!donation) {
        return res.status(400).send({
          success: false,
          err: "Withdrawal of specified parameters does not exist",
        });
      }
      if (donation.donor.toString() !== req.user?.id) {
        return res.status(400).send({
          success: false,
          err: "Access denied",
        });
      }
      if (donation.withdrawal) {
        return res.status(400).send({
          success: false,
          err: "Withdrawal already initiated for donation",
        });
      }
      const campaign = await Campaign.findById(donation.campaign);
      if (!campaign) {
        return res.status(400).send({
          success: false,
          err: "Campaign of specific donation does not exist",
        });
      }
      if (campaign.payoutStatus || campaign.payout) {
        return res.status(400).send({
          success: false,
          err: "Payout already processed for campaign",
        });
      }

      if (donation.method == "CRYPTO") {
        const circlePayment = new CircleCryptoPayment(CircleAPI);
        var toAmount: number;
        if (donation.currency == "BTC" || donation.currency == "ETH") {
          const exchangeRate = await circlePayment.getExchangeRate(
            `${donation.currency}-USD`
          );
          toAmount =
            donation.usdAmount /
            Math.max(Number(exchangeRate.buy), Number(exchangeRate.sell));
        } else {
          toAmount = donation.usdAmount * 0.99;
        }

        const payload: RefundPaymentIntentPayLoad = {
          idempotencyKey: crypto.randomUUID(),
          destination: {
            address: req.body.address,
            chain: req.body.chain,
          },
          amount: {
            currency: "USD",
          },
          toAmount: {
            currency: donation.currency,
            amount: String((0.97 * toAmount).toFixed(2)), //removes fee
          },
        };

        if (!donation.paymentIntentId) {
          return res.status(400).send({
            success: false,
            err: "No payment Intent Id found to withdraw",
          });
        }

        const withdrawalDetails = await circlePayment.refundPaymentById(
          donation.paymentIntentId,
          payload
        );
        const withdrawalDoc = await Withdrawal.create({
          amount: String(0.97 * toAmount),
          currency: donation.currency,
          donation: donation._id,
          user: req.user._id,
          method: "CRYPTO",
          refundId: withdrawalDetails.id,
        });
        donation.withdrawal = withdrawalDoc._id;
        donation.dateUpdated = new Date();
        await donation.save();

        return res.status(200).send({
          success: true,
          data: withdrawalDoc,
        });
      } else {
        const circlePayment = new CircleCardPayment(CircleAPI);
        const payload: RefundPaymentPayload = {
          idempotencyKey: crypto.randomUUID(),
          reason: "Refund of donation",
          amount: {
            amount: String((0.97 * donation.usdAmount).toFixed(2)),
            currency: "USD",
          },
        };

        if (!donation.paymentId) {
          return res.status(400).send({
            success: false,
            err: "No payment Id found to withdraw",
          });
        }

        const withdrawalDetails = await circlePayment.refundCardPayment(
          donation.paymentId,
          payload
        );
        const withdrawalDoc = await Withdrawal.create({
          amount: String(0.97 * donation.usdAmount),
          currency: donation.currency,
          donation: donation._id,
          user: req.user._id,
          method: "CARD",
          refundId: withdrawalDetails.id,
        });
        donation.withdrawal = withdrawalDoc._id;
        donation.dateUpdated = new Date();

        await donation.save();
        return res.status(200).send({
          success: true,
          data: withdrawalDoc,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        err: error,
      });
    }
  }
);

export const donation = router;
