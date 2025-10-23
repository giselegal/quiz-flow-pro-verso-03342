/**
 * PreviewDataWorker
 * Serviço que processa metadados de blocos do preview em background.
 * Usa Web Worker quando disponível; caso contrário, fallback assíncrono no main thread.
 */

export interface PreviewBlockMeta {
    id: string;
    type: string;
    contentSize?: number;
    hasImage?: boolean;
    hasVideo?: boolean;
    fingerprint?: string;
}

export interface PreviewProcessingResult {
    metas: PreviewBlockMeta[];
    processedAt: number;
}

// Função pura para calcular metadados; reaproveitada tanto no worker quanto no fallback
export function computePreviewMetas(blocks: Array<{ id: string; type: any; content?: any }>): PreviewProcessingResult {
    const metas: PreviewBlockMeta[] = blocks.map(b => {
        const typeStr = typeof b.type === 'string' ? b.type : (b.type?.kind || b.type?.name || 'unknown');
        const c = (b as any).content || {};
        const contentString = JSON.stringify(c);
        const contentSize = contentString.length;
        const hasImage = 'imageUrl' in c || 'images' in c || /image|img|photo/i.test(contentString);
        const hasVideo = 'videoUrl' in c || /video|youtube|vimeo/i.test(contentString);
        // fingerprint leve do conteúdo (não para chave de render, apenas telemetria)
        let hash = 0;
        for (let i = 0; i < contentString.length; i++) {
            hash = ((hash << 5) - hash) + contentString.charCodeAt(i);
            hash |= 0; // 32-bit
        }
        const fingerprint = `${typeStr}:${Math.abs(hash)}`;
        return { id: b.id, type: typeStr, contentSize, hasImage, hasVideo, fingerprint };
    });

    return { metas, processedAt: Date.now() };
}

export class PreviewDataWorkerService {
    // Para manter API simples, usamos fallback em todos os ambientes de teste
    static async process(blocks: Array<{ id: string; type: any; content?: any }>): Promise<PreviewProcessingResult> {
        // Se quisermos introduzir um Web Worker real no futuro, detectamos aqui.
        const isWorkerSupported = typeof window !== 'undefined' && typeof (window as any).Worker !== 'undefined' && !isTestEnv();

        if (!isWorkerSupported) {
            // Fallback assíncrono não bloqueante
            return new Promise(resolve => {
                setTimeout(() => resolve(computePreviewMetas(blocks)), 0);
            });
        }

        // Implementação com Worker (adiável): por ora, usar computePreviewMetas diretamente em microtask
        return Promise.resolve().then(() => computePreviewMetas(blocks));
    }
}

function isTestEnv(): boolean {
    return typeof process !== 'undefined' && !!process.env?.VITEST;
}
