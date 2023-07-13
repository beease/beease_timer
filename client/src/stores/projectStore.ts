import { create } from 'zustand'

interface PlayingProject {
    projectId: string | null,
    workspaceId: string | null,
}

export interface ProjectStore {
    PlayingProject: PlayingProject;
    MoreInfoProjectId: string | null;
    toggleMoreInfo: (projectId: string | null) => void;
    toggleIsPlaying: (project: PlayingProject) => void;
} 

export const projectStore = create<ProjectStore>((set) => ({
    PlayingProject: {
        projectId: null,
        workspaceId: null
    },
    MoreInfoProjectId: null,
    toggleMoreInfo: (projectId) => set((state) => ({
        MoreInfoProjectId: state.MoreInfoProjectId === projectId ? null : projectId
    })),
    toggleIsPlaying: async (data) => {
        set((state) => ({
            PlayingProject: state.PlayingProject?.projectId === data.projectId ? {projectId: null,
                workspaceId: null} : data
        })
        )
    },
}))
