import { useState, useRef } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from '../../trpc';

export const WorkspaceAdd = () => {
  const [colorWorkSpace, setColorWorkSpace] = useState('#4969fb');
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  const [name, setName] = useState<string>("");

  const setSettingWorkspace = workspaceStore((state: WorkspaceState) => state.setSettingWorkspace);
  const setSelectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.setSelectedWorkspaceId);

  const inputRef = useRef<HTMLInputElement>(null);
  
  const utils = trpc.useContext();
  const mutation = trpc.workspace.createWorkspace.useMutation();
  
  const handleAddWorkspace = () => {
    if (!name) return;
    mutation.mutate(
      {
        name: name,
        color: colorWorkSpace,
      },
      {
        onSuccess: (newWorkspace) => {
          if(!newWorkspace) return;
          utils.workspace.getMyWorkspaces.setData(undefined, (oldQueryData = []) => {
            return [
              ...oldQueryData,
              newWorkspace
            ]
          })
          setSettingWorkspace(null);
          setSelectedWorkspaceId(newWorkspace.id)
        },
      }
    );
  };

  return (
    <div className="addWorkspace">
      <input 
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
        ref={inputRef} 
        className="addWorkspace_name_input" 
        type="text" 
        placeholder="Workspace name"
      />

      <ColorPickerPopup
        setColor={setColorWorkSpace}
        colorPopup={colorWorkSpacePopup}
        setColorPopup={setColorWorkSpacePopup}
        color={colorWorkSpace}
        style={{
          width: "48px",
          height: "48px",
        }}
      />
      <BasicButton 
        onClick={() => {
          setSettingWorkspace(null);
          workspaceStore.getState().loadWorkspaceIdFromStorage();
        }}
        variant='grey'
        icon={cross}
      />
      <BasicButton 
         onClick={() => {
          name && handleAddWorkspace()
        }}
        variant={
          name ? "confirm" : "grey"
        }
        icon={check}
      />
    </div>
  );
};
