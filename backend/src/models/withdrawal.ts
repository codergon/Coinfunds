import { Document, Model, Schema, Types, model } from "mongoose";
import { Donation } from "./donations";
import { Campaign } from "./campaign";
import { UserModel } from "./user";
import { emailQueue } from "../helpers/sendMail";

interface Withdrawal {
  amount: string;
  currency: string;
  donation: Types.ObjectId;
  status: number;
  dateCreated: Date;
  dateConfirmed: Date;
  refundId: string;
  method: string;
  user: Types.ObjectId;
}

export interface WithdrawalDocument extends Withdrawal, Document {}

export interface WithdrawalModel extends Model<WithdrawalDocument> {}

const WithdrawalSchema = new Schema<WithdrawalDocument>({
  amount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  donation: {
    type: "ObjectId",
    ref: "Donation",
    required: true,
  },
  user: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateConfirmed: {
    type: Date,
  },
  method: {
    type: String,
    required: true,
  },
  refundId: {
    type: String,
  },
});

export const Withdrawal = model<Withdrawal, WithdrawalModel>(
  "Withdrawal",
  WithdrawalSchema
);

WithdrawalSchema.pre<WithdrawalDocument>("save", async function (next) {
  const withdrawal = this;
  if (withdrawal.isModified("status")) {
    if (withdrawal.status == 2) {
      const donation = await Donation.findById(withdrawal.donation);
      const campaign = await Campaign.findById(donation?.campaign);
      const campaignOwner = await UserModel.findById(campaign?.owner);
      const message = `A donation was withdrawn from your campaign ${campaign?.name}`;
      emailQueue.add({
        email: campaignOwner?.email,
        title: "DONATION NOTIFICATION",
        message: message,
      });
      next();
    }
  }
});
