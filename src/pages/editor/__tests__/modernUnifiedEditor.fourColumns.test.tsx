import React from 'react';
import { render, screen } from '@testing-library/react';
import ModernUnifiedEditor from '../ModernUnifiedEditor';

// Utilitário simples para mockar lazy imports rapidinho
jest.mock('../modern/components/ModernToolbar', () => () => <div data-testid="toolbar">Toolbar</div>);
jest.mock('../modern/components/UnifiedEditorCanvas', () => () => <div data-testid="canvas">Canvas</div>);
jest.mock('../modern/components/EditorStatusBar', () => () => <div data-testid="statusbar">Status</div>);

// Mock do layout para inspecionar estrutura? Preferimos usar o real para garantir grid classes reais
// jest.mock('@/components/editor/layout/FourColumnEditorLayout', () => ({
//   __esModule: true,
//   default: ({ sidebar, palette, canvas, properties }: any) => (
//     <div data-testid="four-col-layout">
//       <div data-testid="col-sidebar">{sidebar}</div>
//       <div data-testid="col-palette">{palette}</div>
//       <div data-testid="col-canvas">{canvas}</div>
//       <div data-testid="col-properties">{properties}</div>
//     </div>
//   )
// }));

// Simplificar BlockPalette e StepSidebar / PropertiesPanel (evitar lógicas internas)
jest.mock('@/components/editor/palette/BlockPalette', () => ({ __esModule: true, default: (p: any) => <div data-testid="palette">Palette</div>, }));
jest.mock('@/components/editor/sidebars/StepSidebar', () => ({ __esModule: true, default: (p: any) => <div data-testid="sidebar">StepsSidebar cur={p.currentStep}</div>, }));
jest.mock('@/components/editor/properties/PropertiesPanel', () => ({ PropertiesPanel: (p: any) => <div data-testid="properties">Properties</div> }));

// Bridge quiz para não desviar para QuizEditorIntegratedPage durante este teste
jest.mock('../modern/hooks/useEditorRouteInfo', () => ({ __esModule: true, default: () => ({ type: 'generic', templateId: null, funnelId: null }) }));

// Evitar redirecionamento quiz-estilo
jest.mock('../../domain/quiz/quiz-estilo-ids', () => ({
  QUIZ_ESTILO_TEMPLATE_ID: 'quiz-estilo',
  canonicalizeQuizEstiloId: (id: string) => id,
  warnIfDeprecatedQuizEstilo: () => {}
}));

// Mock providers e hooks mais pesados
jest.mock('@/context/UnifiedCRUDProvider', () => ({
  UnifiedCRUDProvider: ({ children }: any) => <div data-testid="crud-provider">{children}</div>,
  useUnifiedCRUD: () => ({ currentFunnel: null })
}));
jest.mock('@/context/EditorRuntimeProviders', () => ({ __esModule: true, default: ({ children }: any) => <div data-testid="runtime-providers">{children}</div> }));
jest.mock('@/hooks', () => ({ useUnifiedEditor: () => ({ stepBlocks: [] }) }));

// Feature flags e core V2
jest.mock('@/utils/editorFeatureFlags', () => ({ isEditorCoreV2Enabled: () => false }));

// Execução

describe('ModernUnifiedEditor - Layout 4 colunas', () => {
  it('renderiza as quatro colunas (sidebar, palette, canvas, properties)', async () => {
    render(<ModernUnifiedEditor />);

    // Grid container
    const grid = document.querySelector('.grid-cols-[260px_240px_1fr_360px]');
    expect(grid).toBeTruthy();

    // Colunas por data-testid (vêm dos mocks ou do DOM real)
    expect(await screen.findByTestId('sidebar')).toBeInTheDocument();
    expect(await screen.findByTestId('palette')).toBeInTheDocument();
    expect(await screen.findByTestId('canvas')).toBeInTheDocument();
    expect(await screen.findByTestId('properties')).toBeInTheDocument();
  });
});
