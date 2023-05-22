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
exports.Withdrawal = void 0;
const mongoose_1 = require("mongoose");
const donations_1 = require("./donations");
const campaign_1 = require("./campaign");
const user_1 = require("./user");
const sendMail_1 = require("../helpers/sendMail");
const WithdrawalSchema = new mongoose_1.Schema({
    amount: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    donation: {
        type: "ObjectId",
        ref: "Donation",
        required: true,
    },
    user: {
        type: "ObjectId",
        ref: "User",
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    dateConfirmed: {
        type: Date,
    },
    method: {
        type: String,
        required: true,
    },
    refundId: {
        type: String,
    },
});
exports.Withdrawal = (0, mongoose_1.model)("Withdrawal", WithdrawalSchema);
WithdrawalSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const withdrawal = this;
        if (withdrawal.isModified("status")) {
            if (withdrawal.status == 2) {
                const donation = yield donations_1.Donation.findById(withdrawal.donation);
                const campaign = yield campaign_1.Campaign.findById(donation === null || donation === void 0 ? void 0 : donation.campaign);
                const campaignOwner = yield user_1.UserModel.findById(campaign === null || campaign === void 0 ? void 0 : campaign.owner);
                const message = `A donation was withdrawn from your campaign ${campaign === null || campaign === void 0 ? void 0 : campaign.name}`;
                sendMail_1.emailQueue.add({
                    email: campaignOwner === null || campaignOwner === void 0 ? void 0 : campaignOwner.email,
                    title: "DONATION NOTIFICATION",
                    message: message,
                });
                next();
            }
        }
    });
});
