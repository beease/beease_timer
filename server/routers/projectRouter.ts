import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  createProject,
  deleteProject,
  getProject,
  getProjectsByWorkspaceId,
  updateProject,
} from "../services/CRUD/projectService";

export const projectRouter = router({
  createWorkspace: authorizedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
        workspaceId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        return await createProject(
          ctx.tokenPayload.userId,
          opts.input.name,
          opts.input.color,
          opts.input.workspaceId
        );
      }
    }),
  getProjectsByWorkspaceId: authorizedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      const { workspaceId } = opts.input;
      return await getProjectsByWorkspaceId(workspaceId);
    }),
  getProject: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      const { id } = opts.input;
      return await getProject(id);
    }),
  updateProject: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          color: z.string().optional(),
          hourByDay: z.number().optional(),
          dailyPrice: z.number().optional(),
          isArchived: z.boolean().optional(),
        }),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { id, data } = opts.input;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        return await updateProject(ctx.tokenPayload.userId, id, data);
      }
    }),
  deleteProject: authorizedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { id } = opts.input;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        return await deleteProject(ctx.tokenPayload.userId, id);
      }
    }),
});

export type ProjectRouter = typeof projectRouter;
