import { Workspace } from "@prisma/client"

export const invitationAcceptedTemplate = (workspace:Workspace) =>
{
return (`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beease Timer - Invitation acceptée</title>
    <style>
      /* Styles CSS pour le design de l'attestation */
      body {
        background-color: #f2f2f2;
        font-family: Arial, sans-serif;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      h1 {
        font-size: 28px;
        color: #333333;
      }

      p {
        font-size: 16px;
        color: #666666;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Invitation acceptée</h1>
      <p>Félicitations!</p>
      <p>
        Vous avez accepté l'invitation à rejoindre le workspace ${workspace.name}.
      </p>
      <p>
        Vous pouvez maintenant profiter de toutes les fonctionnalités offertes
        par Beease Timer et collaborer avec l'équipe.
      </p>
      <p>Merci d'avoir rejoint notre communauté!</p>
      <p>L'équipe Beease Timer</p>
    </div>
  </body>
</html>`)
}