/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';
import { setFeatureFlag, getFeatureFlag } from '@/core/utils/featureFlags';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useAutoSave', () => {
    beforeEach(() => {
        localStorageMock.clear();
        setFeatureFlag('usePersistenceService', true);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should save data with debounce', async () => {
        const testData = { foo: 'bar', timestamp: Date.now() };
        const onSave = vi.fn();

        const { result, rerender } = renderHook(
            ({ data }) => useAutoSave({
                key: 'test-key',
                data,
                debounceMs: 100,
                onSave,
            }),
            { initialProps: { data: testData } }
        );

        expect(result.current.isSaving).toBe(false);
        expect(result.current.lastSaved).toBeNull();

        // Trigger save by updating data
        const newData = { foo: 'baz', timestamp: Date.now() };
        rerender({ data: newData });

        // Wait for debounce
        await waitFor(() => {
            expect(result.current.isSaving).toBe(false);
        }, { timeout: 500 });

        // Check if data was saved
        await waitFor(() => {
            expect(result.current.lastSaved).not.toBeNull();
        }, { timeout: 500 });

        expect(onSave).toHaveBeenCalled();

        // Verify localStorage
        const stored = localStorage.getItem('test-key');
        expect(stored).not.toBeNull();

        if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.data).toBeDefined();
            const savedData = JSON.parse(parsed.data);
            expect(savedData.foo).toBe('baz');
        }
    });

    it('should force save immediately', async () => {
        const testData = { test: 'data' };
        const onSave = vi.fn();

        const { result } = renderHook(() => useAutoSave({
            key: 'force-save-test',
            data: testData,
            debounceMs: 5000, // Long debounce
            onSave,
        }));

        // Force save immediately
        await result.current.forceSave();

        expect(result.current.lastSaved).not.toBeNull();
        expect(onSave).toHaveBeenCalled();

        // Verify localStorage
        const stored = localStorage.getItem('force-save-test');
        expect(stored).not.toBeNull();
    });

    it('should recover data on mount', () => {
        const recoveryData = { recovered: 'data', id: 123 };

        // Pre-populate localStorage
        localStorage.setItem('recovery-test', JSON.stringify({
            data: JSON.stringify(recoveryData),
            timestamp: Date.now(),
            version: '1.0',
        }));

        const { result } = renderHook(() => useAutoSave({
            key: 'recovery-test',
            data: {},
            enableRecovery: true,
        }));

        expect(result.current.recoveredData).toEqual(recoveryData);
    });

    it('should not save when feature flag is disabled', async () => {
        setFeatureFlag('usePersistenceService', false);

        const testData = { foo: 'bar' };
        const onSave = vi.fn();

        const { result, rerender } = renderHook(
            ({ data }) => useAutoSave({
                key: 'disabled-test',
                data,
                debounceMs: 100,
                onSave,
            }),
            { initialProps: { data: testData } }
        );

        // Update data
        rerender({ data: { foo: 'baz' } });

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 200));

        // Should not have saved
        expect(result.current.lastSaved).toBeNull();
        expect(onSave).not.toHaveBeenCalled();

        const stored = localStorage.getItem('disabled-test');
        expect(stored).toBeNull();
    });

    it('should clear recovery data', () => {
        const recoveryData = { recovered: 'data' };

        // Pre-populate localStorage
        localStorage.setItem('clear-recovery-test', JSON.stringify({
            data: JSON.stringify(recoveryData),
            timestamp: Date.now(),
            version: '1.0',
        }));

        const { result } = renderHook(() => useAutoSave({
            key: 'clear-recovery-test',
            data: {},
            enableRecovery: true,
        }));

        expect(result.current.recoveredData).toEqual(recoveryData);

        // Clear recovery
        result.current.clearRecovery();

        expect(result.current.recoveredData).toBeNull();
    });

    it('should handle save errors gracefully', async () => {
        const testData = { foo: 'bar' };
        const onError = vi.fn();

        // Mock localStorage to throw error
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Storage full');
        });

        const { result, rerender } = renderHook(
            ({ data }) => useAutoSave({
                key: 'error-test',
                data,
                debounceMs: 100,
                onError,
            }),
            { initialProps: { data: testData } }
        );

        // Update data to trigger save
        rerender({ data: { foo: 'baz' } });

        // Wait for debounce and error
        await waitFor(() => {
            expect(result.current.error).not.toBeNull();
        }, { timeout: 500 });

        expect(onError).toHaveBeenCalled();
        expect(result.current.error?.message).toContain('Storage full');

        // Restore original implementation
        vi.restoreAllMocks();
    });

    it('should not recover data when enableRecovery is false', () => {
        const recoveryData = { recovered: 'data' };

        // Pre-populate localStorage
        localStorage.setItem('no-recovery-test', JSON.stringify({
            data: JSON.stringify(recoveryData),
            timestamp: Date.now(),
            version: '1.0',
        }));

        const { result } = renderHook(() => useAutoSave({
            key: 'no-recovery-test',
            data: {},
            enableRecovery: false,
        }));

        expect(result.current.recoveredData).toBeNull();
    });

    it('should save on mount when saveOnMount is true', async () => {
        const testData = { initial: 'data' };
        const onSave = vi.fn();

        renderHook(() => useAutoSave({
            key: 'save-on-mount-test',
            data: testData,
            saveOnMount: true,
            onSave,
            debounceMs: 100,
        }));

        // Wait for initial save
        await waitFor(() => {
            expect(onSave).toHaveBeenCalled();
        }, { timeout: 500 });

        const stored = localStorage.getItem('save-on-mount-test');
        expect(stored).not.toBeNull();
    });
});
