/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from "react";
import play from "../../assets/play_w.svg";
import history from "../../assets/history.svg";
import setting from "../../assets/setting.svg";
import stop from "../../assets/stop_w.svg"
import { wait } from "../../utils/function";
import { DotsButton } from "../ui/dotsButton";
import { TitleTimer } from "../ui/titleTimer";
import { ProjectSettings } from "./projectSettings";
import { BasicButton } from "../ui/basicButton";

interface Props {
  setProjectMoreInfos: (status: string | null) => void;
  projectMoreInfos: null | string;
  project: any;
  isStarted: null | string;
  setIsStarted: (isStarted: null | string) => void;
}

interface ButtonProps {
  title: "history" | "setting";
  icon: string;
}

export const ProjectCard = ({
  projectMoreInfos,
  setProjectMoreInfos,
  project,
  isStarted,
  setIsStarted,
}: Props) => {
  const [selectedButton, setSelectedButton] = useState<"history" | "setting">(
    "history"
  );
  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);

  const projectCard = useRef<HTMLDivElement>(null);
  const moreInfos = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const transition = async () => {
      if (
        projectMoreInfos === project.id &&
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
  }, [projectMoreInfos, project.id]);

  useEffect(() => {
    if (isDotsButtonActive) {
      setProjectMoreInfos(project.id);
    } else if (projectMoreInfos === project.id) {
      setProjectMoreInfos(null);
    }
  }, [isDotsButtonActive, project.id, setProjectMoreInfos]);

  useEffect(() => {
    if (projectMoreInfos !== project.id && isDotsButtonActive) {
      setIsDotsButtonActive(false);
    }
  }, [projectMoreInfos]);

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

  const handleStartStopProject = () => {
    if(!(isStarted === project.id)){
        setIsStarted(project.id)
        return
    }
    setIsStarted(null)
  }

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
          icon={isStarted === project.id ? stop : play}
          style={{
            backgroundColor: project.color,
          }}
          onClick={() => {
            handleStartStopProject()         
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
