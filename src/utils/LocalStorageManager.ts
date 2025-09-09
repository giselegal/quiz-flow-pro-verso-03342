/**
 * 🚨 SISTEMA DE LIMPEZA AUTOMÁTICA DO LOCALSTORAGE
 * 
 * Detecta quando o localStorage está cheio e faz limpeza automática
 * Previne crashes por QuotaExceededError
 */

class LocalStorageManager {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly CLEANUP_THRESHOLD = 0.8; // 80% da capacidade

  /**
   * Verificar se localStorage está funcionando
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obter tamanho aproximado do localStorage
   */
  static getStorageSize(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        total += new Blob([key + value]).size;
      }
    }
    return total;
  }

  /**
   * Estimar capacidade máxima (varia por navegador)
   */
  static getEstimatedMaxSize(): number {
    // Típico: 5-10MB por origem
    return 5 * 1024 * 1024; // 5MB
  }

  /**
   * Verificar se está próximo do limite
   */
  static isNearLimit(): boolean {
    try {
      const current = this.getStorageSize();
      const max = this.getEstimatedMaxSize();
      return (current / max) > this.CLEANUP_THRESHOLD;
    } catch {
      return true; // Se há erro, assumir que está cheio
    }
  }

  /**
   * Limpar dados antigos e desnecessários
   */
  static cleanup(): { cleaned: number; freedSpace: number } {
    console.log('🧹 Iniciando limpeza automática do localStorage...');
    
    let cleaned = 0;
    let freedSpace = 0;

    const keysToRemove: string[] = [];
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    // Identificar chaves para remoção
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = localStorage.getItem(key) || '';
      const size = new Blob([key + value]).size;

      // Regras de limpeza
      const shouldRemove = 
        // Dados temporários
        key.startsWith('temp_') ||
        key.startsWith('debug_') ||
        key.startsWith('test_') ||
        // Dados muito antigos (baseado em timestamp na chave)
        this.isOldData(key, now, ONE_DAY) ||
        // Dados muito grandes (>500KB)
        size > 500 * 1024 ||
        // Dados corrompidos
        this.isCorruptedData(value) ||
        // Funnels com 'default-funnel' que causam problemas
        (key.includes('default-funnel') && size > 10 * 1024);

      if (shouldRemove) {
        keysToRemove.push(key);
        freedSpace += size;
      }
    }

    // Remover chaves identificadas
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        cleaned++;
      } catch (error) {
        console.warn(`Erro ao remover chave: ${key}`, error);
      }
    });

    console.log(`✅ Limpeza concluída: ${cleaned} chaves removidas, ${(freedSpace / 1024).toFixed(2)} KB liberados`);
    
    return { cleaned, freedSpace };
  }

  /**
   * Verificar se dados são antigos baseado em timestamp
   */
  private static isOldData(key: string, now: number, maxAge: number): boolean {
    const timestampMatch = key.match(/(\d{13})/);
    if (timestampMatch) {
      const timestamp = parseInt(timestampMatch[1]);
      return (now - timestamp) > maxAge;
    }
    return false;
  }

  /**
   * Verificar se dados estão corrompidos
   */
  private static isCorruptedData(value: string): boolean {
    if (!value || value.length === 0) return true;
    
    try {
      // Se parece com JSON, tentar parse
      if (value.startsWith('{') || value.startsWith('[')) {
        JSON.parse(value);
      }
      return false;
    } catch {
      return true;
    }
  }

  /**
   * Salvar item com fallback automático
   */
  static safeSetItem(key: string, value: string): boolean {
    let attempts = 0;
    
    while (attempts < this.MAX_ATTEMPTS) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error: any) {
        attempts++;
        
        if (error?.name === 'QuotaExceededError') {
          console.warn(`⚠️ Quota exceeded (tentativa ${attempts}), fazendo limpeza...`);
          this.cleanup();
          
          if (attempts === this.MAX_ATTEMPTS) {
            console.error('❌ Falha ao salvar após múltiplas tentativas de limpeza');
            return false;
          }
        } else {
          console.error('❌ Erro inesperado ao salvar no localStorage:', error);
          return false;
        }
      }
    }
    
    return false;
  }

  /**
   * Obter item com tratamento de erro
   */
  static safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`⚠️ Erro ao obter item do localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Remover item com tratamento de erro
   */
  static safeRemoveItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`⚠️ Erro ao remover item do localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Monitoramento automático
   */
  static startMonitoring(): void {
    // Verificar a cada 5 minutos
    setInterval(() => {
      if (this.isNearLimit()) {
        console.log('📊 LocalStorage próximo do limite, executando limpeza preventiva...');
        this.cleanup();
      }
    }, 5 * 60 * 1000);

    // Limpeza inicial se necessário
    if (this.isNearLimit()) {
      this.cleanup();
    }

    console.log('👁️ Monitoramento do localStorage iniciado');
  }
}

// Exportar para uso global
(window as any).LocalStorageManager = LocalStorageManager;

// Iniciar monitoramento automático
if (typeof window !== 'undefined') {
  LocalStorageManager.startMonitoring();
}

export default LocalStorageManager;
