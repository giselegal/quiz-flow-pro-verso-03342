import { describe, it, expect } from 'vitest';
import { cacheService } from '@/services/canonical/CacheService';
import type { ServiceResult } from '@/services/canonical/types';

// Esses testes cobrem: get/set/invalidate/ttl e evitam cachear arrays vazios/nulos

describe('CacheService (canonical facade)', () => {
  function assertSuccess<T>(res: ServiceResult<T>): asserts res is { success: true; data: T } {
    expect(res.success).toBe(true);
  }

  it('set/get básicos funcionam (generic store)', () => {
    const key = 'test:basic';
    cacheService.delete(key); // limpeza preventiva
    const before = cacheService.get<string>(key);
    assertSuccess(before);
    expect(before.data).toBeNull();

    cacheService.set(key, 'value');
    const after = cacheService.get<string>(key);
    assertSuccess(after);
    expect(after.data).toBe('value');
  });

  it('não cacheia valores nulos/undefined', () => {
    const keyNull = 'test:null';
    cacheService.set(keyNull, null);
    const gotNull = cacheService.get<string>(keyNull);
    assertSuccess(gotNull);
    expect(gotNull.data).toBeNull();

    const keyUndef = 'test:undef';
    cacheService.set(keyUndef, undefined);
    const gotUndef = cacheService.get<string>(keyUndef);
    assertSuccess(gotUndef);
    expect(gotUndef.data).toBeNull();
  });

  it('não cacheia arrays vazios', () => {
    const key = 'test:empty-array';
    cacheService.set(key, [] as any[]);
    const got = cacheService.get<any[]>(key);
    assertSuccess(got);
    expect(got.data).toBeNull();
  });

  it('invalidate(key) remove a entrada', () => {
    const key = 'test:invalidate';
    cacheService.set(key, { x: 1 });
    let got = cacheService.get<{ x: number }>(key);
    assertSuccess(got);
    expect(got.data).toEqual({ x: 1 });

    const deleted = cacheService.invalidate(key);
    assertSuccess(deleted);
    expect(deleted.data).toBe(true);

    got = cacheService.get<{ x: number }>(key);
    assertSuccess(got);
    expect(got.data).toBeNull();
  });

  it('TTL expira a entrada após o tempo definido', async () => {
    const key = 'test:ttl';
    cacheService.set(key, 'temp', { ttl: 50 }); // 50ms
    const immediate = cacheService.get<string>(key);
    assertSuccess(immediate);
    expect(immediate.data).toBe('temp');

    await new Promise((r) => setTimeout(r, 70));
    const expired = cacheService.get<string>(key);
    assertSuccess(expired);
    expect(expired.data).toBeNull();
  });
});
