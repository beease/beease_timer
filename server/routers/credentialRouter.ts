import { z } from "zod";
import { router, publicProcedure, isAuthed } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import * as credentialService from "../services/CRUD/credentialService";
import { sendEmail } from "../services/utils/sendEmail";
const prisma = new PrismaClient();

export const credentialRouter = router({
  isLogged: publicProcedure.use(isAuthed).query(async (opts) => {
    console.log("test");
    if (opts.ctx.tokenPayload) {
      return true;
    }
  }),
  loginByEmail: publicProcedure.query(async () => {
    await sendEmail();
  }),
  // publicProcedure
  // .input(
  //   z.object({
  //     email: z.string().email(),
  //     password: z.string(),
  //   })
  // )
  // .mutation(async (opts) => {
  //   const { email, password } = opts.input;
  //   await sendEmail();

  //   // return await credentialService.getTokenByCredential(email, password);
  // }),
});
