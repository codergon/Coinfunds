"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
const mongoose_1 = require("mongoose");
const campaignSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    owner: {
        type: "ObjectId",
        ref: "User",
        required: true,
    },
    target: {
        type: Number,
        required: true,
        min: 1,
    },
    raised: {
        type: Number,
        default: 0,
    },
    payout: {
        type: "ObjectId",
        ref: "Payout",
    },
    payoutStatus: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    deadlineDate: {
        type: Date,
        required: true,
    },
    dateCompleted: {
        type: Date,
    },
    dateUpdated: {
        type: Date,
    },
    comments: [
        {
            type: "ObjectId",
            ref: "Comment",
        },
    ],
    completed: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    donations: [
        {
            type: "ObjectId",
            ref: "Donation",
        },
    ],
    receiveAlerts: {
        type: Boolean,
        default: false,
    },
});
exports.Campaign = (0, mongoose_1.model)("Campaign", campaignSchema);
