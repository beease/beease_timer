import { mergeRouters, publicProcedure, router } from "../trpc";

import { userRouter } from "./userRouter";
import { workspaceRouter } from "./workspaceRouter";
import { projectRouter } from "./projectRouter";
import { memberWorkspaceRouter } from "./memberWorkspaceRouter";
import { credentialRouter } from "./credentialRouter";
import { memberSessionRouter } from "./memberSessionRouter";
import { emailRouter } from "./emailRouter";

const appRouter = router({
  user: userRouter,
  email: emailRouter,
  workspace: workspaceRouter,
  project: projectRouter,
  memberWorkspace: memberWorkspaceRouter,
  credential: credentialRouter,
  memberSession: memberSessionRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
