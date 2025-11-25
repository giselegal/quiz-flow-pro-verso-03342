import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import SinglePropertiesPanel from '../SinglePropertiesPanel';

// Tests the component doesn't throw when appLogger is partially mocked
describe('SinglePropertiesPanel - logger fallback', () => {
    it('renders without throwing when appLogger is missing debug', () => {
        // Provide a minimal props shape expected by the panel
        const props: any = {
            selectedBlock: {
                id: 'block-1',
                type: 'TextBlock',
                props: { text: 'Hello' },
            },
            blocks: [
                {
                    id: 'block-1',
                    type: 'TextBlock',
                    props: { text: 'Hello' },
                },
            ],
            onSave: () => Promise.resolve({ success: true }),
            onRemoveBlock: () => { },
            onUpdateBlock: () => { },
            isSaving: false,
        };

        // Simulate environment where global logger is partially mocked
        const originalLogger = (global as any).appLogger;
        try {
            (global as any).appLogger = { info: () => { } } as any;
            render(<SinglePropertiesPanel {...props} />);
            // Expect panel to render content related to the block
            expect(screen.getByText(/Hello/)).toBeInTheDocument();
        } finally {
            (global as any).appLogger = originalLogger;
        }
    });
});
