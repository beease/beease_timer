import { z } from "zod";
import { router, publicProcedure, isAuthed } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import * as credentialService from "../services/CRUD/credentialService";
import { sendEmail } from "../services/utils/sendEmail";
const prisma = new PrismaClient();

export const credentialRouter = router({
  isLogged: publicProcedure.use(isAuthed).query(async (opts) => {
    if (opts.ctx.tokenPayload) {
      return true;
    }
  }),
  loginByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .query(async (opts) => {
      const { email, password } = opts.input;
      return await credentialService.getTokenByCredential(email, password);
    }),
  verifyEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async (opts) => {
      const { email } = opts.input;
      return await credentialService.verifyEmail(email);
    }),
});
