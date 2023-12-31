import { ProjectCard } from "./projectCard";
import { ProjectAdd } from "./projectAdd";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { filtersStore, FiltersState } from "../../stores/filterStore";
import { trpc } from "../../trpc";
import { Statistics } from "../statistics/Statistics";

interface Props {
  selectedWorkspaceId: string;
}

export const ProjectList = ({ selectedWorkspaceId }: Props) => {
  const {
    data: worspace,
    error,
    isLoading,
  } = trpc.workspace.getWorkspaceList.useQuery({
    workspaceId: selectedWorkspaceId,
  });

  const isStatisticActive = workspaceStore(
    (state: WorkspaceState) => state.isStatisticActive
  );
  
  const filters = filtersStore((state: FiltersState) => state.filters);

  if (error) return;

  if (isLoading)
    return (
      <div className='ProjectList'>
        <div className='ProjectCard skeleton'></div>
        <div className='ProjectCard skeleton'></div>
        <div className='ProjectCard skeleton'></div>
      </div>
    );

  if (worspace) {
    const filteredProjects = worspace.projects.filter(
      (project) =>
        (project.isArchived && filters.archives) ||
        (!project.isArchived && filters.current)
    );

    if (isStatisticActive) {
      return <Statistics workspace={worspace} />;
    }
    return (
      <div className='ProjectList'>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} myUser={worspace.myUser}/>
        ))}
        <ProjectAdd selectedWorkspaceId={selectedWorkspaceId} />
      </div>
    );
  }
};
