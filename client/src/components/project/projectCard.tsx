/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from "react";
import play from "../../assets/play_w.svg";
import history from "../../assets/history.svg";
import setting from "../../assets/setting.svg";
import stop from "../../assets/stop_w.svg";
import { wait } from "../../utils/function";
import { DotsButton } from "../ui/dotsButton";
import { TitleTimer } from "../ui/titleTimer";
import { ProjectSettings } from "./projectSettings";
import { BasicButton } from "../ui/basicButton";
import { projectStore, ProjectStore } from "../../stores/projectStore";

interface Props {
  project: any;
}

interface ButtonProps {
  title: "history" | "setting";
  icon: string;
}

export const ProjectCard = ({ project }: Props) => {
  const toggleIsPlaying = projectStore(
    (state: ProjectStore) => state.toggleIsPlaying
  );
  const PlayingProjectId = projectStore(
    (state: ProjectStore) => state?.PlayingProjectId
  );
  const MoreInfoProjectId = projectStore(
    (state: ProjectStore) => state?.MoreInfoProjectId
  );
  const toggleMoreInfo = projectStore(
    (state: ProjectStore) => state.toggleMoreInfo
  );

  const [selectedButton, setSelectedButton] = useState<"history" | "setting">(
    "history"
  );
  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);

  const projectCard = useRef<HTMLDivElement>(null);
  const moreInfos = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const transition = async () => {
      if (
        MoreInfoProjectId === project.id &&
        moreInfos.current &&
        projectCard.current
      ) {
        projectCard.current.style.height = "232px";
        moreInfos.current.style.display = "flex";
        await wait(100);
        moreInfos.current.style.opacity = "0";
        moreInfos.current.style.opacity = "1";
      } else if (projectCard.current && moreInfos.current) {
        moreInfos.current.style.opacity = "0";
        await wait(100);
        moreInfos.current.style.display = "none";
        projectCard.current.style.height = "64px";
      }
    };
    transition();
  }, [MoreInfoProjectId, project.id]);

  useEffect(() => {
    if (isDotsButtonActive) {
      toggleMoreInfo(project.id);
    } else if (MoreInfoProjectId === project.id) {
      toggleMoreInfo(project.id);
    }
  }, [isDotsButtonActive, project.id, toggleMoreInfo]);

  useEffect(() => {
    if (MoreInfoProjectId !== project.id && isDotsButtonActive) {
      setIsDotsButtonActive(false);
    }
  }, [MoreInfoProjectId]);

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

  const History = () => {
    return <div></div>;
  };

  return (
    <div ref={projectCard} className="ProjectCard">
      <div className="ProjectCard_top">
        <DotsButton
          setIsDotsButtonActive={setIsDotsButtonActive}
          isDotsButtonActive={isDotsButtonActive}
          style={{
            backgroundColor: project.color,
          }}
        />

        <TitleTimer title={project.name} timestamp={12341234} />
        <BasicButton
          icon={PlayingProjectId === project.id ? stop : play}
          style={{
            backgroundColor: project.color,
          }}
          onClick={() => {
            toggleIsPlaying(project.id);
          }}
        />
      </div>
      <div
        ref={moreInfos}
        className="ProjectCard_moreInfos"
        style={{ display: "none" }}
      >
        <div className="ProjectCard_moreInfos_menu">
          <Button title={"history"} icon={history} />
          <Button title={"setting"} icon={setting} />
        </div>
        <div className="ProjectCard_moreInfos_content">
          {selectedButton === "history" && <History />}
          {selectedButton === "setting" && (
            <ProjectSettings project={project} />
          )}
        </div>
      </div>
    </div>
  );
};
