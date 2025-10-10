#!/usr/bin/env node
/**
 * Smoke: health + live-update
 */
const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function main() {
    try {
        // health
        const r = await fetch(`${BASE}/api/health`);
        const ok = r.ok;
        const json = ok ? await r.json() : null;
        if (!ok || !json || json.status !== 'OK') {
            console.error('FAIL /api/health', { status: r.status, body: json });
            process.exit(1);
        }
        console.log('PASS /api/health', json);

        // live-update
        const funnelId = `smoke-${Date.now()}`;
        const payload = {
            funnelId,
            steps: {
                'step-01': { type: 'intro', title: 'Smoke Intro' },
                'step-02': { type: 'question', questionText: 'Smoke Q', options: ['A', 'B'], requiredSelections: 1, nextStep: 'step-03' },
                'step-03': { type: 'result', title: 'Smoke Result' }
            }
        };
        const r2 = await fetch(`${BASE}/api/live-update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const j2 = await r2.json().catch(() => ({}));
        if (!r2.ok) {
            console.error('FAIL /api/live-update', { status: r2.status, body: j2 });
            process.exit(1);
        }
        console.log('PASS /api/live-update', j2);

        process.exit(0);
    } catch (e) {
        console.error('SMOKE ERROR', e);
        process.exit(2);
    }
}

main();
