import { sendEmailTo } from "../CRUD/emailService";
import { signInvitationJwt } from "../auth/jwt";
import { Workspace } from "@prisma/client";
import { clientUser } from "../../../shared/interfaces/queryInterfaces";

export const sendInvitationToWorkspace = async (invitedMail:string,workspace:Workspace,inviterUser:clientUser,invitedUser?:clientUser | null)=>{
    let invitationURL 
    if(invitedUser){
        invitationURL = `${process.env.SERVER_URL}/invitationAcceptedPage?invitationToken=${signInvitationJwt(workspace.id,inviterUser.id,invitedUser?.id)}`
    }else{
        invitationURL = `${process.env.SERVER_URL}/signInvitationPage?invitationToken=${signInvitationJwt(workspace.id,inviterUser.id)}`
    }
        
if(workspace && inviterUser){
    return await sendEmailTo(invitedMail, {
      subject: `Invitation to join ${workspace.name} workspace`,
      html: ` <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
      <h1 style="font-size: 28px; color: #333333; margin-bottom: 20px;">Invitation à rejoindre l'espace de travail</h1>
      <p style="font-size: 16px; color: #666666;">Bonjour ${
        invitedUser ? (invitedUser.name) : ""
      },</p>
      <p style="font-size: 16px; color: #666666;">Vous avez été invité à rejoindre l'espace de travail <strong>${
        workspace?.name
      }</strong> par ${inviterUser.name}.</p>
      <p style="font-size: 16px; color: #666666;">Cliquez sur le bouton ci-dessous pour accepter l'invitation :</p>
      <p><a href="${invitationURL}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 4px; transition: background-color 0.3s ease;">Accepter l'invitation</a></p>
      <p style="font-size: 16px; color: #666666;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
      <p style="font-size: 16px; color: #666666;">Merci !</p>
      <p style="font-size: 16px; color: #666666;">L'équipe de Beease Timer</p>
  </div>`,
    });
  }
}

export const sendInvitationNotification = async (invitedMail:string,workspace:Workspace,inviterUser:clientUser,invitedUser?:clientUser | null)=>{
  return await sendEmailTo(invitedMail, {
    subject: `Invitation to join ${workspace.name} workspace`,
    html: ` <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
    <h1 style="font-size: 28px; color: #333333; margin-bottom: 20px;">Invitation à rejoindre l'espace de travail</h1>
    <p style="font-size: 16px; color: #666666;">Bonjour ${
      invitedUser ? (invitedUser.name) : ""
    },</p>
    <p style="font-size: 16px; color: #666666;">Vous avez été invité à rejoindre l'espace de travail <strong>${
      workspace?.name
    }</strong> par ${inviterUser.name}.</p>
    <p style="font-size: 16px; color: #666666;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
    <p style="font-size: 16px; color: #666666;">Merci !</p>
    <p style="font-size: 16px; color: #666666;">L'équipe de Beease Timer</p>
</div>`,
  });
}