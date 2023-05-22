import express, {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { UserModel, UserDocument } from "../models/user";
import { ANONYMOUS_EMAIL, ANONYMOUS_PASS } from "../config";

export interface Req extends Request {
  token?: string;
  user?: UserDocument;
}

export const authenticatetoken = function (req: Req, res: Response, next: any) {
  const token: string = req.cookies.x_auth;
  //auth header should take the form "JWT TOKEN_VALUE"
  //   const authHeader = req.headers.authorization;
  if (token) {
    // const token = authHeader.split(" ")[1];
    UserModel.findByToken(token, (err: Error, user: UserDocument | null) => {
      if (err) {
        console.error(err);
      }
      if (!user) {
        res
          .status(403)
          .send({ auth: false, message: "Authentication Failed!" });
      } else {
        req.token = token;
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).send({ auth: false, message: "Wrong cookie!" });
  }
};

export const authenticatetokenOrAnonymous = async function (
  req: Req,
  res: Response,
  next: any
) {
  const token: string = req.cookies.x_auth;
  //auth header should take the form "JWT TOKEN_VALUE"
  //   const authHeader = req.headers.authorization;
  if (token) {
    // const token = authHeader.split(" ")[1];
    UserModel.findByToken(token, (err: Error, user: UserDocument | null) => {
      if (err) {
        console.error(err);
      }
      if (!user) {
        res
          .status(403)
          .send({ auth: false, message: "Authentication Failed!" });
      } else {
        req.token = token;
        req.user = user;
        next();
      }
    });
  } else {
    const anonymousUser = {
      username: "Anonymous",
      email: ANONYMOUS_EMAIL,
      password: ANONYMOUS_PASS,
      active: true,
    };

    const anonymousUserDoc = await UserModel.findOne({
      username: anonymousUser.username,
    });
    if (anonymousUserDoc) {
      req.user = anonymousUserDoc;
      next();
    } else {
      const newAnonymousUserDoc = await UserModel.create({
        ...anonymousUser,
      });
      req.user = newAnonymousUserDoc;
      next();
    }
  }
};
