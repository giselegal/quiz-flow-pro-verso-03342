// @ts-nocheck
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';
import { QuizResult } from '@/hooks/useQuizResult'; // Corrigido para sem "s"
import React, { useState } from 'react';
import StyleGuideModal from './StyleGuideModal';

interface StyleResultsBlockProps {
  result: QuizResult;
  categoryScores: Record<string, number>;
  showAllStyles?: boolean;
  showGuideImage?: boolean;
  guideImageUrl?: string | null;
  onReset?: () => void;
  onShare?: () => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  // ... (mantido igual)
};

// Carregar styleConfig com tratamento de erro (ESM)
import { styleConfig as __styleConfig } from '@/config/styleConfig';
const safeStyleConfig = __styleConfig || {};

const StyleResultsBlock: React.FC<StyleResultsBlockProps> = ({
  result,
  categoryScores = {},
  showAllStyles = false,
  showGuideImage = true,
  guideImageUrl = null,
  onReset,
  onShare,
}) => {
  const { user } = useAuth();
  const userName = user?.name || user?.email || 'Usuário';
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Adicionar logs para depuração
  console.log('StyleResultsBlock - result:', result);
  console.log('StyleResultsBlock - categoryScores:', categoryScores);

  // Verificar se result é válido
  if (!result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Resultado não disponível</h2>
        <p className="mb-6">Não foi possível carregar o resultado do quiz.</p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Isso pode acontecer se você não respondeu a todas as perguntas do quiz.
          </p>
        </div>
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10"
          >
            Refazer Quiz
          </Button>
        )}
      </div>
    );
  }

  // Verificar se categoryScores é válido
  if (!categoryScores || Object.keys(categoryScores).length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-[#432818] mb-2">{result.title}</h2>
        <p className="mb-6">Não foi possível calcular a pontuação dos estilos.</p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Verifique se você respondeu a todas as perguntas do quiz.
          </p>
        </div>
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10"
          >
            Refazer Quiz
          </Button>
        )}
      </div>
    );
  }

  // Obter estilos ordenados por pontuação
  const sortedStyles = Object.entries(categoryScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .filter(([style]) => style in safeStyleConfig);

  // Se não houver estilos após o filtro, usar todos os estilos
  const finalStyles = sortedStyles.length > 0
    ? sortedStyles
    : Object.entries(categoryScores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

  // Estilo principal (maior pontuação)
  const mainStyle = finalStyles[0]?.[0] as keyof typeof safeStyleConfig | undefined;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#432818] mb-2">{result.title}</h2>
        <p style={{ color: '#8B7355' }}>Parabéns, {userName}! Seu estilo predominante é:</p>
        {result.imageUrl && (
          <div className="mb-6">
            <img
              src={result.imageUrl}
              alt={result.title}
              className="w-full max-w-md mx-auto rounded-lg object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg prose-stone mx-auto mb-8">
          <p style={{ color: '#6B4F43' }}>{result.description}</p>
        </div>
        {showGuideImage && guideImageUrl && (
          <div className="mb-8 p-4 bg-stone-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-[#432818]">
              Guia de Estilo Personalizado
            </h3>
            <div className="relative">
              <img
                src={guideImageUrl}
                alt={`Guia ${result.title}`}
                className="w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <Button
                  onClick={() => setShowGuideModal(true)}
                  className="bg-white text-[#432818] hover:bg-[#B89B7A] hover:text-white"
                >
                  Ver Guia Completo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {finalStyles.length > 0 && (
        <div className="mb-8 p-4 bg-stone-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-[#432818]">Sua Composição de Estilos</h3>
          <div className="space-y-3">
            {finalStyles.slice(0, showAllStyles ? undefined : 3).map(([style, score]) => (
              <div key={style} className="flex justify-between items-center">
                <span className="font-medium">{style}</span>
                <div className="flex items-center gap-3">
                  <div className="bg-stone-200 w-48 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B89B7A] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (score / Math.max(...Object.values(categoryScores))) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{score} pts</span>
                </div>
              </div>
            ))}
          </div>
          {!showAllStyles && finalStyles.length > 3 && (
            <p className="text-sm text-center mt-3 text-[#B89B7A]">
              Mostrando os 3 estilos predominantes
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10"
          >
            Refazer Quiz
          </Button>
        )}
        {onShare && (
          <Button onClick={onShare} className="bg-[#B89B7A] hover:bg-[#A08766] text-white">
            Compartilhar Resultado
          </Button>
        )}
      </div>
      {showGuideModal && mainStyle && (
        <StyleGuideModal style={mainStyle} onClose={() => setShowGuideModal(false)} />
      )}
    </div>
  );
};

export default StyleResultsBlock;