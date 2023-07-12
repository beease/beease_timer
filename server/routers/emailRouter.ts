import { z } from "zod";
import { authorizedProcedure, publicProcedure, router } from "../trpc";
import { sendEmail } from "../services/utils/sendEmail";

export const emailRouter = router({
  sendEmail: authorizedProcedure
    .input(
      z.object({
        emailTo: z.string(),
      })
    )
    .query(async (opts) => {
      const { emailTo } = opts.input;
      return await sendEmail(emailTo);
    }),
});
