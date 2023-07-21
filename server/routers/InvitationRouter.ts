import { z } from "zod";
import { authorizedProcedure, publicProcedure, router } from "../trpc";
import { sendInvitationService, acceptInvitation, getInvitationByUserId, denyInvitation, getInvitationByEmailAndWorkspaceId } from "../services/CRUD/invitationService";
import { getUserById, getUserByMail } from "../services/CRUD/userService";
import { getWorkspaceById, getWorkspacesUsers } from "../services/CRUD/workspaceService";

import { sendInvitationNotification } from "../services/email/invitationToWorkspace";

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
       
        const userLists = (await getWorkspacesUsers(workspaceId));
        if(!userLists) throw new Error("Failed to get user list");
        if(!userLists.find(member => member.user.id === ctx.tokenPayload?.userId)) throw new Error("You are not in this workspace");
        if(userLists.find(member => member.user.email === invitedMail)) throw new Error("This user is already in this workspace");
        const invitation = await getInvitationByEmailAndWorkspaceId( invitedMail, workspaceId );
        console.log(invitation)
        if(invitation) throw new Error("invitation already sent")     

        const inviterUser = await getUserById(ctx.tokenPayload.userId);
        const invitedUser = await getUserByMail(invitedMail);
        const workspace = await getWorkspaceById(workspaceId);
        if(inviterUser && workspace) {
          sendInvitationNotification(opts.input.invitedMail, workspace, inviterUser, invitedUser );
          // sendInvitationToWorkspace(opts.input.invitedMail, workspace, inviterUser, invitedUser );
          sendInvitationService(inviterUser.id, invitedMail, workspaceId);
       }     
      }
    }),
});
