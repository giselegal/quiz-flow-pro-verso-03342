#!/usr/bin/env node
/**
 * Verificador rápido do editor: abre /editor?template=quiz21StepsComplete
 * e valida a presença do [data-testid="canvas-editor"].
 * - Sobe a stack de desenvolvimento automaticamente (backend + Vite + redirect)
 * - Usa Playwright (Chromium)
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function waitFor(url, timeoutMs = 60000, interval = 500) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const r = await fetch(url);
            if (r.ok) return true;
        } catch { }
        await new Promise((r) => setTimeout(r, interval));
    }
    return false;
}

async function main() {
    let serverProc = null;
    try {
        // Inicia stack de dev e aguarda servidor HTTP
        serverProc = spawn('npm', ['run', 'dev:stack:wait'], { stdio: 'inherit', env: process.env });
        const ready = await waitFor(`${BASE}/`, 90000, 800);
        if (!ready) {
            console.error('❌ Timeout aguardando servidor em', BASE);
            process.exit(1);
        }

        // Abre navegador headless e valida canvas do editor
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        const target = `${BASE}/editor?template=quiz21StepsComplete`;
        await page.goto(target, { waitUntil: 'domcontentloaded' });

        // Espera pelo canvas do editor
        await page.waitForSelector('[data-testid="canvas-editor"]', { timeout: 30000, state: 'visible' });

        // Pequena verificação extra: header com botão de navegação
        const hasNavButton = await page.locator('[data-testid="nav-open-button"]').first().isVisible().catch(() => false);

        console.log('✅ Editor carregado com sucesso:', target, '| nav-open-button:', hasNavButton ? 'OK' : 'N/A');
        await browser.close();
        process.exit(0);
    } catch (e) {
        console.error('❌ Falha ao validar editor:', e?.message || e);
        process.exit(2);
    } finally {
        if (serverProc) {
            try { serverProc.kill('SIGKILL'); } catch { }
        }
    }
}

main();
