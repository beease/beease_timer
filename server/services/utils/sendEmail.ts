import { z } from "zod";

const nodemailer = require("nodemailer");

const emailToSchema = z.string().email();

export const sendEmail = async (emailTo: string) => {
  try {
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: "Beease Timer - Confirmation Adresse mail.",
      html: `<body>
      <h1 style="color: #333333;">Veuillez confirmer votre adresse e-mail</h1>
      <p style="color: #666666;">Merci de vous être inscrit. Veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
      <a href="http://localhost:3001/api/renderVerifyEmail" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4caf50; color: #ffffff; text-decoration: none; border-radius: 4px;">Confirmer</a>
      <p style="color: #666666;">Si vous n'avez pas créé de compte sur notre site, veuillez ignorer cet e-mail.</p>
      <p style="color: #333333;">Cordialement,<br>Votre équipe Beease</p>
    </body>`,
    });
  } catch (error) {
    throw new Error("Failed to send email.");
  }
};
