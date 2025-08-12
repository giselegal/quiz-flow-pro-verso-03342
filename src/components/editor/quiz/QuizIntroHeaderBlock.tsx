// src/components/editor/quiz/QuizIntroHeaderBlock.tsx
// Componente configurável de cabeçalho para o quiz

import { Badge } from '@/components/ui/badge';

interface QuizIntroHeaderBlockProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  properties?: {
    // Controles principais
    enabled?: boolean;
    showLogo?: boolean;
    showDecorativeBar?: boolean;

    // Upload e configuração da logo
    logoUrl?: string;
    logoAlt?: string;
    logoSize?: number; // 50% a 200%

    // Configuração da barra decorativa
    barColor?: string;
    barHeight?: number; // 2px a 10px
    barPosition?: 'top' | 'bottom' | 'both';

    // Controles de escala geral
    scale?: number; // 50% a 110%

    // Alinhamento
    alignment?: 'left' | 'center' | 'right';

    // Cores de fundo
    backgroundColor?: string;
    backgroundOpacity?: number; // 0 a 100%

    // Configurações do JSON
    jsonConfig?: any;
  };
  // Propriedades de edição (OBRIGATÓRIAS)
  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (id: string, updates: any) => void;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

export const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({
  id,
  className = '',
  style = {},
  properties = {
    enabled: true,
    showLogo: true,
    showDecorativeBar: true,
    logoUrl:
      'https://res.cloudinary.com/dg3fsapzu/image/upload/v1723251877/LOGO_completa_white_clfcga.png',
    logoAlt: 'Logo',
    logoSize: 100,
    barColor: '#B89B7A',
    barHeight: 4,
    barPosition: 'bottom',
    scale: 100,
    alignment: 'center',
    backgroundColor: 'transparent',
    backgroundOpacity: 100,
  },
  isEditing = false,
  isSelected: _isSelected = false,
  onUpdate,
  onClick: _onClick,
  onPropertyChange: _onPropertyChange,
}) => {
  // Função para notificar mudanças ao componente pai
  const handleUpdate = (updates: any) => {
    onUpdate?.(id, updates);
  };

  // Extrair propriedades com valores padrão
  const {
    enabled = true,
    showLogo = true,
    showDecorativeBar = true,
    logoUrl = 'https://res.cloudinary.com/dg3fsapzu/image/upload/v1723251877/LOGO_completa_white_clfcga.png',
    logoAlt = 'Logo',
    logoSize = 100,
    barColor = '#B89B7A',
    barHeight = 4,
    barPosition = 'bottom',
    scale = 100,
    alignment = 'center',
    backgroundColor = 'transparent',
    backgroundOpacity = 100,
    jsonConfig,
  } = properties;

  // Se desabilitado, não renderiza nada
  if (!enabled) {
    return isEditing ? (
      <div
        id={id}
        className={`quiz-intro-header-block ${className}`}
        style={{
          padding: '12px',
          border: '2px dashed #E5DDD5',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6B4F43',
          fontSize: '14px',
          backgroundColor: '#FAF9F7',
          ...style,
        }}
      >
        Cabeçalho desabilitado (ativar no painel de propriedades)
      </div>
    ) : null;
  }

  // Calcular estilos baseados nas propriedades
  const containerStyle: React.CSSProperties = {
    transform: `scale(${scale / 100})`,
    transformOrigin:
      alignment === 'left' ? 'left center' : alignment === 'right' ? 'right center' : 'center',
    textAlign: alignment,
    backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
    opacity: backgroundOpacity / 100,
    ...style,
  };

  const logoStyle: React.CSSProperties = {
    width: 'auto',
    height: `${logoSize}px`,
    maxWidth: '100%',
    objectFit: 'contain',
  };

  const barStyle: React.CSSProperties = {
    width: '100%',
    height: `${barHeight}px`,
    backgroundColor: barColor,
    borderRadius: `${barHeight / 2}px`,
  };

  // Renderizar barra decorativa
  const renderDecorativeBar = (position: 'top' | 'bottom') => {
    if (!showDecorativeBar) return null;
    if (barPosition !== position && barPosition !== 'both') return null;

    return (
      <div
        className={position === 'top' ? 'mb-4' : 'mt-4'}
        style={{ display: 'flex', justifyContent: alignment }}
      >
        <div style={barStyle} />
      </div>
    );
  };

  return (
    <div
      id={id}
      className={`quiz-intro-header-block ${className} ${isEditing ? 'editing-mode' : ''}`}
      style={containerStyle}
    >
      {/* Barra decorativa superior */}
      {renderDecorativeBar('top')}

      {/* Logo */}
      {showLogo && logoUrl && (
        <div
          className="logo-container"
          style={{ marginBottom: showDecorativeBar && barPosition === 'bottom' ? '0' : '16px' }}
        >
          <img
            src={logoUrl}
            alt={logoAlt}
            style={logoStyle}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Notificar erro de carregamento da logo
              handleUpdate({ logoError: true, logoUrl });
            }}
          />
        </div>
      )}

      {/* Barra decorativa inferior */}
      {renderDecorativeBar('bottom')}

      {/* Conteúdo adicional baseado no JSON */}
      {jsonConfig?.title && (
        <div className="header-content" style={{ marginTop: '16px' }}>
          <h2
            style={{
              color: '#432818',
              fontSize: `${16 * (scale / 100)}px`,
              margin: 0,
              fontWeight: 600,
            }}
          >
            {jsonConfig.title}
          </h2>
          {jsonConfig.subtitle && (
            <p
              style={{
                color: '#6B4F43',
                fontSize: `${14 * (scale / 100)}px`,
                margin: '8px 0 0 0',
              }}
            >
              {jsonConfig.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Modo de edição */}
      {isEditing && (
        <div
          className="editing-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(184, 155, 122, 0.1)',
            border: '2px dashed #B89B7A',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Badge variant="outline" style={{ borderColor: '#B89B7A', color: '#B89B7A' }}>
            Cabeçalho do Quiz
          </Badge>
          <div style={{ fontSize: '12px', color: '#6B4F43' }}>
            {showLogo && showDecorativeBar
              ? 'Logo + Barra'
              : showLogo
                ? 'Apenas Logo'
                : showDecorativeBar
                  ? 'Apenas Barra'
                  : 'Personalizado'}
          </div>
        </div>
      )}
    </div>
  );
};
