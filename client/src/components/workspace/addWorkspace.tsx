import { useState } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";
import { BasicButton } from "../ui/basicButton";

interface Props {
  setIsAddingNewWorkspace: (isAddingNewWorkspace: boolean) => void;
}

export const AddWorkspace = ({ setIsAddingNewWorkspace }: Props) => {
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);

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
          setIsAddingNewWorkspace(false);
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
