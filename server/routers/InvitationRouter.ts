import { z } from "zod";
import { authorizedProcedure, router } from "../trpc";
import { sendInvitationService } from "../services/CRUD/invitationService";
import { sendEmailTo } from "../services/CRUD/emailService";
import { getUserById } from "../services/CRUD/userService";
import { getWorkspaceById } from "../services/CRUD/workspaceService";

export const invitationRouter = router({
  sendInvitation: authorizedProcedure
    .input(
      z.object({
        inviterId: z.string(),
        invitedId: z.string(),
        workspaceId: z.string(),
      })
    )
    .query(async (opts) => {
      const { inviterId, invitedId, workspaceId } = opts.input;
      return await sendInvitationService(inviterId, invitedId, workspaceId);
    }),
  sendInvitationEmail: authorizedProcedure
    .input(
      z.object({
        inviterId: z.string(),
        invitedId: z.string(),
        workspaceId: z.string(),
      })
    )
    .query(async (opts) => {
      const { inviterId, invitedId, workspaceId } = opts.input;
      const inviterUser = await getUserById(inviterId);
      const invitedUser = await getUserById(invitedId);
      const workspace = await getWorkspaceById(workspaceId);
      if (invitedUser && workspace && inviterUser) {
        return await sendEmailTo(invitedUser.email, {
          subject: `Invitation to join ${workspace.name} workspace`,
          html: ` <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
          <h1 style="font-size: 28px; color: #333333; margin-bottom: 20px;">Invitation à rejoindre l'espace de travail</h1>
          <p style="font-size: 16px; color: #666666;">Bonjour ${
            invitedUser.family_name + " " + invitedUser.name
          },</p>
          <p style="font-size: 16px; color: #666666;">Vous avez été invité à rejoindre l'espace de travail <strong>${
            workspace?.name
          }</strong> par ${
            inviterUser.family_name + " " + inviterUser.name
          }.</p>
          <p style="font-size: 16px; color: #666666;">Cliquez sur le bouton ci-dessous pour accepter l'invitation :</p>
          <p><a href="{{lienAcceptation}}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 4px; transition: background-color 0.3s ease;">Accepter l'invitation</a></p>
          <p style="font-size: 16px; color: #666666;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
          <p style="font-size: 16px; color: #666666;">Merci !</p>
          <p style="font-size: 16px; color: #666666;">L'équipe de Beease Timer</p>
      </div>`,
        });
      } else {
        throw new Error(
          "Invitation email failed  : not enough information provided."
        );
      }
    }),
});
