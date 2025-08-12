import QuizOptionsGridBlock from '@/components/blocks/quiz/QuizOptionsGridBlock';
import { getStep02Template } from '@/components/steps/Step02Template';
import { useEditor } from '@/context/EditorContext';
import React, { useEffect } from 'react';

// 🛡️ Helper para garantir props corretas
const ensureOptionsProps = (props: any) => {
  return {
    question: props?.question || '',
    description: props?.description || '',
    options: props?.options || [],
    requireOption: props?.requireOption || false,
    autoAdvance: props?.autoAdvance || false,
    autoAdvanceDelay: props?.autoAdvanceDelay || 1000,
    showCorrectAnswer: props?.showCorrectAnswer || false,
    correctOptionIndex: props?.correctOptionIndex || 0,
    useLetterOptions: props?.useLetterOptions || false,
    optionsLayout: props?.optionsLayout || 'grid',
    optionsPerRow: props?.optionsPerRow || 2,
    showOptionImages: props?.showOptionImages || true,
    optionImageSize: props?.optionImageSize || 'medium',
    alignment: props?.alignment || 'center',
    optionStyle: props?.optionStyle || 'card',
    nextButtonText: props?.nextButtonText || 'Próxima',
    minSelections: props?.minSelections || 1,
    maxSelections: props?.maxSelections || 1,
    columns: props?.columns || 2,
    layoutOrientation: props?.layoutOrientation || 'vertical',
    contentType: props?.contentType || 'text-and-image',
    showImages: props?.showImages !== false,
    imagePosition: props?.imagePosition || 'top',
    imageSize: props?.imageSize || 120,
    imageWidth: props?.imageWidth || 120,
    imageHeight: props?.imageHeight || 120,
    responsiveColumns: props?.responsiveColumns || { mobile: 1, tablet: 2, desktop: 2 },
    ...props,
  };
};

const DebugStep02: React.FC = () => {
  const {
    stageActions: { setActiveStage },
    blockActions: { getBlocksForStage },
    activeStageId,
  } = useEditor();

  useEffect(() => {
    // Forçar carregar etapa 2
    setActiveStage('step-2');
  }, [setActiveStage]);

  const step02Blocks = getBlocksForStage('step-2');
  const optionsGridBlock = step02Blocks.find(block => String(block.type) === 'options-grid') as any;
  const step02Template = getStep02Template();
  const templateOptionsGrid = step02Template.find(
    block => String(block.type) === 'options-grid'
  ) as any;

  console.log('🔍 DebugStep02 - Dados:', {
    activeStageId,
    step02BlocksCount: step02Blocks.length,
    optionsGridBlock: optionsGridBlock,
    templateOptionsGrid: templateOptionsGrid,
    templateOptionsGridProperties: templateOptionsGrid?.properties,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Step02 - Options Grid</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dados do Editor Context</h2>
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <p>
              <strong>Etapa Ativa:</strong> {activeStageId}
            </p>
            <p>
              <strong>Blocos na Etapa 2:</strong> {step02Blocks.length}
            </p>
            <p>
              <strong>Options Grid Block:</strong>{' '}
              {optionsGridBlock ? '✅ Encontrado' : '❌ Não encontrado'}
            </p>
          </div>

          {optionsGridBlock && (
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <h3 className="font-semibold mb-2">Options Grid Block Properties</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(optionsGridBlock.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dados do Template</h2>
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <p>
              <strong>Template Blocos:</strong> {step02Template.length}
            </p>
            <p>
              <strong>Template Options Grid:</strong>{' '}
              {templateOptionsGrid ? '✅ Encontrado' : '❌ Não encontrado'}
            </p>
          </div>

          {templateOptionsGrid && (
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Template Options Grid Properties</h3>
              <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(templateOptionsGrid.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Renderização Direta do QuizOptionsGridBlock */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Teste de Renderização Direta</h2>
        <div style={{ borderColor: '#E5DDD5' }}>
          {optionsGridBlock ? (
            <QuizOptionsGridBlock
              id={optionsGridBlock.id}
              type="options-grid"
              properties={ensureOptionsProps(optionsGridBlock.properties)}
              onPropertyChange={(key, value) => {
                console.log('Property changed:', key, value);
              }}
            />
          ) : templateOptionsGrid ? (
            <QuizOptionsGridBlock
              id="test-options-grid"
              type="options-grid"
              properties={ensureOptionsProps(templateOptionsGrid.properties)}
              onPropertyChange={(key, value) => {
                console.log('Property changed:', key, value);
              }}
            />
          ) : (
            <div style={{ color: '#432818' }}>❌ Nenhum Options Grid encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugStep02;
