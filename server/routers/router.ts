import { mergeRouters, publicProcedure, router } from "../trpc";

import { userRouter } from "./userRouter";
import { workspaceRouter } from "./workspaceRouter";
import { projectRouter } from "./projectRouter";
import { memberWorkspaceRouter } from "./memberWorkspaceRouter";
import { credentialRouter } from "./credentialRouter";
import { memberSessionRouter } from "./memberSessionRouter";
import { invitationRouter } from "./InvitationRouter";

const appRouter = router({
  user: userRouter,
  workspace: workspaceRouter,
  project: projectRouter,
  memberWorkspace: memberWorkspaceRouter,
  credential: credentialRouter,
  memberSession: memberSessionRouter,
  invitation: invitationRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
