import { z } from 'zod';
import { router, publicProcedure, isAuthed } from '../trpc';
import * as userService from '../services/CRUD/userService';

export const userRouter = router({

    loginByGoogleToken: publicProcedure
    .input(z.object({ google_token: z.string() }))
    .mutation(async (opts) => {
      return await userService.loginByGoogleToken(opts.input.google_token);
    }),

    getMyUser: publicProcedure.use(isAuthed)
    .query(async (opts) => {
      if (opts.ctx.tokenPayload) {
        return await userService.getUserById(opts.ctx.tokenPayload.userId);
      }
    }),

});