import { describe, it, expect, vi, beforeEach } from 'vitest';
import StorageService from '../StorageService';

describe('StorageService debounced writes', () => {
  const svc = StorageService.getInstance();

  beforeEach(() => {
    // Clear all and use fake timers
    svc.browser.clear();
    vi.useFakeTimers();
  });

  it('should delay writes until debounce timer elapses', () => {
    const key = 'debounce_test_1';
    const waitMs = 200;

    const immediate = svc.browser.get<number>(key);
    expect(immediate.success).toBe(true);
    expect(immediate.data).toBeNull();

    const setRes = svc.browser.setDebounced<number>(key, 42, { waitMs });
    expect(setRes.success).toBe(true);

    // Before time, value should not be present
    let read = svc.browser.get<number>(key);
    expect(read.success).toBe(true);
    expect(read.data).toBeNull();

    // Advance just before threshold
    vi.advanceTimersByTime(waitMs - 1);
    read = svc.browser.get<number>(key);
    expect(read.data).toBeNull();

    // Cross threshold
    vi.advanceTimersByTime(1);
    read = svc.browser.get<number>(key);
    expect(read.data).toBe(42);
  });

  it('should reschedule on rapid successive updates and persist the last value', () => {
    const key = 'debounce_test_2';
    const waitMs = 150;

    svc.browser.setDebounced<number>(key, 1, { waitMs });
    vi.advanceTimersByTime(waitMs - 50);
    // Update before previous timer fires
    svc.browser.setDebounced<number>(key, 2, { waitMs });

    // Still not persisted
    let read = svc.browser.get<number>(key);
    expect(read.data).toBeNull();

    // Advance to just before new timer
    vi.advanceTimersByTime(waitMs - 1);
    read = svc.browser.get<number>(key);
    expect(read.data).toBeNull();

    // Cross threshold and verify last value persisted
    vi.advanceTimersByTime(1);
    read = svc.browser.get<number>(key);
    expect(read.data).toBe(2);
  });

  it('should flush debounced write immediately when requested', () => {
    const key = 'debounce_test_3';
    const waitMs = 300;

    svc.browser.setDebounced<string>(key, 'A', { waitMs });
    let read = svc.browser.get<string>(key);
    expect(read.data).toBeNull();

    const flush = svc.browser.flushDebounced(key);
    expect(flush.success).toBe(true);

    read = svc.browser.get<string>(key);
    expect(read.data).toBe('A');
  });
});
