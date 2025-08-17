// @ts-nocheck
import FunnelPainSection from '@/components/funnel/base/FunnelPainSection';

// Interface local para máxima independência
interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
}

/**
 * 🚀 UnifiedFunnelPainBlock - Wrapper para máxima reutilização
 *
 * ✅ REUTILIZÁVEL: Mesmo componente em editor e funil real
 * ✅ RESPONSIVO: Grid adaptativo 1-4 colunas conforme device
 * ✅ INDEPENDENTE: Funciona sem contexto externo
 * ✅ TOTALMENTE EDITÁVEL: Pain points, cores, layout configuráveis
 */

interface BlockComponentProps {
  block: Block;
  isSelected: boolean;
  onSaveInline: (blockId: string, updates: Partial<Block>) => void;
  onBlockSelect: (blockId: string) => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
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

const UnifiedFunnelPainBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onSaveInline,
  onBlockSelect,
}) => {
  // Pain points padrão para máxima reutilização
  const defaultPainPoints = [
    {
      title: 'Problema de Autoestima',
      description: 'Você se sente insegura e não sabe como melhorar',
      icon: 'Heart',
    },
    {
      title: 'Decisões Erradas',
      description: 'Gasta dinheiro em coisas que não funcionam para você',
      icon: 'ShoppingBag',
    },
    {
      title: 'Perda de Tempo',
      description: 'Demora horas para conseguir resultados satisfatórios',
      icon: 'Clock',
    },
    {
      title: 'Falta de Direção',
      description: 'Não sabe qual caminho seguir para alcançar seus objetivos',
      icon: 'Users',
    },
  ];

  const props = {
    title: block.properties.title || 'Você Reconhece Esses Problemas?',
    subtitle: block.properties.subtitle || 'Não se preocupe, você não está sozinho(a).',
    description: block.properties.description,
    conclusion:
      block.properties.conclusion ||
      'A solução está em encontrar o método certo que funciona para você.',
    painPoints: block.properties.painPoints || defaultPainPoints,
    backgroundColor: block.properties.backgroundColor || '#ffffff',
    textColor: block.properties.textColor || '#432818',
    primaryColor: block.properties.primaryColor || '#B89B7A',
    cardBorderColor: block.properties.cardBorderColor || 'rgba(184, 155, 122, 0.2)',
    columns: (parseInt(block.properties.columns) || 4) as 1 | 2 | 3 | 4,

    // Props específicas do editor
    isSelected,
    onClick: () => onBlockSelect(block.id),
    className: isSelected ? 'ring-2 ring-[#B89B7A] ring-offset-2' : '',
  };

  return (
    <div className="relative group">
      <FunnelPainSection {...props} />

      {/* Indicator visual para seleção no editor */}
      {isSelected && (
        <div className="absolute top-0 left-0 bg-[#B89B7A]/100 text-white text-xs px-2 py-1 rounded-br-md z-10">
          Pain Points ({props.painPoints.length} problemas)
        </div>
      )}
    </div>
  );
};

export default UnifiedFunnelPainBlock;
