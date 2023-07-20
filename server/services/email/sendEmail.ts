const nodemailer = require("nodemailer");
type sendMailSchema = {
  subject: string;
  html: string;
};
export const sendEmail = async (emailTo: string, data: sendMailSchema) => {
  console.log('trying send mail', emailTo)
  try {
    const { subject, html } = data;
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
      subject: subject,
      html: html,
    });
    console.log('mail sent')
  } catch (error) {
    throw new Error(`Failed to send email : ${error}`);
  }
};
