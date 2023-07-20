import { z } from "zod";
import { authorizedProcedure, publicProcedure, router } from "../trpc";
import { sendInvitationService  } from "../services/CRUD/invitationService";
import { getUserById, getUserByMail } from "../services/CRUD/userService";
import { getWorkspaceById, getWorkspaceList } from "../services/CRUD/workspaceService";

import { sendInvitationToWorkspace, sendInvitationNotification } from "../services/email/invitationToWorkspace";

export const invitationRouter = router({
  sendInvitation: authorizedProcedure
    .input(
      z.object({
        invitedId: z.string(),
        workspaceId: z.string(),
      })
    )
    .query(async (opts) => {
      const { ctx } = opts;
      const { invitedId, workspaceId } = opts.input;
      if (ctx.tokenPayload && ctx.tokenPayload.userId) {
        return await sendInvitationService(
          ctx.tokenPayload.userId,
          invitedId,
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
        sendInvitationNotification(opts.input.invitedMail, workspace, inviterUser, invitedUser );
        // sendInvitationToWorkspace(opts.input.invitedMail, workspace, inviterUser, invitedUser );
        if(invitedUser) sendInvitationService(inviterUser.id, invitedUser.id, workspaceId)
       }     
      }
    }),
});
