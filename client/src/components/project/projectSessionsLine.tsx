import { DisplayUserPicture } from "../ui/displayUserPicture";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import { formatDate, formatTwoDates, useTimer } from "../../utils/function";
import type { Session } from "../../libs/interfaces";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from "../../stores/projectStore";

interface Props {
  session: Session;
  projectId: string;
}

export const ProjectSessionsLine = ({ session, projectId }: Props) => {
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );
  const PlayingProject = projectStore(
    (state: ProjectStore) => state.PlayingProject
  );
  const toggleIsPlaying = projectStore(
    (state: ProjectStore) => state.toggleIsPlaying
  );

  const utils = trpc.useContext();
  const mutationDeleteSession = trpc.memberSession.deleteSession.useMutation();

  const handleDeleteSession = async () => {
    mutationDeleteSession.mutateAsync(
      {
        sessionId: session.id,
      },
      {
        onSuccess: (deletedSession) => {
          if (!deletedSession || !selectedWorkspaceId.id) return;
          utils.workspace.getWorkspaceList.setData(
            { workspaceId: selectedWorkspaceId.id },
            (oldQueryData) => {
              if (!oldQueryData) return;
              const newProjects = oldQueryData.projects.map((project) => {
                if (project.id === projectId) {
                  return {
                    ...project,
                    memberSessions: project.memberSessions.filter(
                      (session) => session.id !== deletedSession.id
                    ),
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
          if (
            PlayingProject?.projectId === projectId &&
            !deletedSession.endedAt
          ) {
            toggleIsPlaying(PlayingProject);
          }
        },
      }
    );
  };

  return (
    <div className="ProjectSessions_line">
      {session.memberWorkspace?.user && (
        <DisplayUserPicture
          className="ProjectSessions_picture"
          user={session.memberWorkspace.user}
        />
      )}
      <div className={`ProjectSessions_time ${!session.endedAt && "skeleton"}`}>
        {useTimer(session.startedAt, session.endedAt)}
      </div>
      <div className={`ProjectSessions_date ${!session.endedAt && "skeleton"}`}>
        {session.startedAt && session.endedAt
          ? formatTwoDates(session.startedAt, session.endedAt)
          : session.startedAt && formatDate(session.startedAt)}
      </div>
      <BasicButton
        icon={bin}
        variant="grey"
        size="small"
        onClick={() => {
          handleDeleteSession();
        }}
        style={{
          height: "36px",
          width: "36px",
        }}
      />
    </div>
  );
};
