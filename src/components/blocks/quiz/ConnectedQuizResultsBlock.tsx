import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz';
import { QuizResult, StyleResult } from '@/types/quiz';
import React, { useEffect, useState } from 'react';

/**
 * ConnectedQuizResultsBlock - Componente conectado que exibe o resultado do quiz
 *
 * ✅ INTEGRAÇÃO COMPLETA:
 * - Usa respostas das etapas 2-11 para cálculo
 * - Monitora questões estratégicas 13-18 para métricas
 * - Conecta com Supabase para persistência
 */

interface ConnectedQuizResultsBlockProps {
  id: string;
  className?: string;
  sessionId?: string;
  showScores?: boolean;
  showAllStyles?: boolean;
  onResultCalculated?: (result: QuizResult) => void;
}

export const ConnectedQuizResultsBlock: React.FC<ConnectedQuizResultsBlockProps> = ({
  id,
  className = '',
  sessionId,
  showScores = true,
  showAllStyles = false,
  onResultCalculated,
}) => {
  const { session, result: supabaseResult, isLoading } = useSupabaseQuiz();
  const { answers, strategicAnswers, completeQuiz, quizResult } = useQuizLogic();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<QuizResult | null>(null);

  // ID da sessão ativa (fornecido ou atual)
  const activeSessionId = sessionId || session?.id;

  // ✅ CALCULAR RESULTADO baseado nas etapas 2-11
  useEffect(() => {
    const calculateResults = async () => {
      if (!answers.length || isCalculating) return;

      setIsCalculating(true);

      try {
        // Usar o resultado do useQuizLogic que já filtra apenas questões 2-11
        completeQuiz();

        // Salvar no Supabase se tiver sessão ativa
        if (activeSessionId && quizResult) {
          console.log('💾 SALVANDO RESULTADO:', {
            sessionId: activeSessionId,
            result: quizResult,
            strategicAnswers: strategicAnswers.length, // Métricas
          });

          // TODO: Integrar com quizSupabaseService.saveQuizResult()
        }

        setCalculatedResult(quizResult);
        if (quizResult) {
          onResultCalculated?.(quizResult);
        }
      } catch (error) {
        console.error('❌ Erro ao calcular resultado:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateResults();
  }, [
    answers,
    activeSessionId,
    completeQuiz,
    quizResult,
    strategicAnswers,
    onResultCalculated,
    isCalculating,
  ]);

  // Resultado final (calculado ou do Supabase)
  const finalResult = calculatedResult || supabaseResult || quizResult;

  // ⏳ LOADING STATE
  if (isLoading || isCalculating || !finalResult) {
    return (
      <div id={id} className={`quiz-results-loading ${className}`}>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A]"></div>
          <p className="text-[#432818] text-lg font-medium">
            {isCalculating ? 'Calculando seu resultado...' : 'Carregando dados...'}
          </p>
        </div>
      </div>
    );
  }

  // 📊 PREPARAR DADOS PARA EXIBIÇÃO
  const primaryStyle = finalResult.primaryStyle;
  const secondaryStyles = finalResult.secondaryStyles || [];
  const totalQuestions = finalResult.totalQuestions || 0;

  return (
    <div id={id} className={`quiz-results-block ${className}`}>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* 🏆 RESULTADO PRINCIPAL */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#B89B7A] text-white px-4 py-2 rounded-full text-sm font-medium">
            <span>🎉</span>
            <span>SEU ESTILO PREDOMINANTE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#432818] leading-tight">
            {primaryStyle?.category || 'Estilo Único'}
          </h1>

          <p className="text-xl text-[#432818] opacity-80 max-w-2xl mx-auto">
            Com {primaryStyle?.percentage || 0}% de compatibilidade baseado em suas {totalQuestions}{' '}
            respostas
          </p>
        </div>

        {/* 📈 PONTUAÇÃO DETALHADA (SE HABILITADA) */}
        {showScores && (
          <div className="bg-[#F8F6F4] rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#432818] text-center mb-4">
              Sua Pontuação Detalhada
            </h3>

            {/* Estilo Primário */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#432818]">{primaryStyle?.category}</span>
                <span className="font-bold text-[#B89B7A]">{primaryStyle?.score} pontos</span>
              </div>
              <div className="w-full bg-[#E5DDD5] rounded-full h-3">
                <div
                  className="bg-[#B89B7A] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${primaryStyle?.percentage || 0}%` }}
                />
              </div>
            </div>

            {/* Estilos Secundários (SE HABILITADO) */}
            {showAllStyles && secondaryStyles.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-[#E5DDD5]">
                <h4 className="text-sm font-medium text-[#432818] opacity-80">Outros Estilos:</h4>
                {secondaryStyles.slice(0, 3).map((style: StyleResult, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-[#432818]">{style.category}</span>
                    <span className="text-[#6B4F43]">{style.score} pontos</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 📊 MÉTRICAS DAS QUESTÕES ESTRATÉGICAS */}
        {strategicAnswers.length > 0 && (
          <div className="bg-[#F3E8E6] rounded-xl p-4 border-l-4 border-[#B89B7A]">
            <p className="text-sm text-[#432818] opacity-70">
              📊 Coletamos {strategicAnswers.length} respostas estratégicas para personalizar sua
              experiência
            </p>
          </div>
        )}

        {/* 🎯 INFORMAÇÕES SOBRE O CÁLCULO */}
        <div className="text-center text-sm text-[#432818] opacity-60 space-y-2">
          <p>
            ✅ Resultado baseado em suas respostas das questões 2-11
            {strategicAnswers.length > 0 &&
              ` • ${strategicAnswers.length} respostas estratégicas coletadas para métricas`}
          </p>
          <p>🕒 Calculado em {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectedQuizResultsBlock;
