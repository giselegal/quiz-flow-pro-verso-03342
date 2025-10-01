import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModernUnifiedEditor from '../ModernUnifiedEditor';

// Mocks básicos de dependências pesadas para focar CRUD
jest.mock('../modern/components/ModernToolbar', () => ({
  __esModule: true,
  default: ({ onSave, onCreateNew, onDuplicate, onTestCRUD }: any) => (
    <div>
      <button onClick={onSave} data-testid="btn-save">Save</button>
      <button onClick={onCreateNew} data-testid="btn-create">Create</button>
      <button onClick={onDuplicate} data-testid="btn-duplicate">Duplicate</button>
      <button onClick={onTestCRUD} data-testid="btn-testcrud">TestCRUD</button>
    </div>
  )
}));
jest.mock('../modern/components/UnifiedEditorCanvas', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../modern/components/EditorStatusBar', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('@/components/editor/palette/BlockPalette', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('@/components/editor/sidebars/StepSidebar', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('@/components/editor/properties/PropertiesPanel', () => ({ PropertiesPanel: () => <div /> }));
jest.mock('../modern/hooks/useEditorRouteInfo', () => ({ __esModule: true, default: () => ({ type: 'generic', templateId: null, funnelId: null }) }));
jest.mock('@/utils/editorFeatureFlags', () => ({ isEditorCoreV2Enabled: () => false }));
jest.mock('@/hooks', () => ({ useUnifiedEditor: () => ({ state: { stepBlocks: {} } }) }));
jest.mock('@/context/EditorRuntimeProviders', () => ({ __esModule: true, default: ({ children }: any) => <div>{children}</div> }));

// Mock UnifiedCRUDProvider para injetar operações
const saveFunnel = jest.fn().mockResolvedValue(undefined);
const createFunnel = jest.fn().mockResolvedValue({ id: 'new-1' });
const duplicateFunnel = jest.fn().mockResolvedValue({ id: 'dup-1' });

jest.mock('@/context/UnifiedCRUDProvider', () => ({
  UnifiedCRUDProvider: ({ children }: any) => <div>{children}</div>,
  useUnifiedCRUD: () => ({
    saveFunnel,
    createFunnel,
    duplicateFunnel,
    currentFunnel: { id: 'f-1' }
  })
}));

describe('ModernUnifiedEditor - CRUD básico', () => {
  beforeEach(() => {
    saveFunnel.mockClear();
    createFunnel.mockClear();
    duplicateFunnel.mockClear();
  });

  it('aciona salvar funil', async () => {
    render(<ModernUnifiedEditor funnelId="f-1" />);
    fireEvent.click(screen.getByTestId('btn-save'));
    expect(saveFunnel).toHaveBeenCalledTimes(1);
  });

  it('aciona criar novo funil', async () => {
    render(<ModernUnifiedEditor />);
    fireEvent.click(screen.getByTestId('btn-create'));
    expect(createFunnel).toHaveBeenCalledTimes(1);
  });

  it('aciona duplicar funil', async () => {
    render(<ModernUnifiedEditor funnelId="f-1" />);
    fireEvent.click(screen.getByTestId('btn-duplicate'));
    expect(duplicateFunnel).toHaveBeenCalledTimes(1);
  });
});
