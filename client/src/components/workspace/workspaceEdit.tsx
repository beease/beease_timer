import { useState, useEffect, useRef } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import bin from "../../assets/bin.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from "../../trpc";
import { ConfirmationPopup } from "../ui/comfirmationPopup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  selectedWorkspaceId: string;
}

const validationSchema = z.object({
  name: z.string().nonempty("Please enter a project name"),
  color: z.string().nonempty(),
});

export const WorkspaceEdit = ({ selectedWorkspaceId }: Props) => {
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  const [isConfirmationPopupActive, setIsConfirmationPopupActive] =
    useState(false);

  const setSettingWorkspace = workspaceStore(
    (state: WorkspaceState) => state.setSettingWorkspace
  );
  const setSelectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.setSelectedWorkspaceId
  );

  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      color: "#4969fb",
    },
  });

  const mutationDelete = trpc.workspace.deleteWorkspace.useMutation({
    onSuccess: (newWorkspace) => {
      if (!newWorkspace) return;
      utils.workspace.getMyWorkspaces.setData(
        undefined,
        (oldQueryData = []) => {
          return oldQueryData.filter(
            (workspace) => workspace.id !== newWorkspace.id
          );
        }
      );
      setSettingWorkspace(null);
      setSelectedWorkspaceId(null);
    },
  });

  const mutationUpdate = trpc.workspace.updateWorkspace.useMutation({
    onSuccess: (newWorkspace) => {
      if (!newWorkspace) return;
      utils.workspace.getMyWorkspaces.setData(undefined, (oldQueryData = []) =>
        oldQueryData.map((workspace) =>
          workspace.id === newWorkspace.id ? newWorkspace : workspace
        )
      );
      setSettingWorkspace(null);
      setSelectedWorkspaceId(newWorkspace.id);
    },
  });

  const {
    data: workspaces,
    error,
    isLoading,
  } = trpc.workspace.getMyWorkspaces.useQuery();

  const workspace = workspaces
    ? workspaces.find((ws) => ws.id === selectedWorkspaceId)
    : null;

  useEffect(() => {
    setValue("color", workspace?.color || "#4969fb");
    setValue("name", workspace?.name || "");
  }, [setValue, workspace]);

  if (error) return;

  if (isLoading) return <div className="addWorkspace skeleton"></div>;

  if (workspace) {
    return (
      <form
        className="addWorkspace"
        onSubmit={handleSubmit(async (values) => {
          await mutationUpdate.mutateAsync({
            data: values,
            id: selectedWorkspaceId,
          });
          reset();
          setSettingWorkspace(null);
        })}
      >
        <div className="input_cont addWorkspace_name_input">
          <input
            autoFocus
            {...register("name")}
            placeholder="My workspace name"
          />
          {errors.name?.message && (
            <div className="input_error">{errors.name?.message}</div>
          )}
        </div>

        <ColorPickerPopup
          setColor={(color: string) => setValue("color", color)}
          color={watch("color")}
          colorPopup={colorWorkSpacePopup}
          setColorPopup={setColorWorkSpacePopup}
          style={{
            width: "48px",
            height: "48px",
          }}
        />
        <BasicButton
          onClick={() => {
            setIsConfirmationPopupActive(true);
          }}
          variant="grey"
          icon={bin}
          type="button"
        />
        <BasicButton
          icon={check}
          variant={isValid ? "confirm" : "grey"}
          type={"submit"}
        />
        {isConfirmationPopupActive && (
          <ConfirmationPopup
            open={isConfirmationPopupActive}
            setOpen={setIsConfirmationPopupActive}
            text={`Delete ${workspace.name}?`}
            onConfirm={async () => {
              await mutationDelete.mutateAsync({ id: selectedWorkspaceId });
              setSettingWorkspace(null);
              setSelectedWorkspaceId(null);
            }}
          />
        )}
      </form>
    );
  }
};
