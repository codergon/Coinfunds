import { Schema, model, Document, Model, ObjectId, Types } from "mongoose";
import { emailQueue } from "../helpers/sendMail";
import { UserModel } from "./user";

//to do implement verification and rejection by superUser
export interface Campaign {
  name: string;
  description: string;
  category: string;
  image: string;
  owner: Types.ObjectId;
  target: number;
  raised: number;
  payoutStatus: Boolean;
  payout?: Types.ObjectId;
  dateCreated: Date;
  dateCompleted: Date;
  dateUpdated: Date;
  deadlineDate: Date;
  comments: Types.ObjectId[];
  completed: Boolean;
  donations: Types.ObjectId[];
  verified: Boolean;
  receiveAlerts: Boolean;
  //   documents: string[];
  //   reject: boolean;
  //   rejectMessage: string;
}

export interface CampaignDocument extends Campaign, Document {}

export interface CampaignModel extends Model<CampaignDocument> {}

const campaignSchema = new Schema<CampaignDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
  target: {
    type: Number,
    required: true,
    min: 1,
  },
  raised: {
    type: Number,
    default: 0,
  },
  payout: {
    type: "ObjectId",
    ref: "Payout",
  },
  payoutStatus: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  dateCompleted: {
    type: Date,
  },
  dateUpdated: {
    type: Date,
  },
  comments: [
    {
      type: "ObjectId",
      ref: "Comment",
    },
  ],
  completed: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  donations: [
    {
      type: "ObjectId",
      ref: "Donation",
    },
  ],
  receiveAlerts: {
    type: Boolean,
    default: false,
  },
});

export const Campaign = model<Campaign, CampaignModel>(
  "Campaign",
  campaignSchema
);
