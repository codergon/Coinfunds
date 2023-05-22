import express, { Router, Request, Response } from "express";
import { authenticatetoken } from "../middleware/authenticate";
import crypto from "crypto";
import { Req } from "../middleware/authenticate";
import { UserModel, UserDocument } from "../models/user";
import { ObjectId } from "mongoose";
import sha256 from "crypto-js/sha256";
import { CreateCardPayload } from "../helpers/circle/card/types";
import { CircleCardPayment } from "../helpers/circle/card/cardPayment";
import { CircleAPI } from "../config";
import { CircleCryptoPayment } from "../helpers/circle/crypto/cryptoPayment";
import { CircleCryptoPayout } from "../helpers/circle/crypto/cryptoPayout";
import {
  CreatePayoutPayload,
  CreateRecipientPayload,
} from "../helpers/circle/crypto/interface";
const router: Router = express.Router();

export async function getUserbyUsername(
  username: string
): Promise<UserDocument | null> {
  const user = await UserModel.findOne({
    username: username,
  }).select(["id", "username", "email", "avatar", "active", "dateCreated"]);
  if (user) {
    return user;
  } else {
    return null;
  }
}

//check if request user is authenticated
router.get("/auth", authenticatetoken, async (req: Req, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }
    const circlePayout = new CircleCryptoPayout(CircleAPI);
    const circlePayment = new CircleCardPayment(CircleAPI);
    const cardDetails = req.user.cardIds
      ? await circlePayment.getCardById(req.user.cardIds)
      : null;
    const payoutRecipientDetails = req.user.payoutRecipientsIds
      ? await circlePayout.getRecipientById(req.user.payoutRecipientsIds)
      : null;
    return res.status(200).json({
      success: true,
      data: { user: req.user, payoutRecipientDetails, cardDetails },
    });
  } catch (error) {
    return res.status(501).json({
      message: "An error occured",
    });
  }
});

router.get("/allUsers", async (req: Req, res: Response) => {
  try {
    const allUsers = await UserModel.find().select([
      "id",
      "username",
      "email",
      "avatar",
      "active",
      "dateCreated",
    ]);
    return res.status(200).send({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    return res.status(501).json({
      message: "An error occured",
    });
  }
});

router.put("/addCard", authenticatetoken, async (req: Req, res: Response) => {
  try {
    const circlePayment = new CircleCardPayment(CircleAPI);
    const payload: CreateCardPayload = {
      idempotencyKey: crypto.randomUUID(),
      keyId: "key1",

      encryptedData: req.body.encryptedData,
      expMonth: req.body.expMonth,
      expYear: req.body.expYear,
      billingDetails: {
        name: req.body.name,
        city: req.body.city,
        country: req.body.country,
        line1: req.body.line1,
        line2: req.body.line2,
        district: req.body.district,
        postalCode: req.body.postalCode,
      },
      metadata: {
        email: req.user?.email,
        ipAddress: req.body.ipAddress,
        sessionId: sha256(req.user?.token as string).toString(),
      },
    };
    const card = await circlePayment.createCard(payload);
    await UserModel.findByIdAndUpdate(req.user?.id, {
      $set: {
        cardIds: card.id,
      },
    });

    return res.status(200).send({
      success: true,
      data: "Successfully added card of id " + card.id,
    });
  } catch (error) {
    return res.status(501).json({
      message: "An error occured",
    });
  }
});

router.put(
  "/addPayoutAddr",
  authenticatetoken,
  async (req: Req, res: Response) => {
    const circlePayout = new CircleCryptoPayout(CircleAPI);
    const payload: CreateRecipientPayload = {
      idempotencyKey: crypto.randomUUID(),
      chain: req.body.chain,
      address: req.body.address,
      addressTag: req.user?.id,
      metadata: {
        email: req.user?.email as string,
        nickname: req.user?.username as string,
      },
    };

    const payoutRecipientData = await circlePayout.createRecipient(payload);
    await UserModel.findByIdAndUpdate(req.user?._id, {
      $set: {
        payoutRecipientsIds: payoutRecipientData.id,
      },
    });
    return res.status(200).send({
      success: true,
      data: "Successfully added addr of id " + payoutRecipientData.id,
    });
  }
);

router.get("/:username", async (req: Req, res: Response) => {
  const username = req.params.username;
  const userdata = await getUserbyUsername(username);
  if (!userdata) {
    return res.status(404).send({
      message: "This username was not found",
    });
  } else {
    return res.status(200).send({
      success: true,
      data: userdata,
    });
  }
});

router.get("/:id", async (req: Req, res: Response) => {
  const id = req.params.id;
  const userdata = await UserModel.findById(id).select([
    "id",
    "username",
    "email",
    "avatar",
    "active",
    "dateCreated",
  ]);
  if (!userdata) {
    return res.status(404).send({
      message: "This username was not found",
    });
  } else {
    return res.status(200).send({
      success: true,
      data: userdata,
    });
  }
});

export const user = router;
