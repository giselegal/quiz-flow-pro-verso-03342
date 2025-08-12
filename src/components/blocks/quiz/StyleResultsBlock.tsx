// @ts-nocheck
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { styleConfig } from '@/data/styleConfig';
import { QuizResult } from '@/hooks/useQuizResults';
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
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const StyleResultsBlock: React.FC<StyleResultsBlockProps> = ({
  result,
  categoryScores,
  showAllStyles = false,
  showGuideImage = true,
  guideImageUrl = null,
  onReset,
  onShare,
}) => {
  const { user } = useAuth();
  const userName = user?.name || user?.email || 'Usuário';
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Obter estilos ordenados por pontuação
  const sortedStyles = Object.entries(categoryScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .filter(([style]) => style in styleConfig);

  // Estilo principal (maior pontuação)
  const mainStyle = sortedStyles[0]?.[0] as keyof typeof styleConfig | undefined;

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

      {sortedStyles.length > 0 && (
        <div className="mb-8 p-4 bg-stone-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-[#432818]">Sua Composição de Estilos</h3>

          <div className="space-y-3">
            {sortedStyles.slice(0, showAllStyles ? undefined : 3).map(([style, score]) => (
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

          {!showAllStyles && sortedStyles.length > 3 && (
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
