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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = void 0;
const express_1 = require("express");
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../config");
const donations_1 = require("../models/donations");
const campaign_1 = require("../models/campaign");
const withdrawal_1 = require("../models/withdrawal");
const payout_1 = require("../models/payout");
const axios_1 = __importDefault(require("axios"));
const user_1 = require("../models/user");
const sendMail_1 = require("../helpers/sendMail");
const router = (0, express_1.Router)();
//queue to handle payout and payments
function handleCryptoDonation(paymentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const donation = yield donations_1.Donation.findOne({
            paymentIntentId: paymentData.paymentIntentId,
        });
        if (!donation) {
            return;
        }
        const campaign = yield campaign_1.Campaign.findById(donation.campaign);
        if (!campaign) {
            return;
        }
        if (paymentData.status == "paid") {
            if (donation.status == 2 || donation.status == -2) {
                return; //to prevent processing already processed webhooks
            }
            donation.paymentId = paymentData.id;
            donation.usdAmount = Number(paymentData.settlementAmount.amount); //setllementAmount is usually USD
            donation.amount = paymentData.amount.amount;
            donation.status = 2;
            donation.dateUpdated = new Date();
            campaign.raised += Number(paymentData.settlementAmount.amount);
            campaign.dateUpdated = new Date();
            if (campaign.receiveAlerts) {
                const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                const message = `A donation of $${donation.usdAmount} was just made to your campaign ${campaign === null || campaign === void 0 ? void 0 : campaign.name}`;
                sendMail_1.emailQueue.add({
                    email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                    title: "DONATION NOTIFICATION",
                    message: message,
                });
            }
            if (campaign.raised + Number(paymentData.settlementAmount.amount) >=
                campaign.target) {
                campaign.completed = true;
                campaign.dateCompleted = new Date();
                if (campaign.receiveAlerts) {
                    const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                    const message = `Your campaign ${campaign.name} has reached its target of $${campaign.target}`;
                    sendMail_1.emailQueue.add({
                        email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                        title: "CAMPAIGN COMPLETION",
                        message: message,
                    });
                }
            }
            yield donation.save();
            yield campaign.save();
        }
        else if (paymentData.status == "failed") {
            donation.paymentId = paymentData.id;
            donation.usdAmount = Number(0); //setllementAmount is usually USD
            donation.status = -2;
            donation.dateUpdated = new Date();
            yield donation.save();
        }
    });
}
function handleCryptoRefund(paymentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const withdrawal = yield withdrawal_1.Withdrawal.findOne({
            refundId: paymentData.id,
        });
        if (!withdrawal) {
            return;
        }
        const donation = yield donations_1.Donation.findById(withdrawal.donation);
        if (!donation) {
            return;
        }
        const campaign = yield campaign_1.Campaign.findById(donation.campaign);
        if (!campaign) {
            return;
        }
        if (paymentData.status == "paid") {
            if (withdrawal.status == 2 || withdrawal.status == -2) {
                return; //to prevent processing already processed webhooks
            }
            withdrawal.status = 2;
            withdrawal.dateConfirmed = new Date();
            donation.withdrew = true;
            donation.dateUpdated = new Date();
            campaign.raised -= Number(paymentData.settlementAmount.amount) / 0.97;
            campaign.dateUpdated = new Date();
            if (campaign.receiveAlerts) {
                const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                const message = `A donation of $${paymentData.settlementAmount.amount} was withdrawn from your campaign ${campaign === null || campaign === void 0 ? void 0 : campaign.name}`;
                sendMail_1.emailQueue.add({
                    email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                    title: "DONATION WITHDRAWAL NOTIFICATION",
                    message: message,
                });
            }
            if (campaign.raised - Number(paymentData.settlementAmount.amount) / 0.97 <
                campaign.target) {
                campaign.completed = false;
                if (campaign.receiveAlerts) {
                    const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                    const message = `Your campaign ${campaign.name} went below its target of ${campaign.target} due to a withdrawal.`;
                    sendMail_1.emailQueue.add({
                        email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                        title: "DONATION WITHDRAWAL NOTIFICATION",
                        message: message,
                    });
                }
            }
            yield withdrawal.save();
            yield donation.save();
            yield campaign.save();
        }
        else if (paymentData.status == "failed") {
            withdrawal.status = -2;
            withdrawal.dateConfirmed = new Date();
            yield donations_1.Donation.updateOne({ _id: donation._id }, {
                $unset: {
                    withdrawal: 1,
                },
                $set: {
                    dateUpdated: new Date(),
                },
            });
            yield withdrawal.save();
        }
    });
}
function handleCardPayments(paymentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const donation = yield donations_1.Donation.findOne({
            paymentId: paymentData.id,
        });
        if (!donation) {
            return;
        }
        const campaign = yield campaign_1.Campaign.findById(donation.campaign);
        if (!campaign) {
            return;
        }
        if (paymentData.status == "paid") {
            if (donation.status == 2 || donation.status == -2) {
                return; //to prevent processing already processed webhooks
            }
            donation.paymentId = paymentData.id;
            donation.usdAmount = Number(paymentData.amount.amount); //setllementAmount is usually USD
            donation.status = 2;
            donation.dateUpdated = new Date();
            campaign.raised += Number(paymentData.amount.amount);
            campaign.dateUpdated = new Date();
            if (campaign.receiveAlerts) {
                const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                const message = `A donation of $${donation.usdAmount} was just made to your campaign ${campaign === null || campaign === void 0 ? void 0 : campaign.name}`;
                sendMail_1.emailQueue.add({
                    email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                    title: "DONATION NOTIFICATION",
                    message: message,
                });
            }
            if (campaign.raised + Number(paymentData.amount.amount) >=
                campaign.target) {
                campaign.completed = true;
                campaign.dateCompleted = new Date();
                if (campaign.receiveAlerts) {
                    const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                    const message = `Your campaign ${campaign.name} has reached its target of $${campaign.target}`;
                    sendMail_1.emailQueue.add({
                        email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                        title: "CAMPAIGN COMPLETION",
                        message: message,
                    });
                }
            }
            yield donation.save();
            yield campaign.save();
        }
        else if (paymentData.status == "failed") {
            donation.paymentId = paymentData.id;
            donation.usdAmount = Number(0); //setllementAmount is usually USD
            donation.status = -2;
            donation.dateUpdated = new Date();
            yield donation.save();
        }
    });
}
function handleCardRefund(paymentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const withdrawal = yield withdrawal_1.Withdrawal.findOne({
            refundId: paymentData.id,
        });
        if (!withdrawal) {
            return;
        }
        const donation = yield donations_1.Donation.findById(withdrawal.donation);
        if (!donation) {
            return;
        }
        const campaign = yield campaign_1.Campaign.findById(donation.campaign);
        if (!campaign) {
            return;
        }
        if (paymentData.status == "paid") {
            if (withdrawal.status == 2 || withdrawal.status == -2) {
                return; //to prevent processing already processed webhooks
            }
            withdrawal.status = 2;
            withdrawal.dateConfirmed = new Date();
            donation.withdrew = true;
            donation.dateUpdated = new Date();
            campaign.raised -= Number(paymentData.amount.amount) / 0.97;
            campaign.dateUpdated = new Date();
            if (campaign.receiveAlerts) {
                const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                const message = `A donation of $${Number(paymentData.amount.amount) / 0.97} was withdrawn from your campaign ${campaign === null || campaign === void 0 ? void 0 : campaign.name}`;
                sendMail_1.emailQueue.add({
                    email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                    title: "DONATION WITHDRAWAL NOTIFICATION",
                    message: message,
                });
            }
            if (campaign.raised - Number(paymentData.amount.amount) <=
                campaign.target) {
                campaign.completed = false;
            }
            if (campaign.raised - Number(paymentData.amount.amount) / 0.97 <
                campaign.target) {
                campaign.completed = false;
                if (campaign.receiveAlerts) {
                    const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                    const message = `Your campaign ${campaign.name} went below its target of $${campaign.target} due to a withdrawal.`;
                    sendMail_1.emailQueue.add({
                        email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                        title: "DONATION WITHDRAWAL NOTIFICATION",
                        message: message,
                    });
                }
            }
            yield withdrawal.save();
            yield donation.save();
            yield campaign.save();
        }
        else if (paymentData.status == "failed") {
            withdrawal.status = -2;
            withdrawal.dateConfirmed = new Date();
            yield donations_1.Donation.updateOne({ _id: donation._id }, {
                $unset: {
                    withdrawal: 1,
                },
                $set: {
                    dateUpdated: new Date(),
                },
            });
            yield withdrawal.save();
        }
    });
}
function handlePayout(payoutData) {
    return __awaiter(this, void 0, void 0, function* () {
        const payout = yield payout_1.Payout.findOne({
            payoutId: payoutData.id,
        });
        if (!payout) {
            return;
        }
        const campaign = yield campaign_1.Campaign.findById(payout.campaign);
        if (!campaign) {
            return;
        }
        if (payoutData.status == "complete") {
            if (payout.status == 2 || payout.status == -2) {
                return; //to prevent processing already processed webhooks
            }
            payout.status = 2;
            payout.usdAmount = payoutData.amount.amount;
            payout.amount = payoutData.toAmount.amount;
            payout.dateUpdated = new Date();
            campaign.payoutStatus = true;
            campaign.dateCreated = new Date();
            yield payout.save();
            yield campaign.save();
        }
        else if (payoutData.status == "failed") {
            payout.status = -2;
            payout.dateUpdated = new Date();
            yield campaign_1.Campaign.updateOne({ _id: campaign._id }, {
                $unset: {
                    payout: 1,
                },
                $set: {
                    dateUpdated: new Date(),
                },
            });
            yield payout.save();
        }
    });
}
var paymentQueue;
if (config_1.MODE == "PRODUCTION") {
    paymentQueue = new bull_1.default("payment", {
        redis: {
            port: config_1.REDIS_PORT,
            host: config_1.REDIS_HOST,
            password: config_1.REDIS_PASSWORD,
        },
    });
}
else {
    paymentQueue = new bull_1.default("payment", "redis://127.0.0.1:6379");
}
paymentQueue.process(function (job) {
    return __awaiter(this, void 0, void 0, function* () {
        const paymentData = job.data;
        console.log("Started processing payment of data", job.data.id);
        //payments are usually for donations
        if (paymentData.type == "payment") {
            if (paymentData.source) {
                yield handleCardPayments(paymentData);
            }
            else {
                yield handleCryptoDonation(paymentData);
            }
        }
        else if (paymentData.type == "refund") {
            if (paymentData.source) {
                yield handleCardRefund(paymentData);
            }
            else {
                yield handleCryptoRefund(paymentData);
            }
        }
    });
});
var payoutQueue;
if (config_1.MODE == "PRODUCTION") {
    payoutQueue = new bull_1.default("payout", {
        redis: {
            port: config_1.REDIS_PORT,
            host: config_1.REDIS_HOST,
            password: config_1.REDIS_PASSWORD,
        },
    });
}
else {
    payoutQueue = new bull_1.default("payout", "redis://127.0.0.1:6379");
}
payoutQueue.process(function (job) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Started processing payout of data", job.data);
        const payoutData = job.data;
        yield handlePayout(payoutData);
    });
});
router.head("/notification/v1", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    res.end(`HEAD request for ${req.url}`);
    console.log("Reached Head request");
    return;
}));
router.post("/notification/v1", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = "";
    req.on("data", (data) => {
        body += data;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        res.writeHead(200, {
            "Content-Type": "text/html",
        });
        const envelope = JSON.parse(body);
        if (envelope.Type == "SubscriptionConfirmation") {
            try {
                yield axios_1.default.get(envelope.SubscribeURL);
                console.log("Successfully subscribed");
            }
            catch (error) {
                console.log("Could not subscribe");
            }
        }
        else if (envelope.Type == "Notification") {
            const data = JSON.parse(envelope.Message);
            const { notificationType } = data, payload = __rest(data, ["notificationType"]);
            if (notificationType == "payments") {
                paymentQueue.add(payload.payment);
            }
            //handle payout
            else if (notificationType == "payouts") {
                payoutQueue.add(payload.payout);
            }
            res.end(`POST req for ${req.url}`);
        }
    }));
}));
exports.webhook = router;
