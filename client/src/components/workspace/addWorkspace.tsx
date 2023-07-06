import { useState } from "react";
import { ColorPickerPopup } from "../../ui/colorPicker";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";
import { AnimationCard } from "../animationCard";

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
      <div
        onClick={() => {
          setIsAddingNewWorkspace(false);
        }}
        className="addWorkspace_action cancel"
      >
        <img src={cross} />
      </div>
      <div
        className="addWorkspace_action confirm"
        onClick={() => {
          
        }}
      >
        <img src={check} />
      </div>
    </div>
  );
};
