import { Button } from "@/components/ui/button";
import { QuizResult } from "@/hooks/useQuizResults";
import React from "react";

interface QuizResultsBlockProps {
  result: QuizResult;
  categoryScores?: { category: string; score: number; count: number }[];
  showScores?: boolean;
  onReset?: () => void;
  onShare?: () => void;
}

const QuizResultsBlock: React.FC<QuizResultsBlockProps> = ({
  result,
  categoryScores,
  showScores = false,
  onReset,
  onShare,
}) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#432818] mb-4">{result.title}</h2>

        {result.imageUrl && (
          <div className="mb-6">
            <img
              src={result.imageUrl}
              alt={result.title}
              className="w-full max-w-md mx-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg prose-stone mx-auto">
          <p className="text-gray-700">{result.description}</p>
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

export default QuizResultsBlock;
