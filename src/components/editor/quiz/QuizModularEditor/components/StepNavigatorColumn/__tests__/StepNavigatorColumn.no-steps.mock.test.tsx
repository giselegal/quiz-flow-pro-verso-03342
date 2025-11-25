import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock the templateService module before importing the component so the import path
// resolves to a mocked service without `steps.list`.
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: undefined,
    },
}));

import StepNavigatorColumn from '../index';

describe('StepNavigatorColumn - missing steps.list', () => {
    it('does not throw when templateService.steps.list is missing', () => {
        render(<StepNavigatorColumn onSelectStep={() => { }} />);
        // Expect the column header and the empty-state message to be present
        expect(screen.getByText('Navegação')).toBeInTheDocument();
        expect(screen.getByText(/Nenhuma etapa carregada/i)).toBeInTheDocument();
    });
});
