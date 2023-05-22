"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    owner: {
        type: "ObjectId",
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        minlength: 1,
        required: true,
    },
    campaign: {
        type: "ObjectId",
        ref: "Campaign",
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});
exports.Comment = (0, mongoose_1.model)("Comment", CommentSchema);
