import { projectStore, ProjectStore } from "../../stores/projectStore";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from "../../trpc";
import dayjs from "dayjs";

import { DotsButton } from "../ui/dotsButton";
import { TitleTimer } from "../ui/titleTimer";
import { BasicButton } from "../ui/basicButton";

import play from "../../assets/play_w.svg";
import stop from "../../assets/stop_w.svg";

import type { Project } from "../../libs/interfaces"

interface Props {
  setIsDotsButtonActive: (status: boolean) => void;
  isDotsButtonActive: boolean;
  project: Project;
}

export const ProjectCardTop = ({
  setIsDotsButtonActive,
  isDotsButtonActive,
  project,
}: Props) => {
  const toggleIsPlaying = projectStore(
    (state: ProjectStore) => state.toggleIsPlaying
  );
  const PlayingProject = projectStore(
    (state: ProjectStore) => state.PlayingProject
  );
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );
  const utils = trpc.useContext();
  const mutationCreateSession = trpc.memberSession.createSession.useMutation();
  const mutationStopSession = trpc.memberSession.stopSession.useMutation();

  const CreateSession = async (projectId: string, startedAt: string) => {
    await mutationCreateSession.mutateAsync({
      projectId: projectId,
      startedAt: startedAt,
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
                  memberSessions: [...project.memberSessions, newSession]
                }
              }else{
                return project
              }
            });
            return{
              ...oldQueryData,
              projects: newProjects
            }
          })        
        }
    }); 
  };

  const StopSession = async (projectId: string, endedAt: string, workspaceId: string) => {
   await mutationStopSession.mutateAsync({
      projectId: projectId,
      endedAt: endedAt,
    },
    {
      onSuccess: (newSession) => {
        if(!newSession || !selectedWorkspaceId) return;
        utils.workspace.getWorkspaceList.setData(
          { workspaceId: workspaceId },
          (oldQueryData) => {
            if(!oldQueryData) return;
            const newProjects = oldQueryData.projects.map((project) => {
              if(project.id === projectId){
                return {
                  ...project,
                  memberSessions: project.memberSessions.map((session) => (session.id === newSession.id ? newSession : session))
                }
              }else{
                return project
              }
            });
            return{
              ...oldQueryData,
              projects: newProjects
            }
          })
      }
    });
  };

  const handlePlayStop = async () => {
    const now = dayjs().format()
    if (PlayingProject?.projectId === project.id && selectedWorkspaceId) {
       StopSession(project.id, now, selectedWorkspaceId);
    } else if (PlayingProject?.projectId === null) {
       CreateSession(project.id, now);
    } else if (PlayingProject?.projectId !== project.id && PlayingProject?.projectId && PlayingProject.workspaceId) {
      await StopSession(PlayingProject.projectId, now, PlayingProject.workspaceId);
      CreateSession(project.id, now);
    }
    toggleIsPlaying({
      projectId: project.id,
      workspaceId: selectedWorkspaceId,
      startedAt: now
    })
  };

  const totalSessionTime = project.memberSessions.reduce(
    (acc: number, session) => {
      if (session.endedAt) {
        return acc + dayjs(session.endedAt).diff(dayjs(session.startedAt), "ms");
      }
      return acc;
    },
    0
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
      {
        
      }<TitleTimer title={project.name} isPlaying={PlayingProject.projectId === project.id} total={totalSessionTime} hoursByDay={project.hourByDay}/>
      <BasicButton
        icon={PlayingProject?.projectId === project.id ? stop : play}
        size="small"
        style={{
          backgroundColor: project.color,
        }}
        onClick={() => {
          handlePlayStop();
        }}
      />
    </div>
  );
};
