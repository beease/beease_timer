import { useState } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";

export const AddWorkspace = () => {
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  const setAddingWorkspace = workspaceStore((state: WorkspaceState) => state.setAddingWorkspace);
  return (
    <div className="addWorkspace">
      <input className="addWorkspace_name_input" type="text" placeholder="Workspace name" />

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
          setAddingWorkspace(false);
        }}
        variant='grey'
        icon={cross}
      />
      <BasicButton 
         // onClick={() => {
          
        // }}
        variant='confirm'
        icon={check}
      />
    </div>
  );
};
