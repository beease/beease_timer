import { z } from "zod";
import { router, publicProcedure, isAuthed } from "../trpc";
import * as userService from "../services/CRUD/userService";
import { Prisma } from "@prisma/client";

export const userRouter = router({
  loginByGoogleToken: publicProcedure
    .input(z.object({ google_token: z.string() }))
    .mutation(async (opts) => {
      return await userService.loginByGoogleToken(opts.input.google_token);
    }),
  getMyUser: publicProcedure.use(isAuthed).query(async (opts) => {
    if (opts.ctx.tokenPayload) {
      return await userService.getUserById(opts.ctx.tokenPayload.userId);
    }
  }),
  getUserById: publicProcedure
    .use(isAuthed)
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { id } = opts.input;
      return await userService.getUserById(id);
    }),
  getUserList: publicProcedure.query(async () => {
    return await userService.getUserList();
  }),
  updateUserById: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          given_name: z.string().optional(),
          family_name: z.string().optional(),
          email: z.string().optional(),
          verified_email: z.boolean().optional(),
          picture: z.string().optional(),
          locale: z.string().optional(),
          google_id: z.string().optional(),
        }),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { data } = opts.input;
      console.log("ctx : ", ctx, data);
      if (ctx.tokenPayload) {
        return await userService.updateUserById(ctx.tokenPayload.userId, data);
      }
    }),
  deleteUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { id } = opts.input;
      return await userService.deleteUserById(id);
    }),
});
