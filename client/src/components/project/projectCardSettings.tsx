import { useState, useRef, useEffect } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import { BasicButton } from "../ui/basicButton";
import bin from "../../assets/bin.svg";
import check from "../../assets/check_w.svg";
import { Switch } from "../ui/switch";
import { trpc } from "../../trpc";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { projectStore, ProjectStore } from "../../stores/projectStore";
import type { Project } from "../../libs/interfaces";
import { ConfirmationPopup } from "../ui/comfirmationPopup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

interface Props {
  project: Project;
}

const validationSchema = z.object({
  name: z.string().nonempty("Please enter a workspace name"),
  dailyPrice: z.number().optional(),
  hourByDay: z.number().optional(),
  color: z.string().nonempty(),
  isArchived: z.boolean(),
});

export const ProjectSettings = ({ project }: Props) => {
  const [colorProjectPopup, setColorProjectPopup] = useState<boolean>(false);
  const [isConfirmationPopupActive, setIsConfirmationPopupActive] =
    useState<boolean>(false);

  const selectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.selectedWorkspaceId
  );
  const toggleMoreInfo = projectStore(
    (state: ProjectStore) => state.toggleMoreInfo
  );

  const utils = trpc.useContext();

  const defaultValues = {
    name: project.name,
    dailyPrice: project.dailyPrice ? +project.dailyPrice : undefined,
    hourByDay: project.hourByDay ? +project.hourByDay : undefined,
    color: project.color,
    isArchived: project.isArchived,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const watchAllFields = useWatch({ control });

  const hasChanged =
    JSON.stringify(watchAllFields) !== JSON.stringify(defaultValues);

  const mutationDelete = trpc.project.deleteProject.useMutation({
    onSuccess: (deletedProject) => {
      if (!deletedProject || !selectedWorkspaceId) return;
      utils.workspace.getWorkspaceList.setData(
        { workspaceId: selectedWorkspaceId },
        (oldQueryData) =>
          oldQueryData && {
            ...oldQueryData,
            projects: oldQueryData.projects.filter(
              (project) => project.id !== deletedProject.id
            ),
          }
      );
      toggleMoreInfo(null);
    },
  });

  const mutationUpdate = trpc.project.updateProject.useMutation({
    onSuccess: (newProject) => {
      if (!newProject || !selectedWorkspaceId) return;
      utils.workspace.getWorkspaceList.setData(
        { workspaceId: selectedWorkspaceId },
        (oldQueryData) =>
          oldQueryData && {
            ...oldQueryData,
            projects: oldQueryData.projects.map((project) =>
              project.id === newProject.id ? newProject : project
            ),
          }
      );
    },
  });

  return (
    <form
      className="ProjectSettings"
      onSubmit={handleSubmit(async (values) => {
        await mutationUpdate.mutateAsync({
          id: project.id,
          data: values,
        });
        reset(values);
      })}
    >
      <div className="ProjectSettings_line">
        <div className="input_cont ProjectSettings_name">
          <input autoFocus {...register("name")} placeholder="Project name" />
          {errors.name?.message && (
            <div className="input_error">{errors.name?.message}</div>
          )}
        </div>
      </div>

      <div className="ProjectSettings_line">
        <div className="input_cont ProjectSettings_number">
          <input
            type="number"
            {...register("dailyPrice", { valueAsNumber: true })}
            placeholder="TJM"
          />
          {errors.dailyPrice?.message && (
            <div className="input_error">{errors.dailyPrice?.message}</div>
          )}
        </div>
        <div className="input_cont ProjectSettings_number">
          <input
            type="number"
            {...register("hourByDay", { valueAsNumber: true })}
            placeholder="H/day"
          />
          {errors.hourByDay?.message && (
            <div className="input_error">{errors.hourByDay?.message}</div>
          )}
        </div>
        <ColorPickerPopup
          setColor={(color: string) => setValue("color", color)}
          color={watch("color")}
          colorPopup={colorProjectPopup}
          setColorPopup={setColorProjectPopup}
          style={{
            width: "42px",
            height: "42px",
          }}
        />
        <BasicButton
          icon={bin}
          variant="grey"
          type="button"
          onClick={() => {
            setIsConfirmationPopupActive(true);
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
            onConfirm={() =>
              mutationDelete.mutate({
                id: project.id,
              })
            }
          />
        )}
      </div>

      <div className="ProjectSettings_line">
        <Switch
          width={208}
          height={42}
          options={["En cours", "Archives"]}
          color={project.color}
          currentOption={watch("isArchived")}
          setCurrentOption={(option) => {
            setValue("isArchived", option);
          }}
        />
        <BasicButton
          icon={check}
          disabled={!isValid || !hasChanged}
          variant={isValid && hasChanged ? "confirm" : "grey"}
          type={"submit"}
          style={{
            height: "42px",
            width: "92px",
          }}
        />
      </div>
    </form>
  );
};
