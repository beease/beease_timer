import { z } from "zod";
import { authorizedProcedure, publicProcedure, router } from "../trpc";
import { sendInvitationService, acceptInvitation, getInvitationByUserId, denyInvitation } from "../services/CRUD/invitationService";
import { getUserById, getUserByMail } from "../services/CRUD/userService";
import { getWorkspaceById, getWorkspaceList } from "../services/CRUD/workspaceService";
import { verifyJwtInvitation } from "../services/auth/jwt";
import { sendInvitationToWorkspace } from "../services/email/invitationToWorkspace";
import { signInvitationPage } from "../views/signInvitationPage";
import { invitationAcceptedTemplate } from "../views/invitationAcceptedPage";
export const invitationRouter = router({
  getInvitationByUserId: authorizedProcedure
    .query(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        return await getInvitationByUserId(ctx.tokenPayload.userId);
      }
    }),
  acceptInvitation: authorizedProcedure
    .input(
      z.object({
        inviterId: z.string(),
        workspaceId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        const { inviterId, workspaceId } = opts.input;
        return await acceptInvitation(ctx.tokenPayload.userId, inviterId, workspaceId);
      }
    }),
  denyInvitation: authorizedProcedure
    .input(
      z.object({
        inviterId: z.string(),
        workspaceId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        const { inviterId, workspaceId } = opts.input;
        return await denyInvitation(ctx.tokenPayload.userId, inviterId, workspaceId);
      }
    }),
  sendInvitation: authorizedProcedure
    .input(
      z.object({
        invitedMail: z.string().email(),
        workspaceId: z.string(),
      })
    )
    .query(async (opts) => {
      const { ctx } = opts;
      const { invitedMail, workspaceId } = opts.input;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        return await sendInvitationService(
          ctx.tokenPayload.userId,
          invitedMail,
          workspaceId
        );
      }
    }),
  sendInvitationEmail: authorizedProcedure
    .input(
      z.object({
        invitedMail: z.string().email(),
        workspaceId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx } = opts;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        const { workspaceId, invitedMail } = opts.input;
       
        if(!await getWorkspaceList(workspaceId, ctx.tokenPayload.userId)) throw new Error("You are not in this workspace");

        const inviterUser = await getUserById(ctx.tokenPayload.userId);
        const invitedUser = await getUserByMail(invitedMail);
        const workspace = await getWorkspaceById(workspaceId);
        if(inviterUser && workspace) {
        sendInvitationToWorkspace(invitedMail, workspace, inviterUser, invitedUser );
        if(invitedUser) sendInvitationService(inviterUser.id, invitedMail, workspaceId)
       }     
      }
    }),
});
