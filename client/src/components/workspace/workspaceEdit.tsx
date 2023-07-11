import { useState, useEffect, useRef } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import bin from "../../assets/bin.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from '../../trpc';
import { ConfirmationPopup } from "../ui/comfirmationPopup";

interface Props {
  selectedWorkspaceId: string;
}

export const WorkspaceEdit = ({selectedWorkspaceId}: Props) => {
  const [colorWorkSpace, setColorWorkSpace] = useState('');
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  const [isConfirmationPopupActive, setIsConfirmationPopupActive] = useState(false);

  const setSettingWorkspace = workspaceStore((state: WorkspaceState) => state.setSettingWorkspace);
  const setSelectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.setSelectedWorkspaceId);

  const utils = trpc.useContext();
  const mutationDelete = trpc.workspace.deleteWorkspace.useMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const {data: workspace, error, isLoading} = trpc.workspace.getWorkspaceById.useQuery({
    workspaceId: selectedWorkspaceId
  })
  
  useEffect(() => {
    setColorWorkSpace(workspace?.color || '#4969fb')
  }, [workspace?.color]);

  const handleDeleteWorkspace = () => {
    mutationDelete.mutate(
      {id: selectedWorkspaceId},
      {
        onSuccess: (newWorkspace) => {
          if(!newWorkspace) return;
          utils.workspace.getMyWorkspaces.setData(undefined, (oldQueryData = []) => {
            return oldQueryData.filter((workspace) => workspace.id !== newWorkspace.id)
          })
          setSettingWorkspace(null);
          setSelectedWorkspaceId(null)
        },
      }
    );
  };

  if(error) return;

  if(isLoading) return <div className="addWorkspace skeleton"></div>

  if(workspace){
    return (
      <div className="addWorkspace">
        <input ref={inputRef} className="addWorkspace_name_input" type="text" placeholder="Workspace name" defaultValue={workspace?.name}/>

        <ColorPickerPopup
          setColor={setColorWorkSpace}
          colorPopup={colorWorkSpacePopup}
          setColorPopup={setColorWorkSpacePopup}
          color={colorWorkSpace || "#4969fb"}
          style={{
            width: "48px",
            height: "48px",
          }}
        />
        <BasicButton 
          onClick={() => {
            setIsConfirmationPopupActive(true)
            // handleDeleteWorkspace();
          }}
          variant='grey'
          icon={bin}
        />
        <BasicButton 
          onClick={() => {
            // handleAddWorkspace()
          }}
          variant='confirm'
          icon={check}
        />
       { isConfirmationPopupActive &&
        <ConfirmationPopup
          open={isConfirmationPopupActive}
          setOpen={setIsConfirmationPopupActive}
          text={`Delete ${workspace.name}?`}
          onConfirm={handleDeleteWorkspace}
        />}
      </div>
    );
}
};
