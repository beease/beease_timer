
import { trpc } from "../../trpc";
import beeaseLogo from '../../assets/logo_beease.svg';

interface Props {
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
  setIsAddingNewWorkspace: (workspace: boolean) => void;
}

export const WorkspacesList = ({selectedWorkspace, setSelectedWorkspace, setIsAddingNewWorkspace}: Props) => {
  // const { data, error, isLoading } = trpc.workspace.getMyWorkspaces.useQuery();
  
  const workspaces = [{
    id: 'aZERAZERQSDF342',
    name: 'beease test',
    color: '#FF9E4C'
  }]
  

  // if (error) {
  //   console.log(error)
  //   return <div>error</div>;
  // }

  // if (isLoading) {
  //   return <div className="logout_picture skeleton"></div>;
  // }

  if (workspaces) {
      const handleSelectWorkspace = (id: string) => {
        setSelectedWorkspace(id)
        setIsAddingNewWorkspace(false)
      }

      const WorkspaceMiniature = ({workspace}: {workspace: typeof workspaces[number] })  => {
        return(
        <div 
          className={`workspaceMiniature ${workspace.id === selectedWorkspace && 'selected'}`}
          onClick={() => handleSelectWorkspace(workspace.id)}
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
