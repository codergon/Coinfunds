import { Schema, model, Document, Model, ObjectId, Types } from "mongoose";
import bcrypt from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { LOGIN_SECRET } from "../config";

export interface User {
  username: string;
  avatar: string;
  email: string;
  password: string;
  dateCreated: Date;
  active: boolean;
  token: string;
  donations: any[];
  campaigns: any[];
  cardIds: string;
  payoutRecipientsIds: string;
}

export interface UserDocument extends User, Document {
  checkPassword: (password: string, cb: Function) => Promise<void>;
  generatetoken: (cb: Function) => Promise<void>;
  deletetoken: () => Promise<void>;
}

export interface UserModel extends Model<UserDocument> {
  findByToken: (token: string, cb: Function) => Promise<void>;
}

interface decodedToken extends JwtPayload {
  id: string;
}

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    maxlength: 55,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: false,
  },
  cardIds: {
    type: String,
  },
  payoutRecipientsIds: {
    type: String,
  },
  avatar: {
    type: String,
    default:
      "https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg",
  },
});

//hash password before saving it to db
UserSchema.pre<UserDocument>("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
});

//compare passwords
UserSchema.methods.checkPassword = function (
  password: String & Buffer,
  cb: Function
): void {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.methods.generatetoken = function (cb: Function): void {
  const user = this;
  var token = sign({ id: user._id.toString() }, LOGIN_SECRET);
  cb(null, token);
};

UserSchema.statics.findByToken = async function (token: string, cb: Function) {
  var user = this;
  try {
    const { id } = <decodedToken>verify(token, LOGIN_SECRET);
    const foundUser = await user.findOne({ _id: id, token: token });
    cb(null, foundUser);
  } catch (err) {
    cb(err, null);
  }
};

UserSchema.methods.deletetoken = async function () {
  var user = this;
  user.token = undefined;
  console.log(user);
  await user.save();
};

function arrayLimit(val: string[]) {
  return val.length <= 10;
}

export const UserModel = model<User, UserModel>("User", UserSchema);
