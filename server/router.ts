import { z } from 'zod';
import { PrismaClient,User } from '@prisma/client';
import { publicProcedure, router } from './trpc';

const prisma = new PrismaClient();

const appRouter = router({
    createUser: publicProcedure
    .input(z.object({ name: z.string().min(5) }))
    .mutation(async (opts) => {
      // use your ORM of choicec
      console.log(opts.input);
      return await prisma.user.create({
        data: opts.input,
      });
    }),
});

export type AppRouter = typeof appRouter;
export default appRouter;