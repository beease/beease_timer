import express, { Request, Response, NextFunction } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./routers/router";
import router from "./router";
import http from "http";
import { createContext } from "./trpc";

// import {
//   getTokenByCredential,
//   registerByEmail,
//   verifyEmail,
// } from "./services/CRUD/credentialService";

// import path from "path";


// import { sendEmail } from "./services/email/sendEmail";
// import {
//   acceptInvitation,
//   sendInvitationService,
// } from "./services/CRUD/invitationService";
// import { getUserById, getUserList } from "./services/CRUD/userService";
// import {
//   getMyWorkspaces,
//   getWorkspaceList,
// } from "./services/CRUD/workspaceService";

const app = express();
const PORT = process.env.PORT || 3001;

//const emailSchema = z.string().email();

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
  console.log("⬅️ ", req.method, req.path, req.body, req.query);
  next();
});

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

//app.use("/",router);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
