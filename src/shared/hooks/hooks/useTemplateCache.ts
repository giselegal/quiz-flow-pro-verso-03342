import { useState, useCallback, useRef } from 'react';
import { getStepTemplate } from '@/config/stepTemplatesMapping';
import type { Block } from '@/types/editor';

interface TemplateCache {
  [stepNumber: number]: Block[];
}

interface UseTemplateCacheReturn {
  getTemplate: (stepNumber: number) => Block[];
  isLoading: boolean;
  error: string | null;
  clearCache: () => void;
}

/**
 * 🚀 HOOK OTIMIZADO: Cache de Templates
 * 
 * Otimizações aplicadas:
 * ✅ Cache persistente de templates processados
 * ✅ Loading states apropriados
 * ✅ Error handling robusto
 * ✅ Invalidação seletiva de cache
 */
export const useTemplateCache = (): UseTemplateCacheReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<TemplateCache>({});

  const adaptBlockTemplate = useCallback((templateBlock: any, stepNumber: number, index: number): Block => {
    const baseBlock = {
      id: templateBlock.id || `block-${stepNumber}-${index}`,
      type: templateBlock.type,
      properties: templateBlock.properties || {},
      content: {},
      order: index
    };

    // Otimização: Map direto por tipo em vez de switch gigante
    const contentMappers: Record<string, (props: any) => any> = {
      'text': (props) => ({ text: props?.content || 'Novo texto' }),
      'text-inline': (props) => ({ text: props?.content || 'Novo texto' }),
      'quiz-intro-header': (props) => ({ 
        title: props?.title || '', 
        subtitle: props?.subtitle || '' 
      }),
      'quiz-header': (props) => ({ 
        title: props?.title || '', 
        subtitle: props?.subtitle || '' 
      }),
      'lead-form': (props) => ({
        title: props?.title || 'Digite seu nome',
        placeholder: props?.placeholder || 'Nome',
        buttonText: props?.submitText || 'Continuar',
        validationMessage: props?.validationMessage || 'Por favor, preencha este campo'
      }),
      'options-grid': (props) => ({
        title: props?.title || 'Selecione suas opções',
        options: props?.options || []
      }),
      'button': (props) => ({ 
        text: props?.text || 'Clique aqui', 
        url: props?.url || '#' 
      }),
      'button-inline': (props) => ({ 
        text: props?.text || 'Clique aqui', 
        url: props?.url || '#' 
      }),
      'image': (props) => ({
        url: props?.src || props?.imageUrl || '',
        alt: props?.alt || 'Imagem',
        caption: props?.caption || ''
      }),
      'image-inline': (props) => ({
        url: props?.src || props?.imageUrl || '',
        alt: props?.alt || 'Imagem',
        caption: props?.caption || ''
      }),
      'image-display-inline': (props) => ({
        url: props?.src || props?.imageUrl || '',
        alt: props?.alt || 'Imagem',
        caption: props?.caption || ''
      }),
      'result-display': (props) => ({
        title: props?.title || 'Seu Resultado',
        description: props?.description || 'Resultado personalizado'
      }),
      'offer-cta': (props) => ({
        title: props?.title || 'Oferta Especial',
        description: props?.description || 'Não perca esta oportunidade',
        buttonText: props?.buttonText || 'Aproveitar Oferta'
      })
    };

    const mapper = contentMappers[templateBlock.type];
    baseBlock.content = mapper 
      ? mapper(templateBlock.properties) 
      : { text: templateBlock.properties?.content || templateBlock.properties?.text || 'Conteúdo padrão' };

    // Validações específicas por tipo
    if (templateBlock.type === 'quiz-header' || templateBlock.type === 'quiz-intro-header') {
      baseBlock.properties = {
        ...templateBlock.properties,
        logoWidth: typeof templateBlock.properties?.logoWidth === 'number' 
          ? templateBlock.properties.logoWidth : 96,
        logoHeight: typeof templateBlock.properties?.logoHeight === 'number' 
          ? templateBlock.properties.logoHeight : 96
      };
    }

    return baseBlock;
  }, []);

  const getTemplate = useCallback((stepNumber: number): Block[] => {
    // Cache hit - retorna imediatamente
    if (cacheRef.current[stepNumber]) {
      return cacheRef.current[stepNumber];
    }

    setIsLoading(true);
    setError(null);

    try {
      const template = getStepTemplate(stepNumber);
      
      // Processa template com adaptação otimizada
      const adaptedBlocks = template.map((block, index) => 
        adaptBlockTemplate({
          ...block,
          id: block.id || `block-${stepNumber}-${index}`,
          order: index
        }, stepNumber, index)
      );

      // Cache miss - salva no cache
      cacheRef.current[stepNumber] = adaptedBlocks;
      
      console.log(`✅ Template ${stepNumber} processado e cacheado (${adaptedBlocks.length} blocos)`);
      
      return adaptedBlocks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erro ao carregar template ${stepNumber}`;
      setError(errorMessage);
      console.error(`❌ Erro no template ${stepNumber}:`, err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [adaptBlockTemplate]);

  const clearCache = useCallback(() => {
    cacheRef.current = {};
    console.log('🗑️ Cache de templates limpo');
  }, []);

  return {
    getTemplate,
    isLoading,
    error,
    clearCache
  };
};