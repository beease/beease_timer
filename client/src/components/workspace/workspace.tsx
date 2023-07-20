import { WorkspaceHeader } from "./workspaceHeader";
import { ProjectList } from "../project/projectList";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { WorkspaceAdd } from "./workspaceAdd";
import { WorkspaceEdit } from "./workspaceEdit";

// import { projectStore, ProjectStore } from "../../stores/projectStore";
// import { trpc } from "../../trpc";
// import { useEffect } from "react";
export const Workspace = () => {
  // const {data: user } = trpc.user.getMyUser.useQuery()

  // const PlayingProject = projectStore((state: ProjectStore) => state.PlayingProject)
  // const toggleIsPlaying = projectStore((state: ProjectStore) => state.toggleIsPlaying)

  // useEffect(()=> {
  //   if(user && PlayingProject && PlayingProject.projectId === null && user.currentSession?.memberWorkspace){
      
  //     console.log('toggle')
  //     toggleIsPlaying({
  //       projectId: user.currentSession.projectId,
  //       workspaceId: user.currentSession.memberWorkspace.workspaceId,
  //       startedAt: user.currentSession.startedAt
  //     })
  //   }
  // },[user])

  const isSettingWorkspace = workspaceStore(
    (state: WorkspaceState) => state.isSettingWorkspace
    );
    const selectedWorkspaceId = workspaceStore(
      (state: WorkspaceState) => state.selectedWorkspaceId
    );

  const RenderWorkspaceHeader = () => {
    if (isSettingWorkspace === 'add') {
      return <WorkspaceAdd/>;
    }
    else if (isSettingWorkspace === 'edit' && selectedWorkspaceId) {
      return <WorkspaceEdit selectedWorkspaceId={selectedWorkspaceId} />;
    }
    else if (selectedWorkspaceId){
      return <WorkspaceHeader selectedWorkspaceId={selectedWorkspaceId} />;
    }
    return null
  }

  return (
    <div className="workspace">
      <RenderWorkspaceHeader />
      {selectedWorkspaceId && <ProjectList selectedWorkspaceId={selectedWorkspaceId}/>}
    </div>
  );
};
