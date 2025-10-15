/**
 * 🔍 SYNC VALIDATOR HOOK - Fase 3 (P2)
 * 
 * Valida sincronização entre Canvas e Preview
 * Detecta divergências e fornece feedback visual
 */

import { useEffect, useState, useRef } from 'react';
import { getBlockConfig } from '@/utils/blockConfigMerger';

export interface SyncValidationResult {
  isSynced: boolean;
  differences: string[];
  canvasChecksum: string;
  previewChecksum: string;
  lastCheck: number;
}

export interface UseSyncValidatorOptions {
  enabled?: boolean;
  debounceMs?: number;
  logDifferences?: boolean;
}

/**
 * Hook para validar sincronização entre Canvas e Preview
 */
export function useSyncValidator(
  canvasData: any,
  previewData: any,
  options: UseSyncValidatorOptions = {}
): SyncValidationResult {
  const {
    enabled = true,
    debounceMs = 500,
    logDifferences = process.env.NODE_ENV === 'development'
  } = options;

  const [result, setResult] = useState<SyncValidationResult>({
    isSynced: true,
    differences: [],
    canvasChecksum: '',
    previewChecksum: '',
    lastCheck: 0
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Debounce validation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const validation = validateSync(canvasData, previewData);

      if (logDifferences && validation.differences.length > 0) {
        console.warn('🔍 Sync Validator: Diferenças detectadas', {
          differences: validation.differences,
          canvasChecksum: validation.canvasChecksum,
          previewChecksum: validation.previewChecksum
        });
      }

      setResult(validation);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [canvasData, previewData, enabled, debounceMs, logDifferences]);

  return result;
}

/**
 * Valida sincronização entre Canvas e Preview
 */
function validateSync(canvasData: any, previewData: any): SyncValidationResult {
  const differences: string[] = [];

  // Normalizar dados
  const canvasNormalized = normalizeForComparison(canvasData);
  const previewNormalized = normalizeForComparison(previewData);

  // Gerar checksums
  const canvasChecksum = generateChecksum(canvasNormalized);
  const previewChecksum = generateChecksum(previewNormalized);

  // Comparar checksums
  if (canvasChecksum !== previewChecksum) {
    // Análise detalhada
    const canvasKeys = Object.keys(canvasNormalized);
    const previewKeys = Object.keys(previewNormalized);

    // Verificar chaves faltando
    const missingInPreview = canvasKeys.filter(k => !previewKeys.includes(k));
    const missingInCanvas = previewKeys.filter(k => !canvasKeys.includes(k));

    if (missingInPreview.length > 0) {
      differences.push(`Chaves ausentes no Preview: ${missingInPreview.join(', ')}`);
    }

    if (missingInCanvas.length > 0) {
      differences.push(`Chaves ausentes no Canvas: ${missingInCanvas.join(', ')}`);
    }

    // Verificar valores diferentes
    for (const key of canvasKeys) {
      if (previewKeys.includes(key)) {
        const canvasValue = JSON.stringify(canvasNormalized[key]);
        const previewValue = JSON.stringify(previewNormalized[key]);

        if (canvasValue !== previewValue) {
          differences.push(`Valor diferente em '${key}'`);
        }
      }
    }
  }

  return {
    isSynced: differences.length === 0,
    differences,
    canvasChecksum,
    previewChecksum,
    lastCheck: Date.now()
  };
}

/**
 * Normaliza dados para comparação
 */
function normalizeForComparison(data: any): Record<string, any> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const normalized: Record<string, any> = {};

  // Se for um step com blocks
  if (Array.isArray(data.blocks)) {
    normalized.blocks = data.blocks.map((block: any) => {
      const config = getBlockConfig(block);
      return {
        id: block.id,
        type: block.type,
        config
      };
    });
  }

  // Se for um array de steps
  if (Array.isArray(data)) {
    return data.reduce((acc, step, idx) => {
      acc[step.id || `step-${idx}`] = normalizeForComparison(step);
      return acc;
    }, {} as Record<string, any>);
  }

  // Outras propriedades relevantes
  const relevantKeys = ['id', 'type', 'questionText', 'options', 'nextStep'];
  for (const key of relevantKeys) {
    if (key in data) {
      normalized[key] = data[key];
    }
  }

  return normalized;
}

/**
 * Gera checksum MD5-like simplificado
 */
function generateChecksum(data: any): string {
  const str = JSON.stringify(data, Object.keys(data).sort());
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16);
}
