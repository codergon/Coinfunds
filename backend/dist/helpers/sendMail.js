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
exports.sendEmail = exports.emailQueue = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const bull_1 = __importDefault(require("bull"));
if (config_1.MODE == "PRODUCTION") {
    exports.emailQueue = new bull_1.default("email", {
        redis: {
            port: config_1.REDIS_PORT,
            host: config_1.REDIS_HOST,
            password: config_1.REDIS_PASSWORD,
        },
    });
}
else {
    exports.emailQueue = new bull_1.default("email", "redis://127.0.0.1:6379");
}
exports.emailQueue.process(function (job) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = job.data;
        yield sendEmail(data.email, data.title, data.message, data.html);
    });
});
function sendEmail(email, title, message, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                port: 465,
                auth: {
                    user: config_1.APP_EMAIL,
                    pass: config_1.APP_EMAIL_PASS,
                },
            });
            //Verify transporter connection
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                }
                else {
                }
            });
            var body_html = `<html><p>${message}</p></html>`;
            var mailOptions = {
                from: String(process.env.APP_EMAIL),
                to: email,
                subject: title,
                html: html || body_html,
            };
            yield transporter.sendMail(mailOptions); //Send the mail.
            return { status: true, message: "Email successfully sent" };
        }
        catch (error) {
            console.error("send-email-error", error);
            return {
                status: false,
                message: "Couldn't send email",
            };
        }
    });
}
exports.sendEmail = sendEmail;
