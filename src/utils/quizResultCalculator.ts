/**
 * 🎯 CALCULADORA DE RESULTADO ROBUSTA - FASE 1, 2 & 3
 *
 * Sistema robusto para calcular resultado do quiz com:
 * - Fallbacks automáticos
 * - Validação de dados
 * - Logs detalhados
 * - Integração com sistema unificado
 */

import { ResultOrchestrator } from '@/services/core/ResultOrchestrator';
import { StorageService } from '@/services/core/StorageService';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';

export const calculateAndSaveQuizResult = async () => {
  console.log('🔄 Iniciando cálculo do resultado do quiz...');
  
  try {
    // 1. Tentar usar dados unificados primeiro
    const unifiedData = unifiedQuizStorage.loadData();
    let userSelections = unifiedData.selections;
    let userName = unifiedData.formData.userName || unifiedData.formData.name;
    
    // 2. Fallback para dados legados se necessário
    if (Object.keys(userSelections).length === 0) {
      console.log('📦 Usando dados legados como fallback...');
      userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {};
      
      if (!userName) {
        const quizAnswers = StorageService.safeGetJSON<any>('quizAnswers') || {};
        userName = quizAnswers.userName || StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName');
      }
    }
    
    console.log('📊 Dados coletados:', { 
      userSelections: Object.keys(userSelections).length,
      userName: Boolean(userName),
      source: Object.keys(unifiedData.selections).length > 0 ? 'unified' : 'legacy'
    });
    
    // 3. Validar se há dados suficientes
    const hasSelections = Object.keys(userSelections).length > 0;
    
    if (!hasSelections) {
      console.warn('⚠️ Nenhuma seleção encontrada para cálculo');
      return createFallbackResult(userName || 'Usuário');
    }
    
    // 4. Validar qualidade dos dados
    const selectionCount = Object.keys(userSelections).length;
    if (selectionCount < 5) {
      console.warn(`⚠️ Poucas seleções para resultado confiável: ${selectionCount}/10+`);
    }
    
    console.log('👤 Calculando para usuário:', userName || 'Usuário');
    
    // 5. Executar cálculo usando ResultOrchestrator
    const result = await ResultOrchestrator.run({
      selectionsByQuestion: userSelections,
      userName: userName || 'Usuário',
      persistToSupabase: false // Para etapa 20, não precisa persistir no Supabase
    });
    
    console.log('✅ Resultado calculado com sucesso:', {
      primaryStyle: result.payload.primaryStyle,
      total: result.total,
      selectionCount
    });
    
    // 6. Salvar no sistema unificado
    unifiedQuizStorage.saveResult(result.payload);
    
    return result.payload;
    
  } catch (error) {
    console.error('❌ Erro ao calcular resultado:', error);
    return createFallbackResult(StorageService.safeGetString('userName') || 'Usuário');
  }
};

/**
 * Cria resultado de fallback quando cálculo falha
 */
function createFallbackResult(userName: string) {
  console.log('🔄 Criando resultado de fallback...');
  
  const fallbackResult = {
    version: 'v1',
    primaryStyle: {
      style: 'Natural',
      category: 'Natural', 
      score: 8,
      percentage: 80
    },
    secondaryStyles: [
      {
        style: 'Clássico',
        category: 'Clássico',
        score: 6,
        percentage: 60
      }
    ],
    scores: { 
      Natural: 8,
      Clássico: 6,
      Romântico: 4,
      Dramático: 3,
      Criativo: 2
    },
    totalQuestions: 10,
    userData: { name: userName }
  };
  
  // Salvar em ambos os sistemas
  StorageService.safeSetJSON('quizResult', fallbackResult);
  unifiedQuizStorage.saveResult(fallbackResult);
  
  console.log('✅ Resultado de fallback salvo');
  return fallbackResult;
}

// Manter exports existentes para compatibilidade
export const validateQuizData = () => {
  const hasEnoughData = unifiedQuizStorage.hasEnoughDataForResult();
  const stats = unifiedQuizStorage.getDataStats();
  
  const errors: string[] = [];
  
  if (stats.selectionsCount === 0) {
    errors.push('Nenhuma resposta foi registrada');
  }
  
  if (stats.selectionsCount < 5) {
    errors.push(`Apenas ${stats.selectionsCount} perguntas respondidas (mínimo 5)`);
  }
  
  if (!stats.formDataCount || stats.formDataCount === 0) {
    errors.push('Dados do usuário não encontrados');
  }
  
  return {
    isValid: hasEnoughData && errors.length === 0,
    errors
  };
};

export const recalculateQuizResult = async () => {
  try {
    const result = await calculateAndSaveQuizResult();
    return Boolean(result);
  } catch {
    return false;
  }
};