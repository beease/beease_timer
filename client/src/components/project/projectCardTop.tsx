import { projectStore, ProjectStore } from "../../stores/projectStore";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from "../../trpc";
import Dayjs from "dayjs";

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
  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );
  const utils = trpc.useContext();
  const mutationCreateSession = trpc.memberSession.createSession.useMutation();
  const mutationStopSession = trpc.memberSession.stopSession.useMutation();

  const CreateSession = async (projectId: string) => {
    mutationCreateSession.mutateAsync({
      projectId: projectId,
      startedAt: Dayjs().format(),
    });
  };

  const StopSession = async (projectId: string) => {
    mutationStopSession.mutateAsync({
      projectId: projectId,
      endedAt: Dayjs().format(),
    },
    {
      onSuccess: (newSession) => {
        if(!newSession || !selectedWorkspaceId) return;
        // utils.workspace.getWorkspaceList.setData(
        //   { workspaceId: selectedWorkspaceId },
        //   (oldQueryData) => {
        //     if(!oldQueryData) return;
        //     const newProject = oldQueryData.projects.find((project) => project.id === PlayingProjectId);

        //     return{
        //       ...oldQueryData,
        //       projects: [...oldQueryData.projects, newProject]
        //     }
        //   })
      }
    });
  };

  const handlePlayStop = async () => {
    if (PlayingProjectId === project.id) {
      await StopSession(project.id);
    } else if (PlayingProjectId === null) {
      await CreateSession(project.id);
    } else if (PlayingProjectId !== project.id) {
      await StopSession(PlayingProjectId);
      await CreateSession(project.id);
    }
    toggleIsPlaying(project.id);
  };

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
