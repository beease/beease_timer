import { create } from 'zustand'

interface PlayingProject {
    projectId: string | null,
    workspaceId: string | null,
    startedAt: string | null,
}

export interface ProjectStore {
    PlayingProject: PlayingProject;
    MoreInfoProjectId: string | null;
    isAddingProject: boolean;
    toggleMoreInfo: (projectId: string | null) => void;
    toggleIsPlaying: (project: PlayingProject) => void;
    setIsAddingProject: (isAddingProject: boolean) => void;
} 

export const projectStore = create<ProjectStore>((set) => ({
    PlayingProject: {
        projectId: null,
        workspaceId: null,
        startedAt: null,
    },
    MoreInfoProjectId: null,
    isAddingProject: false,
    toggleMoreInfo: (projectId) => set((state) => ({
        MoreInfoProjectId: state.MoreInfoProjectId === projectId ? null : projectId
    })),
    setIsAddingProject: (isAddingProject) => set(() => ({
        isAddingProject: isAddingProject
    })),
    toggleIsPlaying: async (data) => {
        set((state) => {
            const PlayingProject = state.PlayingProject?.projectId === data.projectId ? 
            {
                projectId: null,
                workspaceId: null,
                startedAt: null,
            } : data
            if(PlayingProject.projectId){
                chrome.action.setIcon({ path: "./time_machine_on.png" });
            }else{
                chrome.action.setIcon({ path: "./time_machine_off.png" });
            }
            return {
                PlayingProject
            }
        }
        )
    },
}))
