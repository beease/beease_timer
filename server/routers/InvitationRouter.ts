import { z } from "zod";
import { authorizedProcedure, router } from "../trpc";
import { sendInvitationService } from "../services/CRUD/invitationService";
import { sendEmailTo } from "../services/CRUD/emailService";
import { getUserById, getUserByMail } from "../services/CRUD/userService";
import { getWorkspaceById } from "../services/CRUD/workspaceService";

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
        const inviterUser = await getUserById(ctx.tokenPayload.userId);
        const invitedUser = await getUserByMail(invitedMail);
        const workspace = await getWorkspaceById(workspaceId);
        console.log("invitedUser", invitedUser, "workspace", workspace, "inviterUser", inviterUser);
        if (workspace && inviterUser) {
          return await sendEmailTo(invitedMail, {
            subject: `Invitation to join ${workspace.name} workspace`,
            html: ` <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
            <h1 style="font-size: 28px; color: #333333; margin-bottom: 20px;">Invitation à rejoindre l'espace de travail</h1>
            <p style="font-size: 16px; color: #666666;">Bonjour ${
              invitedUser && (invitedUser.family_name + " " + invitedUser.name)
            },</p>
            <p style="font-size: 16px; color: #666666;">Vous avez été invité à rejoindre l'espace de travail <strong>${
              workspace?.name
            }</strong> par ${
              inviterUser.family_name + " " + inviterUser.name
            }.</p>
            <p style="font-size: 16px; color: #666666;">Cliquez sur le bouton ci-dessous pour accepter l'invitation :</p>
            <p><a href="http://localhost:3001/api/acceptInvitation?fromUser=${inviterUser}&toUser=${invitedUser}&at=${workspaceId}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 4px; transition: background-color 0.3s ease;">Accepter l'invitation</a></p>
            <p style="font-size: 16px; color: #666666;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
            <p style="font-size: 16px; color: #666666;">Merci !</p>
            <p style="font-size: 16px; color: #666666;">L'équipe de Beease Timer</p>
        </div>`,
          });
        } else {
          throw new Error(
            "Invitation email failed  : incorrect informations provided."
          );
        }
       
      }
    }),
});
