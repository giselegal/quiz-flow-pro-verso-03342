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

export const UnifiedFunnelHeroBlock: React.FC<BlockComponentProps> = ({
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
