import { z } from "zod";

const nodemailer = require("nodemailer");
const emailToSchema = z.string().email();
type sendMailSchema = {
  subject: string;
  html: string;
};
export const sendEmail = async (emailTo: string, data: sendMailSchema) => {
  try {
    const { subject, html } = data;
    emailToSchema.parse(emailTo);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // service: process.env.SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("no error");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "axelboyerllb@gmail.com",
      subject: subject,
      html: html,
    });
    console.log("finished");
  } catch (error) {
    throw new Error("Failed to send email.");
  }
};
