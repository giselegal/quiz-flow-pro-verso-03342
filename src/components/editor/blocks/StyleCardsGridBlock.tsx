import { cn } from '@/lib/utils';
import { Sparkles, Edit3 } from 'lucide-react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { getStyleConfig } from '@/config/styleConfig';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
  // ... (mantido igual)
};

const interpolate = (text: string, vars: Record<string, any>) => {
  if (!text) return '';
  return text
    .replace(/\{resultStyle\}/g, vars.resultStyle || '')
    .replace(/\{resultPersonality\}/g, vars.resultPersonality || '')
    .replace(/\{resultColors\}/g, vars.resultColors || '')
    .replace(/\{resultFabrics\}/g, vars.resultFabrics || '')
    .replace(/\{resultPrints\}/g, vars.resultPrints || '')
    .replace(/\{resultAccessories\}/g, vars.resultAccessories || '');
};

// Função segura para obter configuração do estilo
const getSafeStyleConfig = (styleLabel: string) => {
  try {
    const config = getStyleConfig(styleLabel);
    if (!config || typeof config !== 'object') {
      console.warn(`getStyleConfig retornou um valor inválido para: ${styleLabel}`);
      return {
        keywords: [],
        colors: [],
        fabrics: [],
        prints: [],
        accessories: [],
      };
    }
    return config;
  } catch (error) {
    console.error(`Erro ao obter configuração do estilo ${styleLabel}:`, error);
    return {
      keywords: [],
      colors: [],
      fabrics: [],
      prints: [],
      accessories: [],
    };
  }
};

const StyleCardInlineBlock: React.FC<any> = ({
  block,
  title = 'Seu Estilo Único',
  subtitle = 'Descoberto através do quiz',
  description = 'Características principais do seu perfil de estilo pessoal',
  showIcon = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
}) => {
  const { primaryStyle } = useQuizResult();
  
  // Adicionar log para depuração
  console.log('StyleCardInlineBlock - primaryStyle:', primaryStyle);
  
  // Se não houver estilo, exibir mensagem ou estado de carregamento
  if (!primaryStyle) {
    return (
      <div className="p-4 text-center">
        <p>Carregando informações do estilo...</p>
        <p className="text-sm text-gray-500 mt-2">
          Se isso persistir, verifique se você respondeu a todas as perguntas.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Recarregar Página
        </button>
      </div>
    );
  }
  
  // Resolver dados do estilo a partir do resultado
  const styleLabel = (primaryStyle?.style || primaryStyle?.category || '').trim();
  console.log('StyleCardInlineBlock - styleLabel:', styleLabel);
  
  const resolved = styleLabel ? getSafeStyleConfig(styleLabel) : null;
  console.log('StyleCardInlineBlock - resolved:', resolved);
  
  // Montar variáveis de placeholders com valores padrão
  const vars = {
    resultStyle: styleLabel || 'Seu Estilo',
    resultPersonality: resolved?.keywords?.slice(0, 3).join(', ') || 
                      'Autêntica, confiante',
    resultColors: resolved?.colors?.slice(0, 2).join(', ') || 
                  'Cores que combinam com seu estilo',
    resultFabrics: resolved?.fabrics?.join(', ') || 
                   'Tecidos ideais para seu estilo',
    resultPrints: resolved?.prints?.join(', ') || 
                  'Estampas que combinam com você',
    resultAccessories: resolved?.accessories?.join(', ') || 
                       'Acessórios que complementam seu visual',
  };
  
  // Ler dados do bloco (properties tem precedência, depois content)
  const blockProps = (block && block.properties) || {};
  const blockContent = (block && block.content) || {};
  const resolvedTitle = blockProps.title ?? blockContent.title ?? title;
  const resolvedSubtitle = blockProps.subtitle ?? blockContent.subtitle ?? subtitle;
  const resolvedDescription = blockProps.description ?? blockContent.description ?? description;
  const rawFeatures = blockProps.features ?? blockContent.features ?? [];
  const features: string[] = Array.isArray(rawFeatures) ? rawFeatures : [];
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 p-4 bg-white rounded-lg border-l-4 border-[#B89B7A] shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer',
        'w-full',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Icon */}
      {showIcon && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      )}
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-[#432818] text-sm md:text-base truncate"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newTitle = prompt('Novo título:', String(resolvedTitle));
              if (newTitle !== null) onPropertyChange('title', newTitle);
            }
          }}
        >
          {interpolate(String(resolvedTitle), vars)}
        </h3>
        <p
          className="text-xs md:text-sm text-[#8F7A6A] truncate"
          onClick={e => {
            e.stopPropagation();
            if (onPropertyChange && !disabled) {
              const newSubtitle = prompt('Novo subtítulo:', String(resolvedSubtitle));
              if (newSubtitle !== null) onPropertyChange('subtitle', newSubtitle);
            }
          }}
        >
          {interpolate(String(resolvedSubtitle), vars)}
        </p>
        {resolvedDescription && (
          <p
            className="text-xs text-[#8F7A6A] mt-1 line-clamp-2"
            onClick={e => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newDescription = prompt('Nova descrição:', String(resolvedDescription));
                if (newDescription !== null) onPropertyChange('description', newDescription);
              }
            }}
          >
            {interpolate(String(resolvedDescription), vars)}
          </p>
        )}
        {/* Lista de features do estilo (template step-20) */}
        {features.length > 0 && (
          <ul className="mt-2 space-y-1 text-[#432818] text-xs md:text-sm">
            {features.map((f: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#B89B7A]" />
                <span>{interpolate(String(f), vars)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Edit indicator */}
      {!disabled && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-[#B89B7A]" />
        </div>
      )}
    </div>
  );
};

export default StyleCardInlineBlock;