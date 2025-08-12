import FunnelHeroSection from '@/components/funnel/base/FunnelHeroSection';
import FunnelPainSection from '@/components/funnel/base/FunnelPainSection';

// Interface que todos os blocos do editor devem implementar
interface BlockComponentProps {
  block: {
    id: string;
    type: string;
    properties: Record<string, any>;
  };
  isSelected: boolean;
  onSaveInline: (blockId: string, updates: Partial<any>) => void;
  onBlockSelect: (blockId: string) => void;
}

/**
 * UnifiedFunnelHeroBlock - Wrapper que adapta FunnelHeroSection para o editor
 *
 * Este wrapper conecta nosso componente base reutilizável com a interface
 * esperada pelo sistema de blocos do editor, mantendo 100% de fidelidade visual.
 */
export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
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

const UnifiedFunnelHeroBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onBlockSelect,
}) => {
  // Validação defensiva
  if (!block || !block.properties) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Propriedades do bloco inválidas</p>
      </div>
    );
  }

  const handleClick = () => {
    onBlockSelect(block.id);
  };

  // Usar o componente base exatamente como no funil real
  return (
    <FunnelHeroSection
      title={block.properties.title || 'Título do Hero'}
      description={block.properties.description || 'Descrição do hero section'}
      ctaText={block.properties.ctaText || 'Call to Action'}
      {...block.properties}
      isSelected={isSelected}
      onClick={handleClick}
    />
  );
};

/**
 * UnifiedFunnelPainBlock - Wrapper que adapta FunnelPainSection para o editor
 *
 * Este wrapper conecta nosso componente base reutilizável com a interface
 * esperada pelo sistema de blocos do editor, mantendo 100% de fidelidade visual.
 */
export const UnifiedFunnelPainBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onBlockSelect,
}) => {
  // Validação defensiva
  if (!block || !block.properties) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Propriedades do bloco inválidas</p>
      </div>
    );
  }

  const handleClick = () => {
    onBlockSelect(block.id);
  };

  // Garantir que painPoints seja um array válido
  const painPoints = Array.isArray(block.properties.painPoints) ? block.properties.painPoints : [];

  // Usar o componente base exatamente como no funil real
  return (
    <FunnelPainSection
      title={block.properties.title || 'Seção de Problemas'}
      painPoints={painPoints}
      {...block.properties}
      isSelected={isSelected}
      onClick={handleClick}
    />
  );
};

// Exportar mapeamento para facilitar integração
export const unifiedBlockComponents = {
  FunnelHeroBlock: UnifiedFunnelHeroBlock,
  FunnelPainBlock: UnifiedFunnelPainBlock,
};

export default unifiedBlockComponents;
