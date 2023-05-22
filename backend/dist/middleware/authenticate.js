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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatetokenOrAnonymous = exports.authenticatetoken = void 0;
const user_1 = require("../models/user");
const config_1 = require("../config");
const authenticatetoken = function (req, res, next) {
    const token = req.cookies.x_auth;
    //auth header should take the form "JWT TOKEN_VALUE"
    //   const authHeader = req.headers.authorization;
    if (token) {
        // const token = authHeader.split(" ")[1];
        user_1.UserModel.findByToken(token, (err, user) => {
            if (err) {
                console.error(err);
            }
            if (!user) {
                res
                    .status(403)
                    .send({ auth: false, message: "Authentication Failed!" });
            }
            else {
                req.token = token;
                req.user = user;
                next();
            }
        });
    }
    else {
        res.status(403).send({ auth: false, message: "Wrong cookie!" });
    }
};
exports.authenticatetoken = authenticatetoken;
const authenticatetokenOrAnonymous = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.x_auth;
        //auth header should take the form "JWT TOKEN_VALUE"
        //   const authHeader = req.headers.authorization;
        if (token) {
            // const token = authHeader.split(" ")[1];
            user_1.UserModel.findByToken(token, (err, user) => {
                if (err) {
                    console.error(err);
                }
                if (!user) {
                    res
                        .status(403)
                        .send({ auth: false, message: "Authentication Failed!" });
                }
                else {
                    req.token = token;
                    req.user = user;
                    next();
                }
            });
        }
        else {
            const anonymousUser = {
                username: "Anonymous",
                email: config_1.ANONYMOUS_EMAIL,
                password: config_1.ANONYMOUS_PASS,
                active: true,
            };
            const anonymousUserDoc = yield user_1.UserModel.findOne({
                username: anonymousUser.username,
            });
            if (anonymousUserDoc) {
                req.user = anonymousUserDoc;
                next();
            }
            else {
                const newAnonymousUserDoc = yield user_1.UserModel.create(Object.assign({}, anonymousUser));
                req.user = newAnonymousUserDoc;
                next();
            }
        }
    });
};
exports.authenticatetokenOrAnonymous = authenticatetokenOrAnonymous;
