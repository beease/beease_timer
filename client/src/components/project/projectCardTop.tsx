import { projectStore, ProjectStore } from "../../stores/projectStore";

import { DotsButton } from "../ui/dotsButton";
import { TitleTimer } from "../ui/titleTimer";
import { BasicButton } from "../ui/basicButton";

import play from "../../assets/play_w.svg";
import stop from "../../assets/stop_w.svg";

interface Props {
  setIsDotsButtonActive: (status: boolean) => void;
  isDotsButtonActive: boolean;
  project: any;
}

export const ProjectCardTop = ({
  setIsDotsButtonActive,
  isDotsButtonActive,
  project,
}: Props) => {
  const toggleIsPlaying = projectStore(
    (state: ProjectStore) => state.toggleIsPlaying
  );
  const PlayingProjectId = projectStore(
    (state: ProjectStore) => state?.PlayingProjectId
  );

  return (
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
        size='small'
        style={{
          backgroundColor: project.color,
        }}
        onClick={() => {
          toggleIsPlaying(project.id);
        }}
      />
    </div>
  );
};
