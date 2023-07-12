/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from "react";

import { wait } from "../../utils/function";
import { projectStore, ProjectStore } from "../../stores/projectStore";
import { ProjectMoreInfos } from "./projectCardMoreInfos";
import { ProjectCardTop } from "./projectCardTop";

interface Props {
  project: any;
}

export const ProjectCard = ({ project }: Props) => {
  const [isDotsButtonActive, setIsDotsButtonActive] = useState(false);
  const MoreInfoProjectId = projectStore(
    (state: ProjectStore) => state?.MoreInfoProjectId
  );
  const toggleMoreInfo = projectStore(
    (state: ProjectStore) => state.toggleMoreInfo
  );

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
        moreInfos.current.style.opacity = "0";
        moreInfos.current.style.opacity = "1";
      } else if (projectCard.current && moreInfos.current) {
        moreInfos.current.style.opacity = "0";
        projectCard.current.style.height = "64px";
        await wait(100);
        moreInfos.current.style.display = "none";
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

  return (
    <div ref={projectCard} className="ProjectCard" key={project.id}>
      <ProjectCardTop 
          project={project}
          setIsDotsButtonActive={setIsDotsButtonActive}
          isDotsButtonActive={isDotsButtonActive}
      />
      <div
        ref={moreInfos}
        className="ProjectCard_moreInfos"
        style={{ display: "none" }}
      >
        <ProjectMoreInfos 
          project={project}
        /> 
      </div>
    </div>
  );
};
