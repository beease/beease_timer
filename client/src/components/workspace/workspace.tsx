import { WorkspaceHeader } from "./workspaceHeader";
import { ProjectList } from "../project/projectList";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { WorkspaceAdd } from "./workspaceAdd";
import { WorkspaceEdit } from "./workspaceEdit";
import { trpc } from '../../trpc';

// const workspace = {
//   id: "aZERAZERQSDF342",
//   name: "beease test",
//   color: "#FF9E4C",
// };

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
