import { Schema, model, Document, Model, ObjectId, Types } from "mongoose";
import { emailQueue } from "../helpers/sendMail";
import { Campaign } from "./campaign";
import { UserModel } from "./user";

// PayHere status codes
//  2 = success
//  0 = pending
// -1 = canceled
// -2 = failed
// -3 = chargedback

//to do implement add withdrawn status//for users that withdraw their funding back
export interface Donation {
  donor: Types.ObjectId;
  paymentId?: string;
  paymentIntentId?: string;
  amount: string;
  usdAmount: number;
  currency: "USD" | "ETH" | "BTC";
  campaign: Types.ObjectId;
  dateCreated: Date;
  dateUpdated: Date;
  status: number;
  method: "CRYPTO" | "CARD";
  withdrew: boolean;
  withdrawal?: Types.ObjectId;
}

export interface DonationDocument extends Donation, Document {}

export interface DonationModel extends Model<DonationDocument> {}

const donationSchema = new Schema<DonationDocument>({
  donor: {
    type: "ObjectId",
    required: true,
    ref: "User",
  },
  paymentId: {
    type: String,
  },
  paymentIntentId: {
    type: String,
  },
  amount: {
    type: String,
    required: true,
  },
  usdAmount: {
    type: Number,
  },
  currency: {
    type: String,
    enum: ["ETH", "BTC", "USD"],
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
  method: {
    type: String,
    enum: ["CRYPTO", "CARD"],
    required: true,
  },
  withdrew: {
    type: Boolean,
    default: false,
  },
  withdrawal: {
    type: "ObjectId",
    ref: "Withdrawal",
  },
});

export const Donation = model<Donation, DonationModel>(
  "Donation",
  donationSchema
);
