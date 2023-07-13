import { projectStore, ProjectStore } from "../../stores/projectStore";
import { Timer } from "./timer";

interface Props {
  title: string;
  isPlaying: boolean;
}

export const TitleTimer = ({ title, isPlaying }: Props) => {
  const playingProject = projectStore(
    (state: ProjectStore) => state.PlayingProject
  );

  return (
    <div className="titleTimer">
      <div className="titleTimer_title">{title}</div>
      <div
        className={isPlaying ? "titleTimer_timer skeleton" : "titleTimer_timer"}
      >
        {isPlaying && playingProject.startedAt ? (
          <Timer startedAt={playingProject.startedAt} />
        ) : (
          "00:00:00"
        )}
      </div>
    </div>
  );
};
