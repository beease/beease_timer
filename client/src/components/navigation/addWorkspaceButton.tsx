import plus from '../../assets/plus.svg';

interface Props {
    setIsAddingNewWorkspace: (isAddingNewWorkspace: boolean) => void;
}

export const AddWorkspaceButton = ({setIsAddingNewWorkspace}: Props) => {
  return (
    <div 
        id="addWorkspaceButton"
        onClick={() => setIsAddingNewWorkspace(true)}
    >
        <img src={plus} />
    </div>
  )
}
