#!/usr/bin/env node
import { execSync } from 'node:child_process';

const ports = process.argv.slice(2).filter(p => /^\d+$/.test(p));
if (ports.length === 0) {
  console.log('Uso: node kill-ports.mjs <porta> [porta2 ...]');
  process.exit(0);
}

for (const port of ports) {
  try {
    const pids = execSync(`lsof -ti:${port} || true`, { stdio: 'pipe' }).toString().trim().split(/\s+/).filter(Boolean);
    if (pids.length === 0) {
      console.log(`Porta ${port} já livre.`);
      continue;
    }
    for (const pid of pids) {
      try {
        process.kill(Number(pid), 'SIGKILL');
        console.log(`Matou PID ${pid} na porta ${port}`);
      } catch (e) {
        console.log(`Falhou ao matar PID ${pid} na porta ${port}: ${(e && e.message) || e}`);
      }
    }
  } catch (e) {
    console.log(`Erro ao processar porta ${port}: ${(e && e.message) || e}`);
  }
}
