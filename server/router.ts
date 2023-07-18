import { signInvitationPage } from "./views/signInvitationPage";
import { invitationAcceptedTemplate } from "./views/invitationAcceptedPage";
import { getWorkspaceById } from "./services/CRUD/workspaceService";
import { Request,Response } from "express";
import { verifyJwtInvitation } from "./services/auth/jwt";
import { acceptInvitation } from "./services/CRUD/invitationService";
import { signByGoogleCredentialToJoinWorkspace } from "./services/CRUD/userService";
const router = require('express').Router();

router.get('/signInvitationPage',  (req:Request, res:Response) => {
    const invitationToken = req.query.invitationToken as string;
    if(!invitationToken) return res.status(404).json({ message: "Failed to render sign invitation page : invitationToken not found" });
    res.setHeader("Content-Type", "text/html");
    res.send(signInvitationPage(`${process.env.SERVER_URL}/signByGoogleCredentialToJoinWorkspace?invitationToken=${invitationToken}`));
  });

router.get('/invitationAcceptedPage', async (req:Request, res:Response) => {
    const invitationToken = req.query.invitationToken as string;
    if (!invitationToken) return res.status(404).json({ message: "Failed to render invitation accepted page : invitationToken not found" });
    const invitationTokenPayload = await verifyJwtInvitation(invitationToken);
    if (!invitationTokenPayload?.workspaceId) return res.status(404).json({ message: "Failed to render invitation accepted page : workspaceId not found" });
    if(!invitationTokenPayload?.invitedUserId) return res.status(404).json({ message: "Failed to render invitation accepted page : invitedUserId not found" });
    await acceptInvitation( 
        invitationTokenPayload.inviterUserId,
        invitationTokenPayload.invitedUserId, 
        invitationTokenPayload.workspaceId).catch(err => {
            return res.status(404).json({ message: "Failed to render invitation accepted page : " + err.message });
        })
    const workspace = await getWorkspaceById(invitationTokenPayload?.workspaceId)
    if(!workspace) return res.status(404).json({ message: "Failed to render invitation accepted page : workspace not found" });
    res.setHeader("Content-Type", "text/html");
    res.send(invitationAcceptedTemplate(workspace));
    });

router.post('/signByGoogleCredentialToJoinWorkspace', async (req:Request, res:Response) => {
    const invitationToken = req.query.invitationToken as string;
    const credential = req.body.credential as string;
    if(!credential) return res.status(404).json({ message: "Failed to render invitation accepted page : credential not found" });
    if (!invitationToken) return res.status(404).json({ message: "Failed to render invitation accepted page : invitationToken not found" });
    const workspaceId = await signByGoogleCredentialToJoinWorkspace(credential,invitationToken)
    if(!workspaceId) return res.status(404).json({ message: "Failed to render invitation accepted page : workspaceId not found" });
    const workspace = await getWorkspaceById(workspaceId)
    if(!workspace) return res.status(404).json({ message: "Failed to render invitation accepted page : workspace not found" });
    res.setHeader("Content-Type", "text/html");
    res.send(invitationAcceptedTemplate(workspace));
});


// app.get("/invitationHandler", async (req, res) => {
//   const { fromUser, toUser, at } = await invitationSchema.parse(req.query);
//   if (!fromUser || !toUser || !at)
//     return res
//       .status(404)
//       .json({ message: "Failed to render verified email : email not found" });

//   try {
//     const response = await acceptInvitation(fromUser, toUser, at);
//     app.render(
//       "invitationAccepted",
//       { fromUser: fromUser, toUser: toUser },
//       (err: any, html: any) => {
//         if (err) return res.status(500).json({ message: err.message });
//         res.status(200).type("html").send(html);
//       }
//     );
//   } catch (err) {
//     return res.status(500).json({ message: err });
//   }
// });

// router.get("/renderVerifiedEmail", async (req, res) => {
//     const email = await emailSchema.parse(req.query?.emailTo);
//     if (!email)
//       return res
//         .status(404)
//         .json({ message: "Failed to render verified email : email not found" });
  
//     try {
//       await verifyEmail(email);
//       app.render("emailConfirmed", { emailTo: email }, (err: any, html: any) => {
//         if (err) return res.status(500).json({ message: err.message });
//         res.status(200).type("html").send(html);
//       });
//     } catch (err) {
//       app.render(
//         "emailNotConfirmed",
//         { emailTo: email },
//         (err: any, html: any) => {
//           if (err) return res.status(500).json({ message: err.message });
//           res.status(200).type("html").send(html);
//         }
//       );
//     }
//   });

export default router;