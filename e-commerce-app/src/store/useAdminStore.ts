import { create } from 'zustand';

interface AdminState {
  isSidebarOpen: boolean;
  activeTab: string;
  searchQuery: string;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isSidebarOpen: true,
  activeTab: 'dashboard',
  searchQuery: '',

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () => set({ searchQuery: '', activeTab: 'dashboard' }),
}));