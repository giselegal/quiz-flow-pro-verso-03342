import { describe, it, expect } from 'vitest';
import { computeVirtualWindow } from '@/utils/virtualization/computeVirtualWindow';

describe('computeVirtualWindow', () => {
  const base = {
    estimatedRowHeight: 100,
    overscan: 2,
    threshold: 5,
    disable: false,
  };

  it('desativa abaixo do threshold', () => {
    const res = computeVirtualWindow({
      items: [1,2,3,4,5],
      scrollTop: 0,
      viewportHeight: 400,
      ...base,
    });
    expect(res.enabled).toBe(false);
    expect(res.visible.length).toBe(5);
  });

  it('calcula janela básica', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const res = computeVirtualWindow({
      items,
      scrollTop: 600, // ~ item 6
      viewportHeight: 300,
      ...base,
    });
    expect(res.enabled).toBe(true);
    expect(res.visible.length).toBeGreaterThan(0);
    // topSpacer aproximado (startIndex*height)
    expect(res.topSpacer).toBeGreaterThan(0);
  });

  it('honra disable', () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const res = computeVirtualWindow({
      items,
      scrollTop: 0,
      viewportHeight: 200,
      ...base,
      disable: true,
    });
    expect(res.enabled).toBe(false);
    expect(res.visible.length).toBe(20);
  });
});
