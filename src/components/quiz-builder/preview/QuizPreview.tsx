import React, { useState } from 'react';
import { QuizStage, QuizComponentData } from '@/types/quizBuilder';
import { Button } from '@/components/ui/button';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StyleResult } from '@/types/quiz';
import ResultPreview from './ResultPreview';
import StagePreview from './StagePreview';

interface QuizPreviewProps {
  stages: QuizStage[];
  components: QuizComponentData[];
  previewResult?: {
    primaryStyle: StyleResult;
    secondaryStyles: StyleResult[];
  } | null;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ stages, components, previewResult }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showingResult, setShowingResult] = useState(false);

  // Set showing result when previewResult changes
  React.useEffect(() => {
    if (previewResult) {
      setShowingResult(true);
    } else {
      setShowingResult(false);
    }
  }, [previewResult]);

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const currentStage = sortedStages[currentStageIndex];

  const handleNext = () => {
    if (currentStageIndex < sortedStages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
    }
  };

  // Handle back from result view
  const handleBackFromResult = () => {
    setShowingResult(false);
  };

  const totalStages = sortedStages.length;
  const progressPercent = totalStages > 1 ? (currentStageIndex / (totalStages - 1)) * 100 : 0;

  if (stages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: '#8B7355' }}>Nenhuma etapa adicionada ao quiz ainda.</p>
          <p className="text-gray-400 text-sm">
            Adicione etapas no modo editor para visualizar aqui.
          </p>
        </div>
      </div>
    );
  }

  if (showingResult && previewResult) {
    return (
      <QuizContainer>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleBackFromResult}
            className="border-[#B89B7A]/30 text-[#432818] transition-all duration-200 hover:border-[#B89B7A]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Quiz
          </Button>
        </div>
        <ResultPreview result={previewResult} />
      </QuizContainer>
    );
  }

  const stageComponents = components
    .filter(c => c.stageId === currentStage?.id)
    .sort((a, b) => a.order - b.order);

  return (
    <QuizContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#432818]">
            Prévia: {currentStage?.title || 'Etapa sem título'}
          </h2>
          <div style={{ color: '#8B7355' }}>
            Etapa {currentStageIndex + 1} de {sortedStages.length}
          </div>
        </div>

        <StagePreview stage={currentStage} components={stageComponents} />

        <div className="w-full h-1 bg-[#B89B7A]/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#B89B7A]" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStageIndex === 0}
            className="border-[#B89B7A]/30 text-[#432818] transition-all duration-200 hover:border-[#B89B7A]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStageIndex === sortedStages.length - 1}
            className="bg-[#B89B7A] hover:bg-[#9F836A] text-white transition-all duration-200"
          >
            Próxima
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </QuizContainer>
  );
};

export default QuizPreview;
