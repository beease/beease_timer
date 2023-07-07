import { useState } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import check from "../../assets/check_w.svg";
import { Switch } from "../ui/switch";
interface Props {
  project: any;
}

export const ProjectSettings = ({ project }: Props) => {
  const [colorProject, setColorProject] = useState("#4969fb");
  const [colorProjectPopup, setColorProjectPopup] = useState(false);
  const [currentOption, setCurrentOption] = useState<number>(0);
  return (
    <div className="ProjectSettings">
      <div className="ProjectSettings_line">
        <input
          className="ProjectSettings_name"
          placeholder="Project name"
          value={project.name}
        />
      </div>

      <div className="ProjectSettings_line">
        <input className="ProjectSettings_number" placeholder="TJM" />
        <input className="ProjectSettings_number" placeholder="Hours per day" />
        <ColorPickerPopup
          setColor={setColorProject}
          colorPopup={colorProjectPopup}
          setColorPopup={setColorProjectPopup}
          color={colorProject}
          style={{
            width: "42px",
            height: "42px",
          }}
        />
        <BasicButton
          icon={bin}
          variant="grey"
          style={{
            height: "42px",
            width: "42px",
          }}
        />
      </div>

      <div className="ProjectSettings_line">
        <Switch
          width={208}
          height={42}
          options={["En cours", "Archives"]}
          color={project.color}
          currentOption={currentOption}
          setCurrentOption={setCurrentOption}
        />
        <BasicButton
          icon={check}
          variant="confirm"
          style={{
            height: "42px",
            width: "92px",
          }}
        />
      </div>
    </div>
  );
};
