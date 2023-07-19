import { projectStore, ProjectStore } from "../../stores/projectStore";
import { formatTimestamp } from "../../utils/function";
import { Timer } from "./timer";

interface Props {
  title: string;
  isPlaying: boolean;
  total?: number; 
  hoursByDay?: number | null;
}

export const TitleTimer = ({ title, isPlaying, hoursByDay, total }: Props) => {
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
          <Timer startedAt={playingProject.startedAt} add={total}/>
        ) : (
          total 
          ? formatTimestamp(total, hoursByDay ?? 24)
          : "00:00:00"
        )}
      </div>
    </div>
  );
};
