import type { inferRouterOutputs } from "@trpc/server";
import type { WorkspaceRouter } from "../../../server/routers/workspaceRouter";

export interface Filters {
  archives: boolean;
  current: boolean;
}

export type WorkspaceList = NonNullable<
  inferRouterOutputs<WorkspaceRouter>["getWorkspaceList"]
>;

export type Project = Extract<
  inferRouterOutputs<WorkspaceRouter>["getWorkspaceList"],
  { projects: object[] }
>["projects"][number];

export type Session = Project["memberSessions"][number];
