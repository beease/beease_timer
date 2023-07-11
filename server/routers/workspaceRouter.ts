import { z } from "zod";
import { router, publicProcedure, isAuthed } from "../trpc";
import * as workspaceService from "../services/CRUD/workspaceService";
import * as userService from "../services/CRUD/userService";

export const workspaceRouter = router({
  createWorkspace: publicProcedure
    .use(isAuthed)
    .input(
      z.object({ name: z.string(), color: z.string(), userId: z.string() })
    )
    .mutation(async (opts) => {
      return await workspaceService.createWorkspace(
        opts.input.name,
        opts.input.color,
        opts.input.userId
      );
    }),
  getWorkspaceById: publicProcedure
    .use(isAuthed)
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      return await workspaceService.getWorkspaceById(opts.input.workspaceId);
    }),
  getWorkspaceList: publicProcedure.use(isAuthed).query(async (opts) => {
    const { ctx } = opts;
    if (ctx.tokenPayload) {
      return await workspaceService.getWorkspaceList(ctx.tokenPayload.userId);
    }
  }),
  deleteWorkspace: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { id } = opts.input;
      return await workspaceService.deleteWorkspace(id);
    }),
});
