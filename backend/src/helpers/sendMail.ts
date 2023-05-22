import nodemailer from "nodemailer";
import {
  APP_EMAIL,
  APP_EMAIL_PASS,
  MODE,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from "../config";
import Queue from "bull";

export var emailQueue: Queue.Queue;

if (MODE == "PRODUCTION") {
  emailQueue = new Queue("email", {
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    },
  });
} else {
  emailQueue = new Queue("email", "redis://127.0.0.1:6379");
}

emailQueue.process(async function (job: {
  data: { email: string; title: string; message?: string; html?: string };
}) {
  const data = job.data;
  await sendEmail(data.email, data.title, data.message, data.html);
});

export async function sendEmail(
  email: string,
  title: string,
  message?: string,
  html?: string
) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: APP_EMAIL,
        pass: APP_EMAIL_PASS,
      },
    });

    //Verify transporter connection
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
      }
    });
    var body_html = `<html><p>${message}</p></html>`;
    var mailOptions = {
      from: String(process.env.APP_EMAIL),
      to: email,
      subject: title,
      html: html || body_html,
    };

    await transporter.sendMail(mailOptions); //Send the mail.
    return { status: true, message: "Email successfully sent" };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      status: false,
      message: "Couldn't send email",
    };
  }
}
