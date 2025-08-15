import { useEditor } from '@/context/EditorContext';
import { ConsolidatedBlockRenderer } from '@/components/unified';
import { getStepTemplate } from '../steps/stepTemplatesMapping';
import type { Block } from '@/types/editor';

interface TemplateRendererProps {
  stepNumber: number;
  sessionId?: string;
  onContinue?: () => void;
}

/**
 * 🎯 TEMPLATE RENDERER UNIVERSAL
 * ✅ Sistema que renderiza templates baseados em arrays de blocos
 * ✅ Usa stepTemplatesMapping.ts para obter templates de qualquer etapa
 * ✅ Renderiza blocos usando ConsolidatedBlockRenderer
 * 
 * Funcionalidades:
 * - Carrega templates de 1-21 automaticamente
 * - Converte template blocks para formato Block
 * - Renderiza usando sistema unificado de blocos
 * - Integração completa com EditorContext e hooks de quiz
 */
export const TemplateRenderer = ({ stepNumber, onContinue }: TemplateRendererProps) => {
  const { quizState } = useEditor();

  // Converter template blocks para formato Block
  const convertToBlocks = (templateBlocks: any[]): Block[] => {
    return templateBlocks.map((templateBlock, index) => ({
      id: templateBlock.id || `block-${index}`,
      type: templateBlock.type,
      content: templateBlock.properties || {},
      properties: templateBlock.properties || {},
      order: index,
    }));
  };

  // Obter template da etapa usando o sistema unificado
  const templateBlocks = getStepTemplate(stepNumber);
  
  if (!templateBlocks || templateBlocks.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-[#432818]">Template não encontrado</h2>
          <p className="text-gray-600">
            Nenhum template foi encontrado para a etapa {stepNumber}.
          </p>
          <div className="text-sm text-gray-500 mt-4">
            <p>Verifique se o template está definido em stepTemplatesMapping.ts</p>
          </div>
          {onContinue && (
            <button
              onClick={onContinue}
              className="mt-6 px-6 py-2 bg-[#B89B7A] text-white rounded-lg hover:bg-[#432818] transition-colors"
            >
              Continuar mesmo assim →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Converter blocos do template para o formato Block
  const blocks = convertToBlocks(templateBlocks);

  console.log(`✅ TemplateRenderer: Renderizando ${blocks.length} blocos para step ${stepNumber}`);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Renderizar todos os blocos do template */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {blocks.map((block, index) => (
            <ConsolidatedBlockRenderer
              key={`${block.id}-${index}`}
              block={block}
              isSelected={false}
              onClick={() => {
                // Aqui podemos adicionar lógica de clique se necessário
                console.log(`Bloco clicado: ${block.type}`, block);
              }}
              onPropertyChange={(key, value) => {
                // Aqui podemos adicionar lógica de mudança de propriedades se necessário
                console.log(`Propriedade alterada em ${block.type}:`, key, value);
              }}
            />
          ))}
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border space-y-1 max-w-xs">
          <div><strong>Template Renderer Debug</strong></div>
          <div>Step: {stepNumber}</div>
          <div>Blocks: {blocks.length}</div>
          <div>User: {quizState.userName || 'não definido'}</div>
          <div>Respostas: {quizState.answers.length}</div>
          <div>Estratégicas: {quizState.strategicAnswers.length}</div>
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">Ver Blocos</summary>
            <div className="mt-1 text-xs space-y-1 max-h-32 overflow-y-auto">
              {blocks.map((block, i) => (
                <div key={i} className="p-1 bg-gray-50 rounded">
                  <div className="font-mono">{block.type}</div>
                  <div className="text-gray-500">{block.id}</div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default TemplateRenderer;