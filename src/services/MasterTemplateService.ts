/**
 * 🎯 MASTER TEMPLATE SERVICE - FASE 2
 * 
 * Singleton que elimina carregamento duplicado de quiz21-complete.json
 * Garante que o arquivo seja carregado apenas 1 vez durante toda a sessão
 * 
 * ANTES: 3-6 segundos (múltiplas requisições sequenciais)
 * DEPOIS: <1 segundo (1 requisição única com cache)
 */

interface MasterTemplate {
  metadata?: any;
  steps?: Record<string, any>;
  [key: string]: any;
}

class MasterTemplateServiceClass {
  private static instance: MasterTemplateServiceClass | null = null;
  
  private masterTemplate: MasterTemplate | null = null;
  private loadPromise: Promise<MasterTemplate> | null = null;
  private loadAttempted = false;
  private lastFetchTime = 0;

  private constructor() {
    console.log('🎯 [MasterTemplateService] Singleton instanciado');
  }

  static getInstance(): MasterTemplateServiceClass {
    if (!MasterTemplateServiceClass.instance) {
      MasterTemplateServiceClass.instance = new MasterTemplateServiceClass();
    }
    return MasterTemplateServiceClass.instance;
  }

  /**
   * Obtém o template master (com cache + deduplicação de promises)
   */
  async getMasterTemplate(): Promise<MasterTemplate> {
    // 1. Cache hit - retorna imediatamente
    if (this.masterTemplate) {
      console.log('✅ [MasterTemplateService] Cache HIT - retornando template em memória');
      return this.masterTemplate;
    }

    // 2. Request já em andamento - aguarda a promise existente
    if (this.loadPromise) {
      console.log('⏳ [MasterTemplateService] Aguardando request em andamento...');
      return this.loadPromise;
    }

    // 3. Primeira requisição - inicia o carregamento
    console.log('🚀 [MasterTemplateService] Iniciando carregamento de quiz21-complete.json');
    this.lastFetchTime = Date.now();
    this.loadAttempted = true;

    this.loadPromise = fetch('/templates/quiz21-complete.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: MasterTemplate) => {
        const loadTime = Date.now() - this.lastFetchTime;
        console.log(`✅ [MasterTemplateService] Template carregado com sucesso em ${loadTime}ms`);
        
        this.masterTemplate = data;
        this.loadPromise = null; // Limpa a promise após sucesso
        
        return data;
      })
      .catch(error => {
        console.error('❌ [MasterTemplateService] Erro ao carregar template:', error);
        this.loadPromise = null; // Limpa promise para permitir nova tentativa
        throw error;
      });

    return this.loadPromise;
  }

  /**
   * Obtém um step específico do master template
   */
  async getStep(stepId: string): Promise<any> {
    const master = await this.getMasterTemplate();
    
    // Buscar em múltiplos formatos possíveis
    const step = master[stepId] || master.steps?.[stepId];
    
    if (!step) {
      console.warn(`⚠️ [MasterTemplateService] Step ${stepId} não encontrado no master template`);
      return null;
    }

    return step;
  }

  /**
   * Verifica se template está em cache
   */
  isCached(): boolean {
    return this.masterTemplate !== null;
  }

  /**
   * Força reload (útil para testes ou updates)
   */
  async reload(): Promise<MasterTemplate> {
    console.log('🔄 [MasterTemplateService] Forçando reload do template');
    this.masterTemplate = null;
    this.loadPromise = null;
    this.loadAttempted = false;
    return this.getMasterTemplate();
  }

  /**
   * Limpa cache (útil para testes)
   */
  clearCache(): void {
    console.log('🗑️ [MasterTemplateService] Limpando cache');
    this.masterTemplate = null;
    this.loadPromise = null;
    this.loadAttempted = false;
    this.lastFetchTime = 0;
  }

  /**
   * Status do serviço (diagnóstico)
   */
  getStatus() {
    return {
      cached: this.isCached(),
      loading: this.loadPromise !== null,
      attempted: this.loadAttempted,
      lastFetchTime: this.lastFetchTime,
      cacheSize: this.masterTemplate ? JSON.stringify(this.masterTemplate).length : 0
    };
  }
}

// Singleton export
export const MasterTemplateService = MasterTemplateServiceClass.getInstance();

// Export para testes
export const __resetSingleton = () => {
  (MasterTemplateServiceClass as any).instance = null;
};
