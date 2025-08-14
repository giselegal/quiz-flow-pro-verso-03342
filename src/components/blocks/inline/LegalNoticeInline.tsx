// @ts-nocheck
import React from 'react';

/**
 * ⚖️ COMPONENTE AVISO LEGAL INLINE
 * ================================
 *
 * Componente para exibição de avisos legais, políticas e termos
 * totalmente integrado com o sistema de propriedades unificado.
 */

interface LegalNoticeInlineProps {
  privacyText?: string;
  copyrightText?: string;
  termsText?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  linkColor?: string;
  spacing?: number;
  showDividers?: boolean;
  dividerColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

const LegalNoticeInline: React.FC<LegalNoticeInlineProps> = ({
  privacyText = 'Política de Privacidade',
  copyrightText = '© 2025 Gisele Galvão Consultoria',
  termsText = 'Termos de Uso',
  fontSize = '0.75rem',
  textAlign = 'center',
  color = '#8F7A6A',
  linkColor = '#B89B7A',
  spacing = 8,
  showDividers = true,
  dividerColor = '#ddd',
  className = '',
  style = {},
  onPrivacyClick,
  onTermsClick,
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    fontSize,
    textAlign,
    color,
    lineHeight: '1.4',
    padding: `${spacing}px 0`,
    ...style,
  };

  const linkStyle: React.CSSProperties = {
    color: linkColor,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  };

  const linkHoverStyle: React.CSSProperties = {
    opacity: 0.8,
    textDecoration: 'underline',
  };

  const dividerStyle: React.CSSProperties = {
    margin: `0 ${spacing}px`,
    color: dividerColor,
    opacity: 0.6,
  };

  const handleLinkClick = (callback?: () => void, defaultUrl?: string) => {
    if (callback) {
      callback();
    } else if (defaultUrl) {
      window.open(defaultUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`legal-notice-inline ${className}`} style={containerStyle} {...props}>
      {/* Copyright */}
      <div style={{ marginBottom: `${spacing / 2}px` }}>{copyrightText}</div>

      {/* Links */}
      <div
        style={{
          display: 'flex',
          justifyContent:
            textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: showDividers ? 0 : `${spacing}px`,
        }}
      >
        <a
          style={linkStyle}
          onClick={() => handleLinkClick(onPrivacyClick, '/privacy')}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {privacyText}
        </a>

        {showDividers && <span style={dividerStyle}>•</span>}

        <a
          style={linkStyle}
          onClick={() => handleLinkClick(onTermsClick, '/terms')}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {termsText}
        </a>
      </div>
    </div>
  );
};

export default LegalNoticeInline;
