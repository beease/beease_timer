import plus from '../../assets/plus.svg';
import { workspaceStore, WorkspaceState } from '../../stores/workspaceStore';

export const AddWorkspaceButton = () => {
  const setAddingWorkspace = workspaceStore((state: WorkspaceState) => state.setAddingWorkspace);
  
  return (
    <div 
        id="addWorkspaceButton"
        onClick={() => setAddingWorkspace(true)}
    >
        <img src={plus} />
    </div>
  )
}
