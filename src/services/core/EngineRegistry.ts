/**
 * 🎯 REGISTRO DE MOTORES UNIFICADO - FASE 3
 * 
 * Sistema de registro para motores de cálculo com prioridades,
 * resolvendo conflitos e organizando fallbacks.
 */

import { resultFormatAdapter, UnifiedResult } from './ResultFormatAdapter';
import { resultCacheService } from './ResultCacheService';

export type EngineStatus = 'active' | 'inactive' | 'fallback' | 'disabled';

export interface EngineDefinition {
  id: string;
  name: string;
  version: string;
  priority: number; // Maior número = maior prioridade
  status: EngineStatus;
  capabilities: string[];
  description: string;
  execute: (data: any, options?: any) => Promise<any>;
  isHealthy?: () => Promise<boolean>;
  lastUsed?: Date;
  errors?: string[];
}

export interface EngineExecutionResult {
  engineId: string;
  success: boolean;
  result?: UnifiedResult;
  error?: string;
  executionTime: number;
  fromCache: boolean;
}

/**
 * Registro centralizado de motores de cálculo
 */
export class EngineRegistry {
  private engines = new Map<string, EngineDefinition>();
  private executionHistory: EngineExecutionResult[] = [];
  private readonly MAX_HISTORY = 50;

  constructor() {
    this.registerDefaultEngines();
  }

  /**
   * Registra um motor no sistema
   */
  register(engine: EngineDefinition): void {
    console.log(`📝 Registrando motor: ${engine.name} (${engine.id}) - Prioridade: ${engine.priority}`);
    
    // Validar definição do motor
    this.validateEngine(engine);
    
    this.engines.set(engine.id, {
      ...engine,
      lastUsed: undefined,
      errors: []
    });
    
    console.log(`✅ Motor ${engine.name} registrado com sucesso`);
  }

  /**
   * Remove um motor do registro
   */
  unregister(engineId: string): boolean {
    const removed = this.engines.delete(engineId);
    if (removed) {
      console.log(`🗑️ Motor ${engineId} removido do registro`);
    }
    return removed;
  }

  /**
   * Executa cálculo usando o motor de maior prioridade disponível
   */
  async executeWithPriority(
    data: any, 
    options: {
      userName?: string;
      useCache?: boolean;
      maxRetries?: number;
      excludeEngines?: string[];
    } = {}
  ): Promise<EngineExecutionResult> {
    const { userName, useCache = true, maxRetries = 2, excludeEngines = [] } = options;
    
    console.log('🚀 Executando cálculo com sistema de prioridades...');

    // 1. Verificar cache primeiro se habilitado
    if (useCache && data.selections) {
      const cached = resultCacheService.get(data.selections, userName);
      if (cached) {
        const unifiedResult = resultFormatAdapter.autoDetectAndConvert(cached, userName);
        return {
          engineId: 'cache',
          success: true,
          result: unifiedResult,
          executionTime: 0,
          fromCache: true
        };
      }
    }

    // 2. Obter motores ativos ordenados por prioridade
    const availableEngines = this.getEnginesByPriority()
      .filter(engine => 
        engine.status === 'active' && 
        !excludeEngines.includes(engine.id)
      );

    if (availableEngines.length === 0) {
      throw new Error('Nenhum motor ativo disponível');
    }

    // 3. Tentar execução com cada motor até obter sucesso
    let lastError: string = '';
    
    for (const engine of availableEngines) {
      try {
        console.log(`🔄 Tentando motor: ${engine.name} (prioridade ${engine.priority})`);
        
        const result = await this.executeEngine(engine, data, { maxRetries });
        
        if (result.success && result.result) {
          // Armazenar no cache se habilitado
          if (useCache && data.selections && result.result) {
            const adaptedResult = resultFormatAdapter.toQuizResultPayload(result.result);
            resultCacheService.set(data.selections, adaptedResult, userName);
          }
          
          return result;
        }
        
        lastError = result.error || 'Execução falhou sem erro específico';
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.warn(`⚠️ Motor ${engine.name} falhou:`, lastError);
        
        // Marcar erro no motor
        engine.errors = engine.errors || [];
        engine.errors.push(`${new Date().toISOString()}: ${lastError}`);
        
        // Limitar histórico de erros
        if (engine.errors.length > 10) {
          engine.errors = engine.errors.slice(-10);
        }
      }
    }

    // 4. Se todos falharam, usar fallback
    console.error('❌ Todos os motores falharam, usando fallback');
    return this.createFallbackResult(lastError);
  }

  /**
   * Executa um motor específico
   */
  async executeEngine(
    engine: EngineDefinition, 
    data: any, 
    options: { maxRetries?: number } = {}
  ): Promise<EngineExecutionResult> {
    const { maxRetries = 1 } = options;
    const startTime = Date.now();
    
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Executando ${engine.name} (tentativa ${attempt}/${maxRetries})`);
        
        // Verificar saúde do motor se disponível
        if (engine.isHealthy) {
          const healthy = await Promise.race([
            engine.isHealthy(),
            new Promise<boolean>(resolve => setTimeout(() => resolve(false), 2000)) // 2s timeout
          ]);
          
          if (!healthy) {
            throw new Error('Motor reportou estado não saudável');
          }
        }
        
        // Executar o motor
        const rawResult = await Promise.race([
          engine.execute(data, options),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout de execução (10s)')), 10000)
          )
        ]);
        
        // Converter resultado para formato unificado
        const unifiedResult = resultFormatAdapter.autoDetectAndConvert(rawResult);
        
        // Validar resultado
        const validation = resultFormatAdapter.validate(unifiedResult);
        if (!validation.isValid) {
          throw new Error(`Resultado inválido: ${validation.errors.join(', ')}`);
        }
        
        const executionTime = Date.now() - startTime;
        
        // Atualizar estatísticas do motor
        engine.lastUsed = new Date();
        
        const result: EngineExecutionResult = {
          engineId: engine.id,
          success: true,
          result: unifiedResult,
          executionTime,
          fromCache: false
        };
        
        this.addToHistory(result);
        
        console.log(`✅ Motor ${engine.name} executado com sucesso em ${executionTime}ms`);
        return result;
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.warn(`⚠️ Tentativa ${attempt} falhou para ${engine.name}:`, lastError);
        
        if (attempt === maxRetries) break;
        
        // Delay antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    const executionTime = Date.now() - startTime;
    const result: EngineExecutionResult = {
      engineId: engine.id,
      success: false,
      error: lastError,
      executionTime,
      fromCache: false
    };
    
    this.addToHistory(result);
    return result;
  }

  /**
   * Obtém motores ordenados por prioridade
   */
  getEnginesByPriority(): EngineDefinition[] {
    return Array.from(this.engines.values())
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Obtém estatísticas do registro
   */
  getStatistics() {
    const engines = Array.from(this.engines.values());
    const recentHistory = this.executionHistory.slice(-20);
    
    return {
      totalEngines: engines.length,
      activeEngines: engines.filter(e => e.status === 'active').length,
      disabledEngines: engines.filter(e => e.status === 'disabled').length,
      fallbackEngines: engines.filter(e => e.status === 'fallback').length,
      recentExecutions: recentHistory.length,
      successRate: recentHistory.length > 0 
        ? recentHistory.filter(h => h.success).length / recentHistory.length * 100
        : 0,
      averageExecutionTime: recentHistory.length > 0
        ? recentHistory.reduce((sum, h) => sum + h.executionTime, 0) / recentHistory.length
        : 0,
      engineDetails: engines.map(engine => ({
        id: engine.id,
        name: engine.name,
        priority: engine.priority,
        status: engine.status,
        lastUsed: engine.lastUsed,
        errorCount: engine.errors?.length || 0,
        recentErrors: engine.errors?.slice(-3) || []
      }))
    };
  }

  /**
   * Altera status de um motor
   */
  setEngineStatus(engineId: string, status: EngineStatus): boolean {
    const engine = this.engines.get(engineId);
    if (!engine) return false;
    
    engine.status = status;
    console.log(`🔧 Motor ${engine.name} status alterado para: ${status}`);
    return true;
  }

  /**
   * Limpa histórico de execuções
   */
  clearHistory(): void {
    this.executionHistory = [];
    console.log('🧹 Histórico de execuções limpo');
  }

  /**
   * Registra motores padrão do sistema
   */
  private registerDefaultEngines(): void {
    // Motor principal - quizResultsService
    this.register({
      id: 'quiz-results-service',
      name: 'Quiz Results Service',
      version: '3.0.0',
      priority: 100, // Prioridade máxima
      status: 'active',
      capabilities: ['full-calculation', 'supabase-integration', 'style-analysis'],
      description: 'Motor principal com análise completa de estilo e persistência',
      execute: async (data: any) => {
        const { quizResultsService } = await import('@/services/quizResultsService');
        return await quizResultsService.calculateResults(data);
      },
      isHealthy: async () => {
        // Verificar se pode acessar dependências
        try {
          await import('@/services/quizResultsService');
          return true;
        } catch {
          return false;
        }
      }
    });

    // Motor de fallback - ResultOrchestrator
    this.register({
      id: 'result-orchestrator',
      name: 'Result Orchestrator',
      version: '2.0.0',
      priority: 80,
      status: 'fallback', // Usado apenas se principal falhar
      capabilities: ['basic-calculation', 'local-storage'],
      description: 'Motor de fallback com cálculos básicos e armazenamento local',
      execute: async (data: any) => {
        const { ResultOrchestrator } = await import('@/services/core/ResultOrchestrator');
        const result = await ResultOrchestrator.run({
          selectionsByQuestion: data.selections || {},
          userName: data.userName || 'Usuário'
        });
        return result.payload;
      }
    });

    console.log('🔧 Motores padrão registrados');
  }

  /**
   * Valida definição de motor
   */
  private validateEngine(engine: EngineDefinition): void {
    if (!engine.id || typeof engine.id !== 'string') {
      throw new Error('Motor deve ter ID válido');
    }
    
    if (!engine.name || typeof engine.name !== 'string') {
      throw new Error('Motor deve ter nome válido');
    }
    
    if (typeof engine.priority !== 'number') {
      throw new Error('Motor deve ter prioridade numérica');
    }
    
    if (typeof engine.execute !== 'function') {
      throw new Error('Motor deve ter função execute');
    }
    
    if (this.engines.has(engine.id)) {
      console.warn(`⚠️ Sobrescrevendo motor existente: ${engine.id}`);
    }
  }

  /**
   * Cria resultado de fallback
   */
  private createFallbackResult(error: string): EngineExecutionResult {
    return {
      engineId: 'fallback',
      success: false,
      error,
      executionTime: 0,
      fromCache: false
    };
  }

  /**
   * Adiciona execução ao histórico
   */
  private addToHistory(result: EngineExecutionResult): void {
    this.executionHistory.push(result);
    
    // Manter apenas os últimos registros
    if (this.executionHistory.length > this.MAX_HISTORY) {
      this.executionHistory = this.executionHistory.slice(-this.MAX_HISTORY);
    }
  }
}

// Instância singleton
export const engineRegistry = new EngineRegistry();
export default engineRegistry;