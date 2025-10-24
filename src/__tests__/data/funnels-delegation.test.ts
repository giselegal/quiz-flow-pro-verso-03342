import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { funnelDataService } from '@/services/canonical/data/FunnelDataService';

describe('DataService → FunnelDataService delegation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delegates listFunnels', async () => {
    const fake = [{ id: 'f1', name: 'F1' } as any];
    const spy = vi.spyOn(funnelDataService, 'listFunnels').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.listFunnels({ search: 'F' }, { limit: 10 });
    expect(spy).toHaveBeenCalled();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.length).toBe(1);
  });

  it('delegates getFunnel', async () => {
    const fake = { id: 'f2', name: 'F2' } as any;
    const spy = vi.spyOn(funnelDataService, 'getFunnel').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.getFunnel('f2');
    expect(spy).toHaveBeenCalledWith('f2');
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.id).toBe('f2');
  });

  it('delegates createFunnel', async () => {
    const fake = { id: 'f3', name: 'F3' } as any;
    const spy = vi.spyOn(funnelDataService, 'createFunnel').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.createFunnel({ name: 'F3', context: 'quiz' as any });
    expect(spy).toHaveBeenCalled();
    expect(res.success).toBe(true);
  });

  it('delegates updateFunnel', async () => {
    const fake = { id: 'f4', name: 'F4 updated' } as any;
    const spy = vi.spyOn(funnelDataService, 'updateFunnel').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.updateFunnel('f4', { name: 'F4 updated' });
    expect(spy).toHaveBeenCalledWith('f4', { name: 'F4 updated' });
    expect(res.success).toBe(true);
  });

  it('delegates deleteFunnel', async () => {
    const spy = vi.spyOn(funnelDataService, 'deleteFunnel').mockResolvedValue({ success: true, data: undefined });
    const res = await dataService.deleteFunnel('f5');
    expect(spy).toHaveBeenCalledWith('f5');
    expect(res.success).toBe(true);
  });

  it('delegates duplicateFunnel', async () => {
    const fake = { id: 'f6', name: 'Copy' } as any;
    const spy = vi.spyOn(funnelDataService, 'duplicateFunnel').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.duplicateFunnel('f6', 'Copy');
    expect(spy).toHaveBeenCalledWith('f6', 'Copy');
    expect(res.success).toBe(true);
  });

  it('publish/unpublish funnel delegates via updateFunnel', async () => {
    const spy = vi.spyOn(funnelDataService, 'updateFunnel').mockResolvedValue({ success: true, data: { id: 'f7' } as any });
    const r1 = await dataService.publishFunnel('f7');
    const r2 = await dataService.unpublishFunnel('f7');
    expect(spy).toHaveBeenCalledWith('f7', { isPublished: true });
    expect(spy).toHaveBeenCalledWith('f7', { isPublished: false });
    expect(r1.success && r2.success).toBe(true);
  });
});
