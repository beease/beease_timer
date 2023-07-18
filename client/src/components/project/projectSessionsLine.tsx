import { DisplayUserPicture } from "../ui/displayUserPicture";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import { formatDate, formatTwoDates, useTimer } from "../../utils/function";
import type { Session, MyUser } from "../../libs/interfaces";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from "../../stores/projectStore";

interface Props {
  session: Session;
  myUser: MyUser;
  projectId: string;
}

export const ProjectSessionsLine = ({ session, projectId, myUser }: Props) => {
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
          if (!deletedSession || !selectedWorkspaceId) return;
          utils.workspace.getWorkspaceList.setData(
            { workspaceId: selectedWorkspaceId },
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

  const isAdminOrOwner = myUser.role === 'ADMIN' || myUser.role === 'OWNER';
  const isMySession = session.memberWorkspace?.user.id === myUser.id;
  const isDeletable = isAdminOrOwner || isMySession;

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
        variant={isDeletable ? "grey" : "disable"}
        size="small"
        onClick={() => {
          isDeletable && handleDeleteSession();
        }}
        style={{
          height: "36px",
          width: "36px",
        }}
      />
    </div>
  );
};
