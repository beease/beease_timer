import { create } from "zustand";
import { projectStore } from "./projectStore";

export interface WorkspaceState {
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (workspaceId: string) => void;
  isAddingWorkspace: boolean;
  setAddingWorkspace: (status: boolean) => void;
}

export const workspaceStore = create<WorkspaceState>((set) => ({
  isAddingWorkspace: false,
  selectedWorkspaceId: null,
  setSelectedWorkspaceId: (workspaceId: string) =>
    set(() => {
      projectStore.getState().toggleMoreInfo(null);
      return {
        selectedWorkspaceId: workspaceId,
        isAddingWorkspace: false,
      };
    }),
  setAddingWorkspace: (status) =>
    set((state) => ({
      isAddingWorkspace: status,
      selectedWorkspaceId: status ? null : state.selectedWorkspaceId,
    })),
}));
