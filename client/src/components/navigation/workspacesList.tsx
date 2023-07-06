
import { trpc } from "../../trpc";
import beeaseLogo from '../../assets/logo_beease.svg';

interface Props {
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
}

export const WorkspacesList = ({selectedWorkspace, setSelectedWorkspace}: Props) => {
  const { data: workspaces, error, isLoading } = trpc.workspace.getMyWorkspaces.useQuery();
  
  if (error) {
    console.log(error)
    return <div>error</div>;
  }

  if (isLoading) {
    return <div className="logout_picture skeleton"></div>;
  }

  if (workspaces) {
      const WorkspaceMiniature = ({workspace}: {workspace: typeof workspaces[number] })  => {
        return(
        <div 
          className={`workspaceMiniature ${workspace.id === selectedWorkspace && 'selected'}`}
          onClick={() => setSelectedWorkspace(workspace.id)}
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
