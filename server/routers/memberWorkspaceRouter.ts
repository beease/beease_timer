import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import {
  createMemberWorkspace,
  deleteMemberWorkspace,
  getMembersWorkspaceByWorkspaceId,
  updateRoleMemberWorkspace,
} from "../services/CRUD/memberWorkspaceService";

const ROLES = ["OWNER", "ADMIN", "MEMBER"] as const;

export const memberWorkspaceRouter = router({
  createMemberWorkspace: authorizedProcedure
    .input(
      z.object({
        userId: z.string(),
        workspaceId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { userId, workspaceId } = opts.input;
      return await createMemberWorkspace(userId, workspaceId);
    }),
  deleteMemberWorkspace: authorizedProcedure
    .input(
      z.object({
        userId: z.string(),
        workspaceId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { userId, workspaceId } = opts.input;
      if (ctx.tokenPayload) {
        const emitterId = ctx.tokenPayload.userId;
        return await deleteMemberWorkspace(emitterId, userId, workspaceId);
      }
    }),
  getMembersWorkspaceByWorkspaceId: authorizedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      const { workspaceId } = opts.input;
      return await getMembersWorkspaceByWorkspaceId(workspaceId);
    }),
  updateRoleMemberWorkspace: authorizedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({ role: z.enum(ROLES) }),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { id, data } = opts.input;
      const emitterId = ctx.tokenPayload?.userId;
      if (emitterId)
        return await updateRoleMemberWorkspace(emitterId, id, data);
    }),
});
