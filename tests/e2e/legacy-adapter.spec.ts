import { test, expect, APIRequestContext } from '@playwright/test';
import { startTestServer, stopTestServer } from './testServer';
import { promises as fs } from 'fs';
import path from 'path';

// E2E focado apenas nos endpoints do adapter (API-level). Usa request context Playwright.
// Pré-condição: servidor backend deve estar rodando (npm run dev:server ou dev:full) e flag USE_QUIZ_STYLE_ADAPTER != 'false'

const SLUG = 'quiz-style-test';

async function getDraft(api: APIRequestContext, baseURL: string) {
    const resp = await api.get(`${baseURL}/api/quiz-style/${SLUG}/as-draft`);
    expect(resp.status(), 'GET as-draft status').toBe(200);
    return await resp.json();
}

async function getMetrics(api: APIRequestContext, baseURL: string) {
    const resp = await api.get(`${baseURL}/api/quiz-style/_internal/metrics`);
    expect(resp.status(), 'GET metrics status').toBe(200);
    return await resp.json();
}

test.describe('Legacy Adapter Round Trip', () => {
    test('carrega draft, aplica delta e reflete métricas', async ({ request }) => {
        const { server, url } = await startTestServer();
        try {
            const beforeMetrics = await getMetrics(request, url).catch(() => null);

            const draft1 = await getDraft(request, url);
            expect(draft1).toHaveProperty('meta');
            expect(draft1).toHaveProperty('stages');
            expect(Array.isArray(draft1.stages)).toBe(true);
            expect(draft1.stages.length).toBeGreaterThan(0);

            const originalFirstName = draft1.meta.name;
            const newName = originalFirstName + ' (Edited)';

            // Reorder (se houver ao menos 2 stages, troca as duas primeiras)
            // Monta uma reorder baseada no slug legacy (stage.meta.stageSlug) porque stage ids mudam a cada conversão
            const legacySlugs: string[] = draft1.stages.map((s: any) => s.meta?.stageSlug).filter(Boolean);
            let swapped = false;
            if (legacySlugs.length >= 2) {
                const tmp = legacySlugs[0];
                legacySlugs[0] = legacySlugs[1];
                legacySlugs[1] = tmp;
                swapped = true;
            }

            const deltaPayload: any = { meta: { name: newName } };
            if (swapped) {
                // Precisamos enviar stage ids na ordem nova; mapear slug -> stageId atual
                const slugToStageId = new Map(draft1.stages.map((s: any) => [s.meta?.stageSlug, s.id]));
                const newStageIdOrder = legacySlugs.map(ls => slugToStageId.get(ls));
                deltaPayload.stagesReorder = newStageIdOrder;
            }

            const deltaResp = await request.post(`${url}/api/quiz-style/${SLUG}/apply-delta`, { data: deltaPayload });
            expect(deltaResp.status(), 'apply-delta status').toBe(200);
            const deltaJson = await deltaResp.json();
            expect(deltaJson.ok).toBe(true);

            const draft2 = await getDraft(request, url);
            expect(draft2.meta.name).toBe(newName);
            if (swapped) {
                // Ler manifest e validar que a ordem persistida reflete a troca dos dois primeiros slugs
                const manifestPath = path.join(process.cwd(), 'public', 'templates', 'quiz-steps', 'manifest.adapter.json');
                const raw = await fs.readFile(manifestPath, 'utf-8');
                const manifest = JSON.parse(raw);
                expect(Array.isArray(manifest.order)).toBe(true);
                expect(manifest.order[0]).toBe(legacySlugs[0]);
                expect(manifest.order[1]).toBe(legacySlugs[1]);
            }

            const afterMetrics = await getMetrics(request, url);
            if (beforeMetrics) {
                expect(afterMetrics.conversions).toBeGreaterThanOrEqual(beforeMetrics.conversions + 2); // dois loads de draft
                expect(afterMetrics.deltasApplied).toBeGreaterThanOrEqual(beforeMetrics.deltasApplied + 1);
            } else {
                // Sem baseline, apenas sanity
                expect(afterMetrics.conversions).toBeGreaterThanOrEqual(2);
                expect(afterMetrics.deltasApplied).toBeGreaterThanOrEqual(1);
            }
        } finally {
            await stopTestServer(server);
        }
    });
});
