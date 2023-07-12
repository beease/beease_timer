import { useState, useEffect, useRef } from "react";
import { ColorPickerPopup } from "../ui/colorPicker";
import check from "../../assets/check_w.svg";
import bin from "../../assets/bin.svg";
import { BasicButton } from "../ui/basicButton";
import { workspaceStore, WorkspaceState } from "../../stores/workspaceStore";
import { trpc } from "../../trpc";
import { ConfirmationPopup } from "../ui/comfirmationPopup";

interface Props {
  selectedWorkspaceId: string;
}

export const WorkspaceEdit = ({ selectedWorkspaceId }: Props) => {
  const [colorWorkSpace, setColorWorkSpace] = useState("");
  const [colorWorkSpacePopup, setColorWorkSpacePopup] = useState(false);
  const [isConfirmationPopupActive, setIsConfirmationPopupActive] =
    useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const setSettingWorkspace = workspaceStore(
    (state: WorkspaceState) => state.setSettingWorkspace
  );
  const setSelectedWorkspaceId = workspaceStore(
    (state: WorkspaceState) => state.setSelectedWorkspaceId
  );

  const utils = trpc.useContext();
  const mutationDelete = trpc.workspace.deleteWorkspace.useMutation();
  const mutationUpdate = trpc.workspace.updateWorkspace.useMutation();

  const {data: workspaces, error, isLoading} = trpc.workspace.getMyWorkspaces.useQuery()

  const workspace = workspaces ? workspaces.find(ws => ws.id === selectedWorkspaceId) : null;

  useEffect(() => {
    setColorWorkSpace(workspace?.color || "#4969fb");
  }, [workspace?.color]);

  const handleDeleteWorkspace = () => {
    mutationDelete.mutate(
      { id: selectedWorkspaceId },
      {
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
      }
    );
  };

  const handleUpdateWorkspace = () => {
    const workspaceName = inputRef.current?.value;
    if (!workspaceName) return;
    if (workspaceName === workspace?.name && colorWorkSpace === workspace?.color) {
      setSettingWorkspace(null);
      setSelectedWorkspaceId(workspace.id);
      return;
    }
    mutationUpdate.mutate(
      {
        id: selectedWorkspaceId,
        data: {
          name: workspaceName,
          color: colorWorkSpace,
        },
      },
      {
        onSuccess: (newWorkspace) => {
          if (!newWorkspace) return;
          utils.workspace.getMyWorkspaces.setData(
            undefined,
            (oldQueryData = []) => oldQueryData.map(workspace => workspace.id === newWorkspace.id ? newWorkspace : workspace)
          );
          setSettingWorkspace(null);
          setSelectedWorkspaceId(newWorkspace.id);
        },
      }
    );
  };

  if (error) return;

  if (isLoading) return <div className="addWorkspace skeleton"></div>;

  if (workspace) {
    return (
      <div className="addWorkspace">
        <input
          ref={inputRef}
          className="addWorkspace_name_input"
          type="text"
          placeholder="Workspace name"
          defaultValue={workspace?.name}
        />

        <ColorPickerPopup
          setColor={setColorWorkSpace}
          colorPopup={colorWorkSpacePopup}
          setColorPopup={setColorWorkSpacePopup}
          color={colorWorkSpace || "#4969fb"}
          style={{
            width: "48px",
            height: "48px",
          }}
        />
        <BasicButton
          onClick={() => {
            setIsConfirmationPopupActive(true);
            // handleDeleteWorkspace();
          }}
          variant="grey"
          icon={bin}
        />
        <BasicButton
          onClick={() => {
            handleUpdateWorkspace();
          }}
          variant="confirm"
          icon={check}
        />
        {isConfirmationPopupActive && (
          <ConfirmationPopup
            open={isConfirmationPopupActive}
            setOpen={setIsConfirmationPopupActive}
            text={`Delete ${workspace.name}?`}
            onConfirm={handleDeleteWorkspace}
          />
        )}
      </div>
    );
  }
};
