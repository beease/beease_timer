import express, { Request, Response, NextFunction } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./routers/router";
import http from "http";
import { createContext } from "./trpc";
import {
  getTokenByCredential,
  registerByEmail,
  verifyEmail,
} from "./services/CRUD/credentialService";
import { z } from "zod";
import path from "path";


import { sendEmail } from "./services/utils/sendEmail";
import {
  acceptInvitation,
  sendInvitationService,
} from "./services/CRUD/invitationService";
import { getUserById, getUserList } from "./services/CRUD/userService";
import {
  getMyWorkspaces,
  getWorkspaceList,
} from "./services/CRUD/workspaceService";

const app = express();
const PORT = process.env.PORT || 3001;

const emailSchema = z.string().email();
const invitationSchema = z.object({
  fromUser: z.string(),
  toUser: z.string(),
  at: z.string(),
});

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


app.get('/login', function(req, res) {
  res.header('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'views', 'sign.html'));
});

app.get('/sign', (req, res) => {
  res.header('Content-Type', 'text/html');
  const loginUri = process.env.SERVER_URL + '/api/user.loginByGoogleCredential';
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Connexion avec Google</title>
  </head>
  <body>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <div id="g_id_onload"
      data-client_id="377990403127-s7ul9jtmi4stmvvd97qlvjv21sdqlk12.apps.googleusercontent.com"
      data-auto_prompt="false">
    </div>
    <div class="g_id_signin"
      data-type="standard"
      data-size="large"
      data-theme="outline"
      data-text="sign_in_with"
      data-shape="rectangular"
      data-logo_alignment="left"
      data-width=400>
    </div>
    <script>
    window.onload = function() {
      var loginUri = "${loginUri}?origin=" + window.location.origin;
      document.getElementById('g_id_onload').setAttribute('data-login_uri', loginUri);
    }
  </script>
  </body>
  </html>
  `);
});

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
  }
});

app.get("/acceptInvitation", async (req, res) => {



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

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
