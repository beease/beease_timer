import { create } from "zustand";
import { projectStore } from "./projectStore";

export interface WorkspaceState {
  selectedWorkspaceId: {
    id: string | null;
    role: string | null;
  };
  setSelectedWorkspaceId: (workspaceId: {
    id: string | null;
    role: string | null;
  }) => void;
  isSettingWorkspace: "edit" | "add" | null;
  setSettingWorkspace: (status: "edit" | "add" | null) => void;
  isStatisticActive: boolean;
  toggleInvitationActive: () => void;
  isInvitationActive: boolean;
  toggleStatisticActive: () => void;
  loadWorkspaceIdFromStorage: () => void;
}

export const workspaceStore = create<WorkspaceState>((set) => ({
  isSettingWorkspace: null,
  selectedWorkspaceId: {
    id: null,
    role: null,
  },
  isStatisticActive: false,
  isInvitationActive: false,
  setSelectedWorkspaceId: (workspaceId) =>
    set((state) => {
      if (workspaceId.id !== state.selectedWorkspaceId.id) {
        projectStore.getState().toggleMoreInfo(null);
      }
      if(workspaceId.id === null) localStorage.removeItem("selectedWorkspaceId");
      else localStorage.setItem("selectedWorkspaceId", workspaceId.id);
      return {
        selectedWorkspaceId: workspaceId,
        isSettingWorkspace: null,
        isStatisticActive: false,
      };
    }),
  setSettingWorkspace: (status) =>
    set((state) => ({
      isSettingWorkspace: status,
      selectedWorkspaceId: status === "edit" ? state.selectedWorkspaceId : {
        id: null,
        role: null,
      },
    })),
  toggleStatisticActive: () =>
    set((state) => ({
      isStatisticActive: !state.isStatisticActive,
    })),
  toggleInvitationActive: () =>
    set((state) => ({
      isInvitationActive: !state.isInvitationActive,
    })),
  loadWorkspaceIdFromStorage: () => {
    const workspaceId = localStorage.getItem("selectedWorkspaceId");
    const workspaceRole = localStorage.getItem("selectedWorkspaceRole");
    if (workspaceId) set(() => ({ selectedWorkspaceId: {
      id: workspaceId,
      role: workspaceRole
    } }));
  },
}));

workspaceStore.getState().loadWorkspaceIdFromStorage();

