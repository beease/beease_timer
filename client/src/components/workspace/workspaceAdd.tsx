import { useState, useRef } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import cross from "../../assets/cross.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from '../../trpc';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const validationSchema = z.object({
  name: z.string().nonempty("Please enter a workspace name"),
  color: z.string().nonempty(),
});

export const WorkspaceAdd = () => {
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);

  const setSettingWorkspace = workspaceStore((state: WorkspaceState) => state.setSettingWorkspace);
  const setSelectedWorkspaceId = workspaceStore((state: WorkspaceState) => state.setSelectedWorkspaceId);
  
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    setFocus,
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      color: "#4969fb",
    },
  });

  const mutationCreate = trpc.workspace.createWorkspace.useMutation({
    onSuccess: (newWorkspace) => {
      if(!newWorkspace) return;
      utils.workspace.getMyWorkspaces.setData(undefined, (oldQueryData = []) => {
        return [
          ...oldQueryData,
          newWorkspace
        ]
      })
      setSelectedWorkspaceId(newWorkspace.id)
    },
  });

  return (
    <form 
    className="addWorkspace"
    onSubmit={handleSubmit(async (values) => {
      await mutationCreate.mutateAsync(values);
      reset();
      setSettingWorkspace(null);
    })}
    >
        <div className="input_cont addWorkspace_name_input">
          <input autoFocus {...register("name")} placeholder="My workspace name" />
          {errors.name?.message && (
            <div className="input_error">{errors.name?.message}</div>
          )}
        </div>
      <ColorPickerPopup
        setColor={(color: string) => setValue('color', color)}
        color={watch('color')}
        colorPopup={colorWorkSpacePopup}
        setColorPopup={setColorWorkSpacePopup}
        style={{
          width: "48px",
          height: "48px",
        }}
      />
      <BasicButton 
        onClick={() => {
          setSettingWorkspace(null);
          workspaceStore.getState().loadWorkspaceIdFromStorage();
        }}
        variant='grey'
        icon={cross}
      />
      <BasicButton
          icon={check}
          variant={isValid ? "confirm" : "grey"}
          type={"submit"}
        />
    </form>
  );
};
