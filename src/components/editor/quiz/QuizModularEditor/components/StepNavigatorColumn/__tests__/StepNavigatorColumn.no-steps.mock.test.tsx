import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import StepNavigatorColumn from '../index';

// Mock templateService to not have steps.list
import * as templateModule from '@/services/canonical/TemplateService';

describe('StepNavigatorColumn - missing steps.list', () => {
    it('does not throw when templateService.steps.list is missing', () => {
        const original = (templateModule as any).templateService;
        try {
            // Provide a templateService without steps.list
            (templateModule as any).templateService = {
                steps: undefined,
            } as any;

            render(<StepNavigatorColumn onSelectStep={() => { }} />);

            // Expect the column to render (either empty state or UI header)
            expect(screen.getByText(/Navegação|Nenhuma etapa carregada/i)).toBeTruthy();
        } finally {
            (templateModule as any).templateService = original;
        }
    });
});
