import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PerformanceMonitor } from '@/components/editor/PerformanceMonitor';

describe('PerformanceMonitor - safe timing', () => {
    it('renders without throwing when navigation timing is absent', () => {
        // Ensure performance navigation data is not present
        const originalPerf = (global as any).performance;
        try {
            (global as any).performance = { getEntriesByType: () => [] } as any;
            render(<PerformanceMonitor />);
            // Compact view should render
            expect(screen.getByText(/Performance Monitor/)).toBeInTheDocument();
        } finally {
            (global as any).performance = originalPerf;
        }
    });
});
