import { useState } from "react";
import { BasicButton } from "../ui/basicButton";
import plus from "../../assets/plus_w.svg";
import dayjs from "dayjs";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { DisplayMyPicture } from "../ui/displayMyPicture";

interface Props {
  projectId: string;
}

export const ProjectSessionsAdd = ({ projectId }: Props) => {
  const [hours, setHours] = useState<number | null>(null);
  const [mins, setMins] = useState<number | null>(null);
  const [secs, setSecs] = useState<number | null>(null);

  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );

  const utils = trpc.useContext();
  const mutationDeleteSession = trpc.memberSession.createSession.useMutation();

  const handleCreateSession = async () => {
    const now = dayjs();

    const newDate = now
      .subtract(secs ?? 0, "second")
      .subtract(mins ?? 0, "minute")
      .subtract(hours ?? 0, "hour");

    mutationDeleteSession.mutateAsync(
      {
        projectId: projectId,
        startedAt: newDate.format(),
        endedAt: now.format(),
      },
      {
        onSuccess: (newSession) => {
          if (!newSession || !selectedWorkspaceId) return;
          utils.workspace.getWorkspaceList.setData(
            { workspaceId: selectedWorkspaceId },
            (oldQueryData) => {
              if (!oldQueryData) return;
              const newProjects = oldQueryData.projects.map((project) => {
                if (project.id === projectId) {
                  return {
                    ...project,
                    memberSessions: [...project.memberSessions, newSession],
                  };
                } else {
                  return project;
                }
              });
              return {
                ...oldQueryData,
                projects: newProjects,
              };
            }
          );
          setHours(null)
          setMins(null)
          setSecs(null)
        },
      }
    );
  };

  const isValid = mins || secs || hours;

  return (
    <div className="ProjectSessions_line">
      <DisplayMyPicture className="ProjectSessions_picture" />
      <input
        className="ProjectSessions_add_input"
        placeholder="Hour"
        onChange={(e) => {
          setHours(+e.target.value || null);
        }}
        value={hours ?? ""}
      />
      <input
        className="ProjectSessions_add_input"
        placeholder="Min"
        onChange={(e) => {
          setMins(+e.target.value || null);
        }}
        value={mins ?? ""}
      />
      <input
        className="ProjectSessions_add_input"
        placeholder="Sec"
        onChange={(e) => {
          setSecs(+e.target.value || null);
        }}
        value={secs ?? ""}
      />
      <BasicButton
        icon={plus}
        variant={isValid ? "confirm" : "grey"}
        size="small"
        style={{
          height: "36px",
          width: "36px",
        }}
        onClick={() => {
            isValid && handleCreateSession();
        }}
      />
    </div>
  );
};
