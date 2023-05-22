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
exports.campaign = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const campaign_1 = require("../models/campaign");
const comment_1 = require("../models/comment");
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
//get campaigns(if pagination query params not specified defaults to first 25)
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield campaign_1.Campaign.find({})
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
//get all campaigns cunt
router.get("/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docCount = yield campaign_1.Campaign.find({}).countDocuments();
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
//create new campaign
router.post("/", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description, category, target, deadlineDate, receiveAlerts, image, } = req.body;
    if (deadlineDate < Date.now()) {
        return res.status(400).send({
            success: false,
            err: "Invalid deadline date",
        });
    }
    try {
        const newCampaign = yield campaign_1.Campaign.create({
            name: name,
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            description: description.trim(),
            target: Number(target),
            deadlineDate: deadlineDate,
            image: image,
            receiveAlerts: receiveAlerts,
            category: category.toUpperCase(),
        });
        return res.status(200).send({
            success: true,
            data: newCampaign,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/recent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.params.limit ? parseInt(req.params.limit) : 15;
    try {
        const docs = yield campaign_1.Campaign.find({ verified: true })
            .sort({
            dateCreated: -1,
        })
            .limit(limit);
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
router.get("/verified", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield campaign_1.Campaign.find({ verified: true })
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
router.get("/verified/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docCount = yield campaign_1.Campaign.find({ verified: true }).countDocuments();
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
router.get("/unverified", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 1;
    try {
        const docs = yield campaign_1.Campaign.find({ verified: false })
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
router.get("/unverified/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docCount = yield campaign_1.Campaign.find({ verified: false }).countDocuments();
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
router.get("/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield campaign_1.Campaign.distinct("category");
        return res.status(200).send({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/categories/:category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 0;
    try {
        const docs = yield campaign_1.Campaign.find({ category: req.params.category })
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
router.get("/categories/:category/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docCount = yield campaign_1.Campaign.find({
            category: req.params.category,
        }).countDocuments();
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
// TO-DO sorting techniques endpoint
// router.get("/sort/:sort/count", async (req: Request, res: Response) => {});
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const doc = yield campaign_1.Campaign.findById(id)
            .populate("owner", [
            "username",
            "email",
            "avatar",
            "active",
            "dateCreated",
        ])
            .populate("payout") //check for inner populations
            .populate("comments")
            .populate("donations");
        return res.status(200).send({
            success: true,
            data: doc,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.put("/:id", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = req.params.id;
    const campaignUpdateData = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        target: req.body.target,
        deadlineDate: req.body.deadlineDate,
        receiveAlerts: req.body.receiveAlerts,
    };
    try {
        const campaign = yield campaign_1.Campaign.findById(id);
        if (!campaign) {
            return res.status(400).send({
                success: false,
                err: "Campaign of specified id not found",
            });
        }
        if (campaign.owner._id.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
            return res.status(400).send({
                success: false,
                err: "Not Authorised",
            });
        }
        const newDoc = yield campaign_1.Campaign.findByIdAndUpdate(id, { $set: campaignUpdateData }, { new: true });
        return res.status(200).send({
            success: true,
            data: newDoc,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.get("/user", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const doc = yield campaign_1.Campaign.find({ owner: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id });
        return res.status(200).send({
            success: true,
            data: doc,
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
        const docCount = yield campaign_1.Campaign.find({
            owner: new mongoose_1.Types.ObjectId(userId),
        }).countDocuments();
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
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const pageLimit = req.query.pageLimit
        ? parseInt(req.query.pageLimit)
        : 25;
    const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber)
        : 0;
    try {
        const doc = yield campaign_1.Campaign.find({ owner: new mongoose_1.Types.ObjectId(userId) })
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);
        return res.status(200).send({
            success: true,
            data: doc,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.post("/:id/comment", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const id = req.params.id;
    const commentText = req.body.text;
    if (!commentText || commentText == "") {
        return res.status(400).send({
            success: false,
            err: "Text property in request body should not be empty",
        });
    }
    try {
        const commentDoc = yield comment_1.Comment.create({
            owner: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
            campaign: new mongoose_1.Types.ObjectId(id),
            text: commentText,
        });
        const newCampaignDoc = yield campaign_1.Campaign.findByIdAndUpdate(id, { $push: { comments: commentDoc.id } }, { new: true });
        return res.status(200).send({
            success: true,
            data: newCampaignDoc,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
router.delete("/:id/comment/:commentId", authenticate_1.authenticatetoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const campaignId = req.params.id;
    const commentId = req.params.commentId;
    try {
        const commentFound = yield comment_1.Comment.findOne({
            campaign: new mongoose_1.Types.ObjectId(campaignId),
            _id: new mongoose_1.Types.ObjectId(commentId),
        });
        if (!commentId) {
            return res.status(400).send({
                success: false,
                err: "Comment Not found",
            });
        }
        if ((commentFound === null || commentFound === void 0 ? void 0 : commentFound.owner.toString()) !== ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
            return res.status(400).send({
                success: false,
                err: "Unauthorized action",
            });
        }
        const newCampaignDoc = yield campaign_1.Campaign.findByIdAndUpdate(campaignId, {
            $pull: { comments: new mongoose_1.Types.ObjectId(commentId) },
        });
        yield comment_1.Comment.findByIdAndDelete(commentId);
        return res.status(200).send({
            success: true,
            data: newCampaignDoc,
        });
    }
    catch (error) {
        return res.status(400).send({
            success: false,
            err: error,
        });
    }
}));
exports.campaign = router;
