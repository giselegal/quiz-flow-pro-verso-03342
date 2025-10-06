/**
 * 🔍 checkBuildVersion - Verifica se há uma versão mais recente da aplicação.
 * Busca /build-meta.json e compara com cache local.
 */

interface BuildMeta {
  buildTimestamp: string;
  commitHash: string;
  version: string;
}

const STORAGE_KEY = 'app-build-meta';

export async function checkBuildVersion(options: { onNewVersion?: (remote: BuildMeta, local?: BuildMeta) => void } = {}) {
  try {
    const res = await fetch(`/build-meta.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const remote: BuildMeta = await res.json();

    let local: BuildMeta | undefined;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) local = JSON.parse(raw);
    } catch {}

    const changed = !local || local.commitHash !== remote.commitHash || local.buildTimestamp !== remote.buildTimestamp;
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      options.onNewVersion?.(remote, local);
    }
  } catch (e) {
    // Silencioso para não poluir console em ambientes offline
  }
}

export function startPeriodicVersionCheck(intervalMs = 120000) {
  checkBuildVersion({
    onNewVersion: () => {
      console.info('[VersionCheck] Nova versão detectada, recarregando para sincronizar chunks.');
      window.location.reload();
    }
  });
  return setInterval(() => checkBuildVersion({
    onNewVersion: () => {
      console.info('[VersionCheck] Nova versão detectada (interval), recarregando.');
      window.location.reload();
    }
  }), intervalMs);
}
