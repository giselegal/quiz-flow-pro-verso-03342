#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { execSync } from 'node:child_process';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function log(msg) { console.log(`[stack] ${msg}`); }

async function ensurePortFree(port) {
    try {
        const pids = execSync(`lsof -ti:${port} || true`).toString().trim().split(/\s+/).filter(Boolean);
        for (const pid of pids) {
            try { process.kill(Number(pid), 'SIGKILL'); log(`Matou PID ${pid} porta ${port}`); } catch { }
        }
    } catch { }
}

async function waitFor(url, timeoutMs = 15000, interval = 500) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const ok = await fetch(url).then(r => r.ok).catch(() => false);
        if (ok) return true;
        await sleep(interval);
    }
    return false;
}

(async () => {
    const FRONT_PORT = 8080; // legado
    const BACK_PORT = 3001;
    const VITE_PORT = 5173; // dev server frontend
    await ensurePortFree(FRONT_PORT);
    await ensurePortFree(BACK_PORT);
    await ensurePortFree(VITE_PORT);

    log('Iniciando backend ...');
    const backend = spawn('npm', ['run', 'dev:server'], { stdio: 'inherit', env: process.env });

    const backendReady = await waitFor(`http://localhost:${BACK_PORT}/health`, 12000, 600);
    if (!backendReady) {
        log('Backend não respondeu /health no tempo esperado. Encerrando.');
        backend.kill('SIGKILL');
        process.exit(1);
    }
    log('Backend OK. Iniciando frontend ...');
    const frontend = spawn('npm', ['run', 'dev'], { stdio: 'inherit', env: process.env });

    // Encerrar filhos ao sair
    const shutdown = () => {
        log('Encerrando stack...');
        backend.kill('SIGKILL');
        frontend.kill('SIGKILL');
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();
