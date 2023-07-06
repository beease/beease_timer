import { mergeRouters, router  } from '../trpc';

import * as userServices from './userRouter';
import * as workspaceService from './workspaceRouter';
import * as projectService from './projectRouter';
import * as memberService from './memberRouter';
import * as credetialService from './credentialRouter';
import * as sessionService from './sessionRouter'; 

const appRouter = router({
  user : userServices.userRouter, 
  workspace : workspaceService.workspaceRouter, 
  project : projectService.projectRouter, 
  member : memberService.memeberRouter, 
  credential : credetialService.credentialRouter, 
  session : sessionService.sessionRouter,
  });

export type AppRouter = typeof appRouter;
export default appRouter;