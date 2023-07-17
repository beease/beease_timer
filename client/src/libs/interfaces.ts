import type { inferRouterOutputs } from "@trpc/server";
import type { WorkspaceRouter } from "../../../server/routers/workspaceRouter";
import type { MemberWorkspaceRouter } from "../../../server/routers/memberWorkspaceRouter";

export interface Filters {
  archives: boolean;
  current: boolean;
}

export type WorkspaceList = NonNullable<
  inferRouterOutputs<WorkspaceRouter>["getWorkspaceList"]
>;

export type MyUser = WorkspaceList['myUser']

export type Member = WorkspaceList['membersWorkspace'][number]


export type Workspaces = NonNullable<
  inferRouterOutputs<WorkspaceRouter>["getMyWorkspaces"]
>;

export type Workspace = Workspaces[number];

export type UserList = inferRouterOutputs<MemberWorkspaceRouter>['getUsersByWorkspaceId']

// export type User = UserList[number]

export type Project = Extract<
  inferRouterOutputs<WorkspaceRouter>["getWorkspaceList"],
  { projects: object[] }
>["projects"][number];

export type Session = Project["memberSessions"][number];
export type MemberWorkspace = NonNullable<Session["memberWorkspace"]>;
export type User = MemberWorkspace["user"];
