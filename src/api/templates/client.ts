import { TemplateListItem, TemplateDraft, ValidationReport, BranchingRule, Outcome, ScoringConfig } from './types';

const BASE = '/api/templates';

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  if (!res.ok) {
    let detail: any = undefined;
    try { detail = await res.json(); } catch {}
    throw new Error(detail?.error || `Request failed ${res.status}`);
  }
  return res.json();
}

export const templatesApi = {
  async list(): Promise<TemplateListItem[]> { return http(`${BASE}`); },
  async create(name: string, slug: string) { return http<{ id: string; slug: string }>(`${BASE}`, { method: 'POST', body: JSON.stringify({ name, slug }) }); },
  async get(id: string): Promise<TemplateDraft> { return http(`${BASE}/${id}`); },
  async updateMeta(id: string, patch: Partial<TemplateDraft['meta']>) { return http(`${BASE}/${id}/meta`, { method: 'PATCH', body: JSON.stringify(patch) }); },
  async addStage(id: string, params: { type: string; afterStageId?: string; label?: string }) { return http(`${BASE}/${id}/stages`, { method: 'POST', body: JSON.stringify(params) }); },
  async reorderStages(id: string, orderedIds: string[]) { return http(`${BASE}/${id}/stages/reorder`, { method: 'POST', body: JSON.stringify({ orderedIds }) }); },
  async updateStage(id: string, stageId: string, patch: any) { return http(`${BASE}/${id}/stages/${stageId}`, { method: 'PATCH', body: JSON.stringify(patch) }); },
  async removeStage(id: string, stageId: string) { return http(`${BASE}/${id}/stages/${stageId}`, { method: 'DELETE' }); },
  async setOutcomes(id: string, outcomes: Outcome[]) { return http(`${BASE}/${id}/outcomes`, { method: 'PUT', body: JSON.stringify({ outcomes }) }); },
  async setScoring(id: string, scoring: Partial<ScoringConfig>) { return http(`${BASE}/${id}/scoring`, { method: 'PATCH', body: JSON.stringify(scoring) }); },
  async setBranching(id: string, rules: BranchingRule[]) { return http(`${BASE}/${id}/branching`, { method: 'PUT', body: JSON.stringify({ rules }) }); },
  async validate(id: string): Promise<ValidationReport> { return http(`${BASE}/${id}/validate`, { method: 'POST' }); },
  async publish(id: string) { return http(`${BASE}/${id}/publish`, { method: 'POST' }); },
  async startPreview(id: string) { return http(`${BASE}/${id}/runtime/preview/start`, { method: 'POST' }); }
};
