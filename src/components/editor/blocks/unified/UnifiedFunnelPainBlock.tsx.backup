import React from 'react';
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

const UnifiedFunnelPainBlock: React.FC<BlockComponentProps> = ({ block, isSelected, onSaveInline, onBlockSelect }) => {
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
    conclusion: block.properties.conclusion || 'A solução está em encontrar o método certo que funciona para você.',
    painPoints: block.properties.painPoints || defaultPainPoints,
    backgroundColor: block.properties.backgroundColor || '#ffffff',
    textColor: block.properties.textColor || '#432818',
    primaryColor: block.properties.primaryColor || '#B89B7A',
    cardBorderColor: block.properties.cardBorderColor || 'rgba(184, 155, 122, 0.2)',
    columns: (parseInt(block.properties.columns) || 4) as 1 | 2 | 3 | 4,

    // Props específicas do editor
    isSelected,
    onClick: () => onBlockSelect(block.id),
    className: isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '',
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
