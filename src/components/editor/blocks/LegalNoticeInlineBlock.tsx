import type { BlockComponentProps } from '@/types/blocks';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: string | number,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
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

const LegalNoticeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange: _onPropertyChange,
  className = '',
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco LegalNotice não encontrado</p>
      </div>
    );
  }

  // Debug: Log das propriedades recebidas
  console.log('🔍 [LegalNoticeInlineBlock] Propriedades:', block.properties);

  const {
    // Configurações de conteúdo
    privacyText = 'Política de Privacidade',
    copyrightText = '© 2025 Gisele Galvão Consultoria',
    termsText = 'Termos de Uso',
    // Configurações de estilo
    fontSize = '12',
    fontFamily = 'inherit',
    fontWeight = '400',
    textAlign = 'center',
    textColor = '#8F7A6A',
    linkColor = '#B89B7A',
    backgroundColor = 'transparent',
    lineHeight = '1.5',
    // Links
    privacyLinkUrl = '#privacy',
    termsLinkUrl = '#terms',
    // Layout
    contentMaxWidth = 640,
    // Sistema de margens
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = (block?.properties as any) || {};

  // Estilos CSS dinâmicos
  const containerStyles: React.CSSProperties = {
    backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
    textAlign: textAlign as 'left' | 'center' | 'right',
    padding: '24px 16px',
  };

  const textStyles: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    color: textColor,
    lineHeight: lineHeight,
    margin: 0,
  };

  const linkStyles: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    color: linkColor,
    lineHeight: lineHeight,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-[#B89B7A]/50 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
        ${getMarginClass(marginTop, 'top')}
        ${getMarginClass(marginBottom, 'bottom')}
        ${getMarginClass(marginLeft, 'left')}
        ${getMarginClass(marginRight, 'right')}
      `}
      style={containerStyles}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <div style={{ maxWidth: `${contentMaxWidth}px`, margin: '0 auto' }}>
        {/* Copyright */}
        <div style={textStyles} className="mb-2">
          {copyrightText}
        </div>

        {/* Links legais */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent:
              textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <a
            href={privacyLinkUrl}
            style={linkStyles}
            className="hover:underline"
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {privacyText}
          </a>
          <span style={textStyles}>•</span>
          <a
            href={termsLinkUrl}
            style={linkStyles}
            className="hover:underline"
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {termsText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalNoticeInlineBlock;
