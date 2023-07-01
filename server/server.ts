import express, { Request, Response, NextFunction } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./router";
import { createContext } from "./trpc";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3001;

app.options("*", (_req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
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
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Pass to next layer of middleware
  next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, _res, next) => {
  // request logger
  console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

  next();
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/", (_req, res) => res.send("hello"));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
