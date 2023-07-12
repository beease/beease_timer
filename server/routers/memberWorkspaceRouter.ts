import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import {
  getMembersWorkspaceByWorkspaceId,
  updateMemberWorkspace,
} from "../services/CRUD/memberWorkspaceService";

const ROLES = ["OWNER", "MEMBER"] as const;

export const memberWorkspaceRouter = router({
  getMembersWorkspaceByWorkspaceId: publicProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async (opts) => {
      const { workspaceId } = opts.input;
      return await getMembersWorkspaceByWorkspaceId(workspaceId);
    }),
  updateMemberWorkspace: publicProcedure
    .input(
      z.object({ id: z.string(), data: z.object({ role: z.enum(ROLES) }) })
    )
    .mutation(async (opts) => {
      const { id, data } = opts.input;
      return await updateMemberWorkspace(id, data);
    }),
});
