import { create } from "zustand";
import { projectStore } from "./projectStore";

export interface WorkspaceState {
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (workspaceId: string) => void;
  isSettingWorkspace: "edit" | "add" | null;
  setSettingWorkspace: (status: "edit" | "add" | null) => void;
  isStatisticActive: boolean;
  toggleStatisticActive: () => void;
}

export const workspaceStore = create<WorkspaceState>((set) => ({
  isSettingWorkspace: null,
  selectedWorkspaceId: null,
  isStatisticActive: false,
  setSelectedWorkspaceId: (workspaceId) =>
    set((state) => {
      if (workspaceId !== state.selectedWorkspaceId) {
        projectStore.getState().toggleMoreInfo(null);
      }
      return {
        selectedWorkspaceId: workspaceId,
        isSettingWorkspace: null,
        isStatisticActive: false,
      };
    }),
  setSettingWorkspace: (status) =>
    set((state) => ({
      isSettingWorkspace: status,
      selectedWorkspaceId: status === "edit" ? state.selectedWorkspaceId : null,
    })),
  toggleStatisticActive: () =>
    set((state) => ({
      isStatisticActive: !state.isStatisticActive,
    })),
}));
