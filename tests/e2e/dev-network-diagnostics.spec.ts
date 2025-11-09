import { test } from '@playwright/test';

test.describe('Diagnóstico de rede (DEV)', () => {
    test('Top recursos por duração e tamanho', async ({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => (document.getElementById('root')?.children?.length || 0) > 0, { timeout: 15000 });

        const report = await page.evaluate(() => {
            const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            const map = res.map((e) => ({
                name: e.name,
                initiatorType: (e as any).initiatorType,
                duration: Math.round(e.duration),
                transferSize: (e as any).transferSize || 0,
                encodedBodySize: (e as any).encodedBodySize || 0,
                decodedBodySize: (e as any).decodedBodySize || 0,
            }));
            const byDuration = [...map].sort((a, b) => b.duration - a.duration).slice(0, 10);
            const bySize = [...map].sort((a, b) => (b.transferSize || b.encodedBodySize) - (a.transferSize || a.encodedBodySize)).slice(0, 10);
            return { byDuration, bySize };
        });

        console.log('\n[DEV-NET] Top 10 por duração (ms):');
        for (const r of report.byDuration) console.log(`${r.duration}ms  ${r.initiatorType || ''}  ${r.name}`);
        console.log('\n[DEV-NET] Top 10 por tamanho (bytes):');
        for (const r of report.bySize) console.log(`${r.transferSize || r.encodedBodySize}B  ${r.initiatorType || ''}  ${r.name}`);
    });
});
