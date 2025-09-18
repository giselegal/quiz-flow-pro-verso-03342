import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useEditorDragAndDrop } from '@/hooks/editor/useEditorDragAndDrop';

// Mocks
vi.mock('@/utils/editorUtils', () => ({
    createBlockFromComponent: (type: string) => ({ id: 'mocked-id', type, properties: {} }),
    devLog: vi.fn(),
}));

vi.mock('@/utils/debugLogger', () => ({
    logger: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

function HookHarness(props: any) {
    const hook = useEditorDragAndDrop(props);
    // expõe no window para facilitar acesso nos testes
    (window as any).__dndHook = hook;
    return null;
}

const makeActive = (data: any) => ({ id: data.blockId || data.blockType || 'active-id', data: { current: data } });
const makeOver = (id: string, data?: any) => ({ id, data: { current: data ?? {} } });

describe('useEditorDragAndDrop', () => {
    it('avisa quando drop sem alvo', () => {
        const actions = { addBlock: vi.fn(), reorderBlocks: vi.fn(), setSelectedBlockId: vi.fn() };
        const notification = { success: vi.fn(), info: vi.fn(), warning: vi.fn(), error: vi.fn() };

        render(
            <HookHarness
                currentStepData={[{ id: 'block-A', type: 'Text', properties: {} } as any]}
                currentStepKey="step-1"
                actions={actions}
                notification={notification}
            />
        );

        const { handleDragEnd } = (window as any).__dndHook;
        // over null
        handleDragEnd({ active: makeActive({ type: 'sidebar-component', blockType: 'Heading' }), over: null } as any);
        expect(notification.warning).toHaveBeenCalled();
        expect(actions.addBlock).not.toHaveBeenCalled();
        expect(actions.reorderBlocks).not.toHaveBeenCalled();
    });

    it('adiciona componente quando arrastado da sidebar para canvas', () => {
        const actions = { addBlock: vi.fn(), reorderBlocks: vi.fn(), setSelectedBlockId: vi.fn() };
        const notification = { success: vi.fn(), info: vi.fn(), warning: vi.fn(), error: vi.fn() };

        render(
            <HookHarness
                currentStepData={[]}
                currentStepKey="step-1"
                actions={actions}
                notification={notification}
            />
        );

        const { handleDragEnd } = (window as any).__dndHook;
        const active = makeActive({ type: 'sidebar-component', blockType: 'Heading' });
        const over = makeOver('canvas-drop-zone', { type: 'dropzone' });
        handleDragEnd({ active, over } as any);

        expect(actions.addBlock).toHaveBeenCalledTimes(1);
        expect(notification.success).toHaveBeenCalled();
    });

    it('reordena quando arrastado entre blocos do canvas', () => {
        const actions = { addBlock: vi.fn(), reorderBlocks: vi.fn(), setSelectedBlockId: vi.fn() };
        const notification = { success: vi.fn(), info: vi.fn(), warning: vi.fn(), error: vi.fn() };
        const blocks = [
            { id: 'block-A', type: 'Text', properties: {} },
            { id: 'block-B', type: 'Text', properties: {} },
        ] as any[];

        render(
            <HookHarness
                currentStepData={blocks}
                currentStepKey="step-1"
                actions={actions}
                notification={notification}
            />
        );

        const { handleDragEnd } = (window as any).__dndHook;
        const active = { id: 'block-A', data: { current: { type: 'canvas-block', blockId: 'block-A' } } };
        const over = makeOver('block-B');
        handleDragEnd({ active, over } as any);

        expect(actions.reorderBlocks).toHaveBeenCalledWith('step-1', 0, 1);
        expect(notification.info).toHaveBeenCalled();
    });
});
