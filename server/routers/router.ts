import { mergeRouters, publicProcedure, router } from "../trpc";

import { userRouter } from "./userRouter";
import { workspaceRouter } from "./workspaceRouter";
import { projectRouter } from "./projectRouter";
import { memberWorkspaceRouter } from "./memberWorkspaceRouter";
import { credentialRouter } from "./credentialRouter";
import { sessionRouter } from "./sessionRouter";
import { sendEmail } from "../services/utils/sendEmail";
import { z } from "zod";
import { emailRouter } from "./emailRouter";

const appRouter = router({
  user: userRouter,
  email: emailRouter,
  workspace: workspaceRouter,
  project: projectRouter,
  member: memberWorkspaceRouter,
  credential: credentialRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
