import express, { Router, Request, Response } from "express";
import { UserModel, UserDocument } from "../models/user";
import { Req, authenticatetoken } from "../middleware/authenticate";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { sendEmail } from "../helpers/sendMail";
import { ACTIVATION_SECRET } from "../config";

const router: Router = express.Router();
interface decodedToken extends JwtPayload {
  username: string;
  password: string;
  email: string;
}

router.post("/login", async function (req: Request, res: Response) {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Auth failed, email does not exist",
      });
    }
    if (!user.active) {
      return res.status(401).json({
        message: "Auth failed,user is not active",
      });
    }
    user.checkPassword(password, (err: Error, ismatch: Boolean) => {
      if (!ismatch) {
        return res.status(401).json({
          message: "Username and password do not match",
        });
      }
      user.generatetoken(async (err: Error, token: string) => {
        await UserModel.updateOne(
          { _id: user._id },
          { $set: { token: token } }
        );
        return res
          .cookie("x_auth", token, {
            httpOnly: true,
          })
          .status(201)
          .send({
            success: true,
            message: "Successful Login",
            active: user.active,
            _id: user._id,
          });
      });
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error,
    });
  }
});

router.post("/register", async function (req: Request, res: Response) {
  try {
    const username: string = req.body.username;
    const email: string = req.body.email.toLowerCase();
    const password: string = req.body.password;

    if (username.length < 4) {
      res.status(400).send({
        message: "The username is too short",
      });
    }
    const existingUser: UserDocument | null = await UserModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existingUser?.username == username) {
      return res.status(400).send({
        message: "This username is already in use",
      });
    }
    if (existingUser?.email == email) {
      return res.status(400).send({
        message: "This email is already in use",
      });
    }
    const user = await UserModel.create({
      username: username,
      email: email,
      password: password,
    });
    return res.status(201).send({
      success: true,
      message: "New user created",
      active: user.active,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error,
    });
  }
});

router.get(
  "/send-verification-email/:email",
  async (req: Request, res: Response) => {
    const reqEmail = req.params.email;
    const user = await UserModel.findOne({ email: reqEmail });
    if (!user) {
      return res.status(403).send({ message: "User Not Found" });
    }
    if (user.active) {
      return res.status(200).send({
        message: "User already verified",
      });
    }
    const email = user.email;
    const username = user.username;
    console.log(ACTIVATION_SECRET, "hey");
    var activationToken = sign({ email, username }, ACTIVATION_SECRET, {
      expiresIn: "20m",
    });

    const html = `<h2>Here's your activation link!</h2>
            <a href="${process.env.CLIENT_URL}/login?activate=${activationToken}">Click Here To activate your account. ${activationToken}</a>
             <p>Thank you for creating an account with <your app name> 😄 For security reasons, this link will expire within 20 mins! </p>`;

    const mailResponse = await sendEmail(
      email as string,
      "ACCOUNT ACTIVATION",
      undefined,
      html
    );

    return res.status(200).send({
      ...mailResponse,
    });
  }
);

router.post("/verify-email", async (req: Request, res: Response) => {
  const activationToken = req.body.activationToken;
  const decoded: decodedToken = <decodedToken>(
    verify(activationToken, String(process.env.ACTIVATION_SECRET))
  );
  const { email, username } = decoded;
  const existingUser = await UserModel.findOneAndUpdate(
    {
      email: email,
      username: username,
    },
    { $set: { active: true } }
  );
  if (!existingUser) {
    res.status(400).send({ message: "Account not found" });
  }
  res.status(200).send({ message: "Successfully activated User Account" });
});

router.post("/logout", authenticatetoken, async (req: Req, res: Response) => {
  try {
    if (req.user) {
      await UserModel.updateOne(
        { _id: req.user._id },
        {
          $unset: {
            token: 1,
          },
        },
        {
          new: true,
        }
      );
      return res
        .clearCookie("x_auth")
        .status(200)
        .send({ message: "Logged out user" });
    }
  } catch (error) {
    return res.status(400).send({ message: "Couldnt log out" });
  }
});

export const auth = router;
