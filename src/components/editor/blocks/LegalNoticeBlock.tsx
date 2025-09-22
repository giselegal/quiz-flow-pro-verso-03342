import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

/**
 * ⚖️ LegalNoticeBlock - Aviso legal/copyright
 */
const LegalNoticeBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const {
    fontSize = '12px',
    color = '#666666',
    textAlign = 'center',
    marginTop = 16,
    marginBottom = 16,
    paddingTop = 8,
    paddingBottom = 8,
  } = block?.properties || {};

  // Usar texto do content ou padrão
  const legalText = block?.content?.text || '2025 - Todos os direitos reservados';

  const containerStyle = {
    fontSize,
    color,
    textAlign,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
  } as React.CSSProperties;

  return (
    <div
      className={`
        py-2 px-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-blue-400 bg-blue-50/30' : 'hover:bg-gray-50/50'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <div style={containerStyle}>
        <p dangerouslySetInnerHTML={{ __html: legalText }} />
      </div>
    </div>
  );
};

export default LegalNoticeBlock;