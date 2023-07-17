import { useEffect } from "react"
import { WorkspaceHeader } from "./workspaceHeader";
import { ProjectList } from "../project/projectList";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from "../../stores/projectStore";
import { WorkspaceAdd } from "./workspaceAdd";
import { WorkspaceEdit } from "./workspaceEdit";
import { InvitationPopup } from "./workspaceInvitationPopup";

export const Workspace = () => {
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
    else if (isSettingWorkspace === 'edit' && selectedWorkspaceId.id) {
      return <WorkspaceEdit selectedWorkspaceId={selectedWorkspaceId.id} />;
    }
    else if (selectedWorkspaceId.id){
      return <WorkspaceHeader selectedWorkspaceId={selectedWorkspaceId.id} />;
    }
    return null
  }

  return (
    <div className="workspace">
      <RenderWorkspaceHeader />
      {selectedWorkspaceId.id && <ProjectList selectedWorkspaceId={selectedWorkspaceId.id}/>}
    </div>
  );
};
