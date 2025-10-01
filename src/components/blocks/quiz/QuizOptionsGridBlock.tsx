import QuizQuestion from '@/components/funnel-blocks/QuizQuestion';
import React, { useState } from 'react';
import { QuizBlockProps } from './types';
import { computeSelectionValidity } from '@/lib/quiz/selectionRules';
import { StorageService } from '@/services/core/StorageService';

/**
 * QuizOptionsGridBlock - Componente de grid de opções para quiz
 *
 * Utiliza o componente base QuizQuestion para renderizar uma pergunta
 * com múltiplas opções em formato de grid, permitindo seleção única ou múltipla.
 */
export interface QuizOptionsGridBlockProps extends QuizBlockProps {
  properties: {
    question?: string;
    description?: string;
    options:
    | Array<{
      id: string;
      text: string;
      points?: number;
      category?: string;
      imageUrl?: string;
      value?: string;
    }>
    | string;
    requireOption?: boolean;
    autoAdvance?: boolean;
    autoAdvanceDelay?: number;
    showCorrectAnswer?: boolean;
    correctOptionIndex?: number;
    useLetterOptions?: boolean;
    optionsLayout?: 'vertical' | 'horizontal' | 'grid';
    optionsPerRow?: number;
    showOptionImages?: boolean;
    optionImageSize?: 'small' | 'medium' | 'large';
    alignment?: 'left' | 'center' | 'right';
    optionStyle?: 'card' | 'button' | 'radio' | 'checkbox';
    nextButtonText?: string;
    minSelections?: number;
    maxSelections?: number;
    // === NOVAS PROPRIEDADES ===
    // Layout e Orientação
    columns?: number | string;
    layoutOrientation?: 'vertical' | 'horizontal';
    contentType?: 'text-only' | 'image-only' | 'text-and-image';
    // Imagens
    showImages?: boolean;
    imagePosition?: 'top' | 'left' | 'right' | 'background';
    imageSize?: number;
    imageWidth?: number;
    imageHeight?: number;
    // Bordas e Estilo Visual
    showBorders?: boolean;
    borderWidth?: number;
    borderColor?: string;
    selectedBorderColor?: string;
    borderRadius?: number;
    // Sombras
    showShadows?: boolean;
    shadowColor?: string;
    selectedShadowColor?: string;
    shadowIntensity?: number;
    // Escala
    scale?: number;
    // Cores
    primaryColor?: string;
    selectedColor?: string;
    hoverColor?: string;
    // Validação e Seleção
    multipleSelection?: boolean;
    selectionStyle?: 'border' | 'background' | 'shadow' | 'scale';
    gridGap?: number;
    responsiveColumns?: boolean;
    // IDs e metadados
    questionId?: string;
    requiredSelections?: number;
  };
  deviceView?: 'mobile' | 'tablet' | 'desktop';
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizOptionsGridBlock: React.FC<QuizOptionsGridBlockProps> = ({
  properties,
  id,
  onPropertyChange,
  ...props
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // 🔍 DEBUG DETALHADO - LOG DE TODAS AS PROPRIEDADES
  console.log('🔍 QuizOptionsGridBlock DEBUG COMPLETO:', {
    id,
    properties,
    optionsFromProperties: properties?.options,
    propertiesKeys: properties ? Object.keys(properties) : [],
    allProps: { properties, id, onPropertyChange, ...props },
  });

  // Extrair as opções - pode ser array de objetos ou string
  const parseOptions = (options: any) => {
    console.log('QuizOptionsGridBlock - parseOptions input:', options);

    // Se já é um array de objetos, retornar diretamente
    if (Array.isArray(options) && options.length > 0 && typeof options[0] === 'object') {
      console.log('QuizOptionsGridBlock - returning object array:', options);
      return options;
    }

    // Se é uma string, parsear linha por linha
    if (typeof options === 'string') {
      const parsed = options
        .split('\n')
        .filter(line => line.trim() !== '')
        .map((line, index) => ({
          id: `option-${index}`,
          text: line.trim(),
          value: `option-${index}`,
          imageUrl: '',
        }));
      console.log('QuizOptionsGridBlock - returning parsed string:', parsed);
      return parsed;
    }

    // Fallback: retornar array vazio
    console.log('QuizOptionsGridBlock - returning empty array');
    return [];
  };

  const options = parseOptions(properties?.options || []);

  // LOG DE DEBUG - vamos ver o que está acontecendo
  console.log('🔍 QuizOptionsGridBlock DEBUG:', {
    id,
    propertiesOptions: properties?.options,
    optionsLength: options?.length,
    firstOption: options?.[0],
    properties: Object.keys(properties || {}),
    fullOptions: options,
  });

  // Se não há opções, mostrar um placeholder de debug
  if (!options || options.length === 0) {
    return (
      <div style={{ borderColor: '#E5DDD5' }}>
        <h3 style={{ color: '#432818' }}>Debug: QuizOptionsGridBlock</h3>
        <p style={{ color: '#6B4F43' }}>Nenhuma opção encontrada</p>
        <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
          {JSON.stringify({ properties, id }, null, 2)}
        </pre>
      </div>
    );
  }

  // Determinar limites por propriedades (controle visual/UX do componente)
  const minSelections = properties?.minSelections || 1;
  const maxSelections = properties?.maxSelections || options.length;

  // Callbacks para interações do usuário
  const emitSelectionEvent = (opts: any[]) => {
    setSelectedOptions(opts);

    // Determinar se a seleção está válida conforme regra centralizada (considera fase/etapa)
    const step = (window as any)?.__quizCurrentStep ?? null;
    const { isValid } = computeSelectionValidity(step, opts.length, {
      minSelections: properties?.minSelections,
      requiredSelections: properties?.requiredSelections || properties?.minSelections,
    });
    const currentCount = opts.length;

    // Evento padrão unificado
    try {
      const questionId = properties?.questionId || properties?.question || id;
      const selectedIds = opts.map(opt => opt.id);

      // 🔗 Persistência unificada (produção/runtime)
      try {
        // usar import dinâmico para evitar require no cliente
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
          try {
            const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
            unifiedQuizStorage.updateSelections(String(questionId), selectedIds);
          } catch { /* noop */ }
        })();
      } catch { /* noop */ }

      // 🧰 Espelho legado para compatibilidade com validadores antigos
      try {
        const current = (StorageService.safeGetJSON<Record<string, string[]>>('userSelections') || {});
        const next = { ...current, [String(questionId)]: selectedIds };
        StorageService.safeSetJSON('userSelections', next);
      } catch { /* noop */ }

      // 📢 Evento unificado para consumidores (wrapper, navegadores, etc.)
      window.dispatchEvent(
        new CustomEvent('quiz-selection-change', {
          detail: {
            questionId,
            selectionCount: currentCount,
            valid: isValid,
            isValid,
            gridId: id,
            selectedCount: currentCount,
            minRequired: minSelections,
            maxAllowed: maxSelections,
            selectedOptions: selectedIds,
            selectedIds, // compat
          },
        })
      );

      // 🔔 Notificar que respostas foram atualizadas (para hooks que recalculam)
      try { window.dispatchEvent(new Event('quiz-answer-updated')); } catch { }
    } catch { }

    // Notificar o editor que uma seleção foi feita
    if (onPropertyChange) {
      onPropertyChange(
        'selectedOptions',
        opts.map(opt => opt.id)
      );
      onPropertyChange('hasCompleteSelection', isValid);
    }

    // 💾 Persistir respostas para cálculo de resultados em produção
    try {
      const step = (window as any)?.__quizCurrentStep ?? null;
      if (step) {
        const key = 'quizResponses';
        const prev = (StorageService.safeGetJSON(key) as any) || {};
        const questionId = properties?.questionId || properties?.question || id;
        const entry = {
          ids: opts.map(o => o.id),
          texts: opts.map(o => o.text || ''),
        };
        const next = {
          ...prev,
          [String(step)]: {
            ...(prev[String(step)] || {}),
            [questionId]: entry,
          },
        };
        StorageService.safeSetJSON(key, next);
      }
    } catch { }
  };

  const handleNext = () => {
    // Notificar o editor que o usuário quer avançar
    if (onPropertyChange) {
      onPropertyChange('complete', true);
      onPropertyChange(
        'selectedOptions',
        selectedOptions
      );
    }
  };

  // Mapear propriedades do editor para o componente QuizQuestion
  const {
    // Layout e Orientação
    columns = 'auto', // 'auto' detecta automaticamente: 2 com imagens, 1 só texto
    layoutOrientation = 'vertical',
    contentType = 'text-and-image',
    // Imagens - 256x256 como no exemplo fornecido
    showImages = true,
    imagePosition = 'top',
    imageSize = 256, // 256x256 como no exemplo fornecido
    imageWidth,
    imageHeight,
    // Bordas e Estilo Visual
    showBorders = true,
    borderWidth = 2,
    borderColor = '#E5E7EB',
    selectedBorderColor = '#B89B7A',
    borderRadius = 8,
    // Sombras
    showShadows = true,
    shadowColor = '#00000020',
    selectedShadowColor = '#B89B7A40',
    shadowIntensity = 3,
    // Escala
    scale = 100,
    // Cores
    primaryColor = '#B89B7A',
    selectedColor = '#B89B7A',
    hoverColor = '#D4C2A8',
    // Seleção
    multipleSelection = true,
    selectionStyle = 'border',
    gridGap = 8, // gap-2 (0.5rem = 8px) como no exemplo
    responsiveColumns = true,
  } = properties || {};

  // Detectar automaticamente se há imagens nas opções
  const hasImages = options.some(option => option.imageUrl && option.imageUrl.trim() !== '');

  // Auto-configurar número de colunas baseado na presença de imagens
  const autoColumns = hasImages ? 2 : 1; // 2 colunas com imagens, 1 coluna só texto
  const finalColumns = columns === 'auto' ? autoColumns : (columns || autoColumns);

  // Classes de layout baseadas na orientação e detecção automática
  const layoutClass = layoutOrientation === 'horizontal' ? 'grid' : 'flex flex-col';
  const gridColumnsClass = responsiveColumns
    ? (hasImages
      ? 'grid-cols-2'                 // Com imagens: 2 colunas em todos os dispositivos
      : 'grid-cols-1'                 // Só texto: sempre 1 coluna
    )
    : `grid-cols-${finalColumns}`;

  // Log para debug da detecção automática
  console.log('🔍 Auto-detecção de colunas:', {
    hasImages,
    autoColumns,
    finalColumns,
    columnsConfig: columns,
    gridColumnsClass,
    optionsWithImages: options.filter(opt => opt.imageUrl).length,
    totalOptions: options.length,
    layout: hasImages ? '2 colunas (mobile + desktop)' : '1 coluna (todos dispositivos)'
  });

  // Calcular tamanho da imagem
  const finalImageWidth = imageWidth || imageSize;
  const finalImageHeight = imageHeight || imageSize;

  // Estilos dinâmicos para bordas e sombras
  const optionStyles = {
    borderWidth: showBorders ? `${borderWidth}px` : '0px',
    borderColor: borderColor,
    borderRadius: `${borderRadius}px`,
    boxShadow: showShadows
      ? `0 ${shadowIntensity}px ${shadowIntensity * 2}px ${shadowColor}`
      : 'none',
    // CSS vars para controle dinâmico
    '--selected-border-color': selectedBorderColor,
    '--selected-shadow-color': selectedShadowColor,
    '--hover-color': hoverColor,
  } as React.CSSProperties;

  return (
    <div
      className="quiz-options-grid-block"
      data-block-id={id}
      style={{
        transform: `scale(${scale / 100})`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease-in-out',
      }}
    >
      <QuizQuestion
        question={properties?.question || ''}
        description={properties?.description || ''}
        options={options.map(option => ({
          ...option,
          // Aplicar configurações visuais
          imageUrl: contentType === 'text-only' ? undefined : option.imageUrl,
          text: contentType === 'image-only' ? '' : option.text,
        }))}
        multipleSelection={multipleSelection}
        minSelections={minSelections}
        maxSelections={maxSelections}
        required={properties?.requireOption !== false}
        alignment={properties?.alignment || 'center'}
        optionLayout={layoutOrientation === 'horizontal' ? 'grid' : 'vertical'}
        optionStyle={properties?.optionStyle || 'card'}
        showLetters={properties?.useLetterOptions === false}
        optionImageSize={
          finalImageWidth <= 128 ? 'small' : finalImageWidth >= 256 ? 'large' : 'medium'
        }
        autoAdvance={properties?.autoAdvance === false}
        autoAdvanceDelay={properties?.autoAdvanceDelay || 1000}
        showNextButton={true}
        nextButtonText={properties?.nextButtonText || 'Avançar'}
        onSelectionChange={emitSelectionEvent}
        onAnswer={emitSelectionEvent}
        onNext={handleNext}
        deviceView={props.deviceView || 'desktop'}
        // Passar propriedades customizadas via props
        customStyles={{
          optionStyles,
          gridGap: `${gridGap}px`,
          columns: responsiveColumns
            ? `repeat(auto-fit, minmax(250px, 1fr))`
            : `repeat(${columns}, 1fr)`,
          imageWidth: `${finalImageWidth}px`,
          imageHeight: `${finalImageHeight}px`,
          scale: scale,
          layoutOrientation,
          columnsCount: typeof columns === 'number' ? columns : parseInt(columns as string) || 2,
          borderWidth,
          borderColor,
          borderRadius,
          shadowBlur: shadowIntensity * 2,
          shadowColor,
          shadowOffsetX: 0,
          shadowOffsetY: shadowIntensity,
          imageSize,
          contentType,
          // novo: estilo de seleção e cores
          selectionStyle,
          selectedColor,
          hoverColor,
        }}
      />
    </div>
  );
};

export default QuizOptionsGridBlock;
