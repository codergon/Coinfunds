import express, { Router, Request, Response } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import { CircleAPI, MODE } from "./config";
import { user } from "./routes/user";
import { auth } from "./routes/auth";
import cookieParser from "cookie-parser";
import { campaign } from "./routes/campaign";
import { donation } from "./routes/donation";
import { payout } from "./routes/payout";
import { webhook } from "./routes/webhook";
import { CircleCryptoPayment } from "./helpers/circle/crypto/cryptoPayment";
import axios from "axios";

const uri =
  MODE == "PRODUCTION"
    ? String(process.env.MONGO_CONNECTION_STRING)
    : "mongodb://localhost:27017/FundRaiser";
const PORT: number = 3000;
export let client: any;
(async function run() {
  // const circlePayment = new CircleCryptoPayment(CircleAPI);
  // const existingSubscriptions = await circlePayment.getSubscriptions();
  // // await circlePayment.removeSubcsription(
  // //   "24e37410-b867-4392-b9ea-fa0117c50341"
  // // );
  // console.log(existingSubscriptions);
  // if (!existingSubscriptions || existingSubscriptions.length == 0) {
  //   const data = await circlePayment.createSubscription(
  //     "https://coin-funds.fly.dev/webhook/notifications"
  //   );
  //   console.log(data);
  // }
  try {
    // ("https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-east-1:908968368384:sandbox_platform-notifications-topic&Token=2336412f37fb687f5d51e6e2425c464de0761df34399449911fa259ff8c182373a2d18a8d21e02c47253ce7f1e4c7a500ce1bb3a2e0c692ff7ad486328a18656f095744b00a898e8933438a12301800cc10662ce4f84b6c43ab0d69f481cf81e3adc5e1a78f001e681fb18d5857faf41f476a6f3f4e113bf219af9c4a4823ce98aacdd07a6f329cb8da5d23d00329a88");
    // await axios.get(
    //   "https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:908968368384:sandbox_platform-notifications-topic&Token=2336412f37fb687f5d51e6e2425c464de0761df34399449911fa259ff8c18523fce13c6560391fb27906681b1f98044ab941b1e4bec165f2d15c319ae8fe0fe92711d706fa87427153edfa760252163abd91c87731549995705de8891c91441844c6b8a7441b69ccf3cb2a43d8024972bbec7d01618955e6d14f419cb58521926c2db2662a7e9c8dd0ca3c6395026141"
    // );
    // console.log("Successfully subscribed");
  } catch (error: any) {
    console.log(error.message);
    console.log("Could not subscribe");
  }
})();
mongoose
  .connect(uri, {})
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Couldn't connect to database");
  });
const app = express();
app.use(cors());
app.use(json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", async function (req: Request, res: Response) {
  res.status(200).send({
    status: "Up and running",
  });
});

app.use("/user", user);
app.use("/auth", auth);
app.use("/campaign", campaign);
app.use("/donation", donation);
app.use("/payout", payout);
app.use("/webhook", webhook);

app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}`);
});
