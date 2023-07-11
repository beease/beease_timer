import React from "react";
import { useState } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";

interface Props {
  setIsEditWorkspaceActive: (status: boolean) => void;
}

export const WorkspaceEdit = ({ setIsEditWorkspaceActive }: Props) => {
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  return (
    <div className="editWorkspace">
      <input
        className="editWorkspace_name_input"
        type="text"
        placeholder="Workspace name"
      />

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
        // onClick={() => {

        // }}
        variant="confirm"
        icon={check}
      />
    </div>
  );
};
