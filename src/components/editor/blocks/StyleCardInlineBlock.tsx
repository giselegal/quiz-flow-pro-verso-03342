import { cn } from '@/lib/utils';
import { Sparkles, Edit3 } from 'lucide-react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { getStyleConfig } from '@/config/styleConfig';

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

// Helpers para normalizar nomes de estilos (slugs -> nomes amigáveis)
const removeDiacritics = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normalizeToken = (s: string) => removeDiacritics(String(s || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-');
const mapToFriendlyStyle = (raw: string): string => {
  const t = normalizeToken(raw);
  const table: Record<string, string> = {
    natural: 'Natural',
    classico: 'Clássico',
    contemporaneo: 'Contemporâneo',
    elegante: 'Elegante',
    romantico: 'Romântico',
    sexy: 'Sexy',
    dramatico: 'Dramático',
    criativo: 'Criativo',
    'estilo-natural': 'Natural',
    'estilo-classico': 'Clássico',
    'estilo-contemporaneo': 'Contemporâneo',
    'estilo-elegante': 'Elegante',
    'estilo-romantico': 'Romântico',
    'estilo-sexy': 'Sexy',
    'estilo-dramatico': 'Dramático',
    'estilo-criativo': 'Criativo',
    neutro: 'Natural',
    neutral: 'Natural',
    'estilo-neutro': 'Natural',
  };
  return table[t] || table[t.replace(/^estilo-/, '')] || 'Natural';
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

  // Resolver dados do estilo a partir do resultado
  const rawStyle = (primaryStyle?.style || primaryStyle?.category || '').trim();
  const styleLabel = mapToFriendlyStyle(rawStyle);
  const resolved = styleLabel ? getStyleConfig(styleLabel) : null;

  // Montar variáveis de placeholders
  const vars = {
  resultStyle: styleLabel || 'Seu Estilo',
    resultPersonality: resolved?.keywords?.slice(0, 3).join(', ') || 'Autêntica, confiante',
    // styleConfig não contém cores hex agrupadas; usar keywords como proxy amigável
    resultColors: (resolved?.keywords || []).slice(0, 2).join(', ') || 'Cores ideais do seu estilo',
    resultFabrics: 'Tecidos recomendados do seu estilo',
    resultPrints: 'Estampas recomendadas do seu estilo',
    resultAccessories: 'Acessórios recomendados do seu estilo',
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
