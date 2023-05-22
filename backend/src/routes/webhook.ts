import { Request, Response, Router } from "express";
import {
  CryptoPayment,
  CryptoPayout,
} from "../helpers/circle/crypto/interface";
import Queue from "bull";
import { MODE, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../config";
import { Donation } from "../models/donations";
import { Campaign } from "../models/campaign";
import { CardPayment } from "../helpers/circle/card/types";
import { Withdrawal } from "../models/withdrawal";
import { Payout } from "../models/payout";
import axios from "axios";
import { UserModel } from "../models/user";
import { emailQueue } from "../helpers/sendMail";
type notificationType = "payments" | "payouts" | "paymentIntents";
const router = Router();

//queue to handle payout and payments

async function handleCryptoDonation(paymentData: CryptoPayment) {
  const donation = await Donation.findOne({
    paymentIntentId: paymentData.paymentIntentId,
  });
  if (!donation) {
    return;
  }
  const campaign = await Campaign.findById(donation.campaign);
  if (!campaign) {
    return;
  }
  if (paymentData.status == "paid") {
    if (donation.status == 2 || donation.status == -2) {
      return; //to prevent processing already processed webhooks
    }
    donation.paymentId = paymentData.id;
    donation.usdAmount = Number(paymentData.settlementAmount.amount); //setllementAmount is usually USD
    donation.amount = paymentData.amount.amount;
    donation.status = 2;
    donation.dateUpdated = new Date();

    campaign.raised += Number(paymentData.settlementAmount.amount);
    campaign.dateUpdated = new Date();

    if (campaign.receiveAlerts) {
      const campaignOwner = await UserModel.findById(campaign?.owner);
      const message = `A donation of $${donation.usdAmount} was just made to your campaign ${campaign?.name}`;
      emailQueue.add({
        email: campaignOwner?.email,
        title: "DONATION NOTIFICATION",
        message: message,
      });
    }
    if (
      campaign.raised + Number(paymentData.settlementAmount.amount) >=
      campaign.target
    ) {
      campaign.completed = true;
      campaign.dateCompleted = new Date();
      if (campaign.receiveAlerts) {
        const campaignOwner = await UserModel.findById(campaign?.owner);
        const message = `Your campaign ${campaign.name} has reached its target of $${campaign.target}`;
        emailQueue.add({
          email: campaignOwner?.email,
          title: "CAMPAIGN COMPLETION",
          message: message,
        });
      }
    }

    await donation.save();
    await campaign.save();
  } else if (paymentData.status == "failed") {
    donation.paymentId = paymentData.id;
    donation.usdAmount = Number(0); //setllementAmount is usually USD
    donation.status = -2;
    donation.dateUpdated = new Date();
    await donation.save();
  }
}

async function handleCryptoRefund(paymentData: CryptoPayment) {
  const withdrawal = await Withdrawal.findOne({
    refundId: paymentData.id,
  });
  if (!withdrawal) {
    return;
  }
  const donation = await Donation.findById(withdrawal.donation);
  if (!donation) {
    return;
  }
  const campaign = await Campaign.findById(donation.campaign);
  if (!campaign) {
    return;
  }
  if (paymentData.status == "paid") {
    if (withdrawal.status == 2 || withdrawal.status == -2) {
      return; //to prevent processing already processed webhooks
    }
    withdrawal.status = 2;
    withdrawal.dateConfirmed = new Date();
    donation.withdrew = true;
    donation.dateUpdated = new Date();

    campaign.raised -= Number(paymentData.settlementAmount.amount) / 0.97;
    campaign.dateUpdated = new Date();
    if (campaign.receiveAlerts) {
      const campaignOwner = await UserModel.findById(campaign?.owner);
      const message = `A donation of $${paymentData.settlementAmount.amount} was withdrawn from your campaign ${campaign?.name}`;
      emailQueue.add({
        email: campaignOwner?.email,
        title: "DONATION WITHDRAWAL NOTIFICATION",
        message: message,
      });
    }
    if (
      campaign.raised - Number(paymentData.settlementAmount.amount) / 0.97 <
      campaign.target
    ) {
      campaign.completed = false;
      if (campaign.receiveAlerts) {
        const campaignOwner = await UserModel.findById(campaign?.owner);
        const message = `Your campaign ${campaign.name} went below its target of ${campaign.target} due to a withdrawal.`;
        emailQueue.add({
          email: campaignOwner?.email,
          title: "DONATION WITHDRAWAL NOTIFICATION",
          message: message,
        });
      }
    }
    await withdrawal.save();
    await donation.save();
    await campaign.save();
  } else if (paymentData.status == "failed") {
    withdrawal.status = -2;
    withdrawal.dateConfirmed = new Date();
    await Donation.updateOne(
      { _id: donation._id },
      {
        $unset: {
          withdrawal: 1,
        },
        $set: {
          dateUpdated: new Date(),
        },
      }
    );
    await withdrawal.save();
  }
}

async function handleCardPayments(paymentData: CardPayment) {
  const donation = await Donation.findOne({
    paymentId: paymentData.id,
  });
  if (!donation) {
    return;
  }
  const campaign = await Campaign.findById(donation.campaign);
  if (!campaign) {
    return;
  }
  if (paymentData.status == "paid") {
    if (donation.status == 2 || donation.status == -2) {
      return; //to prevent processing already processed webhooks
    }
    donation.paymentId = paymentData.id;
    donation.usdAmount = Number(paymentData.amount.amount); //setllementAmount is usually USD
    donation.status = 2;
    donation.dateUpdated = new Date();

    campaign.raised += Number(paymentData.amount.amount);
    campaign.dateUpdated = new Date();
    if (campaign.receiveAlerts) {
      const campaignOwner = await UserModel.findById(campaign?.owner);
      const message = `A donation of $${donation.usdAmount} was just made to your campaign ${campaign?.name}`;
      emailQueue.add({
        email: campaignOwner?.email,
        title: "DONATION NOTIFICATION",
        message: message,
      });
    }
    if (
      campaign.raised + Number(paymentData.amount.amount) >=
      campaign.target
    ) {
      campaign.completed = true;
      campaign.dateCompleted = new Date();
      if (campaign.receiveAlerts) {
        const campaignOwner = await UserModel.findById(campaign?.owner);
        const message = `Your campaign ${campaign.name} has reached its target of $${campaign.target}`;
        emailQueue.add({
          email: campaignOwner?.email,
          title: "CAMPAIGN COMPLETION",
          message: message,
        });
      }
    }
    await donation.save();
    await campaign.save();
  } else if (paymentData.status == "failed") {
    donation.paymentId = paymentData.id;
    donation.usdAmount = Number(0); //setllementAmount is usually USD
    donation.status = -2;
    donation.dateUpdated = new Date();
    await donation.save();
  }
}

async function handleCardRefund(paymentData: CardPayment) {
  const withdrawal = await Withdrawal.findOne({
    refundId: paymentData.id,
  });
  if (!withdrawal) {
    return;
  }
  const donation = await Donation.findById(withdrawal.donation);
  if (!donation) {
    return;
  }
  const campaign = await Campaign.findById(donation.campaign);
  if (!campaign) {
    return;
  }
  if (paymentData.status == "paid") {
    if (withdrawal.status == 2 || withdrawal.status == -2) {
      return; //to prevent processing already processed webhooks
    }
    withdrawal.status = 2;
    withdrawal.dateConfirmed = new Date();
    donation.withdrew = true;
    donation.dateUpdated = new Date();
    campaign.raised -= Number(paymentData.amount.amount) / 0.97;
    campaign.dateUpdated = new Date();
    if (campaign.receiveAlerts) {
      const campaignOwner = await UserModel.findById(campaign?.owner);
      const message = `A donation of $${
        Number(paymentData.amount.amount) / 0.97
      } was withdrawn from your campaign ${campaign?.name}`;
      emailQueue.add({
        email: campaignOwner?.email,
        title: "DONATION WITHDRAWAL NOTIFICATION",
        message: message,
      });
    }
    if (
      campaign.raised - Number(paymentData.amount.amount) <=
      campaign.target
    ) {
      campaign.completed = false;
    }
    if (
      campaign.raised - Number(paymentData.amount.amount) / 0.97 <
      campaign.target
    ) {
      campaign.completed = false;
      if (campaign.receiveAlerts) {
        const campaignOwner = await UserModel.findById(campaign?.owner);
        const message = `Your campaign ${campaign.name} went below its target of $${campaign.target} due to a withdrawal.`;
        emailQueue.add({
          email: campaignOwner?.email,
          title: "DONATION WITHDRAWAL NOTIFICATION",
          message: message,
        });
      }
    }
    await withdrawal.save();
    await donation.save();
    await campaign.save();
  } else if (paymentData.status == "failed") {
    withdrawal.status = -2;
    withdrawal.dateConfirmed = new Date();
    await Donation.updateOne(
      { _id: donation._id },
      {
        $unset: {
          withdrawal: 1,
        },
        $set: {
          dateUpdated: new Date(),
        },
      }
    );
    await withdrawal.save();
  }
}

async function handlePayout(payoutData: CryptoPayout) {
  const payout = await Payout.findOne({
    payoutId: payoutData.id,
  });
  if (!payout) {
    return;
  }
  const campaign = await Campaign.findById(payout.campaign);
  if (!campaign) {
    return;
  }
  if (payoutData.status == "complete") {
    if (payout.status == 2 || payout.status == -2) {
      return; //to prevent processing already processed webhooks
    }
    payout.status = 2;
    payout.usdAmount = payoutData.amount.amount;
    payout.amount = payoutData.toAmount.amount;
    payout.dateUpdated = new Date();
    campaign.payoutStatus = true;
    campaign.dateCreated = new Date();
    await payout.save();
    await campaign.save();
  } else if (payoutData.status == "failed") {
    payout.status = -2;
    payout.dateUpdated = new Date();
    await Campaign.updateOne(
      { _id: campaign._id },
      {
        $unset: {
          payout: 1,
        },
        $set: {
          dateUpdated: new Date(),
        },
      }
    );
    await payout.save();
  }
}

var paymentQueue: Queue.Queue;

if (MODE == "PRODUCTION") {
  paymentQueue = new Queue("payment", {
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    },
  });
} else {
  paymentQueue = new Queue("payment", "redis://127.0.0.1:6379");
}

paymentQueue.process(async function (job: {
  data: CryptoPayment | CardPayment;
}) {
  const paymentData = job.data;
  console.log("Started processing payment of data", job.data.id);

  //payments are usually for donations

  if (paymentData.type == "payment") {
    if (paymentData.source) {
      await handleCardPayments(paymentData as CardPayment);
    } else {
      await handleCryptoDonation(paymentData as CryptoPayment);
    }
  } else if (paymentData.type == "refund") {
    if (paymentData.source) {
      await handleCardRefund(paymentData as CardPayment);
    } else {
      await handleCryptoRefund(paymentData as CryptoPayment);
    }
  }
});

var payoutQueue: Queue.Queue;

if (MODE == "PRODUCTION") {
  payoutQueue = new Queue("payout", {
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    },
  });
} else {
  payoutQueue = new Queue("payout", "redis://127.0.0.1:6379");
}

payoutQueue.process(async function (job: { data: CryptoPayout }) {
  console.log("Started processing payout of data", job.data);
  const payoutData = job.data;
  await handlePayout(payoutData);
});

router.head("/notification/v1", async (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(`HEAD request for ${req.url}`);
  console.log("Reached Head request");
  return;
});

router.post("/notification/v1", async (req: Request, res: Response) => {
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", async () => {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const envelope = JSON.parse(body);
    if (envelope.Type == "SubscriptionConfirmation") {
      try {
        await axios.get(envelope.SubscribeURL);
        console.log("Successfully subscribed");
      } catch (error: any) {
        console.log("Could not subscribe");
      }
    } else if (envelope.Type == "Notification") {
      const data: {
        notificationType: notificationType;
        payment: CryptoPayment;
        payout: CryptoPayout;
      } = JSON.parse(envelope.Message);
      const { notificationType, ...payload } = data;
      if (notificationType == "payments") {
        paymentQueue.add(payload.payment);
      }
      //handle payout
      else if (notificationType == "payouts") {
        payoutQueue.add(payload.payout);
      }
      res.end(`POST req for ${req.url}`);
    }
  });
});

export const webhook = router;
