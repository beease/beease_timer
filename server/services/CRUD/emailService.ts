import { z } from "zod";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { sendEmail } from "../utils/sendEmail";
type sendMailSchema = {
  subject: string;
  html: string;
};
export const sendEmailTo = async (emailTo: string, data: sendMailSchema) => {
  return asyncFunctionErrorCatcher(
    async () => await sendEmail(emailTo, data),
    "Failed to send email."
  );
};
