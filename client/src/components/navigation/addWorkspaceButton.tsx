import plus from '../../assets/plus.svg';

interface Props {
    setIsAddingNewWorkspace: (isAddingNewWorkspace: boolean) => void;
    setSelectedWorkspace: (workspace: string) => void;
}

export const AddWorkspaceButton = ({setIsAddingNewWorkspace, setSelectedWorkspace}: Props) => {
  const handleAddWorkspace = () => {
    setIsAddingNewWorkspace(true)
    setSelectedWorkspace("")
  }
  
  return (
    <div 
        id="addWorkspaceButton"
        onClick={handleAddWorkspace}
    >
        <img src={plus} />
    </div>
  )
}
