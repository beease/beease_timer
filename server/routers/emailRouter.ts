import { z } from "zod";
import { authorizedProcedure, publicProcedure, router } from "../trpc";
import { sendEmailTo } from "../services/CRUD/emailService";

export const emailRouter = router({
  sendEmail: authorizedProcedure
    .input(
      z.object({
        emailTo: z.string(),
        data: z.object({
          subject: z.string(),
          html: z.string(),
        }),
      })
    )
    .query(async (opts) => {
      const { emailTo, data } = opts.input;
      return await sendEmailTo(emailTo, data);
    }),
});
