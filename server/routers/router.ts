import { mergeRouters, router } from "../trpc";

import { userRouter } from "./userRouter";
import { workspaceRouter } from "./workspaceRouter";
import { projectRouter } from "./projectRouter";
import { memeberRouter } from "./memberWorkspace";
import { credentialRouter } from "./credentialRouter";
import { sessionRouter } from "./sessionRouter";

const appRouter = router({
  user: userRouter,
  workspace: workspaceRouter,
  project: projectRouter,
  member: memeberRouter,
  credential: credentialRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
