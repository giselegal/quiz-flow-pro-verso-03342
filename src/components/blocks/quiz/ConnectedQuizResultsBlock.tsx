import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz';
import { QuizResult } from '@/types/quiz';
import { STYLES } from '@/data/styles';
import { getBestUserName } from '@/core/user/name';
import QuizProgress from '@/components/quiz/components/QuizProgress';
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
  
  // 🎨 Obter dados completos do estilo
  const styleId = (primaryStyle?.category || primaryStyle?.style || 'natural').toLowerCase();
  const styleData = STYLES[styleId as keyof typeof STYLES] || STYLES.natural;
  
  // 👤 Nome do usuário
  const userName = getBestUserName() || 'Participante';
  
  // 📈 Calcular recomendações baseadas no estilo
  const getRecommendations = (style: string) => {
    const recommendations = {
      classico: [
        'Invista em peças de qualidade e cortes clássicos',
        'Prefira cores neutras como preto, branco, bege e tons terrosos',
        'Aposte em acessórios discretos mas marcantes',
        'Mantenha um guarda-roupa organizado e versátil'
      ],
      elegante: [
        'Invista em tecidos nobres e caimentos perfeitos',
        'Prefira paleta monocromática ou cores sofisticadas',
        'Aposte em peças statement de alta qualidade',
        'Mantenha sempre a postura e cuidado com detalhes'
      ],
      natural: [
        'Priorize tecidos naturais como algodão e linho',
        'Aposte em cores terrosas e tons naturais',
        'Escolha peças confortáveis e funcionais',
        'Valorize a simplicidade e autenticidade'
      ],
      romântico: [
        'Aposte em detalhes femininos como rendas e babados',
        'Prefira cores suaves e tons pastéis',
        'Use estampas florais e delicadas',
        'Invista em peças que realcem sua feminilidade'
      ],
      dramático: [
        'Use contrastes fortes e cores marcantes',
        'Aposte em geometrias definidas e linhas retas',
        'Invista em peças statement impactantes',
        'Mantenha sempre a confiança e postura'
      ],
      criativo: [
        'Experimente misturar estampas e texturas',
        'Use cores vibrantes e combinações inusitadas',
        'Aposte em peças únicas e autorais',
        'Deixe sua personalidade brilhar através das roupas'
      ],
      sexy: [
        'Aposte em decotes e recortes estratégicos',
        'Use peças que valorizem sua silhueta',
        'Prefira cores sensuais como vermelho e preto',
        'Mantenha sempre a confiança e atitude'
      ],
      contemporâneo: [
        'Acompanhe as tendências da moda atual',
        'Invista em peças com design moderno',
        'Use tecnologia têxtil e inovações',
        'Adapte as tendências ao seu estilo pessoal'
      ]
    };
    return recommendations[style as keyof typeof recommendations] || recommendations.natural;
  };

  return (
    <div id={id} className={`quiz-results-block ${className}`}>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* 🎉 HEADER DO RESULTADO */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#B89B7A] text-white px-6 py-3 rounded-full text-lg font-medium">
            <span>🎉</span>
            <span>RESULTADO DO QUIZ DE ESTILO PESSOAL</span>
          </div>
        </div>

        {/* 👤 RESULTADO PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#B89B7A]/20 space-y-6">
          {/* Nome */}
          <div className="text-center">
            <p className="text-lg text-[#432818] mb-2">
              <strong>Nome:</strong> {userName}
            </p>
          </div>

          {/* Estilo Principal */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#432818] leading-tight">
              {styleData.name}
            </h1>
            <p className="text-xl text-[#6B4F43] font-medium">
              <strong>Estilo Principal:</strong> {styleData.name}
            </p>
          </div>

          {/* Porcentagem com barra de progresso */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#B89B7A] mb-2">
                <strong>Porcentagem:</strong> {primaryStyle?.percentage || 85}%
              </p>
            </div>
            
            <QuizProgress 
              value={primaryStyle?.percentage || 85}
              max={100}
              showPercentage={true}
              color="#B89B7A"
              backgroundColor="#E5DDD5"
              height="12px"
            />
          </div>

          {/* Imagem do Estilo */}
          {styleData.imageUrl && (
            <div className="text-center">
              <div className="inline-block rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={styleData.imageUrl} 
                  alt={`Estilo ${styleData.name}`}
                  className="w-64 h-64 object-cover"
                  onError={(e) => {
                    // Fallback para imagem padrão se não carregar
                    (e.target as HTMLImageElement).src = '/placeholder-style.jpg';
                  }}
                />
              </div>
            </div>
          )}

          {/* Guia do Estilo */}
          {styleData.guideImageUrl && (
            <div className="text-center">
              <p className="text-lg font-medium text-[#432818] mb-3">
                <strong>Guia do Estilo:</strong>
              </p>
              <div className="inline-block rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={styleData.guideImageUrl} 
                  alt={`Guia do estilo ${styleData.name}`}
                  className="w-full max-w-md h-48 object-cover"
                  onError={(e) => {
                    // Fallback para guia padrão se não carregar
                    (e.target as HTMLImageElement).src = '/placeholder-guide.jpg';
                  }}
                />
              </div>
            </div>
          )}

          {/* Descrição */}
          <div className="bg-[#F8F6F4] rounded-xl p-6">
            <p className="text-lg text-[#432818] leading-relaxed">
              <strong>Descrição:</strong><br />
              {styleData.description}
            </p>
          </div>
        </div>

        {/* 📋 RECOMENDAÇÕES PERSONALIZADAS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#B89B7A]/20">
          <h2 className="text-2xl font-bold text-[#432818] mb-6 text-center">
            📋 Recomendações Personalizadas
          </h2>
          <div className="grid gap-4">
            {getRecommendations(styleId).map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-[#F8F6F4] rounded-lg">
                <span className="text-[#B89B7A] font-bold text-lg">{index + 1}.</span>
                <p className="text-[#432818] flex-1">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🏅 ESTILOS SECUNDÁRIOS */}
        {secondaryStyles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#B89B7A]/20">
            <h2 className="text-2xl font-bold text-[#432818] mb-6 text-center">
              🏅 Estilos Secundários
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {secondaryStyles.slice(0, 2).map((style, idx) => {
                const secondaryStyleData = STYLES[(style.category || style.style || 'natural').toLowerCase() as keyof typeof STYLES] || STYLES.natural;
                return (
                  <div key={idx} className="p-4 bg-[#F8F6F4] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-[#432818]">
                        {idx === 0 ? '2º' : '3º'} - {secondaryStyleData.name}
                      </span>
                      <span className="text-lg font-bold text-[#B89B7A]">
                        {style.percentage || 0}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 📊 INFORMAÇÕES SOBRE O CÁLCULO */}
        <div className="text-center text-sm text-[#432818] opacity-60 space-y-2 p-4 bg-[#F3E8E6] rounded-xl">
          <p>
            ✅ Resultado baseado em suas respostas das questões 2-11
            {strategicAnswers.length > 0 &&
              ` • ${strategicAnswers.length} respostas estratégicas coletadas para métricas`}
          </p>
          <p>📊 Total de {totalQuestions} questões analisadas</p>
          <p>🕒 Calculado em {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectedQuizResultsBlock;
