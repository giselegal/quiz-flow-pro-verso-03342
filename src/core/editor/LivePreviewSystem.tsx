/**/**

 * 📱 SISTEMA DE PREVIEW EM TEMPO REAL * 📱 SISTEMA DE PREVIEW EM TEMPO REAL

 *  * 

 * Preview completo do funil com navegação linear e condicional, * Preview completo do funil com navegação linear e condicional,

 * sincronizado em tempo real com o editor. * sincronizado em tempo real com o editor.

 */ */



import React, { useState, useCallback } from 'react';import React, { useState, useCallback, useEffect } from 'react';

import { useHeadlessEditor } from './HeadlessEditorProvider';import { useHeadlessEditor } from './HeadlessEditorProvider';

import { FunnelStep } from '../../types/quiz-schema';import { FunnelStep } from '../../types/quiz-schema';



// ============================================================================// ============================================================================

// COMPONENTE PRINCIPAL DO PREVIEW// COMPONENTE PRINCIPAL DO PREVIEW

// ============================================================================// ============================================================================



export const LivePreviewSystem: React.FC = () => {export const LivePreviewSystem: React.FC = () => {

  const { schema, setCurrentStepId } = useHeadlessEditor();  const { schema, currentStep, setCurrentStepId } = useHeadlessEditor();

  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [showDebugInfo, setShowDebugInfo] = useState(false);  const [showDebugInfo, setShowDebugInfo] = useState(false);



  // Navegação entre etapas  // Navegação entre etapas

  const navigateToStep = useCallback((stepId: string | number) => {  const navigateToStep = useCallback((stepId: string | number) => {

    if (typeof stepId === 'number') {    if (typeof stepId === 'number') {

      const step = schema?.steps[stepId];      const step = schema?.steps[stepId];

      if (step) {      if (step) {

        setCurrentStepIndex(stepId);        setCurrentStepIndex(stepId);

        setCurrentStepId(step.id);        setCurrentStepId(step.id);

      }      }

    } else {    } else {

      const stepIndex = schema?.steps.findIndex(s => s.id === stepId) ?? -1;      const stepIndex = schema?.steps.findIndex(s => s.id === stepId) ?? -1;

      if (stepIndex >= 0) {      if (stepIndex >= 0) {

        setCurrentStepIndex(stepIndex);        setCurrentStepIndex(stepIndex);

        setCurrentStepId(stepId);        setCurrentStepId(stepId);

      }      }

    }    }

  }, [schema, setCurrentStepId]);  }, [schema, setCurrentStepId]);



  const nextStep = useCallback(() => {  const nextStep = useCallback(() => {

    if (schema && currentStepIndex < schema.steps.length - 1) {    if (schema && currentStepIndex < schema.steps.length - 1) {

      navigateToStep(currentStepIndex + 1);      navigateToStep(currentStepIndex + 1);

    }    }

  }, [currentStepIndex, schema, navigateToStep]);  }, [currentStepIndex, schema, navigateToStep]);



  const previousStep = useCallback(() => {  const previousStep = useCallback(() => {

    if (currentStepIndex > 0) {    if (currentStepIndex > 0) {

      navigateToStep(currentStepIndex - 1);      navigateToStep(currentStepIndex - 1);

    }    }

  }, [currentStepIndex, navigateToStep]);  }, [currentStepIndex, navigateToStep]);



  // Dimensões do preview por device  // Dimensões do preview por device

  const getPreviewDimensions = (mode: string) => {  const getPreviewDimensions = (mode: string) => {

    switch (mode) {    switch (mode) {

      case 'mobile':      case 'mobile':

        return 'w-80 h-[600px]';        return 'w-80 h-[600px]';

      case 'tablet':      case 'tablet':

        return 'w-96 h-[700px]';        return 'w-96 h-[700px]';

      default:      default:

        return 'w-full h-[800px]';        return 'w-full h-[800px]';

    }    }

  };  };



  if (!schema) {  if (!schema) {

    return (    return (

      <div className="flex items-center justify-center h-full bg-gray-100">      <div className="flex items-center justify-center h-full bg-gray-100">

        <div className="text-center">        <div className="text-center">

          <div className="text-2xl mb-2">🔄</div>          <div className="text-2xl mb-2">🔄</div>

          <div className="text-gray-600">Carregando preview...</div>          <div className="text-gray-600">Carregando preview...</div>

        </div>        </div>

      </div>      </div>

    );    );

  }  }



  const step = schema.steps[currentStepIndex];  const step = schema.steps[currentStepIndex];



  return (  return (

    <div className="flex flex-col h-full bg-gray-100">    <div className="flex flex-col h-full bg-gray-100">

      {/* Barra de ferramentas do preview */}      {/* Barra de ferramentas do preview */}

      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-4">        <div className="flex items-center space-x-4">

          <h2 className="font-semibold text-gray-900">Preview ao Vivo</h2>          <h2 className="font-semibold text-gray-900">Preview ao Vivo</h2>

                    

          {/* Controles de navegação */}          {/* Controles de navegação */}

          <div className="flex items-center space-x-2">          <div className="flex items-center space-x-2">

            <button            <button

              onClick={previousStep}              onClick={previousStep}

              disabled={currentStepIndex === 0}              disabled={currentStepIndex === 0}

              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"

            >            >

              ←              ←

            </button>            </button>

                        

            <span className="text-sm text-gray-600">            <span className="text-sm text-gray-600">

              {currentStepIndex + 1} / {schema.steps.length}              {currentStepIndex + 1} / {schema.steps.length}

            </span>            </span>

                        

            <button            <button

              onClick={nextStep}              onClick={nextStep}

              disabled={currentStepIndex === schema.steps.length - 1}              disabled={currentStepIndex === schema.steps.length - 1}

              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"

            >            >

              →              →

            </button>            </button>

          </div>          </div>

        </div>        </div>



        {/* Controles do preview */}        {/* Controles do preview */}

        <div className="flex items-center space-x-4">        <div className="flex items-center space-x-4">

          {/* Seletor de device */}          {/* Seletor de device */}

          <div className="flex bg-gray-100 rounded-md p-1">          <div className="flex bg-gray-100 rounded-md p-1">

            {(['desktop', 'tablet', 'mobile'] as const).map(mode => (            {(['desktop', 'tablet', 'mobile'] as const).map(mode => (

              <button              <button

                key={mode}                key={mode}

                onClick={() => setPreviewMode(mode)}                onClick={() => setPreviewMode(mode)}

                className={`px-3 py-1 rounded text-sm ${                className={`px-3 py-1 rounded text-sm ${

                  previewMode === mode                  previewMode === mode

                    ? 'bg-white text-gray-900 shadow'                    ? 'bg-white text-gray-900 shadow'

                    : 'text-gray-600 hover:text-gray-900'                    : 'text-gray-600 hover:text-gray-900'

                }`}                }`}

              >              >

                {mode === 'desktop' ? '💻' : mode === 'tablet' ? '📱' : '📱'}                {mode === 'desktop' ? '💻' : mode === 'tablet' ? '📱' : '📱'}

                {mode}                {mode}

              </button>              </button>

            ))}            ))}

          </div>          </div>

                    

          {/* Debug toggle */}          {/* Debug toggle */}

          <button          <button

            onClick={() => setShowDebugInfo(!showDebugInfo)}            onClick={() => setShowDebugInfo(!showDebugInfo)}

            className={`px-3 py-1 rounded text-sm ${            className={`px-3 py-1 rounded text-sm ${

              showDebugInfo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'              showDebugInfo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'

            }`}            }`}

          >          >

            🔍 Debug            🔍 Debug

          </button>          </button>

        </div>        </div>

      </div>      </div>



      {/* Área do preview */}      {/* Área do preview */}

      <div className="flex-1 p-4 overflow-auto">      <div className="flex-1 p-4 overflow-auto">

        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${getPreviewDimensions(previewMode)}`}>        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${getPreviewDimensions(previewMode)}`}>

          {/* Cabeçalho da etapa */}          {/* Cabeçalho da etapa */}

          <div className="bg-blue-50 px-4 py-2 border-b">          <div className="bg-blue-50 px-4 py-2 border-b">

            <div className="flex items-center justify-between">            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-blue-900">              <span className="text-sm font-medium text-blue-900">

                Etapa {currentStepIndex + 1}: {step.name}                Etapa {currentStepIndex + 1}: {step.name}

              </span>              </span>

              <span className="text-xs text-blue-600">              <span className="text-xs text-blue-600">

                {step.type}                {step.type}

              </span>              </span>

            </div>            </div>

          </div>          </div>

                    

          {/* Conteúdo da etapa */}          {/* Conteúdo da etapa */}

          <div className="p-4">          <div className="p-4">

            <FunnelStepRenderer            <FunnelStepRenderer

              step={step}              step={step}

              isPreview={true}              isPreview={true}

              onNavigate={navigateToStep}              onNavigate={navigateToStep}

            />            />

          </div>          </div>

        </div>        </div>



        {/* Debug info */}        {/* Debug info */}

        {showDebugInfo && (        {showDebugInfo && (

          <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">          <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">

            <h3 className="font-bold mb-2">🔍 Debug Info</h3>            <h3 className="font-bold mb-2">🔍 Debug Info</h3>

            <div className="space-y-1">            <div className="space-y-1">

              <div>Etapa atual: {step.id} ({step.type})</div>              <div>Etapa atual: {step.id} ({step.type})</div>

              <div>Blocos: {step.blocks.length}</div>              <div>Blocos: {step.blocks.length}</div>

              <div>Schema version: {schema.version}</div>              <div>Schema version: {schema.version}</div>

              <div>Preview mode: {previewMode}</div>              <div>Preview mode: {previewMode}</div>

            </div>            </div>

          </div>          </div>

        )}        )}

      </div>      </div>

    </div>    </div>

  );  );

};};



// ============================================================================// ============================================================================

// RENDERIZADOR DE ETAPA DO FUNIL// RENDERIZADOR DE ETAPA DO FUNIL

// ============================================================================// ============================================================================



interface FunnelStepRendererProps {interface FunnelStepRendererProps {

  step: FunnelStep;  step: FunnelStep;

  isPreview?: boolean;  isPreview?: boolean;

  onNavigate?: (stepId: string) => void;  onNavigate?: (stepId: string) => void;

}}



const FunnelStepRenderer: React.FC<FunnelStepRendererProps> = ({const FunnelStepRenderer: React.FC<FunnelStepRendererProps> = ({

  step,  step,

  isPreview = false  isPreview = false

}) => {}) => {

  return (  return (

    <div className="space-y-4">    <div className="space-y-4">

      {step.blocks.map((block, index) => (      {step.blocks.map((block, index) => (

        <div key={`${block.id || index}`} className="border border-gray-200 rounded-lg p-4">        <div key={`${block.id || index}`} className="border border-gray-200 rounded-lg p-4">

          <div className="flex items-center justify-between mb-2">          <div className="flex items-center justify-between mb-2">

            <span className="text-sm font-medium text-gray-700">            <span className="text-sm font-medium text-gray-700">

              Bloco: {block.type}              Bloco: {block.type}

            </span>            </span>

            {isPreview && (            {isPreview && (

              <span className="text-xs text-gray-500">              <span className="text-xs text-gray-500">

                ID: {block.id || `block-${index}`}                ID: {block.id || `block-${index}`}

              </span>              </span>

            )}            )}

          </div>          </div>

                    

          {/* Renderizar conteúdo do bloco baseado no tipo */}          {/* Renderizar conteúdo do bloco baseado no tipo */}

          <div className="bg-gray-50 p-3 rounded">          <div className="bg-gray-50 p-3 rounded">

            {renderBlockContent(block)}            {renderBlockContent(block)}

          </div>          </div>

        </div>        </div>

      ))}      ))}

    </div>    </div>

  );  );

};};



// Função auxiliar para renderizar conteúdo do bloco// Função auxiliar para renderizar conteúdo do bloco

function renderBlockContent(block: any) {function renderBlockContent(block: any) {

  const props = block.properties || {};  const props = block.properties || {};

    

  switch (block.type) {  switch (block.type) {

    case 'text-inline':    case 'text-inline':

    case 'heading-inline':    case 'heading-inline':

      return <div>{props.content || props.text || 'Texto do bloco'}</div>;      return <div>{props.content || props.text || 'Texto do bloco'}</div>;

        

    case 'image-inline':    case 'image-inline':

      return <img src={props.src || props.imageUrl} alt={props.alt || 'Imagem'} className="max-w-full h-auto" />;      return <img src={props.src || props.imageUrl} alt={props.alt || 'Imagem'} className="max-w-full h-auto" />;

        

    case 'button-inline':    case 'button-inline':

      return (      return (

        <button className="bg-blue-500 text-white px-4 py-2 rounded">        <button className="bg-blue-500 text-white px-4 py-2 rounded">

          {props.text || props.label || 'Botão'}          {props.text || props.label || 'Botão'}

        </button>        </button>

      );      );

        

    case 'form-input':    case 'form-input':

      return (      return (

        <input        <input

          type={props.type || 'text'}          type={props.type || 'text'}

          placeholder={props.placeholder || 'Digite aqui...'}          placeholder={props.placeholder || 'Digite aqui...'}

          className="border border-gray-300 rounded px-3 py-2 w-full"          className="border border-gray-300 rounded px-3 py-2 w-full"

        />        />

      );      );

        

    default:    default:

      return (      return (

        <div className="text-gray-500 italic">        <div className="text-gray-500 italic">

          Renderizador para "{block.type}" não implementado          Renderizador para "{block.type}" não implementado

        </div>        </div>

      );      );

  }  }

}}



export default LivePreviewSystem;export default LivePreviewSystem;
          <h2 className=\"font-semibold text-gray-900\">Preview ao Vivo</h2>
          
          {/* Controles de navegação */}
          <div className=\"flex items-center space-x-2\">
            <button
              onClick={previousStep}
              disabled={currentStepIndex === 0}
              className=\"p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50\"
            >
              ←
            </button>
            
            <span className=\"text-sm text-gray-600\">
              {currentStepIndex + 1} / {schema.steps.length}
            </span>
            
            <button
              onClick={nextStep}
              disabled={currentStepIndex >= schema.steps.length - 1}
              className=\"p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50\"
            >
              →
            </button>
          </div>
        </div>

        <div className=\"flex items-center space-x-4\">
          {/* Seletor de dispositivo */}
          <div className=\"flex bg-gray-100 rounded-md p-1\">
            {[
              { key: 'desktop', icon: '🖥️', label: 'Desktop' },
              { key: 'tablet', icon: '📱', label: 'Tablet' },
              { key: 'mobile', icon: '📱', label: 'Mobile' }
            ].map((device) => (
              <button
                key={device.key}
                onClick={() => setPreviewMode(device.key as any)}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                  previewMode === device.key
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={device.label}
              >
                <span>{device.icon}</span>
                <span className=\"hidden sm:inline\">{device.label}</span>
              </button>
            ))}
          </div>

          {/* Toggle debug */}
          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showDebugInfo ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🐛 Debug
          </button>
        </div>
      </div>

      {/* Área do preview */}
      <div className=\"flex-1 overflow-auto p-4\">
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${getPreviewDimensions(previewMode)}`}>
          {/* Barra de progresso */}
          {schema.settings.ui.showProgressBar && (
            <div className=\"h-2 bg-gray-200\">
              <div 
                className=\"h-full bg-blue-500 transition-all duration-300\"
                style={{ 
                  width: `${((currentStepIndex + 1) / schema.steps.length) * 100}%` 
                }}
              />
            </div>
          )}

          {/* Renderização da etapa atual */}
          <div className=\"p-6\">
            <FunnelStepRenderer 
              step={step}
              schema={schema}
              userResponses={userResponses}
              onUpdateResponse={(key, value) => setUserResponses(prev => ({ ...prev, [key]: value }))}
              onNavigate={navigateToStep}
              onNext={nextStep}
              onPrevious={previousStep}
            />
          </div>

          {/* Informações de debug */}
          {showDebugInfo && (
            <div className=\"border-t border-gray-200 p-4 bg-gray-50\">
              <h4 className=\"font-medium text-sm mb-2\">🐛 Debug Info</h4>
              <div className=\"text-xs text-gray-600 space-y-1\">
                <div>Etapa atual: {step.id} ({step.type})</div>
                <div>Blocos: {step.blocks.length}</div>
                <div>Respostas: {Object.keys(userResponses).length}</div>
                <div>Modo: {previewMode}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de sincronização */}
      <SyncIndicator />
    </div>
  );
};

// ============================================================================
// RENDERIZADOR DE ETAPA DO FUNIL
// ============================================================================

interface FunnelStepRendererProps {
  step: FunnelStep;
  schema: QuizFunnelSchema;
  userResponses: Record<string, any>;
  onUpdateResponse: (key: string, value: any) => void;
  onNavigate: (stepId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FunnelStepRenderer: React.FC<FunnelStepRendererProps> = ({
  step,
  schema,
  userResponses,
  onUpdateResponse,
  onNavigate,
  onNext,
  onPrevious
}) => {
  // Ordenar blocos por order
  const sortedBlocks = [...step.blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className=\"space-y-6\">
      {/* Renderizar todos os blocos da etapa */}
      {sortedBlocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          step={step}
          schema={schema}
          userResponses={userResponses}
          onUpdateResponse={onUpdateResponse}
          onNavigate={onNavigate}
        />
      ))}

      {/* Botões de navegação (se habilitados) */}
      <div className=\"flex justify-between items-center pt-6 border-t border-gray-200\">
        <div>
          {step.settings.showBackButton && (
            <button
              onClick={onPrevious}
              className=\"px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors\"
            >
              ← Voltar
            </button>
          )}
        </div>

        <div>
          {step.settings.showNextButton && (
            <button
              onClick={onNext}
              className=\"px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors\"
            >
              Continuar →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RENDERIZADOR DE BLOCOS
// ============================================================================

interface BlockRendererProps {
  block: Block;
  step: FunnelStep;
  schema: QuizFunnelSchema;
  userResponses: Record<string, any>;
  onUpdateResponse: (key: string, value: any) => void;
  onNavigate: (stepId: string) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  step, 
  schema, 
  userResponses, 
  onUpdateResponse, 
  onNavigate 
}) => {
  const renderBlockContent = () => {
    const props = block.properties || {};

    switch (block.type) {
      case 'text-inline':
        return (
          <div 
            className=\"prose prose-sm max-w-none\"
            style={{ color: props.color || '#000000' }}
          >
            {props.content || block.content || 'Texto não definido'}
          </div>
        );

      case 'heading-inline':
        return (
          <h2 
            className=\"text-2xl font-bold mb-4\"
            style={{ color: props.color || '#000000' }}
          >
            {props.content || block.content || 'Título não definido'}
          </h2>
        );

      case 'image-inline':
      case 'image-display-inline':
        const imageUrl = props.src || props.imageUrl;
        const imageAlt = props.alt || props.imageAlt || 'Imagem';
        
        if (!imageUrl) {
          return (
            <div className=\"w-full h-48 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500\">
              📷 Imagem não definida
            </div>
          );
        }

        return (
          <img
            src={imageUrl}
            alt={imageAlt}
            className=\"w-full h-auto rounded-lg shadow-sm\"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'w-full h-48 bg-gray-200 border border-gray-400 rounded-lg flex items-center justify-center text-gray-500';
              placeholder.textContent = '🚫 Erro ao carregar imagem';
              target.parentElement?.appendChild(placeholder);
            }}
          />
        );

      case 'button-inline':
        return (
          <button
            className=\"px-6 py-3 rounded-md font-medium transition-colors hover:opacity-90\"
            style={{
              backgroundColor: props.backgroundColor || '#4CAF50',
              color: props.textColor || '#FFFFFF'
            }}
            onClick={() => {
              // Lógica de clique do botão (navegação, ação, etc.)
              console.log('Botão clicado:', block.id);
            }}
          >
            {props.text || block.content || 'Botão'}
          </button>
        );

      case 'input-text':
        return (
          <div>
            {props.label && (
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                {props.label}
              </label>
            )}
            <input
              type=\"text\"
              value={userResponses[block.id] || ''}
              onChange={(e) => onUpdateResponse(block.id, e.target.value)}
              placeholder={props.placeholder || 'Digite aqui...'}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
            />
          </div>
        );

      case 'input-email':
        return (
          <div>
            {props.label && (
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                {props.label}
              </label>
            )}
            <input
              type=\"email\"
              value={userResponses[block.id] || ''}
              onChange={(e) => onUpdateResponse(block.id, e.target.value)}
              placeholder={props.placeholder || 'seu@email.com'}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"
            />
          </div>
        );

      case 'multiple-choice':
        return (
          <div>
            {props.question && (
              <h3 className=\"text-lg font-medium mb-4\">{props.question}</h3>
            )}
            <div className=\"space-y-2\">
              {(props.options || []).map((option: any, index: number) => (
                <label key={index} className=\"flex items-center space-x-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer\">
                  <input
                    type=\"radio\"
                    name={block.id}
                    value={option.value || option.text}
                    checked={userResponses[block.id] === (option.value || option.text)}
                    onChange={(e) => onUpdateResponse(block.id, e.target.value)}
                    className=\"text-blue-600\"
                  />
                  <span>{option.text || option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className=\"p-4 bg-yellow-50 border border-yellow-200 rounded-md\">
            <div className=\"text-sm text-yellow-800\">
              🚧 Tipo de bloco '{block.type}' não implementado no preview
            </div>
            <details className=\"mt-2 text-xs text-yellow-700\">
              <summary className=\"cursor-pointer\">Propriedades do bloco</summary>
              <pre className=\"mt-1 p-2 bg-yellow-100 rounded overflow-auto\">
                {JSON.stringify({ type: block.type, properties: props }, null, 2)}
              </pre>
            </details>
          </div>
        );
    }
  };

  return (
    <div className=\"block-preview\" data-block-id={block.id} data-block-type={block.type}>
      {renderBlockContent()}
    </div>
  );
};

// ============================================================================
// INDICADOR DE SINCRONIZAÇÃO
// ============================================================================

const SyncIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Simulação de updates em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className=\"fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-800 px-3 py-2 rounded-md shadow-sm text-sm flex items-center gap-2\">
      <div className=\"w-2 h-2 bg-green-500 rounded-full animate-pulse\" />
      Preview sincronizado
    </div>
  );
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

const getPreviewDimensions = (mode: 'desktop' | 'tablet' | 'mobile'): string => {
  switch (mode) {
    case 'mobile':
      return 'max-w-sm'; // 375px
    case 'tablet':
      return 'max-w-2xl'; // 768px
    case 'desktop':
    default:
      return 'max-w-4xl'; // 1024px
  }
};

// ============================================================================
// NAVEGAÇÃO CONDICIONAL (Sistema Inteligente)
// ============================================================================

export const ConditionalNavigation = {
  /**
   * Determina a próxima etapa baseada nas respostas do usuário
   */
  getNextStep(
    currentStep: FunnelStep,
    userResponses: Record<string, any>,
    allSteps: FunnelStep[]
  ): string | null {
    // Verificar se a etapa tem regras de navegação condicional
    if (currentStep.navigation?.rules && currentStep.navigation.rules.length > 0) {
      for (const rule of currentStep.navigation.rules) {
        if (this.evaluateCondition(rule.condition, userResponses)) {
          return rule.targetStepId;
        }
      }
    }

    // Navegação padrão (próxima etapa sequencial)
    const currentIndex = allSteps.findIndex(s => s.id === currentStep.id);
    if (currentIndex >= 0 && currentIndex < allSteps.length - 1) {
      return allSteps[currentIndex + 1].id;
    }

    return null;
  },

  /**
   * Avalia uma condição de navegação
   */
  evaluateCondition(condition: any, userResponses: Record<string, any>): boolean {
    if (!condition) return false;

    switch (condition.type) {
      case 'equals':
        return userResponses[condition.field] === condition.value;
      
      case 'not_equals':
        return userResponses[condition.field] !== condition.value;
      
      case 'contains':
        const value = userResponses[condition.field];
        return typeof value === 'string' && value.includes(condition.value);
      
      case 'exists':
        return condition.field in userResponses && userResponses[condition.field] != null;
      
      case 'and':
        return condition.conditions.every((c: any) => this.evaluateCondition(c, userResponses));
      
      case 'or':
        return condition.conditions.some((c: any) => this.evaluateCondition(c, userResponses));
      
      default:
        return false;
    }
  }
};