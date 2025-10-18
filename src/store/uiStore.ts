/**
 * 🎯 UI STORE - Zustand Store para Estado de UI
 * 
 * Store para gerenciar estado de interface:
 * - Painéis (properties, library, layers)
 * - Modais e dialogs
 * - Notificações
 * - Loading states
 * 
 * Substitui: UIContext, useUI, hooks de UI fragmentados
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Modal {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface UIState {
  // Painéis
  isPropertiesPanelOpen: boolean;
  isLibraryOpen: boolean;
  isLayersOpen: boolean;
  isSettingsOpen: boolean;
  
  // Modais
  activeModals: Modal[];
  
  // Notificações
  notifications: Notification[];
  
  // Loading states
  isGlobalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Sidebar
  sidebarCollapsed: boolean;
  
  // Viewport
  isMobile: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

interface UIActions {
  // Painéis
  togglePropertiesPanel: () => void;
  setPropertiesPanelOpen: (isOpen: boolean) => void;
  toggleLibrary: () => void;
  setLibraryOpen: (isOpen: boolean) => void;
  toggleLayers: () => void;
  setLayersOpen: (isOpen: boolean) => void;
  toggleSettings: () => void;
  setSettingsOpen: (isOpen: boolean) => void;
  
  // Modais
  openModal: (type: string, props?: Record<string, any>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Notificações
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading
  setGlobalLoading: (isLoading: boolean) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Viewport
  setViewport: (width: number, height: number) => void;
  
  // Helpers
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
}

type UIStore = UIState & UIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: UIState = {
  isPropertiesPanelOpen: true,
  isLibraryOpen: false,
  isLayersOpen: false,
  isSettingsOpen: false,
  activeModals: [],
  notifications: [],
  isGlobalLoading: false,
  loadingStates: {},
  sidebarCollapsed: false,
  isMobile: false,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
};

// ============================================================================
// STORE
// ============================================================================

export const useUIStore = create<UIStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Painéis
      togglePropertiesPanel: () =>
        set((state) => {
          state.isPropertiesPanelOpen = !state.isPropertiesPanelOpen;
        }),

      setPropertiesPanelOpen: (isOpen) =>
        set((state) => {
          state.isPropertiesPanelOpen = isOpen;
        }),

      toggleLibrary: () =>
        set((state) => {
          state.isLibraryOpen = !state.isLibraryOpen;
        }),

      setLibraryOpen: (isOpen) =>
        set((state) => {
          state.isLibraryOpen = isOpen;
        }),

      toggleLayers: () =>
        set((state) => {
          state.isLayersOpen = !state.isLayersOpen;
        }),

      setLayersOpen: (isOpen) =>
        set((state) => {
          state.isLayersOpen = isOpen;
        }),

      toggleSettings: () =>
        set((state) => {
          state.isSettingsOpen = !state.isSettingsOpen;
        }),

      setSettingsOpen: (isOpen) =>
        set((state) => {
          state.isSettingsOpen = isOpen;
        }),

      // Modais
      openModal: (type, props = {}) => {
        const id = `modal-${Date.now()}`;
        
        set((state) => {
          state.activeModals.push({ id, type, props });
        });
        
        return id;
      },

      closeModal: (id) =>
        set((state) => {
          state.activeModals = state.activeModals.filter((m) => m.id !== id);
        }),

      closeAllModals: () =>
        set((state) => {
          state.activeModals = [];
        }),

      // Notificações
      showNotification: (notification) => {
        const id = `notification-${Date.now()}`;
        const duration = notification.duration ?? 5000;
        
        set((state) => {
          state.notifications.push({ ...notification, id });
        });
        
        // Auto-dismiss
        if (duration > 0) {
          setTimeout(() => {
            get().dismissNotification(id);
          }, duration);
        }
        
        return id;
      },

      dismissNotification: (id) =>
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        }),

      clearNotifications: () =>
        set((state) => {
          state.notifications = [];
        }),

      // Loading
      setGlobalLoading: (isLoading) =>
        set((state) => {
          state.isGlobalLoading = isLoading;
        }),

      setLoading: (key, isLoading) =>
        set((state) => {
          if (isLoading) {
            state.loadingStates[key] = true;
          } else {
            delete state.loadingStates[key];
          }
        }),

      isLoading: (key) => get().loadingStates[key] ?? false,

      // Sidebar
      toggleSidebar: () =>
        set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

      setSidebarCollapsed: (collapsed) =>
        set((state) => {
          state.sidebarCollapsed = collapsed;
        }),

      // Viewport
      setViewport: (width, height) =>
        set((state) => {
          state.viewportWidth = width;
          state.viewportHeight = height;
          state.isMobile = width < 768;
        }),

      // Helpers
      showSuccess: (title, message) =>
        get().showNotification({ type: 'success', title, message }),

      showError: (title, message) =>
        get().showNotification({ type: 'error', title, message, duration: 7000 }),

      showWarning: (title, message) =>
        get().showNotification({ type: 'warning', title, message }),

      showInfo: (title, message) =>
        get().showNotification({ type: 'info', title, message }),
    })),
    { name: 'UIStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const usePanels = () =>
  useUIStore((state) => ({
    isPropertiesPanelOpen: state.isPropertiesPanelOpen,
    isLibraryOpen: state.isLibraryOpen,
    isLayersOpen: state.isLayersOpen,
    isSettingsOpen: state.isSettingsOpen,
  }));

export const useNotifications = () => useUIStore((state) => state.notifications);

export const useActiveModals = () => useUIStore((state) => state.activeModals);

export const useViewport = () =>
  useUIStore((state) => ({
    width: state.viewportWidth,
    height: state.viewportHeight,
    isMobile: state.isMobile,
  }));
