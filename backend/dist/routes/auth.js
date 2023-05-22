"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const authenticate_1 = require("../middleware/authenticate");
const jsonwebtoken_1 = require("jsonwebtoken");
const sendMail_1 = require("../helpers/sendMail");
const config_1 = require("../config");
const router = express_1.default.Router();
router.post("/login", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = yield user_1.UserModel.findOne({ email: email });
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
            user.checkPassword(password, (err, ismatch) => {
                if (!ismatch) {
                    return res.status(401).json({
                        message: "Username and password do not match",
                    });
                }
                user.generatetoken((err, token) => __awaiter(this, void 0, void 0, function* () {
                    yield user_1.UserModel.updateOne({ _id: user._id }, { $set: { token: token } });
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
                }));
            });
        }
        catch (error) {
            res.status(400).send({
                success: false,
                error: error,
            });
        }
    });
});
router.post("/register", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.body.username;
            const email = req.body.email.toLowerCase();
            const password = req.body.password;
            if (username.length < 4) {
                res.status(400).send({
                    message: "The username is too short",
                });
            }
            const existingUser = yield user_1.UserModel.findOne({
                $or: [{ email: email }, { username: username }],
            });
            if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.username) == username) {
                return res.status(400).send({
                    message: "This username is already in use",
                });
            }
            if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) == email) {
                return res.status(400).send({
                    message: "This email is already in use",
                });
            }
            const user = yield user_1.UserModel.create({
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
        }
        catch (error) {
            res.status(400).send({
                success: false,
                error: error,
            });
        }
    });
});
router.get("/send-verification-email/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqEmail = req.params.email;
    const user = yield user_1.UserModel.findOne({ email: reqEmail });
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
    console.log(config_1.ACTIVATION_SECRET, "hey");
    var activationToken = (0, jsonwebtoken_1.sign)({ email, username }, config_1.ACTIVATION_SECRET, {
        expiresIn: "20m",
    });
    const html = `<h2>Here's your activation link!</h2>
            <a href="${process.env.CLIENT_URL}/login?activate=${activationToken}">Click Here To activate your account. ${activationToken}</a>
             <p>Thank you for creating an account with <your app name> 😄 For security reasons, this link will expire within 20 mins! </p>`;
    const mailResponse = yield (0, sendMail_1.sendEmail)(email, "ACCOUNT ACTIVATION", undefined, html);
    return res.status(200).send(Object.assign({}, mailResponse));
}));
router.post("/verify-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activationToken = req.body.activationToken;
    const decoded = ((0, jsonwebtoken_1.verify)(activationToken, String(process.env.ACTIVATION_SECRET)));
    const { email, username } = decoded;
    const existingUser = yield user_1.UserModel.findOneAndUpdate({
        email: email,
        username: username,
    }, { $set: { active: true } });
    if (!existingUser) {
        res.status(400).send({ message: "Account not found" });
    }
    res.status(200).send({ message: "Successfully activated User Account" });
}));
router.post("/logout", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            yield user_1.UserModel.updateOne({ _id: req.user._id }, {
                $unset: {
                    token: 1,
                },
            }, {
                new: true,
            });
            return res
                .clearCookie("x_auth")
                .status(200)
                .send({ message: "Logged out user" });
        }
    }
    catch (error) {
        return res.status(400).send({ message: "Couldnt log out" });
    }
}));
exports.auth = router;
