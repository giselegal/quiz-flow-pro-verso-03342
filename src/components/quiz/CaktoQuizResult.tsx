import { QuizResult, StyleType } from '@/types/quiz';
import { getStyleById } from '@/data/styles';

interface CaktoQuizResultProps {
  result: QuizResult;
  onContinue: () => void;
}

const CaktoQuizResult: React.FC<CaktoQuizResultProps> = ({ result, onContinue }) => {
  // Safe property access with defaults
  const primaryStyle = result.predominantStyle
    ? getStyleById(result.predominantStyle as StyleType)
    : null;
  const complementaryStyles =
    result.complementaryStyles
      ?.map(styleId => getStyleById(styleId as StyleType))
      .filter(Boolean) || [];

  const styleScores = result.styleScores || {};
  const sortedScores = Object.entries(styleScores).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  );
  const topSecondaryStyles = complementaryStyles.slice(0, 3);
  const totalScore = Object.values(styleScores).reduce((sum, score) => sum + (score as number), 0);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair text-[#432818] mb-4">Seu Resultado</h1>
          <p className="text-[#8F7A6A] text-lg">
            Descobrimos seu estilo único baseado em suas respostas
          </p>
        </div>

        {/* Primary Style Result */}
        {primaryStyle && (
          <div className="bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-playfair text-[#432818] mb-2">Seu Estilo Principal</h2>
              <h3 className="text-2xl font-semibold text-[#B89B7A] mb-4">{primaryStyle.name}</h3>
              <p className="text-[#8F7A6A] text-lg leading-relaxed">{primaryStyle.description}</p>
            </div>

            {primaryStyle.imageUrl && (
              <div className="mb-6">
                <img
                  src={primaryStyle.imageUrl}
                  alt={`Estilo ${primaryStyle.name}`}
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-[#FAF9F7] rounded-lg">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: primaryStyle.colors.primary }}
                ></div>
                <p className="text-sm text-[#8F7A6A]">Cor Principal</p>
              </div>
              <div className="text-center p-4 bg-[#FAF9F7] rounded-lg">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: primaryStyle.colors.secondary }}
                ></div>
                <p className="text-sm text-[#8F7A6A]">Cor Secundária</p>
              </div>
              <div className="text-center p-4 bg-[#FAF9F7] rounded-lg">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: primaryStyle.colors.accent }}
                ></div>
                <p className="text-sm text-[#8F7A6A]">Cor de Destaque</p>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Styles */}
        {topSecondaryStyles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-8 mb-6">
            <h3 className="text-2xl font-playfair text-[#432818] mb-6 text-center">
              Estilos Complementares
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topSecondaryStyles.map((style, index) => (
                <div key={style?.id || index} className="text-center">
                  <h4 className="text-lg font-semibold text-[#B89B7A] mb-2">{style?.name}</h4>
                  <p className="text-sm text-[#8F7A6A]">{style?.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-8 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#432818]">{result.totalQuestions || 0}</div>
              <div className="text-sm text-[#8F7A6A]">Perguntas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#432818]">{sortedScores.length}</div>
              <div className="text-sm text-[#8F7A6A]">Estilos Avaliados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#432818]">{Math.round(totalScore)}</div>
              <div className="text-sm text-[#8F7A6A]">Pontuação Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#432818]">
                {primaryStyle
                  ? Math.round((((styleScores[primaryStyle.id] as number) || 0) / totalScore) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-[#8F7A6A]">Compatibilidade</div>
            </div>
          </div>
        </div>

        {/* Style Scores Breakdown */}
        {sortedScores.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-8 mb-6">
            <h3 className="text-xl font-playfair text-[#432818] mb-6 text-center">
              Compatibilidade por Estilo
            </h3>
            <div className="space-y-4">
              {sortedScores.map(([styleId, score]) => {
                const style = getStyleById(styleId as StyleType);
                const percentage = Math.round(((score as number) / totalScore) * 100);

                return (
                  <div key={styleId} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-[#8F7A6A] font-medium">{style?.name}</div>
                    <div style={{ backgroundColor: '#E5DDD5' }}>
                      <div
                        className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-[#432818] font-semibold">{percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="bg-[#B89B7A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#A08972] transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaktoQuizResult;
