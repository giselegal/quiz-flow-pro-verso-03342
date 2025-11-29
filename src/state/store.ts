import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Auth Slice
export interface AuthState {
  userId?: string;
  token?: string;
  isAuthenticated: boolean;
  setAuth: (payload: { userId?: string; token?: string }) => void;
  logout: () => void;
}

const createAuthSlice = (set: any): AuthState => ({
  userId: undefined,
  token: undefined,
  isAuthenticated: false,
  setAuth: ({ userId, token }) => set((s: any) => ({
    auth: {
      ...s.auth,
      userId,
      token,
      isAuthenticated: Boolean(userId && token),
    },
  })),
  logout: () => set((s: any) => ({ auth: { ...s.auth, userId: undefined, token: undefined, isAuthenticated: false } })),
});

// UI Slice
export interface UIState {
  theme: 'light' | 'dark';
  panelOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  togglePanel: (open?: boolean) => void;
}

const createUISlice = (set: any): UIState => ({
  theme: 'light',
  panelOpen: false,
  setTheme: (theme) => set((s: any) => ({ ui: { ...s.ui, theme } })),
  togglePanel: (open) => set((s: any) => ({ ui: { ...s.ui, panelOpen: typeof open === 'boolean' ? open : !s.ui.panelOpen } })),
});

// Editor Slice
export interface EditorState {
  currentFile?: string;
  isDirty: boolean;
  setCurrentFile: (file?: string) => void;
  markDirty: (dirty: boolean) => void;
}

const createEditorSlice = (set: any): EditorState => ({
  currentFile: undefined,
  isDirty: false,
  setCurrentFile: (file) => set((s: any) => ({ editor: { ...s.editor, currentFile: file } })),
  markDirty: (dirty) => set((s: any) => ({ editor: { ...s.editor, isDirty: dirty } })),
});

// Quiz Slice
export interface QuizState {
  currentStep: number;
  selections: Record<string, string[]>;
  setStep: (step: number) => void;
  setSelections: (qId: string, options: string[]) => void;
  resetSelections: () => void;
}

const createQuizSlice = (set: any): QuizState => ({
  currentStep: 1,
  selections: {},
  setStep: (step) => set((s: any) => ({ quiz: { ...s.quiz, currentStep: step } })),
  setSelections: (qId, options) => set((s: any) => ({ quiz: { ...s.quiz, selections: { ...s.quiz.selections, [qId]: options } } })),
  resetSelections: () => set((s: any) => ({ quiz: { ...s.quiz, selections: {} } })),
});

export interface RootState {
  auth: AuthState;
  ui: UIState;
  editor: EditorState;
  quiz: QuizState;
}

export const useAppStore = create<RootState>()(devtools((set) => ({
  auth: createAuthSlice(set),
  ui: createUISlice(set),
  editor: createEditorSlice(set),
  quiz: createQuizSlice(set),
})));

// Selectors helpers for selective subscriptions
export const selectors = {
  isAuthenticated: (s: RootState) => s.auth.isAuthenticated,
  theme: (s: RootState) => s.ui.theme,
  panelOpen: (s: RootState) => s.ui.panelOpen,
  currentFile: (s: RootState) => s.editor.currentFile,
  currentStep: (s: RootState) => s.quiz.currentStep,
  selections: (s: RootState) => s.quiz.selections,
};
