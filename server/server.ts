import express, { Request, Response, NextFunction } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./routers/router";
import http from "http";
import { createContext } from "./trpc";
import { verifyEmail } from "./services/CRUD/credentialService";
import { AnyZodObject, z } from "zod";
import { sendEmail } from "./services/utils/sendEmail";

const app = express();
const PORT = process.env.PORT || 3001;

const emailSchema = z.string().email();

app.options("*", (_req, res) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", String(process.env.ORIGIN_URL));

  res.sendStatus(200);
});

app.use(function (req: Request, res: Response, next: NextFunction) {
  //utf8 setter
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", String(process.env.ORIGIN_URL));
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Pass to next layer of middleware
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  // request logger
  console.log("⬅️ ", req.method, req.path, req.body || req.query);

  next();
});

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/renderVerifiedEmail", async (req, res) => {
  const email = await emailSchema.parse(req.query?.emailTo);
  if (!email)
    return res
      .status(404)
      .json({ message: "Failed to render verified email : email not found" });

  try {
    await verifyEmail(email);
    app.render("emailConfirmed", { emailTo: email }, (err: any, html: any) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).type("html").send(html);
    });
  } catch (err) {
    app.render(
      "emailNotConfirmed",
      { emailTo: email },
      (err: any, html: any) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).type("html").send(html);
      }
    );
    return res.status(500).json({ message: err });
  }
});

// app.get("/test/sendEmail", async (req, res) => {
//   const email = await emailSchema.parse(req.body?.emailTo);
//   if (!email)
//     return res
//       .status(404)
//       .json({ message: "Failed to render verified email : email not found" });
//   await sendEmail(email, {
//     subject: "Beease Timer - Confirmation Adresse mail.",
//     html: `<body>
//     <h1 style="color: #333333;">Veuillez confirmer votre adresse e-mail</h1>
//     <p style="color: #666666;">Merci de vous être inscrit. Veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
//     <a href="http://localhost:3001/renderVerifiedEmail?emailTo=${email}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4caf50; color: #ffffff; text-decoration: none; border-radius: 4px;">Confirmer</a>
//     <p style="color: #666666;">Si vous n'avez pas créé de compte sur notre site, veuillez ignorer cet e-mail.</p>
//     <p style="color: #333333;">Cordialement,<br>Votre équipe Beease</p>
//   </body>`,
//   });
// });

// app.get("/test/invitationEmail", async (req, res) => {
//   return await sendEmail("axelboyerllb@gmail.com", {
//     subject: `Invitation to join truc workspace`,
//     html: ` <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
//           <h1 style="font-size: 28px; color: #333333; margin-bottom: 20px;">Invitation à rejoindre l'espace de travail</h1>
//           <p style="font-size: 16px; color: #666666;">Bonjour machin,</p>
//           <p style="font-size: 16px; color: #666666;">Vous avez été invité à rejoindre l'espace de travail <strong>machin truc</strong> par azeaze.</p>
//           <p style="font-size: 16px; color: #666666;">Cliquez sur le bouton ci-dessous pour accepter l'invitation :</p>
//           <p><a href="{{lienAcceptation}}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 4px; transition: background-color 0.3s ease;">Accepter l'invitation</a></p>
//           <p style="font-size: 16px; color: #666666;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
//           <p style="font-size: 16px; color: #666666;">Merci !</p>
//           <p style="font-size: 16px; color: #666666;">L'équipe de Beease Timer</p>
//       </div>`,
//   });
// });

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
