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
exports.client = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const user_1 = require("./routes/user");
const auth_1 = require("./routes/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const campaign_1 = require("./routes/campaign");
const donation_1 = require("./routes/donation");
const payout_1 = require("./routes/payout");
const webhook_1 = require("./routes/webhook");
const uri = config_1.MODE == "PRODUCTION"
    ? String(process.env.MONGO_CONNECTION_STRING)
    : "mongodb://localhost:27017/FundRaiser";
const PORT = 3000;
(function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // const circlePayment = new CircleCryptoPayment(CircleAPI);
        // const existingSubscriptions = await circlePayment.getSubscriptions();
        // // await circlePayment.removeSubcsription(
        // //   "24e37410-b867-4392-b9ea-fa0117c50341"
        // // );
        // console.log(existingSubscriptions);
        // if (!existingSubscriptions || existingSubscriptions.length == 0) {
        //   const data = await circlePayment.createSubscription(
        //     "https://coin-funds.fly.dev/webhook/notifications"
        //   );
        //   console.log(data);
        // }
        try {
            // ("https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-east-1:908968368384:sandbox_platform-notifications-topic&Token=2336412f37fb687f5d51e6e2425c464de0761df34399449911fa259ff8c182373a2d18a8d21e02c47253ce7f1e4c7a500ce1bb3a2e0c692ff7ad486328a18656f095744b00a898e8933438a12301800cc10662ce4f84b6c43ab0d69f481cf81e3adc5e1a78f001e681fb18d5857faf41f476a6f3f4e113bf219af9c4a4823ce98aacdd07a6f329cb8da5d23d00329a88");
            // await axios.get(
            //   "https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:908968368384:sandbox_platform-notifications-topic&Token=2336412f37fb687f5d51e6e2425c464de0761df34399449911fa259ff8c18523fce13c6560391fb27906681b1f98044ab941b1e4bec165f2d15c319ae8fe0fe92711d706fa87427153edfa760252163abd91c87731549995705de8891c91441844c6b8a7441b69ccf3cb2a43d8024972bbec7d01618955e6d14f419cb58521926c2db2662a7e9c8dd0ca3c6395026141"
            // );
            // console.log("Successfully subscribed");
        }
        catch (error) {
            console.log(error.message);
            console.log("Could not subscribe");
        }
    });
})();
mongoose_1.default
    .connect(uri, {})
    .then(() => {
    console.log("Connected to the database");
})
    .catch((err) => {
    console.error("Couldn't connect to database");
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).send({
            status: "Up and running",
        });
    });
});
app.use("/user", user_1.user);
app.use("/auth", auth_1.auth);
app.use("/campaign", campaign_1.campaign);
app.use("/donation", donation_1.donation);
app.use("/payout", payout_1.payout);
app.use("/webhook", webhook_1.webhook);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Listening on ${PORT}`);
}));
