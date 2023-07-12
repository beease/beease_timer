import { z } from "zod";
import { asyncFunctionErrorCatcher } from "../utils/errorHandler";
import { sendEmail } from "../utils/sendEmail";

export const sendEmailTo = async (emailTo: string) => {
  return asyncFunctionErrorCatcher(
    async () => await sendEmail(emailTo),
    "Failed to send email."
  );
};
