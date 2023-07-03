import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { publicProcedure, router } from './trpc';

const prisma = new PrismaClient();

const appRouter = router({
    createUser: publicProcedure
    .input(z.object({ name: z.string()}))
    .mutation(async (opts) => {
      console.log(opts.input);
      return await prisma.user.create({
        data: opts.input,
      });
    }),
    greeting: publicProcedure.query(() => 'hello tRPC v10!'),

});

export type AppRouter = typeof appRouter;
export default appRouter;