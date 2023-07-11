import { mergeRouters, publicProcedure, router } from "../trpc";

import { userRouter } from "./userRouter";
import { workspaceRouter } from "./workspaceRouter";
import { projectRouter } from "./projectRouter";
import { memeberRouter } from "./memberWorkspace";
import { credentialRouter } from "./credentialRouter";
import { sessionRouter } from "./sessionRouter";
import { sendEmail } from "../services/utils/sendEmail";

const appRouter = router({
  greeting: publicProcedure.query(async () => {
    await sendEmail();
  }),
  user: userRouter,
  workspace: workspaceRouter,
  project: projectRouter,
  member: memeberRouter,
  credential: credentialRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
