import React, { useState } from 'react';
import { useHeadlessEditor } from './HeadlessEditorProvider';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export const LivePreviewSystem: React.FC = () => {
  const { schema, isLoading } = useHeadlessEditor();
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = schema?.steps || [];
  const totalSteps = steps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  };

  if (isLoading) {
    return <LoadingPreview />;
  }

  if (!schema || totalSteps === 0) {
    return <EmptyPreview />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <PreviewHeader
        mode={previewMode}
        onModeChange={setPreviewMode}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepChange={goToStep}
      />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className={getPreviewContainerClasses(previewMode)}>
          <PreviewFrame
            step={steps[currentStep]}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        </div>
      </div>

      <PreviewControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrevious={previousStep}
        canGoNext={currentStep < totalSteps - 1}
        canGoPrevious={currentStep > 0}
      />
    </div>
  );
};

interface PreviewHeaderProps {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  mode,
  onModeChange,
  currentStep,
  totalSteps,
  onStepChange
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Preview em Tempo Real</h2>
        <div className="text-sm text-gray-600">
          Etapa {currentStep + 1} de {totalSteps}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'desktop', label: 'Desktop', icon: 'Monitor' },
            { id: 'tablet', label: 'Tablet', icon: 'Tablet' },
            { id: 'mobile', label: 'Mobile', icon: 'Phone' }
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => onModeChange(id as PreviewMode)}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${mode === id
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <select
          value={currentStep}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <option key={i} value={i}>
              Etapa {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

interface PreviewFrameProps {
  step: any;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrevious
}) => {
  if (!step) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <p>Etapa não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-full p-6 flex flex-col">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">{step.question}</h1>

          {step.options && step.options.length > 0 && (
            <div className="space-y-3">
              {step.options.map((option: any, index: number) => (
                <button
                  key={index}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

interface PreviewControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-center space-x-4">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Anterior
      </button>

      <div className="px-4 py-2 text-sm text-gray-600">
        {currentStep + 1} / {totalSteps}
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próximo →
      </button>
    </div>
  );
};

const LoadingPreview: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando preview...</p>
    </div>
  </div>
);

const EmptyPreview: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="text-6xl mb-4">📱</div>
      <h3 className="text-lg font-semibold mb-2">Nenhum quiz para preview</h3>
      <p className="text-gray-600">Crie ou carregue um quiz para ver o preview.</p>
    </div>
  </div>
);

function getPreviewContainerClasses(mode: PreviewMode): string {
  const baseClasses = 'bg-gray-200 rounded-lg overflow-hidden shadow-xl transition-all duration-300';

  switch (mode) {
    case 'desktop':
      return `${baseClasses} w-full max-w-6xl h-full max-h-[800px]`;
    case 'tablet':
      return `${baseClasses} w-full max-w-2xl h-full max-h-[900px]`;
    case 'mobile':
      return `${baseClasses} w-full max-w-sm h-full max-h-[700px]`;
    default:
      return baseClasses;
  }
}

export default LivePreviewSystem;
