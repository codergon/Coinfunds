"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payout = void 0;
const mongoose_1 = require("mongoose");
const payoutSchema = new mongoose_1.Schema({
    recipient: {
        type: "ObjectId",
        required: true,
        ref: "User",
    },
    payoutId: {
        type: String,
    },
    amount: {
        type: String,
    },
    usdAmount: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        enum: ["ETH", "BTC", "USD"],
        required: true,
    },
    recipientId: {
        type: String,
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
});
exports.Payout = (0, mongoose_1.model)("Payout", payoutSchema);
