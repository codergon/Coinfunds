"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donation = void 0;
const mongoose_1 = require("mongoose");
const donationSchema = new mongoose_1.Schema({
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
exports.Donation = (0, mongoose_1.model)("Donation", donationSchema);
