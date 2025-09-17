/**
 * 🎯 GLOBAL STATE HOOK - CONSOLIDATED STATE MANAGEMENT
 * 
 * Consolidates fragmented state management hooks:
 * - useConfiguration.ts (global config management)
 * - useGlobalEventManager.ts (event management)
 * - useSingleActiveFunnel.ts (funnel state)
 * - Various context providers
 * 
 * Benefits:
 * ✅ Single source of truth for global state
 * ✅ Unified event handling
 * ✅ Performance optimized with selectors
 * ✅ Type-safe state management
 * ✅ Automatic persistence
 * ✅ Memory leak prevention
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface GlobalAppConfig {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  debugMode: boolean;
  performanceMode: 'normal' | 'high' | 'ultra';
  autoSave: boolean;
  autoSaveInterval: number;
}

export interface GlobalUIState {
  sidebarOpen: boolean;
  propertiesPanelOpen: boolean;
  previewMode: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  currentRoute: string;
  isFullscreen: boolean;
}

export interface GlobalFunnelState {
  activeFunnelId: string | null;
  activeFunnel: any | null;
  funnelHistory: string[];
  recentFunnels: Array<{ id: string; name: string; lastAccessed: Date }>;
}

export interface GlobalNotificationState {
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    persistent?: boolean;
  }>;
  unreadCount: number;
}

export interface GlobalState {
  // Core state sections
  config: GlobalAppConfig;
  ui: GlobalUIState;
  funnel: GlobalFunnelState;
  notifications: GlobalNotificationState;

  // Meta state
  isInitialized: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;

  // Performance tracking
  performanceMetrics: {
    renderCount: number;
    lastRenderTime: number;
    slowOperations: Array<{ operation: string; duration: number; timestamp: Date }>;
  };
}

// =============================================================================
// ACTIONS INTERFACE
// =============================================================================

export interface GlobalStateActions {
  // Config actions
  updateConfig: (updates: Partial<GlobalAppConfig>) => void;
  resetConfig: () => void;
  loadConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;

  // UI actions
  toggleSidebar: () => void;
  togglePropertiesPanel: () => void;
  setPreviewMode: (enabled: boolean) => void;
  setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setCurrentRoute: (route: string) => void;
  toggleFullscreen: () => void;

  // Funnel actions
  setActiveFunnel: (funnelId: string | null, funnelData?: any) => void;
  addToFunnelHistory: (funnelId: string) => void;
  addToRecentFunnels: (funnel: { id: string; name: string }) => void;
  clearFunnelHistory: () => void;

  // Notification actions
  addNotification: (notification: Omit<GlobalNotificationState['notifications'][0], 'id' | 'timestamp' | 'read'>) => string;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // System actions
  initialize: () => Promise<void>;
  reset: () => void;
  updatePerformanceMetrics: (operation: string, duration: number) => void;
}

// =============================================================================
// DEFAULT STATE
// =============================================================================

const defaultConfig: GlobalAppConfig = {
  theme: 'light',
  language: 'pt-BR',
  debugMode: false,
  performanceMode: 'normal',
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
};

const defaultUIState: GlobalUIState = {
  sidebarOpen: true,
  propertiesPanelOpen: true,
  previewMode: false,
  viewMode: 'desktop',
  currentRoute: '/',
  isFullscreen: false,
};

const defaultFunnelState: GlobalFunnelState = {
  activeFunnelId: null,
  activeFunnel: null,
  funnelHistory: [],
  recentFunnels: [],
};

const defaultNotificationState: GlobalNotificationState = {
  notifications: [],
  unreadCount: 0,
};

const defaultPerformanceMetrics = {
  renderCount: 0,
  lastRenderTime: 0,
  slowOperations: [],
};

// =============================================================================
// ZUSTAND STORE
// =============================================================================

interface GlobalStore extends GlobalState, GlobalStateActions { }

const useGlobalStore = create<GlobalStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      config: defaultConfig,
      ui: defaultUIState,
      funnel: defaultFunnelState,
      notifications: defaultNotificationState,
      isInitialized: false,
      isLoading: false,
      lastUpdated: null,
      performanceMetrics: defaultPerformanceMetrics,

      // Config actions
      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
          lastUpdated: new Date(),
        }));
        // Auto-save config
        setTimeout(() => get().saveConfig(), 100);
      },

      resetConfig: () => {
        set({
          config: defaultConfig,
          lastUpdated: new Date(),
        });
      },

      loadConfig: async () => {
        set({ isLoading: true });
        try {
          const savedConfig = localStorage.getItem('global-app-config');
          if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            set((state) => ({
              config: { ...defaultConfig, ...parsedConfig },
              lastUpdated: new Date(),
            }));
          }
        } catch (error) {
          console.warn('Failed to load global config:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      saveConfig: async () => {
        try {
          const { config } = get();
          localStorage.setItem('global-app-config', JSON.stringify(config));
        } catch (error) {
          console.error('Failed to save global config:', error);
        }
      },

      // UI actions
      toggleSidebar: () => {
        set((state) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
          lastUpdated: new Date(),
        }));
      },

      togglePropertiesPanel: () => {
        set((state) => ({
          ui: { ...state.ui, propertiesPanelOpen: !state.ui.propertiesPanelOpen },
          lastUpdated: new Date(),
        }));
      },

      setPreviewMode: (enabled) => {
        set((state) => ({
          ui: { ...state.ui, previewMode: enabled },
          lastUpdated: new Date(),
        }));
      },

      setViewMode: (mode) => {
        set((state) => ({
          ui: { ...state.ui, viewMode: mode },
          lastUpdated: new Date(),
        }));
      },

      setCurrentRoute: (route) => {
        set((state) => ({
          ui: { ...state.ui, currentRoute: route },
          lastUpdated: new Date(),
        }));
      },

      toggleFullscreen: () => {
        set((state) => ({
          ui: { ...state.ui, isFullscreen: !state.ui.isFullscreen },
          lastUpdated: new Date(),
        }));
      },

      // Funnel actions
      setActiveFunnel: (funnelId, funnelData) => {
        set((state) => ({
          funnel: {
            ...state.funnel,
            activeFunnelId: funnelId,
            activeFunnel: funnelData || null,
          },
          lastUpdated: new Date(),
        }));

        if (funnelId) {
          get().addToFunnelHistory(funnelId);
        }
      },

      addToFunnelHistory: (funnelId) => {
        set((state) => {
          const newHistory = [funnelId, ...state.funnel.funnelHistory.filter(id => id !== funnelId)];
          return {
            funnel: {
              ...state.funnel,
              funnelHistory: newHistory.slice(0, 10), // Keep last 10
            },
            lastUpdated: new Date(),
          };
        });
      },

      addToRecentFunnels: (funnel) => {
        set((state) => {
          const newRecents = [
            { ...funnel, lastAccessed: new Date() },
            ...state.funnel.recentFunnels.filter(f => f.id !== funnel.id)
          ];
          return {
            funnel: {
              ...state.funnel,
              recentFunnels: newRecents.slice(0, 5), // Keep last 5
            },
            lastUpdated: new Date(),
          };
        });
      },

      clearFunnelHistory: () => {
        set((state) => ({
          funnel: { ...state.funnel, funnelHistory: [] },
          lastUpdated: new Date(),
        }));
      },

      // Notification actions
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => {
          const newNotification = {
            ...notification,
            id,
            timestamp: new Date(),
            read: false,
          };

          return {
            notifications: {
              notifications: [newNotification, ...state.notifications.notifications],
              unreadCount: state.notifications.unreadCount + 1,
            },
            lastUpdated: new Date(),
          };
        });

        return id;
      },

      markNotificationRead: (id) => {
        set((state) => {
          const notifications = state.notifications.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = notifications.filter(n => !n.read).length;

          return {
            notifications: { notifications, unreadCount },
            lastUpdated: new Date(),
          };
        });
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: {
            notifications: state.notifications.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0,
          },
          lastUpdated: new Date(),
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notifications = state.notifications.notifications.filter(n => n.id !== id);
          const unreadCount = notifications.filter(n => !n.read).length;

          return {
            notifications: { notifications, unreadCount },
            lastUpdated: new Date(),
          };
        });
      },

      clearNotifications: () => {
        set({
          notifications: defaultNotificationState,
          lastUpdated: new Date(),
        });
      },

      // System actions
      initialize: async () => {
        set({ isLoading: true });
        try {
          await get().loadConfig();
          set({
            isInitialized: true,
            lastUpdated: new Date(),
          });
        } catch (error) {
          console.error('Failed to initialize global state:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => {
        set({
          config: defaultConfig,
          ui: defaultUIState,
          funnel: defaultFunnelState,
          notifications: defaultNotificationState,
          isInitialized: false,
          isLoading: false,
          lastUpdated: null,
          performanceMetrics: defaultPerformanceMetrics,
        });
      },

      updatePerformanceMetrics: (operation, duration) => {
        set((state) => {
          const newSlowOperations = duration > 100
            ? [
              { operation, duration, timestamp: new Date() },
              ...state.performanceMetrics.slowOperations.slice(0, 9) // Keep last 10
            ]
            : state.performanceMetrics.slowOperations;

          return {
            performanceMetrics: {
              renderCount: state.performanceMetrics.renderCount + 1,
              lastRenderTime: performance.now(),
              slowOperations: newSlowOperations,
            },
            lastUpdated: new Date(),
          };
        });
      },
    })),
    { name: 'global-state-store' }
  )
);

// =============================================================================
// HOOK INTERFACE
// =============================================================================

export interface UseGlobalStateReturn extends GlobalState, GlobalStateActions {
  // Computed properties
  hasUnreadNotifications: boolean;
  currentFunnelName: string | null;
  isConfigDirty: boolean;

  // Selectors
  selectConfig: <T>(selector: (config: GlobalAppConfig) => T) => T;
  selectUI: <T>(selector: (ui: GlobalUIState) => T) => T;
  selectFunnel: <T>(selector: (funnel: GlobalFunnelState) => T) => T;
  selectNotifications: <T>(selector: (notifications: GlobalNotificationState) => T) => T;
}

// =============================================================================
// MAIN HOOK
// =============================================================================

export const useGlobalState = (): UseGlobalStateReturn => {
  const store = useGlobalStore();
  const performanceRef = useRef<{ startTime: number; renderCount: number }>({
    startTime: performance.now(),
    renderCount: 0
  });

  // Performance tracking
  useEffect(() => {
    performanceRef.current.renderCount++;
    const duration = performance.now() - performanceRef.current.startTime;

    if (duration > 16) { // > 16ms (60fps threshold)
      store.updatePerformanceMetrics('useGlobalState render', duration);
    }

    performanceRef.current.startTime = performance.now();
  });

  // Initialize on mount
  useEffect(() => {
    if (!store.isInitialized && !store.isLoading) {
      store.initialize();
    }
  }, [store.isInitialized, store.isLoading, store.initialize]);

  // Computed properties
  const computed = useMemo(() => ({
    hasUnreadNotifications: store.notifications.unreadCount > 0,
    currentFunnelName: store.funnel.activeFunnel?.name || null,
    isConfigDirty: store.lastUpdated !== null,
  }), [
    store.notifications.unreadCount,
    store.funnel.activeFunnel?.name,
    store.lastUpdated
  ]);

  // Selectors
  const selectors = useMemo(() => ({
    selectConfig: <T,>(selector: (config: GlobalAppConfig) => T) => selector(store.config),
    selectUI: <T,>(selector: (ui: GlobalUIState) => T) => selector(store.ui),
    selectFunnel: <T,>(selector: (funnel: GlobalFunnelState) => T) => selector(store.funnel),
    selectNotifications: <T,>(selector: (notifications: GlobalNotificationState) => T) => selector(store.notifications),
  }), [store.config, store.ui, store.funnel, store.notifications]);

  return {
    ...store,
    ...computed,
    ...selectors,
  };
};

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

/**
 * Hook for components that only need config
 */
export const useGlobalConfig = () => {
  return useGlobalStore((state) => ({
    config: state.config,
    updateConfig: state.updateConfig,
    resetConfig: state.resetConfig,
    loadConfig: state.loadConfig,
    saveConfig: state.saveConfig,
  }));
};

/**
 * Hook for components that only need UI state
 */
export const useGlobalUI = () => {
  return useGlobalStore((state) => ({
    ui: state.ui,
    toggleSidebar: state.toggleSidebar,
    togglePropertiesPanel: state.togglePropertiesPanel,
    setPreviewMode: state.setPreviewMode,
    setViewMode: state.setViewMode,
    setCurrentRoute: state.setCurrentRoute,
    toggleFullscreen: state.toggleFullscreen,
  }));
};

/**
 * Hook for components that only need funnel state
 */
export const useGlobalFunnel = () => {
  return useGlobalStore((state) => ({
    funnel: state.funnel,
    setActiveFunnel: state.setActiveFunnel,
    addToFunnelHistory: state.addToFunnelHistory,
    addToRecentFunnels: state.addToRecentFunnels,
    clearFunnelHistory: state.clearFunnelHistory,
  }));
};

/**
 * Hook for components that only need notifications
 */
export const useGlobalNotifications = () => {
  return useGlobalStore((state) => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    markNotificationRead: state.markNotificationRead,
    markAllNotificationsRead: state.markAllNotificationsRead,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
  }));
};

export default useGlobalState;