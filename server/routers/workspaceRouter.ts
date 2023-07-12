import { z } from "zod";
import {
  router,
  publicProcedure,
  isAuthed,
  authorizedProcedure,
} from "../trpc";
import * as workspaceService from "../services/CRUD/workspaceService";
import * as userService from "../services/CRUD/userService";

export const workspaceRouter = router({
  createWorkspace: authorizedProcedure
    .input(z.object({ name: z.string(), color: z.string() }))
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload) {
        return await workspaceService.createWorkspace(
          opts.input.name,
          opts.input.color,
          ctx.tokenPayload.userId
        );
      }
    }),
  getMyWorkspaces: authorizedProcedure.query(async (opts) => {
    const { ctx } = opts;
    if (ctx.tokenPayload) {
      return await workspaceService.getMyWorkspaces(ctx.tokenPayload.userId);
    }
  }),
  getWorkspaceById: authorizedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      return await workspaceService.getWorkspaceById(opts.input.workspaceId);
    }),
  getWorkspaceList: authorizedProcedure.query(async (opts) => {
    const { ctx } = opts;
    if (ctx.tokenPayload) {
      return await workspaceService.getWorkspaceList(ctx.tokenPayload.userId);
    }
  }),
  updateWorkspace: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z
          .object({
            name: z.string().optional(),
            color: z.string().optional(),
          })
          .required(),
      })
    )
    .mutation(async (opts) => {
      const { id, data } = opts.input;
      return await workspaceService.updateWorkspace(id, data);
    }),
  deleteWorkspace: authorizedProcedure
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

export type WorkspaceRouter = typeof workspaceRouter;
