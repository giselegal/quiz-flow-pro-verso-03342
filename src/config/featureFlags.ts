/**
 * 🚩 Feature Flags para Rollout Gradual
 * 
 * Controla habilitação de novas features de forma segura
 */

export const FEATURE_FLAGS = {
  // 🆕 NOVA ARQUITETURA
  useUnifiedEditorStore: false, // ⚠️ Em desenvolvimento - aguardar integração completa
  useFunnelCloneService: true,  // ✅ Pronto para uso - serviço de duplicação otimizado
  useWYSIWYGSync: false,         // ⚠️ Em testes - sincronização com Immer
  useVirtualization: true,       // ✅ Safe - auto-detecta threshold (>50 items)
  
  // 🔧 DEBUGGING
  enableEventBusLogging: false,  // Log de todos os eventos do editor
  enablePerformanceMonitor: true, // Métricas de performance
  
  // 🧪 EXPERIMENTAL
  useCollaborativeEditing: false, // Edição colaborativa (futuro)
  useWebWorkerValidation: false,  // Validação em Web Worker (futuro)
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Obter valor de uma feature flag
 * 
 * Em dev mode, permite override via localStorage:
 * - localStorage.setItem('flag:useFunnelCloneService', 'true')
 */
export function getFeatureFlag(flag: FeatureFlag): boolean {
  // Override via localStorage (dev only)
  if (import.meta.env.DEV) {
    const override = localStorage.getItem(`flag:${flag}`);
    if (override !== null) {
      return override === 'true';
    }
  }
  
  // Override via environment variables (útil para staging)
  const envKey = `VITE_FF_${flag.toUpperCase()}`;
  const envValue = import.meta.env[envKey];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }
  
  return FEATURE_FLAGS[flag];
}

/**
 * Helpers para dev mode (console)
 */
if (import.meta.env.DEV) {
  (window as any).enableFlag = (flag: string) => {
    if (!(flag in FEATURE_FLAGS)) {
      console.error(`❌ Flag desconhecida: "${flag}"`);
      console.log('Flags disponíveis:', Object.keys(FEATURE_FLAGS));
      return;
    }
    
    localStorage.setItem(`flag:${flag}`, 'true');
    console.log(`✅ Feature flag "${flag}" habilitada. Recarregue a página.`);
  };
  
  (window as any).disableFlag = (flag: string) => {
    if (!(flag in FEATURE_FLAGS)) {
      console.error(`❌ Flag desconhecida: "${flag}"`);
      return;
    }
    
    localStorage.setItem(`flag:${flag}`, 'false');
    console.log(`❌ Feature flag "${flag}" desabilitada. Recarregue a página.`);
  };
  
  (window as any).listFlags = () => {
    console.table(
      Object.entries(FEATURE_FLAGS).map(([key, defaultValue]) => ({
        Flag: key,
        Default: defaultValue,
        Current: getFeatureFlag(key as FeatureFlag),
        Overridden: localStorage.getItem(`flag:${key}`) !== null,
      }))
    );
  };
  
  console.log('💡 Feature Flags disponíveis no console:');
  console.log('  - enableFlag("useFunnelCloneService")');
  console.log('  - disableFlag("useFunnelCloneService")');
  console.log('  - listFlags()');
}
