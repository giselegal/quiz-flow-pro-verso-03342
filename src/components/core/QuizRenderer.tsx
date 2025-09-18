import React from 'react';

interface QuizRendererProps {
  mode?: string;
  blocksOverride?: any;
  currentStepOverride?: number;
  previewEditable?: boolean;
  selectedBlockId?: string | null;
  onBlockClick?: (blockId: string) => any;
  onStepChange?: (step: number) => any;
  className?: string;
}

const QuizRenderer: React.FC<QuizRendererProps> = ({
  mode = 'preview',
  currentStepOverride = 1,
  className = ''
}) => {
  return (
    <div className={`quiz-renderer ${className}`}>
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Quiz Renderer (Step {currentStepOverride})
        </h2>
        <p className="text-gray-600">
          Mode: {mode}
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">
            Quiz content will be rendered here.
          </p>
        </div>
      </div>
    </div>
  );
};

export { QuizRenderer };
export default QuizRenderer;