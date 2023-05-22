import { Schema, model, Document, Model, ObjectId, Types } from "mongoose";

interface Comment {
  owner: Types.ObjectId;
  text: string;
  campaign: Types.ObjectId;
  dateCreated: Date;
}

export interface CommentDocument extends Comment, Document {}

export interface CommentModel extends Model<CommentDocument> {}

const CommentSchema = new Schema<CommentDocument>({
  owner: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    minlength: 1,
    required: true,
  },
  campaign: {
    type: "ObjectId",
    ref: "Campaign",
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = model<Comment, CommentModel>("Comment", CommentSchema);
