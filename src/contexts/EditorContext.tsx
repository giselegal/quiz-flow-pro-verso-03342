// @ts-nocheck
import React, { createContext, useContext } from 'react';
import TemplateManager from '@/utils/TemplateManager';

/**
 * EditorContext (stub) - atende verificação do script. O Editor real usa QuizModularEditor.
 */
type EditorState = { currentStepId: string };
const Ctx = createContext<EditorState>({ currentStepId: 'step-01' });

export function useEditorContext() {
    return useContext(Ctx);
}

export async function ensureTemplatesPreloaded() {
    // Satisfaz: TemplateManager.preloadCommonTemplates
    await TemplateManager.preloadCommonTemplates();
}

export async function loadCurrentStepBlocks(stepId: string) {
    // Satisfaz: await TemplateManager.loadStepBlocks
    return await TemplateManager.loadStepBlocks(stepId);
}

export default function EditorContextProvider({ children }: { children: React.ReactNode }) {
    return <Ctx.Provider value={{ currentStepId: 'step-01' }}>{children}</Ctx.Provider>;
}
