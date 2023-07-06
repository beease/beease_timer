import { useState } from "react";
import { ColorPickerPopup } from "../../ui/colorPicker";

export const AddWorkspace = () => {
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);

  return (
    <div className="addWorkspace">
      <input type="text" placeholder="Workspace name" />
      <ColorPickerPopup
        setColor={setColorWorkSpace}
        colorPopup={colorWorkSpacePopup}
        setColorPopup={setColorWorkSpacePopup}
        color={colorWorkSpace || "#4969fb"}
      />
    </div>
  );
};
