import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const BASE = process.env.PROBE_BASE_URL || 'http://localhost:5173';
const ROUTES = (process.env.PROBE_ROUTES || '/, /editor, /dashboard, /preview').split(/\s*,\s*/);

function log(msg, ...args) {
    // eslint-disable-next-line no-console
    console.log(`[probe] ${msg}`, ...args);
}

let hadError = false;
let stackProcess = null;

async function checkServer(url) {
    try {
        const resp = await fetch(url);
        return resp.ok;
    } catch {
        return false;
    }
}

async function startStack() {
    return new Promise((resolve, reject) => {
        log('Stack não detectado. Iniciando dev:stack...');
        stackProcess = spawn('npm', ['run', 'dev:stack'], {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: false,
        });

        let output = '';
        stackProcess.stdout.on('data', (d) => {
            output += d.toString();
        });
        stackProcess.stderr.on('data', (d) => {
            output += d.toString();
        });

        const checkReady = setInterval(async () => {
            if (await checkServer(BASE)) {
                clearInterval(checkReady);
                log('Stack pronto!');
                resolve();
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(checkReady);
            reject(new Error('Timeout aguardando stack'));
        }, 30000);

        stackProcess.on('exit', (code) => {
            clearInterval(checkReady);
            if (code !== 0 && code !== null) {
                reject(new Error(`Stack falhou com código ${code}`));
            }
        });
    });
}

async function run() {
    // Verifica se o servidor já está rodando
    const serverRunning = await checkServer(BASE);
    if (!serverRunning) {
        await startStack();
        // Aguarda estabilizar
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

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

    // Finaliza o stack se foi iniciado por este script
    if (stackProcess && !stackProcess.killed) {
        log('Encerrando stack...');
        stackProcess.kill('SIGTERM');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!stackProcess.killed) {
            stackProcess.kill('SIGKILL');
        }
    }

    if (hadError) {
        process.exitCode = 1;
    } else {
        log('Sem erros detectados nas rotas sondadas.');
    }
}

run().catch((err) => {
    log(`ERRO FATAL: ${err?.message || err}`);
    if (stackProcess && !stackProcess.killed) {
        stackProcess.kill('SIGKILL');
    }
    process.exit(1);
});
