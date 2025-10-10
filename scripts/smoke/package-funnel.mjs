#!/usr/bin/env node
/**
 * Smoke: /api/package-funnel
 */
const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function main() {
    try {
        const payload = {
            id: `pkg-${Date.now()}`,
            name: 'Smoke Package',
            steps: [{ id: 'step-01' }],
        };
        const r = await fetch(`${BASE}/api/package-funnel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!r.ok) {
            const text = await r.text();
            console.error('FAIL /api/package-funnel', r.status, text);
            process.exit(1);
        }
        const ct = r.headers.get('content-type') || '';
        const disp = r.headers.get('content-disposition') || '';
        if (!ct.includes('application/zip') || !/attachment;/.test(disp)) {
            console.error('FAIL headers', { ct, disp });
            process.exit(1);
        }
        // consume a little to ensure stream works
        const reader = r.body?.getReader?.();
        if (reader) await reader.read().catch(() => { });
        console.log('PASS /api/package-funnel');
        process.exit(0);
    } catch (e) {
        console.error('SMOKE ERROR', e);
        process.exit(2);
    }
}

main();
