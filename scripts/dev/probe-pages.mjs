import { chromium } from 'playwright';

const BASE = process.env.PROBE_BASE_URL || 'http://localhost:5173';
const ROUTES = (process.env.PROBE_ROUTES || '/, /editor, /dashboard, /preview').split(/\s*,\s*/);

function log(msg, ...args) {
    // eslint-disable-next-line no-console
    console.log(`[probe] ${msg}`, ...args);
}

let hadError = false;

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();
        if (/(error|warning)/i.test(type) || /Minified React error/i.test(text)) {
            hadError = true;
        }
        log(`console.${type}: ${text}`);
    });

    page.on('pageerror', (err) => {
        hadError = true;
        log(`pageerror: ${err?.message || err}`);
    });

    for (const route of ROUTES) {
        const url = `${BASE}${route}`;
        log(`→ Abrindo ${url}`);
        try {
            const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            log(`status: ${resp?.status?.()}`);
            await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => { });
            await page.screenshot({ path: `./test-results/probe${route.replace(/\W+/g, '_')}.png`, fullPage: true }).catch(() => { });
        } catch (e) {
            hadError = true;
            log(`Falha ao abrir ${url}: ${e?.message || e}`);
        }
    }

    await browser.close();
    if (hadError) {
        process.exitCode = 1;
    } else {
        log('Sem erros detectados nas rotas sondadas.');
    }
}

run();
