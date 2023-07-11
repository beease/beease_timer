import { WorkspaceHeader } from "./workspaceHeader";
import { ProjectList } from "../project/projectList";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { WorkspaceAddEdit } from "./workspaceAddEdit";

const workspace = {
  id: "aZERAZERQSDF342",
  name: "beease test",
  color: "#FF9E4C",
};

export const Workspace = () => {
  const isSettingWorkspace = workspaceStore(
    (state: WorkspaceState) => state.isSettingWorkspace
  );
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );


  const RenderWorkspaceHeader = () => {
    if (isSettingWorkspace === 'add') {
      return <WorkspaceAddEdit variant={'add'} />;
    }
    if (isSettingWorkspace === 'edit') {
      return <WorkspaceAddEdit variant={'edit'} workspace={workspace} />;
    }
    return <WorkspaceHeader workspace={workspace} />;
  }

  return (
    <div className="workspace">
      <RenderWorkspaceHeader />
      {selectedWorkspaceId && <ProjectList />
      }
    </div>
  );
};
