import { useState } from "react";
import { ProjectSettings } from "./projectCardSettings";
import history from "../../assets/history.svg";
import setting from "../../assets/setting.svg";
import { ProjectSessions } from "./projectSessions";
import type { Project } from "../../libs/interfaces";

interface ButtonProps {
  title: "history" | "setting";
  icon: string;
}

interface Props {
  project: Project;
}

export const ProjectMoreInfos = ({ project }: Props) => {
  const [selectedButton, setSelectedButton] = useState<"history" | "setting">(
    "history"
  );
  const History = () => {
    return <div></div>;
  };

  const Button = ({ title, icon }: ButtonProps) => {
    const isSelected = selectedButton === title;
    const handleClick = () => {
      if (!isSelected) setSelectedButton(title);
    };
    return (
      <button
        style={{ backgroundColor: isSelected ? "auto" : project.color }}
        onClick={handleClick}
        className={`more_infos_history_button ${isSelected && "selected"}`}
      >
        <img className={`${!isSelected && "white"}`} alt={title} src={icon} />
      </button>
    );
  };

  return (
    <>
      <div className="ProjectCard_moreInfos_menu">
        <Button title={"history"} icon={history} />
        <Button title={"setting"} icon={setting} />
      </div>
      <div className="ProjectCard_moreInfos_content">
        {selectedButton === "history" && <ProjectSessions project={project} />}
        {selectedButton === "setting" && <ProjectSettings project={project} />}
      </div>
    </>
  );
};
