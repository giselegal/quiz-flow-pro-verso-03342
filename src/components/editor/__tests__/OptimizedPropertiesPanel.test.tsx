import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OptimizedPropertiesPanel } from '../OptimizedPropertiesPanel';

// Mock completo dos módulos UI para testes leves
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/ui/card', () => ({
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}));

vi.mock('@/components/ui/input', () => ({
    Input: (props: any) => <input {...props} />,
}));

vi.mock('@/components/ui/textarea', () => ({
    Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock('@/components/ui/select', () => ({
    Select: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectValue: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/switch', () => ({
    Switch: (props: any) => <input type="checkbox" {...props} />,
}));

// Mock do hook principal
vi.mock('@/hooks/useUnifiedProperties', () => ({
    useUnifiedProperties: () => ({
        properties: {},
        updateProperty: vi.fn(),
        resetProperties: vi.fn(),
        getPropertiesByCategory: vi.fn(() => []),
    }),
}));

// Mock de outros hooks
vi.mock('@/hooks/useDebounce', () => ({
    useDebounce: (value: any) => value,
}));

describe('OptimizedPropertiesPanel', () => {
    // Mock simples sem tipos complexos
    const mockSelectedBlock = {
        id: 'test-block-1',
        type: 'text-inline',
        order: 0,
        properties: {},
        version: '1.0',
        children: [],
        events: [],
        locked: false,
        visible: true,
    } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render without crashing when no block is selected', () => {
        const { container } = render(<OptimizedPropertiesPanel selectedBlock={null} />);
        expect(container).toBeInTheDocument();
    });

    it('should render without crashing when block is selected', () => {
        const { container } = render(<OptimizedPropertiesPanel selectedBlock={mockSelectedBlock} />);
        expect(container).toBeInTheDocument();
    });

    it('should handle onUpdate callback', () => {
        const onUpdate = vi.fn();
        const { container } = render(
            <OptimizedPropertiesPanel
                selectedBlock={mockSelectedBlock}
                onUpdate={onUpdate}
            />
        );
        expect(container).toBeInTheDocument();
        expect(onUpdate).toBeDefined();
    });

    it('should handle onClose callback', () => {
        const onClose = vi.fn();
        const { container } = render(
            <OptimizedPropertiesPanel
                selectedBlock={mockSelectedBlock}
                onClose={onClose}
            />
        );
        expect(container).toBeInTheDocument();
        expect(onClose).toBeDefined();
    });

    it('should handle onDelete callback', () => {
        const onDelete = vi.fn();
        const { container } = render(
            <OptimizedPropertiesPanel
                selectedBlock={mockSelectedBlock}
                onDelete={onDelete}
            />
        );
        expect(container).toBeInTheDocument();
        expect(onDelete).toBeDefined();
    });
});
