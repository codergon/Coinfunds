import express, { Router, Request, Response } from "express";
import { Req, authenticatetoken } from "../middleware/authenticate";
import { Campaign, CampaignDocument } from "../models/campaign";
import { Comment } from "../models/comment";
import { Types } from "mongoose";

const router: Router = express.Router();

//get campaigns(if pagination query params not specified defaults to first 25)
router.get("/", async (req: Request, res: Response) => {
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;

  try {
    const docs = await Campaign.find({})
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

//get all campaigns cunt
router.get("/count", async (req: Request, res: Response) => {
  try {
    const docCount = await Campaign.find({}).countDocuments();
    return res.status(200).send({
      success: true,
      data: docCount,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

//create new campaign
router.post("/", authenticatetoken, async (req: Req, res: Response) => {
  const {
    name,
    description,
    category,
    target,
    deadlineDate,
    receiveAlerts,
    image,
  } = req.body;
  if (deadlineDate < Date.now()) {
    return res.status(400).send({
      success: false,
      err: "Invalid deadline date",
    });
  }
  try {
    const newCampaign = await Campaign.create({
      name: name,
      owner: req.user?.id,
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
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/recent", async (req: Request, res: Response) => {
  const limit = req.params.limit ? parseInt(req.params.limit) : 15;
  try {
    const docs = await Campaign.find({ verified: true })
      .sort({
        dateCreated: -1,
      })
      .limit(limit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/verified", async (req: Request, res: Response) => {
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;

  try {
    const docs = await Campaign.find({ verified: true })
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/verified/count", async (req: Request, res: Response) => {
  try {
    const docCount = await Campaign.find({ verified: true }).countDocuments();
    return res.status(200).send({
      success: true,
      data: docCount,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/unverified", async (req: Request, res: Response) => {
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;

  try {
    const docs = await Campaign.find({ verified: false })
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/unverified/count", async (req: Request, res: Response) => {
  try {
    const docCount = await Campaign.find({ verified: false }).countDocuments();
    return res.status(200).send({
      success: true,
      data: docCount,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Campaign.distinct<string>("category");
    return res.status(200).send({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/categories/:category", async (req: Request, res: Response) => {
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 0;
  try {
    const docs = await Campaign.find({ category: req.params.category })
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: docs,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get(
  "/categories/:category/count",
  async (req: Request, res: Response) => {
    try {
      const docCount = await Campaign.find({
        category: req.params.category,
      }).countDocuments();
      return res.status(200).send({
        success: true,
        data: docCount,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        err: error,
      });
    }
  }
);

// TO-DO sorting techniques endpoint
// router.get("/sort/:sort/count", async (req: Request, res: Response) => {});
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const doc = await Campaign.findById(id)
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
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.put("/:id", authenticatetoken, async (req: Req, res: Response) => {
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
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(400).send({
        success: false,
        err: "Campaign of specified id not found",
      });
    }
    if (campaign.owner._id.toString() !== req.user?._id.toString()) {
      return res.status(400).send({
        success: false,
        err: "Not Authorised",
      });
    }
    const newDoc = await Campaign.findByIdAndUpdate(
      id,
      { $set: campaignUpdateData },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      data: newDoc,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user", authenticatetoken, async (req: Req, res: Response) => {
  try {
    const doc = await Campaign.find({ owner: req.user?._id });
    return res.status(200).send({
      success: true,
      data: doc,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id/count", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const docCount = await Campaign.find({
      owner: new Types.ObjectId(userId),
    }).countDocuments();
    return res.status(200).send({
      success: true,
      data: docCount,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.get("/user/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const pageLimit = req.query.pageLimit
    ? parseInt(req.query.pageLimit as string)
    : 25;
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 0;
  try {
    const doc = await Campaign.find({ owner: new Types.ObjectId(userId) })
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).send({
      success: true,
      data: doc,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      err: error,
    });
  }
});

router.post(
  "/:id/comment",
  authenticatetoken,
  async (req: Req, res: Response) => {
    const id = req.params.id;
    const commentText = req.body.text;
    if (!commentText || commentText == "") {
      return res.status(400).send({
        success: false,
        err: "Text property in request body should not be empty",
      });
    }
    try {
      const commentDoc = await Comment.create({
        owner: req.user?._id,
        campaign: new Types.ObjectId(id),
        text: commentText,
      });
      const newCampaignDoc = await Campaign.findByIdAndUpdate(
        id,
        { $push: { comments: commentDoc.id } },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        data: newCampaignDoc,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        err: error,
      });
    }
  }
);

router.delete(
  "/:id/comment/:commentId",
  authenticatetoken,
  async (req: Req, res: Response) => {
    const campaignId = req.params.id;
    const commentId = req.params.commentId;
    try {
      const commentFound = await Comment.findOne({
        campaign: new Types.ObjectId(campaignId),
        _id: new Types.ObjectId(commentId),
      });
      if (!commentId) {
        return res.status(400).send({
          success: false,
          err: "Comment Not found",
        });
      }
      if (commentFound?.owner.toString() !== req.user?.id) {
        return res.status(400).send({
          success: false,
          err: "Unauthorized action",
        });
      }
      const newCampaignDoc = await Campaign.findByIdAndUpdate(campaignId, {
        $pull: { comments: new Types.ObjectId(commentId) },
      });
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).send({
        success: true,
        data: newCampaignDoc,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        err: error,
      });
    }
  }
);

export const campaign = router;
