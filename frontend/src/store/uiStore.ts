import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isModalOpen: boolean;
  activeModal: string | null;
  modalData: Record<string, unknown> | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isModalOpen: false,
  activeModal: null,
  modalData: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  openModal: (modalId, data) =>
    set({ isModalOpen: true, activeModal: modalId, modalData: data || null }),
  closeModal: () =>
    set({ isModalOpen: false, activeModal: null, modalData: null }),
}));
