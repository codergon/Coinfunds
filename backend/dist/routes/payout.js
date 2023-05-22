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
exports.payout = void 0;
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const payout_1 = require("../models/payout");
const campaign_1 = require("../models/campaign");
const cryptoPayout_1 = require("../helpers/circle/crypto/cryptoPayout");
const config_1 = require("../config");
const mongoose_1 = require("mongoose");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield payout_1.Payout.find({})
            .populate("campaign", "-donations -comments")
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);
        return res.status(200).send({
            success: true,
            data: docs,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docCount = yield payout_1.Payout.find({}).countDocuments();
        return res.status(200).send({
            success: true,
            data: docCount,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/date/:start/:end", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docs = yield payout_1.Payout.find({
            // within date range
            created_at: {
                $gte: new Date(new Date(req.params.start).setHours(0, 0, 0)),
                $lt: new Date(new Date(req.params.end).setHours(23, 59, 59)),
            },
        })
            .sort({ dateCreated: 1 })
            .populate("recipient", [
            "id",
            "username",
            "email",
            "avatar",
            "active",
            "dateCreated",
        ]);
        return res.status(200).send({
            success: true,
            data: docs,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const doc = yield payout_1.Payout.findById(id)
            .populate("recipient", [
            "id",
            "username",
            "email",
            "avatar",
            "active",
            "dateCreated",
        ])
            .populate("campaign");
        if (!doc) {
            return res.status(404).send({
                success: false,
                err: "Payout of specified id not found",
            });
        }
        const circlePayout = new cryptoPayout_1.CircleCryptoPayout(config_1.CircleAPI);
        const payout = yield circlePayout.getPayoutById(doc.payoutId);
        return res.status(200).send({
            success: true,
            data: { doc, payout },
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield payout_1.Payout.find({ recipient: userId })
            .populate("campaign", "-donations -comments ")
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);
        return res.status(200).send({
            success: true,
            data: docs,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user/:id/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const count = yield payout_1.Payout.find({ recipient: userId }).countDocuments();
        return res.status(200).send({
            success: true,
            data: count,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user/:id/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const sum = yield payout_1.Payout.aggregate([
            {
                $match: {
                    recipient: new mongoose_1.Types.ObjectId(userId),
                },
            },
            {
                $group: {
                    amount: {
                        $sum: "$usdAmount",
                    },
                },
            },
        ]);
        return res.status(200).send({
            success: true,
            data: sum[0] ? sum[0].amount : 0,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.post("/", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const payoutPayload = {
        recipient: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        currency: req.body.currency,
        campaign: req.body.campaignId,
        recipientId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.payoutRecipientsIds,
    };
    try {
        const campaign = yield campaign_1.Campaign.findById(payoutPayload.campaign);
        if (!campaign) {
            return res.status(404).send({
                success: false,
                err: "The campaign of specidied id was not found",
            });
        }
        if (campaign.payoutStatus || campaign.payout) {
            return res.status(400).send({
                success: false,
                err: "Payout already processed for campaign",
            });
        }
        if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.payoutRecipientsIds)) {
            return res.status(400).send({
                success: false,
                err: "Account does not have associated payout Id",
            });
        }
        const circlePayout = new cryptoPayout_1.CircleCryptoPayout(config_1.CircleAPI);
        const masterWalletId = yield circlePayout.getMasterWalletId();
        const payload = {
            idempotencyKey: crypto_1.default.randomUUID(),
            source: {
                type: "wallet",
                id: masterWalletId,
            },
            destination: {
                type: "address_book",
                id: req.user.payoutRecipientsIds,
            },
            amount: {
                amount: String((campaign.raised * 0.97).toFixed(2)),
                currency: "USD",
            },
            toAmount: {
                currency: payoutPayload.currency,
            },
        };
        const payout = yield circlePayout.createPayout(payload);
        const doc = yield payout_1.Payout.create({
            recipient: payoutPayload.recipient,
            payoutId: payout.id,
            campaign: payoutPayload.campaign,
            currency: payoutPayload.currency,
            usdAmount: String((campaign.raised * 0.97).toFixed(2)),
            recipientId: payoutPayload.recipientId,
        });
        campaign.payout = doc._id;
        yield campaign.save();
        return res.status(200).send({
            success: true,
            data: { doc, payout },
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
exports.payout = router;
