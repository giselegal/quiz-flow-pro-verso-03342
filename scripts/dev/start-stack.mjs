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
    const FRONT_PORT = Number(process.env.FRONT_PORT || 8080); // porta pública
    const BACK_PORT = Number(process.env.BACK_PORT || 3001);
    // Detecta porta do Vite via env (quando definida) ou usa padrão atual do projeto (8080)
    const VITE_PORT = Number(process.env.VITE_PORT || 8080);

    // Libera portas necessárias
    await ensurePortFree(BACK_PORT);
    await ensurePortFree(VITE_PORT);
    // Só libera FRONT_PORT se ela for diferente da do Vite (caso contrário é a mesma)
    if (FRONT_PORT !== VITE_PORT) {
        await ensurePortFree(FRONT_PORT);
    }

    log('Iniciando backend ...');
    const backend = spawn('npm', ['run', 'dev:server'], { stdio: 'inherit', env: process.env });

    const backendReady = await waitFor(`http://localhost:${BACK_PORT}/health`, 12000, 600);
    if (!backendReady) {
        log('Backend não respondeu /health no tempo esperado. Encerrando.');
        backend.kill('SIGKILL');
        process.exit(1);
    }
    log('Backend OK. Iniciando frontend (Vite) ...');
    const env = { ...process.env };
    // Permite sobrescrever porta do Vite em runtime se necessário
    if (!env.VITE_PORT) env.VITE_PORT = String(VITE_PORT);
    const frontend = spawn('npm', ['run', 'dev'], { stdio: 'inherit', env });

    // Inicia redirecionador somente quando as portas diferem
    let redirector = null;
    if (FRONT_PORT !== VITE_PORT) {
        log(`Iniciando redirecionador ${FRONT_PORT} -> ${VITE_PORT} ...`);
        redirector = spawn('npm', ['run', 'dev:redirect-8080'], { stdio: 'inherit', env: { ...env, LEGACY_PORT: String(FRONT_PORT), TARGET_PORT: String(VITE_PORT) } });
    } else {
        log(`Redirecionador não necessário: FRONT_PORT (${FRONT_PORT}) == VITE_PORT (${VITE_PORT}).`);
    }

    // Encerrar filhos ao sair
    const shutdown = () => {
        log('Encerrando stack...');
        backend.kill('SIGKILL');
        frontend.kill('SIGKILL');
        if (redirector) redirector.kill('SIGKILL');
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();
