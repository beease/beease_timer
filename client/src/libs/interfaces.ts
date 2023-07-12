import type { inferRouterOutputs } from '@trpc/server';
import type { WorkspaceRouter } from '../../../server/routers/workspaceRouter';

export interface Filters {
    archives: boolean,
    current: boolean,
}

export type Project = Extract<inferRouterOutputs<WorkspaceRouter>['getWorkspaceList'], { projects: object[] }>['projects'][number];



