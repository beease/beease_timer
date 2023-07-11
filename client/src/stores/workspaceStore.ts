import { create } from "zustand";
import { projectStore } from "./projectStore";

export interface WorkspaceState {
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (workspaceId: string | null) => void;
  isSettingWorkspace: "edit" | "add" | null;
  setSettingWorkspace: (status: "edit" | "add" | null) => void;
  isStatisticActive: boolean;
  toggleStatisticActive: () => void;
  loadWorkspaceIdFromStorage: () => void;
}

export const workspaceStore = create<WorkspaceState>((set) => ({
  isSettingWorkspace: null,
  selectedWorkspaceId: null,
  selectedWorkspaceIdCache: null,
  isStatisticActive: false,
  setSelectedWorkspaceId: (workspaceId) =>
    set((state) => {
      if (workspaceId !== state.selectedWorkspaceId) {
        projectStore.getState().toggleMoreInfo(null);
      }
      if(workspaceId === null) localStorage.removeItem("selectedWorkspaceId");
      else localStorage.setItem("selectedWorkspaceId", workspaceId);
      return {
        selectedWorkspaceId: workspaceId,
        selectedWorkspaceIdCache: workspaceId,
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
  loadWorkspaceIdFromStorage: () => {
    const workspaceId = localStorage.getItem("selectedWorkspaceId");
    if (workspaceId) set(() => ({ selectedWorkspaceId: workspaceId }));
  },
}));

workspaceStore.getState().loadWorkspaceIdFromStorage();

