import { trpc } from "../../trpc"
import { useEffect } from "react";
import beeaseLogo from '../../assets/logo_beease.svg';
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";


export const WorkspacesList = () => {
  const { data: workspaces, error, isLoading } = trpc.workspace.getMyWorkspaces.useQuery()

  const setSelectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.setSelectedWorkspaceId);
  const selectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.selectedWorkspaceId);
  const isSettingWorkspace = workspaceStore((state: WorkspaceState) => state.isSettingWorkspace);
  
  useEffect(() => {
    if(!selectedWorkspaceId && !isSettingWorkspace && workspaces?.[0]) {
      setSelectedWorkspaceId(workspaces[0].id)
    }
  }, [isSettingWorkspace, selectedWorkspaceId, setSelectedWorkspaceId, workspaces])

  if(error) return;

  if (isLoading) {
    return (
      <div id="WorkspacesList">
        <div className="workspaceMiniature skeleton"></div>
        <div className="workspaceMiniature skeleton"></div>
      </div> 
    )
  }

  if (workspaces) {
      const WorkspaceMiniature = ({workspace}: {workspace: typeof workspaces[number] })  => {
        return(
        <div 
          className={`workspaceMiniature ${selectedWorkspaceId === workspace.id && 'selected'}`}
          onClick={() => setSelectedWorkspaceId(workspace.id)}
          style={{
            backgroundColor: workspace.color,
          }}
        >
          <img src={beeaseLogo} />
        </div>
        )
      }

      return (
        <div id="WorkspacesList">
         {workspaces.map((workspace, index) => (
            <WorkspaceMiniature workspace={workspace} key={index}/>
          ))}
        </div>
      )
  }
}
