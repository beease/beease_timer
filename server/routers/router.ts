import { mergeRouters  } from '../trpc';

import * as userServices from './userRouter';
import * as workspaceService from './workspaceRouter';
import * as projectService from './projectRouter';
import * as memberService from './memberRouter';
import * as credetialService from './credentialRouter';
import * as sessionService from './sessionRouter'; 

const appRouter = mergeRouters(
  userServices.userRouter, 
  workspaceService.workspaceRouter, 
  projectService.projectRouter, 
  memberService.memeberRouter, 
  credetialService.credentialRouter, 
  sessionService.sessionRouter,
  );

export type AppRouter = typeof appRouter;
export default appRouter;