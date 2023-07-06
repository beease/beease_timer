import { z } from 'zod';
import { router, publicProcedure,isAuthed } from '../trpc';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const credentialRouter = router({
     isLogged: publicProcedure.use(isAuthed)
    .query(async (opts) => {
      console.log("test")
      if (opts.ctx.tokenPayload) {
        return true
      }
    }),
});