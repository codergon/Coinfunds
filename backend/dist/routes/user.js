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
exports.user = exports.getUserbyUsername = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../models/user");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const cardPayment_1 = require("../helpers/circle/card/cardPayment");
const config_1 = require("../config");
const cryptoPayout_1 = require("../helpers/circle/crypto/cryptoPayout");
const router = express_1.default.Router();
function getUserbyUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.UserModel.findOne({
            username: username,
        }).select(["id", "username", "email", "avatar", "active", "dateCreated"]);
        if (user) {
            return user;
        }
        else {
            return null;
        }
    });
}
exports.getUserbyUsername = getUserbyUsername;
//check if request user is authenticated
router.get("/auth", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const circlePayout = new cryptoPayout_1.CircleCryptoPayout(config_1.CircleAPI);
        const circlePayment = new cardPayment_1.CircleCardPayment(config_1.CircleAPI);
        const cardDetails = req.user.cardIds
            ? yield circlePayment.getCardById(req.user.cardIds)
            : null;
        const payoutRecipientDetails = req.user.payoutRecipientsIds
            ? yield circlePayout.getRecipientById(req.user.payoutRecipientsIds)
            : null;
        return res.status(200).json({
            success: true,
            data: { user: req.user, payoutRecipientDetails, cardDetails },
        });
    }
    catch (error) {
        return res.status(501).json({
            message: "An error occured",
        });
    }
}));
router.get("/allUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_1.UserModel.find().select([
            "id",
            "username",
            "email",
            "avatar",
            "active",
            "dateCreated",
        ]);
        return res.status(200).send({
            success: true,
            data: allUsers,
        });
    }
    catch (error) {
        return res.status(501).json({
            message: "An error occured",
        });
    }
}));
router.put("/addCard", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const circlePayment = new cardPayment_1.CircleCardPayment(config_1.CircleAPI);
        const payload = {
            idempotencyKey: crypto_1.default.randomUUID(),
            keyId: "key1",
            encryptedData: req.body.encryptedData,
            expMonth: req.body.expMonth,
            expYear: req.body.expYear,
            billingDetails: {
                name: req.body.name,
                city: req.body.city,
                country: req.body.country,
                line1: req.body.line1,
                line2: req.body.line2,
                district: req.body.district,
                postalCode: req.body.postalCode,
            },
            metadata: {
                email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
                ipAddress: req.body.ipAddress,
                sessionId: (0, sha256_1.default)((_b = req.user) === null || _b === void 0 ? void 0 : _b.token).toString(),
            },
        };
        const card = yield circlePayment.createCard(payload);
        yield user_1.UserModel.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, {
            $set: {
                cardIds: card.id,
            },
        });
        return res.status(200).send({
            success: true,
            data: "Successfully added card of id " + card.id,
        });
    }
    catch (error) {
        return res.status(501).json({
            message: "An error occured",
        });
    }
}));
router.put("/addPayoutAddr", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    const circlePayout = new cryptoPayout_1.CircleCryptoPayout(config_1.CircleAPI);
    const payload = {
        idempotencyKey: crypto_1.default.randomUUID(),
        chain: req.body.chain,
        address: req.body.address,
        addressTag: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
        metadata: {
            email: (_e = req.user) === null || _e === void 0 ? void 0 : _e.email,
            nickname: (_f = req.user) === null || _f === void 0 ? void 0 : _f.username,
        },
    };
    const payoutRecipientData = yield circlePayout.createRecipient(payload);
    yield user_1.UserModel.findByIdAndUpdate((_g = req.user) === null || _g === void 0 ? void 0 : _g._id, {
        $set: {
            payoutRecipientsIds: payoutRecipientData.id,
        },
    });
    return res.status(200).send({
        success: true,
        data: "Successfully added addr of id " + payoutRecipientData.id,
    });
}));
router.get("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const userdata = yield getUserbyUsername(username);
    if (!userdata) {
        return res.status(404).send({
            message: "This username was not found",
        });
    }
    else {
        return res.status(200).send({
            success: true,
            data: userdata,
        });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userdata = yield user_1.UserModel.findById(id).select([
        "id",
        "username",
        "email",
        "avatar",
        "active",
        "dateCreated",
    ]);
    if (!userdata) {
        return res.status(404).send({
            message: "This username was not found",
        });
    }
    else {
        return res.status(200).send({
            success: true,
            data: userdata,
        });
    }
}));
exports.user = router;
