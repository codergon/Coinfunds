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
exports.donation = void 0;
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const authenticate_1 = require("../middleware/authenticate");
const donations_1 = require("../models/donations");
const mongoose_1 = require("mongoose");
const campaign_1 = require("../models/campaign");
const cryptoPayment_1 = require("../helpers/circle/crypto/cryptoPayment");
const config_1 = require("../config");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const withdrawal_1 = require("../models/withdrawal");
const cardPayment_1 = require("../helpers/circle/card/cardPayment");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield donations_1.Donation.find({})
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
        const docCount = yield donations_1.Donation.find({}).countDocuments();
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
        const docs = yield donations_1.Donation.find({
            // within date range
            created_at: {
                $gte: new Date(new Date(req.params.start).setHours(0, 0, 0)),
                $lt: new Date(new Date(req.params.end).setHours(23, 59, 59)),
            },
        })
            .sort({ dateCreated: 1 })
            .populate("donor", [
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
        const doc = yield donations_1.Donation.findById(id)
            .populate("donor", [
            "id",
            "username",
            "email",
            "avatar",
            "active",
            "dateCreated",
        ])
            .populate("campaign")
            .populate("withdrawal");
        if (!doc) {
            return res.status(404).send({
                success: false,
                err: "Donation of specified id not found",
            });
        }
        const circlePayment = new cryptoPayment_1.CircleCryptoPayment(config_1.CircleAPI);
        const paymentIntent = doc.paymentIntentId
            ? yield circlePayment.getPaymentIntentById(doc.paymentIntentId)
            : null;
        const circleCardPayment = new cardPayment_1.CircleCardPayment(config_1.CircleAPI);
        const payment = doc.paymentId
            ? yield circleCardPayment.getPaymentById(doc.paymentId)
            : null;
        return res.status(200).send({
            success: true,
            data: { doc, paymentIntent, payment },
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user/:id/donated", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield donations_1.Donation.find({ donor: new mongoose_1.Types.ObjectId(userId) })
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
router.get("/user/:id/donated/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const count = yield donations_1.Donation.find({
            donor: new mongoose_1.Types.ObjectId(userId),
        }).countDocuments();
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
router.get("/user/:id/donated/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const sum = yield donations_1.Donation.aggregate([
            {
                $match: {
                    donor: new mongoose_1.Types.ObjectId(userId),
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
router.get("/user/:id/received", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const userCampaignsIds = (yield campaign_1.Campaign.find({
            owner: new mongoose_1.Types.ObjectId(userId),
        })).map((campian) => new mongoose_1.Types.ObjectId(campian._id));
        const userReceivedDonations = yield donations_1.Donation.find({
            campaign: { $in: userCampaignsIds },
        })
            .populate("campaign", "-donations -comments")
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);
        return res.status(200).send({
            success: true,
            data: userReceivedDonations[0],
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user/:id/received/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userCampaignsIds = (yield campaign_1.Campaign.find({
            owner: new mongoose_1.Types.ObjectId(userId),
        })).map((campian) => new mongoose_1.Types.ObjectId(campian._id));
        const userReceivedDonationsCount = yield donations_1.Donation.find({
            campaign: { $in: userCampaignsIds },
        }).countDocuments();
        return res.status(200).send({
            success: true,
            data: userReceivedDonationsCount,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user/:id/received/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userCampaignsIds = (yield campaign_1.Campaign.find({
            owner: new mongoose_1.Types.ObjectId(userId),
        })).map((campian) => new mongoose_1.Types.ObjectId(campian._id));
        const userCampaignsReceuvedSum = yield donations_1.Donation.aggregate([
            {
                $match: {
                    $campaign: {
                        $in: userCampaignsIds,
                    },
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
            data: userCampaignsReceuvedSum,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.post("/card", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    /*
      Donate with card
      */
    const donatePayload = {
        donor: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        currency: "USD",
        campaign: req.body.campaignId,
        usdAmount: Number(req.body.amount),
        method: "CARD",
        amount: req.body.amount,
    };
    if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.cardIds)) {
        return res.status(404).send({
            success: false,
            err: "No Card Details for user",
        });
    }
    const circlePayment = new cardPayment_1.CircleCardPayment(config_1.CircleAPI);
    try {
        const campaign = yield campaign_1.Campaign.findById(donatePayload.campaign);
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
        const payload = {
            idempotencyKey: crypto_1.default.randomUUID(),
            keyId: "key1",
            verification: "cvv",
            source: {
                id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.cardIds,
                type: "card",
            },
            encryptedData: req.body.encryptedData,
            amount: {
                amount: String(donatePayload.amount),
                currency: "USD",
            },
            description: req.body.description || "Donation At Coin Funds",
            metadata: {
                email: req.user.email,
                ipAddress: req.body.ipAddress,
                sessionId: (0, sha256_1.default)(req.user.token).toString(),
            },
        };
        const payment = yield circlePayment.createCardPayment(payload);
        const donationDoc = yield donations_1.Donation.create(Object.assign(Object.assign({}, donatePayload), { paymentId: payment.id }));
        campaign.donations.push(donationDoc._id);
        yield campaign.save();
        return res.status(200).send({
            success: true,
            data: {
                donationDoc,
                payment,
            },
        });
    }
    catch (error) { }
}));
router.post("/crypto", authenticate_1.authenticatetokenOrAnonymous, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    Donate with crypto
    User creates a payment intent that is to be processed
    Create a donation object with specified params
    webhook to receive notifications
   */
    var _d;
    const donatePayload = {
        donor: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
        currency: req.body.currency,
        campaign: new mongoose_1.Types.ObjectId(req.body.campaignId),
        method: "CRYPTO",
        amount: String(req.body.amount),
        chain: req.body.chain,
    };
    try {
        const circlePayment = new cryptoPayment_1.CircleCryptoPayment(config_1.CircleAPI);
        const campaign = yield campaign_1.Campaign.findById(donatePayload.campaign);
        if (!campaign) {
            return res.status(404).send({
                success: false,
                err: "The campaign of specified id was not found",
            });
        }
        if (campaign.payoutStatus || campaign.payout) {
            return res.status(400).send({
                success: false,
                err: "Payout already processed for campaign",
            });
        }
        const payload = {
            idempotencyKey: crypto_1.default.randomUUID(),
            amount: {
                amount: String(donatePayload.amount),
                currency: donatePayload.currency,
            },
            settlementCurrency: "USD",
            paymentMethods: [
                {
                    chain: donatePayload.chain,
                    type: "blockchain",
                },
            ],
        };
        const paymentIntent = yield circlePayment.createPaymenIntent(payload);
        const donationDoc = yield donations_1.Donation.create(Object.assign(Object.assign({}, donatePayload), { paymentIntentId: paymentIntent.id }));
        campaign.donations.push(donationDoc._id);
        yield campaign.save();
        return res.status(200).send({
            success: true,
            data: {
                donationDoc,
                paymentIntent,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.post("/:id/withdraw", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    To Withdraw
    A user must be logged in, must have been logged in to withdraw
    must specify id of donation they are trying to withdraw
    // check if donation id exists, if the logged in users is the owner,the status of the donation is confirmed, the withdrew status is false and there is a withdrawalId.
    //Check that payout status of campaign is false
    //update donation status
    //update
    */
    var _e;
    try {
        const donationId = req.params.id;
        const donation = yield donations_1.Donation.findOne({
            _id: new mongoose_1.Types.ObjectId(donationId),
            withdrew: false,
            status: 2, //it has been confirmed
        });
        if (!donation) {
            return res.status(400).send({
                success: false,
                err: "Withdrawal of specified parameters does not exist",
            });
        }
        if (donation.donor.toString() !== ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
            return res.status(400).send({
                success: false,
                err: "Access denied",
            });
        }
        if (donation.withdrawal) {
            return res.status(400).send({
                success: false,
                err: "Withdrawal already initiated for donation",
            });
        }
        const campaign = yield campaign_1.Campaign.findById(donation.campaign);
        if (!campaign) {
            return res.status(400).send({
                success: false,
                err: "Campaign of specific donation does not exist",
            });
        }
        if (campaign.payoutStatus || campaign.payout) {
            return res.status(400).send({
                success: false,
                err: "Payout already processed for campaign",
            });
        }
        if (donation.method == "CRYPTO") {
            const circlePayment = new cryptoPayment_1.CircleCryptoPayment(config_1.CircleAPI);
            var toAmount;
            if (donation.currency == "BTC" || donation.currency == "ETH") {
                const exchangeRate = yield circlePayment.getExchangeRate(`${donation.currency}-USD`);
                toAmount =
                    donation.usdAmount /
                        Math.max(Number(exchangeRate.buy), Number(exchangeRate.sell));
            }
            else {
                toAmount = donation.usdAmount * 0.99;
            }
            const payload = {
                idempotencyKey: crypto_1.default.randomUUID(),
                destination: {
                    address: req.body.address,
                    chain: req.body.chain,
                },
                amount: {
                    currency: "USD",
                },
                toAmount: {
                    currency: donation.currency,
                    amount: String((0.97 * toAmount).toFixed(2)), //removes fee
                },
            };
            if (!donation.paymentIntentId) {
                return res.status(400).send({
                    success: false,
                    err: "No payment Intent Id found to withdraw",
                });
            }
            const withdrawalDetails = yield circlePayment.refundPaymentById(donation.paymentIntentId, payload);
            const withdrawalDoc = yield withdrawal_1.Withdrawal.create({
                amount: String(0.97 * toAmount),
                currency: donation.currency,
                donation: donation._id,
                user: req.user._id,
                method: "CRYPTO",
                refundId: withdrawalDetails.id,
            });
            donation.withdrawal = withdrawalDoc._id;
            donation.dateUpdated = new Date();
            yield donation.save();
            return res.status(200).send({
                success: true,
                data: withdrawalDoc,
            });
        }
        else {
            const circlePayment = new cardPayment_1.CircleCardPayment(config_1.CircleAPI);
            const payload = {
                idempotencyKey: crypto_1.default.randomUUID(),
                reason: "Refund of donation",
                amount: {
                    amount: String((0.97 * donation.usdAmount).toFixed(2)),
                    currency: "USD",
                },
            };
            if (!donation.paymentId) {
                return res.status(400).send({
                    success: false,
                    err: "No payment Id found to withdraw",
                });
            }
            const withdrawalDetails = yield circlePayment.refundCardPayment(donation.paymentId, payload);
            const withdrawalDoc = yield withdrawal_1.Withdrawal.create({
                amount: String(0.97 * donation.usdAmount),
                currency: donation.currency,
                donation: donation._id,
                user: req.user._id,
                method: "CARD",
                refundId: withdrawalDetails.id,
            });
            donation.withdrawal = withdrawalDoc._id;
            donation.dateUpdated = new Date();
            yield donation.save();
            return res.status(200).send({
                success: true,
                data: withdrawalDoc,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
exports.donation = router;
