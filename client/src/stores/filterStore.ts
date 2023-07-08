import { create } from 'zustand'
import { Filters } from '../libs/interfaces'

export interface FiltersState {
    filters: Filters;
    setFilters: (filter: 'archives' | 'current' ) => void;
} 

export const filtersStore = create<FiltersState>((set) => ({
    filters: {
        archives: false,
        current: true,
    },
    setFilters: (filter: 'archives' | 'current' ) => set((state) => ({
        filters: {
            ...state.filters,
            [filter]: !state.filters[filter]
        }
    }))
}))

