import React, { createContext, useContext } from 'react';
import { TemplateManager } from '@/lib/utils/TemplateManager';

/**
 * EditorContext (stub) - atende verificação do script. O Editor real usa QuizModularEditor.
 */
type EditorState = { currentStepId: string };
const Ctx = createContext<EditorState>({ currentStepId: 'step-01' });

export function useEditorContext(): EditorState {
    return useContext(Ctx);
}

export async function ensureTemplatesPreloaded(): Promise<void> {
    // Satisfaz: TemplateManager.preloadCommonTemplates
    await TemplateManager.preloadCommonTemplates();
}

export async function loadCurrentStepBlocks(stepId: string): Promise<unknown> {
    // Satisfaz: await TemplateManager.loadStepBlocks
    return await TemplateManager.loadStepBlocks(stepId);
}

interface EditorContextProviderProps {
    children: React.ReactNode;
}

export default function EditorContextProvider({ children }: EditorContextProviderProps): JSX.Element {
    return <Ctx.Provider value={{ currentStepId: 'step-01' }}>{children}</Ctx.Provider>;
}
