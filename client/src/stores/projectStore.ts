import { create } from 'zustand'
import { trpc } from '../trpc';

export interface ProjectStore {
    PlayingProjectId: string | null;
    MoreInfoProjectId: string | null;
    toggleMoreInfo: (projectId: string | null) => void;
    toggleIsPlaying: (projectId: string) => void;
} 

// const mutation = trpc.session.

export const projectStore = create<ProjectStore>((set) => ({
    PlayingProjectId: null,
    MoreInfoProjectId: null,
    toggleMoreInfo: (projectId) => set((state) => ({
        MoreInfoProjectId: state.MoreInfoProjectId === projectId ? null : projectId
    })),
    toggleIsPlaying: (projectId) => set((state) => ({
        PlayingProjectId: state.PlayingProjectId === projectId ? null : projectId
    }))
}))
