import { useState } from "react";
import { ProjectSettings } from "./projectCardSettings";
import history from "../../assets/history.svg";
import setting from "../../assets/setting.svg";
import { ProjectSessions } from "./projectSessions";
import type { Project, MyUser } from "../../libs/interfaces";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
interface ButtonProps {
  title: "history" | "setting";
  icon: string;
}

interface Props {
  project: Project;
  myUser: MyUser
}

export const ProjectMoreInfos = ({ project, myUser }: Props) => {
  const [selectedButton, setSelectedButton] = useState<"history" | "setting">(
    "history"
  );
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
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

  const isAdminOrOwner = myUser.role === "ADMIN" || myUser.role === "OWNER";

  return (
    <>
      <div className="ProjectCard_moreInfos_menu">
        <Button title={"history"} icon={history} />
        {isAdminOrOwner && <Button title={"setting"} icon={setting} />}
      </div>
      <div className="ProjectCard_moreInfos_content">
        {selectedButton === "history" && selectedWorkspaceId && <ProjectSessions project={project} myUser={myUser} selectedWorkspaceId={selectedWorkspaceId}/>}
        {selectedButton === "setting" && isAdminOrOwner && <ProjectSettings project={project} />}
      </div>
    </>
  );
};
