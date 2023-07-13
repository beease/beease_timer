import { z } from "zod";
import { router, publicProcedure, authorizedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  createMemberSession,
  deleteMemberSession,
  getMemberSessionById,
  getMemberSessionsByProjectId,
  stopSession,
} from "../services/CRUD/memberSessionService";
import { TRPCError } from "@trpc/server";

export const memberSessionRouter = router({
  createSession: authorizedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startedAt: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload) {
        const { projectId, startedAt } = opts.input;
        const emitterId = ctx.tokenPayload.userId;
        return await createMemberSession(emitterId, projectId, startedAt);
      }
    }),
  deleteSession: authorizedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { sessionId } = opts.input;
      if (ctx.tokenPayload) {
        return await deleteMemberSession(ctx.tokenPayload.userId, sessionId);
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized to delete session.",
        });
      }
    }),
  stopSession: authorizedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        endedAt: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      const { sessionId, endedAt } = opts.input;

      if (ctx.tokenPayload) {
        const emitterId = ctx.tokenPayload.userId;
        return await stopSession(emitterId, sessionId, endedAt);
      }
    }),
  getSessionsByProjectId: authorizedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async (opts) => {
      const { projectId } = opts.input;
      return await getMemberSessionsByProjectId(projectId);
    }),
  getSessionById: authorizedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async (opts) => {
      const { sessionId } = opts.input;
      return await getMemberSessionById(sessionId);
    }),
});
