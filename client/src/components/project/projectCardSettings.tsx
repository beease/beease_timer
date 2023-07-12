import { useState, useRef, useEffect } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import check from "../../assets/check_w.svg";
import { Switch } from "../ui/switch";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from "../../stores/projectStore";
import type { Project } from '../../libs/interfaces';
import { ConfirmationPopup } from "../ui/comfirmationPopup";

interface Props {
  project: Project;
}

export const ProjectSettings = ({ project }: Props) => {
  const [name, setName] = useState<string>(project.name);
  const [dailyPrice, setDailyPrice] = useState<number | null>(project.dailyPrice);
  const [hourByDay, setHourByDay] = useState<number | null>(project.hourByDay);
  const [colorProject, setColorProject] = useState(project.color);
  const [currentOption, setCurrentOption] = useState<number>(0);
  
  const [isValuesChanged, setIsValueChanged] = useState(false);

  const [colorProjectPopup, setColorProjectPopup] = useState(false);
  const [isConfirmationPopupActive, setIsConfirmationPopupActive] = useState(false);
  
  const selectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.selectedWorkspaceId);

  const utils = trpc.useContext();
  const mutationDelete = trpc.project.deleteProject.useMutation();
  const mutationUpdate = trpc.project.updateProject.useMutation();
  const toggleMoreInfo = projectStore(
    (state: ProjectStore) => state.toggleMoreInfo
  );

  const handleDeleteProject = () => {
    mutationDelete.mutate(
      { id: project.id },
      {
        onSuccess: (newProject) => {
          if (!newProject ?? !selectedWorkspaceId) return;
          utils.workspace.getWorkspaceList.setData(
            { workspaceId: selectedWorkspaceId },
            (oldQueryData) => oldQueryData && {
              ...oldQueryData,
              projects: oldQueryData.projects.filter((project) => project.id !== newProject.id)
            }
          );
          toggleMoreInfo(null);
        },
      }
    );
  };

  const handleUpdateProject = () => {
    if (!name ?? !selectedWorkspaceId) return;
    mutationUpdate.mutate(
      {
        id: project.id,
        data: {
          name: name,
          color: colorProject,
          dailyPrice: dailyPrice ? +dailyPrice : undefined,
          hourByDay: hourByDay ? +hourByDay : undefined ,
        },
      },
      {
        onSuccess: (newProject) => {
          if (!newProject) return;
          utils.workspace.getWorkspaceList.setData(
            { workspaceId: selectedWorkspaceId },
            (oldQueryData) => oldQueryData && {
              ...oldQueryData,
              projects: oldQueryData.projects.map((project) => (project.id === newProject.id ? newProject : project))
            },
          );
        },
      }
    );
  };

  useEffect(() => {
    const hasValueChanged = (
      name !== project.name ||
      dailyPrice !== project.dailyPrice ||
      hourByDay !== project.hourByDay ||
      colorProject !== project.color
    );
    setIsValueChanged(hasValueChanged);
  }, [name, dailyPrice, hourByDay, colorProject, project.name, project.dailyPrice, project.hourByDay, project.color]);
  

  return (
    <div className="ProjectSettings">
      <div className="ProjectSettings_line">
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
          className="ProjectSettings_name"
          placeholder="Project name"
          defaultValue={project.name}
        />
      </div>

      <div className="ProjectSettings_line">
        <input 
        onChange={(e) => {
          setDailyPrice(+e.target.value || null)
        }}
          value={dailyPrice ?? ""}
          className="ProjectSettings_number" 
          placeholder="TJM" 
          type="number" 
          defaultValue={project.dailyPrice || ""}
          />
        <input 
          onChange={(e) => {
            setHourByDay(+e.target.value || null)
          }}
          value={hourByDay ?? ""}
          className="ProjectSettings_number" 
          placeholder="Hours per day" 
          type="number" 
          defaultValue={project.hourByDay || ""}
        />
        <ColorPickerPopup
          setColor={setColorProject}
          colorPopup={colorProjectPopup}
          setColorPopup={setColorProjectPopup}
          color={colorProject}
          style={{
            width: "42px",
            height: "42px",
          }}
        />
        <BasicButton
          icon={bin}
          variant="grey"
          onClick={() =>{
            setIsConfirmationPopupActive(true)
          }}
          style={{
            height: "42px",
            width: "42px",
          }}
        />
        {isConfirmationPopupActive && (
          <ConfirmationPopup
            open={isConfirmationPopupActive}
            setOpen={setIsConfirmationPopupActive}
            text={`Delete ${project.name}?`}
            onConfirm={handleDeleteProject}
          />
        )}
      </div>

      <div className="ProjectSettings_line">
        <Switch
          width={208}
          height={42}
          options={["En cours", "Archives"]}
          color={project.color}
          currentOption={currentOption}
          setCurrentOption={setCurrentOption}
        />
        <BasicButton
          icon={check}
          variant={isValuesChanged ? "confirm" : "grey"}
          onClick={() => {
            isValuesChanged && handleUpdateProject();
          }}
          style={{
            height: "42px",
            width: "92px",
          }}
        />
      </div>
    </div>
  );
};
