#!/usr/bin/env node
import { execSync } from 'node:child_process';

const ports = process.argv.slice(2).filter(p => /^\d+$/.test(p));
if (ports.length === 0) {
    console.log('Uso: node kill-ports.mjs <porta> [porta2 ...]');
    process.exit(0);
}

const isWin = process.platform === 'win32';

function getPidsUnix(port) {
  try {
    return execSync(`lsof -ti:${port} || true`, { stdio: 'pipe' }).toString().trim().split(/\s+/).filter(Boolean);
  } catch { return []; }
}

function getPidsWin(port) {
  // Try PowerShell Get-NetTCPConnection
  try {
    const out = execSync(`powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} | Select-Object -ExpandProperty OwningProcess"`, { stdio: 'pipe' }).toString();
    const pids = out.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (pids.length > 0) return pids;
  } catch { /* fallback */ }
  // Fallback to netstat -ano parsing
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' }).toString();
    const pids = out.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
      const parts = line.split(/\s+/);
      return parts[parts.length - 1];
    }).filter(Boolean);
    return Array.from(new Set(pids));
  } catch { return []; }
}

function killPidUnix(pid, port) {
  try {
    process.kill(Number(pid), 'SIGKILL');
    console.log(`Matou PID ${pid} na porta ${port}`);
  } catch (e) {
    console.log(`Falhou ao matar PID ${pid} na porta ${port}: ${(e && e.message) || e}`);
  }
}

function killPidWin(pid, port) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
    console.log(`Matou PID ${pid} na porta ${port}`);
  } catch (e) {
    console.log(`Falhou ao matar PID ${pid} na porta ${port}: ${(e && e.message) || e}`);
  }
}

for (const port of ports) {
  try {
    const pids = isWin ? getPidsWin(port) : getPidsUnix(port);
    if (pids.length === 0) {
      console.log(`Porta ${port} já livre.`);
      continue;
    }
    for (const pid of pids) {
      isWin ? killPidWin(pid, port) : killPidUnix(pid, port);
    }
  } catch (e) {
    console.log(`Erro ao processar porta ${port}: ${(e && e.message) || e}`);
  }
}
