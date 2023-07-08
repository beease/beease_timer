
import { trpc } from "../../trpc";
import beeaseLogo from '../../assets/logo_beease.svg';
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";


export const WorkspacesList = () => {
  // const { data, error, isLoading } = trpc.workspace.getMyWorkspaces.useQuery();
  
  const workspaces = [{
    id: 'aZERAZERQSDF342',
    name: 'beease test',
    color: '#FF9E4C'
  }]
  
  const setSelectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.setSelectedWorkspaceId);
  const selectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.selectedWorkspaceId);
  

  // if (error) {
  //   console.log(error)
  //   return <div>error</div>;
  // }

  // if (isLoading) {
  //   return <div className="logout_picture skeleton"></div>;
  // }

  if (workspaces) {
      const WorkspaceMiniature = ({workspace}: {workspace: typeof workspaces[number] })  => {
        return(
        <div 
          className={`workspaceMiniature ${workspace.id === selectedWorkspaceId && 'selected'}`}
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
