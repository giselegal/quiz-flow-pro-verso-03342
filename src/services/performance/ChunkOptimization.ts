import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🚀 CHUNK OPTIMIZATION SERVICE - SPRINT 3
 * 
 * Code splitting estratégico por ranges de steps para otimizar bundle
 * 
 * ESTRATÉGIA:
 * - Chunk 1 (steps 1-5): Intro + primeiras questions (critical path)
 * - Chunk 2 (steps 6-11): Questions intermediárias
 * - Chunk 3 (steps 12-18): Transition + strategic questions
 * - Chunk 4 (steps 19-21): Result + offer (conversão)
 * 
 * @version 1.0.0
 * @date 2025-01-16
 */

export type ChunkRange = 'critical' | 'questions' | 'strategic' | 'conversion';

export interface ChunkInfo {
  range: ChunkRange;
  stepRange: [number, number];
  priority: 'high' | 'medium' | 'low';
  preloadAdjacent: boolean;
}

const CHUNK_MAP: Record<ChunkRange, ChunkInfo> = {
  critical: {
    range: 'critical',
    stepRange: [1, 5],
    priority: 'high',
    preloadAdjacent: true,
  },
  questions: {
    range: 'questions',
    stepRange: [6, 11],
    priority: 'medium',
    preloadAdjacent: true,
  },
  strategic: {
    range: 'strategic',
    stepRange: [12, 18],
    priority: 'medium',
    preloadAdjacent: true,
  },
  conversion: {
    range: 'conversion',
    stepRange: [19, 21],
    priority: 'high',
    preloadAdjacent: false,
  },
};

/**
 * Determina qual chunk um step pertence
 */
export function getChunkForStep(stepNumber: number): ChunkInfo {
  for (const chunkInfo of Object.values(CHUNK_MAP)) {
    const [min, max] = chunkInfo.stepRange;
    if (stepNumber >= min && stepNumber <= max) {
      return chunkInfo;
    }
  }
  
  // Fallback para steps fora do range (não deveria acontecer)
  return CHUNK_MAP.critical;
}

/**
 * Retorna chunks adjacentes que devem ser preloaded
 */
export function getAdjacentChunks(currentChunk: ChunkRange): ChunkRange[] {
  const chunks: ChunkRange[] = ['critical', 'questions', 'strategic', 'conversion'];
  const currentIndex = chunks.indexOf(currentChunk);
  
  const adjacent: ChunkRange[] = [];
  
  // Chunk anterior
  if (currentIndex > 0) {
    adjacent.push(chunks[currentIndex - 1]);
  }
  
  // Chunk seguinte
  if (currentIndex < chunks.length - 1) {
    adjacent.push(chunks[currentIndex + 1]);
  }
  
  return adjacent;
}

/**
 * Preload de chunks adjacentes (chamado quando usuário navega para um step)
 */
export async function preloadAdjacentChunks(currentStepNumber: number): Promise<void> {
  const currentChunk = getChunkForStep(currentStepNumber);
  
  if (!currentChunk.preloadAdjacent) {
    return;
  }
  
  const adjacentChunks = getAdjacentChunks(currentChunk.range);
  
  // Preload assíncrono em background
  adjacentChunks.forEach(chunkRange => {
    const chunkInfo = CHUNK_MAP[chunkRange];
    appLogger.info(`🔄 Preloading chunk: ${chunkRange} (steps ${chunkInfo.stepRange[0]}-${chunkInfo.stepRange[1]})`);
    
    // Aqui poderia fazer import dinâmico dos componentes do chunk
    // Por enquanto apenas log para demonstração
  });
}

/**
 * Estatísticas de chunks
 */
export function getChunkStats(): Record<ChunkRange, { steps: number; loaded: boolean }> {
  return {
    critical: { steps: 5, loaded: true },
    questions: { steps: 6, loaded: false },
    strategic: { steps: 7, loaded: false },
    conversion: { steps: 3, loaded: false },
  };
}

/**
 * Clear de chunks não utilizados (memory management)
 */
export function clearUnusedChunks(currentStepNumber: number): void {
  const currentChunk = getChunkForStep(currentStepNumber);
  const adjacent = getAdjacentChunks(currentChunk.range);
  
  const allChunks: ChunkRange[] = ['critical', 'questions', 'strategic', 'conversion'];
  const toKeep = [currentChunk.range, ...adjacent];
  const toClear = allChunks.filter(c => !toKeep.includes(c));
  
  toClear.forEach(chunk => {
    appLogger.info(`🗑️ Clearing unused chunk: ${chunk}`);
    // Aqui poderia implementar lógica de clear de cache/memory
  });
}
