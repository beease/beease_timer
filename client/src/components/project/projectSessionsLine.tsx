import { DisplayUserPicture } from "../ui/displayUserPicture";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import { formatDate, formatTwoDates, useTimer } from '../../utils/function';
import type { Session } from '../../libs/interfaces';
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from '../../stores/projectStore';

interface Props {
    session: Session;
    projectId: string;
}

export const ProjectSessionsLine = ({session, projectId}: Props) => {    
    const selectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.selectedWorkspaceId);
    const PlayingProjectId = projectStore((state: ProjectStore) => state.PlayingProjectId);
    const toggleIsPlaying = projectStore((state: ProjectStore) => state.toggleIsPlaying);

    const utils = trpc.useContext();
    const mutationDeleteSession = trpc.memberSession.deleteSession.useMutation()

    const handleDeleteSession = async () => {
        mutationDeleteSession.mutateAsync({
            sessionId: session.id
        },
        {
            onSuccess: (deletedSession) => {
                if(!deletedSession || !selectedWorkspaceId) return;
                utils.workspace.getWorkspaceList.setData(
                  { workspaceId: selectedWorkspaceId },
                  (oldQueryData) => {
                    if(!oldQueryData) return;
                    const newProjects = oldQueryData.projects.map((project) => {
                      if(project.id === projectId){
                        return {
                          ...project,
                          memberSessions: project.memberSessions.filter((session) => session.id !== deletedSession.id)
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
                  if(PlayingProjectId === projectId && !deletedSession.endedAt){
                    toggleIsPlaying(PlayingProjectId)
                  }
              }
            }
        )
    }  

    const DisplayTimer = ({ session }: { session: Session }) => {
        const time = useTimer(session);
        return <div>{time}</div>;
    };

    const DisplayDate = ({ session }: { session: Session }) => {
        const { startedAt, endedAt } = session
        if(startedAt && endedAt){
            const date = formatTwoDates(startedAt, endedAt)
            return <>{date}</>;
        }else if(startedAt){
            const date = formatDate(startedAt)
            return <>{date}</>;
        }
    };

    return(
        <div className="ProjectSessions_line">
            {session.memberWorkspace?.user && <DisplayUserPicture className="ProjectSessions_picture" user={session.memberWorkspace.user} />}
        <div className={`ProjectSessions_time ${!session.endedAt && 'skeleton'}`}>
            <DisplayTimer session={session}/>
        </div>
        <div className={`ProjectSessions_date ${!session.endedAt && 'skeleton'}`}>
            <DisplayDate session={session}/>
        </div>
            <BasicButton
                icon={bin}
                variant="grey"
                size='small'
                onClick={() => {
                    handleDeleteSession();
                }}
                style={{
                    height: "36px",
                    width: "36px",
                }}
            />
        </div>
    )
}
