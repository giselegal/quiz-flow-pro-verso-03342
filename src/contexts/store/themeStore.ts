/**
 * 🎨 THEME STORE - Zustand Store para Tema
 * 
 * Gerencia estado de tema da aplicação:
 * - Dark/Light mode
 * - Preferências do usuário
 * - Persistência de configurações
 * 
 * Substitui: ThemeProvider, ThemeContext, useTheme hooks fragmentados
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// TYPES
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  systemPreference: 'light' | 'dark';
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSystemPreference: (preference: 'light' | 'dark') => void;
}

type ThemeStore = ThemeState & ThemeActions;

// ============================================================================
// HELPERS
// ============================================================================

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme, systemPreference: 'light' | 'dark'): 'light' | 'dark' {
  if (theme === 'system') return systemPreference;
  return theme;
}

function applyThemeToDOM(resolvedTheme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const systemPref = getSystemPreference();

const initialState: ThemeState = {
  theme: 'system',
  resolvedTheme: systemPref,
  systemPreference: systemPref,
};

// ============================================================================
// STORE
// ============================================================================

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
            state.resolvedTheme = resolveTheme(theme, state.systemPreference);
            applyThemeToDOM(state.resolvedTheme);
          }),

        toggleTheme: () =>
          set((state) => {
            // Cycle: light → dark → system → light
            const cycle: Theme[] = ['light', 'dark', 'system'];
            const currentIndex = cycle.indexOf(state.theme);
            const nextTheme = cycle[(currentIndex + 1) % cycle.length];
            
            state.theme = nextTheme;
            state.resolvedTheme = resolveTheme(nextTheme, state.systemPreference);
            applyThemeToDOM(state.resolvedTheme);
          }),

        setSystemPreference: (preference) =>
          set((state) => {
            state.systemPreference = preference;
            if (state.theme === 'system') {
              state.resolvedTheme = preference;
              applyThemeToDOM(state.resolvedTheme);
            }
          }),
      })),
      {
        name: 'theme-storage',
        partialize: (state) => ({
          theme: state.theme,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Apply theme on rehydration
            const resolved = resolveTheme(state.theme, getSystemPreference());
            applyThemeToDOM(resolved);
          }
        },
      },
    ),
    { name: 'ThemeStore' },
  ),
);

// ============================================================================
// INITIALIZATION: Listen for system preference changes
// ============================================================================

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    const preference = e.matches ? 'dark' : 'light';
    useThemeStore.getState().setSystemPreference(preference);
  });
  
  // Apply initial theme on load
  const state = useThemeStore.getState();
  applyThemeToDOM(state.resolvedTheme);
}

// ============================================================================
// SELECTORS
// ============================================================================

export const useTheme = () => useThemeStore((state) => state.theme);

export const useResolvedTheme = () => useThemeStore((state) => state.resolvedTheme);

export const useIsDarkMode = () => useThemeStore((state) => state.resolvedTheme === 'dark');

export const useThemeActions = () =>
  useThemeStore((state) => ({
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));
