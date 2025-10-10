/**
 * 🔄 SERVIÇO DE ARMAZENAMENTO UNIFICADO - FASE 3
 * 
 * Consolida userSelections e quizAnswers em uma única fonte de verdade
 * com sincronização automática e validação cruzada
 */

import { StorageService } from './StorageService';
import { ContextualStorageService } from './ContextualStorageService';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import EVENTS from '@/core/constants/events';

export interface UnifiedQuizData {
  // Seleções de múltipla escolha (ex: etapas 2-19)
  selections: Record<string, string[]>;

  // Dados de formulário (ex: nome, email, telefone)
  formData: Record<string, any>;

  // Metadados
  metadata: {
    currentStep: number;
    completedSteps: number[];
    startedAt: string;
    lastUpdated: string;
    version: string;
  };

  // Resultado calculado (cache)
  result?: any;
}

class UnifiedQuizStorageService {
  private readonly STORAGE_KEY = 'unifiedQuizData';
  private readonly LEGACY_KEYS = ['userSelections', 'quizAnswers'];
  private contextualStorage: ContextualStorageService;

  constructor(context: FunnelContext = FunnelContext.EDITOR) {
    this.contextualStorage = new ContextualStorageService(context);
  }

  /**
   * Permite alterar o contexto dinamicamente
   */
  setContext(context: FunnelContext): void {
    this.contextualStorage = new ContextualStorageService(context);
  }

  /**
   * Carrega dados unificados, migrando dados legados se necessário
   */
  loadData(): UnifiedQuizData {
    // Tentar carregar dados unificados do storage contextual primeiro
    const unified = this.contextualStorage.getJSON<UnifiedQuizData>(this.STORAGE_KEY);
    if (unified && this.isValidUnifiedData(unified)) {
      return unified;
    }

    // Fallback: tentar carregar do storage legado (sem contexto)
    const legacyUnified = StorageService.safeGetJSON<UnifiedQuizData>(this.STORAGE_KEY);
    if (legacyUnified && this.isValidUnifiedData(legacyUnified)) {
      // Migrar para storage contextual
      this.contextualStorage.setJSON(this.STORAGE_KEY, legacyUnified);
      StorageService.safeRemove(this.STORAGE_KEY);
      return legacyUnified;
    }

    // Se não existir, migrar dados legados
    return this.migrateLegacyData();
  }

  /**
   * Salva dados unificados e notifica mudanças
   */
  saveData(data: UnifiedQuizData, opts?: { skipAnswerEvent?: boolean }): boolean {
    data.metadata.lastUpdated = new Date().toISOString();
    data.metadata.version = '2.0';

    const success = this.contextualStorage.setJSON(this.STORAGE_KEY, data);

    if (success) {
      // Notificar mudanças para hooks e componentes
      this.dispatchEvents({ skipAnswerEvent: opts?.skipAnswerEvent });

      // Sincronizar com chaves legadas para compatibilidade (temporário)
      this.syncLegacyKeys(data);
    }

    return success;
  }

  /**
   * Atualiza apenas as seleções de múltipla escolha
   */
  updateSelections(questionId: string, selectedOptions: string[]): boolean {
    const data = this.loadData();
    data.selections[questionId] = selectedOptions;
    return this.saveData(data);
  }

  /**
   * Atualiza apenas dados de formulário
   */
  updateFormData(key: string, value: any): boolean {
    const data = this.loadData();
    data.formData[key] = value;
    return this.saveData(data);
  }

  /**
   * Atualiza step atual e marca como completo
   */
  updateProgress(currentStep: number): boolean {
    const data = this.loadData();
    data.metadata.currentStep = currentStep;

    // Adicionar step aos completos se não estiver lá
    if (!data.metadata.completedSteps.includes(currentStep)) {
      data.metadata.completedSteps.push(currentStep);
    }

    return this.saveData(data);
  }

  /**
   * Salva resultado calculado
   */
  saveResult(result: any): boolean {
    const data = this.loadData();
    data.result = result;
    // Evitar emitir QUIZ_ANSWER_UPDATED quando apenas o resultado mudou
    return this.saveData(data, { skipAnswerEvent: true });
  }

  /**
   * Valida se há dados suficientes para calcular resultado
   */
  hasEnoughDataForResult(): boolean {
    const data = this.loadData();
    const selectionCount = Object.keys(data.selections).length;
    const formHasName = Boolean(data.formData.userName || data.formData.name);

    // Verificar se estamos na etapa 20 (resultado)
    const isResultStep = data.metadata?.currentStep === 20;

    // Se estamos na etapa 20, sempre permitir o cálculo
    if (isResultStep) {
      console.log('🎯 Etapa 20 detectada: permitindo cálculo de resultado');
      return true;
    }

    // Caso contrário, precisa de pelo menos 8 seleções das etapas 2-11 e um nome
    return selectionCount >= 8 && formHasName;
  }

  /**
   * Obtém estatísticas dos dados
   */
  getDataStats() {
    const data = this.loadData();
    return {
      selectionsCount: Object.keys(data.selections).length,
      formDataCount: Object.keys(data.formData).length,
      completedSteps: data.metadata.completedSteps.length,
      hasResult: Boolean(data.result),
      lastUpdated: data.metadata.lastUpdated,
      dataSize: JSON.stringify(data).length
    };
  }

  /**
   * Limpa todos os dados
   */
  clearAll(): boolean {
    const success = this.contextualStorage.remove(this.STORAGE_KEY);

    // Limpar também chaves legadas
    this.LEGACY_KEYS.forEach(key => {
      StorageService.safeRemove(key);
      this.contextualStorage.remove(key);
    });

    if (success) {
      this.dispatchEvents();
    }

    return success;
  }

  private migrateLegacyData(): UnifiedQuizData {
    console.log('🔄 UnifiedQuizStorage: Migrando dados legados...');

    const userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {};
    const quizAnswers = StorageService.safeGetJSON<Record<string, any>>('quizAnswers') || {};

    const unified: UnifiedQuizData = {
      selections: userSelections,
      formData: quizAnswers,
      metadata: {
        currentStep: 1,
        completedSteps: Object.keys(userSelections).map(key => {
          const match = key.match(/step-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        }).filter(step => step > 0),
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: '2.0'
      }
    };

    // Salvar dados migrados
    this.saveData(unified);

    console.log('✅ UnifiedQuizStorage: Migração concluída', {
      selections: Object.keys(unified.selections).length,
      formData: Object.keys(unified.formData).length
    });

    return unified;
  }

  private isValidUnifiedData(data: any): data is UnifiedQuizData {
    return data &&
      typeof data.selections === 'object' &&
      typeof data.formData === 'object' &&
      typeof data.metadata === 'object' &&
      typeof data.metadata.version === 'string';
  }

  private syncLegacyKeys(data: UnifiedQuizData): void {
    // Manter compatibilidade com código legado
    StorageService.safeSetJSON('userSelections', data.selections);
    StorageService.safeSetJSON('quizAnswers', data.formData);
  }

  private dispatchEvents(opts?: { skipAnswerEvent?: boolean }): void {
    try {
      if (!opts?.skipAnswerEvent) {
        window.dispatchEvent(new Event(EVENTS.QUIZ_ANSWER_UPDATED));
      }
      window.dispatchEvent(new Event(EVENTS.QUIZ_RESULT_UPDATED));
      window.dispatchEvent(new Event('unified-quiz-data-updated'));
    } catch (e) {
      // Silencioso se window não existir (SSR)
    }
  }
}

export const unifiedQuizStorage = new UnifiedQuizStorageService();
export default unifiedQuizStorage;