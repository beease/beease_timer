import { z } from "zod";
import { authorizedProcedure, publicProcedure, router } from "../trpc";
import { sendInvitationService, acceptInvitation } from "../services/CRUD/invitationService";
import { getUserById, getUserByMail } from "../services/CRUD/userService";
import { getWorkspaceById, getWorkspaceList } from "../services/CRUD/workspaceService";
import { verifyJwtInvitation } from "../services/auth/jwt";
import { sendInvitationToWorkspace } from "../services/email/invitationToWorkspace";
import { signInvitationPage } from "../views/signInvitationPage";
import { invitationAcceptedTemplate } from "../views/invitationAcceptedPage";
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
        sendInvitationToWorkspace(opts.input.invitedMail, workspace, inviterUser, invitedUser );
        if(invitedUser) sendInvitationService(inviterUser.id, invitedUser.id, workspaceId)
       }     
      }
    }),
    acceptInvitation: publicProcedure
    .input(
      z.object({
        invitationToken: z.string(),
      })
    )
    .query(async (opts) => {
    const invitationTokenPayload = await verifyJwtInvitation(opts.input.invitationToken)
    if(!invitationTokenPayload?.invitedUserId ) throw new Error("Invalid invitation token")
    return await acceptInvitation( 
      invitationTokenPayload.inviterUserId,
      invitationTokenPayload.invitedUserId, 
      invitationTokenPayload.workspaceId
      )
    }
    ),
    signInvitationPage: publicProcedure
    .input(
      z.object({
        invitationToken: z.string(),
      })
    )
    .query(async () => {
      return signInvitationPage(process.env.SERVER_URL + '/api/user.signByGoogleCredentialToJoinWorkspace')
     }),
    invitationAcceptedPage: publicProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async (opts) => {
      const workspace = await getWorkspaceById(opts.input.workspaceId)
      if(!workspace) throw new Error("Invalid workspace id")
      return invitationAcceptedTemplate(workspace)
     }),
});
