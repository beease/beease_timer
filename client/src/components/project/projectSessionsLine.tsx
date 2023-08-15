import { DisplayUserPicture } from "../ui/displayUserPicture";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import { formatDate, formatTwoDates, useTimer } from "../../utils/function";
import type { Session, MyUser } from "../../libs/interfaces";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from "../../stores/projectStore";
import stop from "../../assets/stop.svg";
import dayjs from "dayjs";

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
  const mutationStopSession = trpc.memberSession.stopSession.useMutation();

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

  const StopSession = async (projectId: string, endedAt: string, userId?: string) => {
    console.log('userId', userId)
    await mutationStopSession.mutateAsync({
       projectId: projectId,
       endedAt: endedAt,
       userId: userId
     },
     {
       onSuccess: (newSession) => {
         if(!newSession || !selectedWorkspaceId) return;
         utils.workspace.getWorkspaceList.setData(
           { workspaceId: selectedWorkspaceId },
           (oldQueryData) => {
             if(!oldQueryData) return;
             const newProjects = oldQueryData.projects.map((project) => {
               if(project.id === projectId){
                 return {
                   ...project,
                   memberSessions: project.memberSessions.map((session) => (session.id === newSession.newSession.id ? newSession.newSession : session))
                 }
               }else{
                 return project
               }
             });
             return{
               ...oldQueryData,
               projects: newProjects
             }
           }),
           utils.user.getMyUser.setData(
             undefined,
             (oldQueryData) => {
               if(!oldQueryData) return;
               return {...oldQueryData, currentSession: null}
             }
           )    
       }
     });
   };
   const isAdminOrOwner = myUser.role === 'ADMIN' || myUser.role === 'OWNER';
   const isMySession = session.memberWorkspace?.user.id === myUser.id;
   const isSessionActive = session.endedAt === null;
   const isDeletable = !isSessionActive && (isAdminOrOwner || isMySession);
   const isStopable = isSessionActive && (isAdminOrOwner || isMySession);

   const handleStop = () => {
    const now = dayjs().format();
    if(isMySession){
      toggleIsPlaying({
            projectId: projectId,
            workspaceId: selectedWorkspaceId,
            startedAt: now
      })    
      StopSession(projectId, dayjs().format());
    }else{
      StopSession(projectId, dayjs().format(), session.memberWorkspace?.user.id);
    }
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
        {useTimer(0, 24, session.startedAt, session.endedAt)}
      </div>
      <div className={`ProjectSessions_date ${!session.endedAt && "skeleton"}`}>
        {session.startedAt && session.endedAt
          ? formatTwoDates(session.startedAt, session.endedAt)
          : session.startedAt && formatDate(session.startedAt)}
      </div>
      {
        isStopable ? (
          <BasicButton
            variant="grey"
            size="small"
            icon={stop}
            onClick={() => {
              handleStop();
            }}
            style={{
              height: "36px",
              width: "36px",
            }}
          />
        ) : (
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
        )
      }
    </div>
  );
};
