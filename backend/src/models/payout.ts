import { Schema, model, Document, Model, ObjectId, Types } from "mongoose";
import { Campaign } from "./campaign";
import { UserModel } from "./user";
import { emailQueue } from "../helpers/sendMail";

// PayHere status codes
//  2 = success
//  0 = pending
// -1 = canceled
// -2 = failed
// -3 = chargedback

//to do implement add withdrawn status//for users that withdraw their funding back
export interface Payout {
  recipient: Types.ObjectId;
  payoutId: string;
  recipientId: string;
  amount: string;
  usdAmount: string;
  currency: "USD" | "ETH" | "BTC";
  campaign: Types.ObjectId;
  dateCreated: Date;
  dateUpdated: Date;
  status: number;
}

export interface PayoutDocument extends Payout, Document {}

export interface PayoutModel extends Model<PayoutDocument> {}

const payoutSchema = new Schema<PayoutDocument>({
  recipient: {
    type: "ObjectId",
    required: true,
    ref: "User",
  },
  payoutId: {
    type: String,
  },
  amount: {
    type: String,
  },
  usdAmount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    enum: ["ETH", "BTC", "USD"],
    required: true,
  },
  recipientId: {
    type: String,
    required: true,
  },
  campaign: {
    type: "ObjectId",
    required: true,
    ref: "Campaign",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
  },
  status: {
    type: Number,
    default: 0,
  },
});

export const Payout = model<Payout, PayoutModel>("Payout", payoutSchema);
