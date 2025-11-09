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

/**
 * Faz fetch de /build-meta.json. Retorna true quando o endpoint existe (res.ok),
 * false quando não existe/está indisponível. Silencia exceções.
 */
export async function checkBuildVersion(options: { onNewVersion?: (remote: BuildMeta, local?: BuildMeta) => void } = {}): Promise<boolean> {
    try {
        const res = await fetch(`/build-meta.json?ts=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return false;
        const remote: BuildMeta = await res.json();

        let local: BuildMeta | undefined;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) local = JSON.parse(raw);
        } catch { }

        const changed = !local || local.commitHash !== remote.commitHash || local.buildTimestamp !== remote.buildTimestamp;
        if (changed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
            options.onNewVersion?.(remote, local);
        }
        return true;
    } catch (e) {
        // Silencioso para não poluir console em ambientes offline
        return false;
    }
}

/**
 * Inicia verificação periódica somente se:
 * - o host não estiver em uma lista de bloqueio (ex.: lovableproject.com), e
 * - o endpoint /build-meta.json existir (primeiro fetch ok)
 */
export function startPeriodicVersionCheck(intervalMs = 120000) {
    if (typeof window === 'undefined') return undefined as any;

    const disabledHostSubstrings = ['lovableproject.com', 'localhost', '127.0.0.1', '0.0.0.0'];
    const host = window.location.hostname || '';
    if (disabledHostSubstrings.some((s) => host.includes(s))) {
        console.info('[VersionCheck] desabilitado neste host:', host);
        return undefined as any;
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    (async () => {
        const ok = await checkBuildVersion({
            onNewVersion: () => {
                console.info('[VersionCheck] Nova versão detectada, recarregando para sincronizar chunks.');
                window.location.reload();
            },
        });
        if (!ok) {
            console.info('[VersionCheck] build-meta.json ausente; verificação periódica desativada.');
            return;
        }
        timer = setInterval(() => {
            checkBuildVersion({
                onNewVersion: () => {
                    console.info('[VersionCheck] Nova versão detectada (interval), recarregando.');
                    window.location.reload();
                },
            });
        }, intervalMs);
    })();

    return timer as any;
}
