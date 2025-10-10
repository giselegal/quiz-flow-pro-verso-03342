#!/usr/bin/env node
/**
 * Smoke: /api/package-funnel
 */
const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function waitFor(url, timeoutMs = 20000, interval = 500) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const r = await fetch(url);
            if (r.ok) return true;
        } catch { }
        await new Promise(r => setTimeout(r, interval));
    }
    return false;
}

async function main() {
    try {
        const ready = await waitFor(`${BASE}/api/health`, 20000, 500);
        if (!ready) {
            console.error('FAIL wait /api/health timeout');
            process.exit(1);
        }
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
