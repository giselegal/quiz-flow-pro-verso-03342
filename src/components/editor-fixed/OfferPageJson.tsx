import { ENHANCED_BLOCK_REGISTRY } from '@/config/enhancedBlockRegistry';
import React, { useEffect } from 'react';
import { injectOfferPageStyles } from './offer/offerStyles';
import { useEditorWithJson } from './useEditorWithJson';

interface OfferPageJsonProps {
  stepNumber?: number;
  templateName?: string;
}

/**
 * 🎯 COMPONENTE: OfferPageJson
 *
 * Renderiza uma página de oferta completa usando o sistema JSON
 * Compatível com templates step-XX-template.json
 *
 * @example
 * <OfferPageJson stepNumber={21} templateName="step-21-template" />
 */
export const OfferPageJson: React.FC<OfferPageJsonProps> = ({
  stepNumber = 21,
  templateName = 'step-21-template',
}) => {
  const [blocks, setBlocks] = React.useState<any[]>([]);

  const { loadStepTemplate } = useEditorWithJson(blocks, setBlocks);

  // Estado local para template carregado
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Efeito para carregar o template e aplicar estilos
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Injetar estilos customizados
        const cleanupStyles = injectOfferPageStyles();

        // Carregar template
        loadStepTemplate(stepNumber);

        // Performance tracking
        if (typeof window !== 'undefined' && 'performance' in window) {
          window.performance.mark('offer-page-json-mounted');
        }

        return cleanupStyles;
      } catch (err) {
        setError('Erro inesperado ao carregar template');
        console.error('Erro ao carregar template:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [stepNumber, loadStepTemplate]);

  // Renderizar blocos usando ENHANCED_BLOCK_REGISTRY
  const renderBlocks = () => {
    if (blocks.length === 0) return null;

    return blocks.map((block, index) => {
      const BlockComponent =
        ENHANCED_BLOCK_REGISTRY[block.type] || ENHANCED_BLOCK_REGISTRY['text-inline'];

      if (!BlockComponent) {
        console.warn(`Componente não encontrado para tipo: ${block.type}`);
        return null;
      }

      return <BlockComponent key={block.id || `block-${index}`} {...(block.properties || {})} />;
    });
  };

  // Estados de loading e erro
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
          <p className="text-[#6B4F43] text-lg">Carregando oferta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-[#432818] mb-4">Erro ao Carregar</h2>
          <p className="text-[#6B4F43] mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary-clean">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#FFFBF7',
      }}
    >
      {/* Renderizar blocos do template */}
      {renderBlocks()}

      {/* Analytics Script - coleta dados de interação */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Analytics para página de oferta
            if (typeof window !== 'undefined') {
              window.offerPageAnalytics = {
                stepNumber: ${stepNumber},
                templateName: '${templateName}',
                loadTime: Date.now(),
                interactions: []
              };
              
              // Rastrear cliques em botões
              document.addEventListener('click', function(e) {
                if (e.target.classList.contains('btn-primary-clean')) {
                  window.offerPageAnalytics.interactions.push({
                    type: 'cta_click',
                    element: e.target.textContent,
                    timestamp: Date.now()
                  });
                }
              });
            }
          `,
        }}
      />
    </div>
  );
};

export default OfferPageJson;
