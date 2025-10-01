import React from 'react';
import ModernUnifiedEditor from '../../ModernUnifiedEditor';
import { render } from '@testing-library/react';

// Permite configurar mocks dinâmicos antes de cada render
export interface MockConfig {
  quizBridge?: Partial<{ active: boolean; steps: any[]; answersCount: number }>;
  funnelSync?: Partial<{ active: boolean; funnelId?: string }>;
  crud?: Partial<{ saveFunnel: () => Promise<void>; createFunnel: (n: string, m?: any) => Promise<any>; duplicateFunnel: (id: string, n?: string) => Promise<any>; currentFunnel?: { id: string } | null }>;
  coreV2?: boolean;
  coreQuiz?: { steps: any[]; hash: string } | null;
}

// Módulos a serem jest.mock dinamicamente precisam ser mockados no escopo global do arquivo de teste.
// Aqui exportamos uma função de factory que presume que os mocks já foram configurados nos testes.

export function renderModernEditor(opts: { funnelId?: string; templateId?: string; mode?: any } = {}) {
  return render(<ModernUnifiedEditor {...opts} />);
}
