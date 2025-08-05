import QuizResultsBlock from "@/components/blocks/quiz/QuizResultsBlock";
import { QuizResult, useQuizResults } from "@/hooks/useQuizResults";
import React, { useEffect, useState } from "react";
import { QuizBlockProps } from "./types";

export interface QuizResultsBlockEditorProps extends QuizBlockProps {
  properties: {
    results?: string; // JSON string com todos os resultados possíveis
    calculationMethod?: string; // JSON string com o método de cálculo
    showScores?: boolean;
    showAllResults?: boolean;
    demoResult?: string; // ID do resultado para preview no editor
  };
}

const QuizResultsBlockEditor: React.FC<QuizResultsBlockEditorProps> = ({
  properties,
  id,
  onPropertyChange,
  ...props
}) => {
  // Parse das propriedades
  const parseResults = (): QuizResult[] => {
    try {
      return JSON.parse(properties?.results || "[]");
    } catch (e) {
      console.error("Erro ao parsear resultados:", e);
      return [];
    }
  };

  const parseCalculationMethod = () => {
    try {
      return JSON.parse(properties?.calculationMethod || '{"type":"sum"}');
    } catch (e) {
      console.error("Erro ao parsear método de cálculo:", e);
      return { type: "sum" };
    }
  };

  // Estados
  const [results] = useState<QuizResult[]>(parseResults());
  const [demoResult, setDemoResult] = useState<QuizResult | null>(null);

  // Hooks
  const { determineResult } = useQuizResults();

  // Efeito para configurar o resultado de demonstração
  useEffect(() => {
    if (results.length === 0) return;

    // Se houver um demoResult nas propriedades, use-o
    if (properties?.demoResult) {
      const selectedResult = results.find(r => r.id === properties.demoResult);
      if (selectedResult) {
        setDemoResult(selectedResult);
        return;
      }
    }

    // Caso contrário, use o primeiro resultado
    setDemoResult(results[0]);
  }, [properties?.demoResult, results]);

  // Dados simulados para demonstração
  const demoScores = [
    { category: "Elegante", score: 7, count: 3 },
    { category: "Clássico", score: 5, count: 2 },
    { category: "Contemporâneo", score: 3, count: 1 },
  ];

  // Manipuladores de eventos
  const handleReset = () => {
    console.log("Reset demo");
  };

  const handleShare = () => {
    console.log("Share demo");
  };

  // Renderização
  if (!demoResult) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Adicione resultados para visualizar a prévia</p>
      </div>
    );
  }

  return (
    <div className="quiz-results-block-editor" data-block-id={id}>
      <QuizResultsBlock
        result={demoResult}
        categoryScores={properties?.showScores ? demoScores : undefined}
        showScores={properties?.showScores}
        onReset={handleReset}
        onShare={handleShare}
      />
    </div>
  );
};

export default QuizResultsBlockEditor;
