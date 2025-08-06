import { Button } from "@/components/ui/button";
import { QuizResult } from "@/hooks/useQuizResults";
import { Block } from "@/types/editor";
import React from "react";

// Interface original para uso direto
interface QuizResultsBlockProps {
  result: QuizResult;
  categoryScores?: { category: string; score: number; count: number }[];
  showScores?: boolean;
  onReset?: () => void;
  onShare?: () => void;
}

// Interface para compatibilidade com UniversalBlockRenderer
interface UniversalQuizResultsBlockProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

// Componente wrapper para UniversalBlockRenderer
const UniversalQuizResultsBlock: React.FC<UniversalQuizResultsBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  // Extrair propriedades do bloco
  const blockProps = block.properties || {};
  const blockContent = block.content || {};

  // Mesclar properties e content
  const allProps = { ...blockProps, ...blockContent };

  // Extrair result das propriedades ou criar um padrão
  const result: QuizResult = allProps.result || {
    id: "default-result",
    title: "Seu Resultado",
    description: "Parabéns por completar o quiz!",
    category: "Geral",
    minScore: 0,
    maxScore: 100,
    displayOrder: 1,
    imageUrl: undefined,
  };

  const categoryScores = allProps.categoryScores || [];
  const showScores = allProps.showScores !== false; // default true

  const handleReset = () => {
    if (allProps.onReset) {
      allProps.onReset();
    } else {
      console.log("🔄 Reset quiz requested");
    }
  };

  const handleShare = () => {
    if (allProps.onShare) {
      allProps.onShare();
    } else {
      console.log("📤 Share result requested");
    }
  };

  return (
    <div
      className={`quiz-results-wrapper ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onClick={onClick}
    >
      <QuizResultsBlockCore
        result={result}
        categoryScores={categoryScores}
        showScores={showScores}
        onReset={handleReset}
        onShare={handleShare}
      />
    </div>
  );
};

// Componente principal renomeado
const QuizResultsBlockCore: React.FC<QuizResultsBlockProps> = ({
  result,
  categoryScores,
  showScores = false,
  onReset,
  onShare,
}) => {
  // ✅ CORREÇÃO: Verificação de segurança para result
  if (!result) {
    console.warn("QuizResultsBlock: result prop is undefined, usando dados padrão");
    const defaultResult: QuizResult = {
      id: "default-result",
      title: "Seu Resultado",
      description: "Parabéns por completar o quiz!",
      category: "Geral",
      minScore: 0,
      maxScore: 100,
      displayOrder: 1,
      imageUrl: undefined,
    };
    return (
      <QuizResultsBlockCore
        result={defaultResult}
        categoryScores={categoryScores}
        showScores={showScores}
        onReset={onReset}
        onShare={onShare}
      />
    );
  }

  // ✅ CORREÇÃO: Verificação adicional de propriedades obrigatórias
  const safeResult = {
    id: result.id || "default-result",
    title: result.title || "Seu Resultado",
    description: result.description || "Parabéns por completar o quiz!",
    category: result.category || "Geral",
    minScore: result.minScore || 0,
    maxScore: result.maxScore || 100,
    displayOrder: result.displayOrder || 1,
    imageUrl: result.imageUrl,
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#432818] mb-4">{safeResult.title}</h2>

        {safeResult.imageUrl && (
          <div className="mb-6">
            <img
              src={safeResult.imageUrl}
              alt={safeResult.title}
              className="w-full max-w-md mx-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg prose-stone mx-auto">
          <p className="text-gray-700">{safeResult.description}</p>
        </div>
      </div>

      {showScores && categoryScores && categoryScores.length > 0 && (
        <div className="mb-8 p-4 bg-stone-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-[#432818]">
            Seus Resultados por Categoria
          </h3>

          <div className="space-y-3">
            {categoryScores.map(categoryScore => (
              <div key={categoryScore.category} className="flex justify-between items-center">
                <span className="font-medium">{categoryScore.category}</span>
                <div className="flex items-center gap-3">
                  <div className="bg-stone-200 w-48 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B89B7A] h-full rounded-full"
                      style={{ width: `${Math.min(100, (categoryScore.score / 10) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{categoryScore.score} pts</span>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

// ✅ EXPORTAÇÕES CORRETAS
export const QuizResultsBlock = QuizResultsBlockCore;
export { UniversalQuizResultsBlock };
export default QuizResultsBlock;
