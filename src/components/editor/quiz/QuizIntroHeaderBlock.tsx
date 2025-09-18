// src/components/editor/quiz/QuizIntroHeaderBlock.tsx
// Componente configurável de cabeçalho para o quiz

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useStyleResultsForHeader } from '@/hooks/useStyleResultsForHeader';

// Componente para a barra de progresso personalizada
interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = '#B89B7A', height = 8 }) => (
  <div className="w-full bg-gray-200 rounded-full" style={{ height: `${height}px` }}>
    <div
      className="rounded-full transition-all duration-300"
      style={{
        width: `${Math.min(Math.max(percentage, 0), 100)}%`,
        height: `${height}px`,
        backgroundColor: color,
      }}
    />
  </div>
);

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

    // Controles de Estilo Predominante
    showPredominantStyleName?: boolean;
    showPredominantStyleDescription?: boolean;
    showPredominantStylePercentage?: boolean;
    showPredominantStyleImage?: boolean;
    showPredominantStyleGuide?: boolean;

    // Controles de Estilos Secundários
    showSecondaryStyleName?: boolean;
    showSecondaryStylePercentage?: boolean;
    showThirdStyleName?: boolean;
    showThirdStylePercentage?: boolean;
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
    // Valores padrão para estilos
    showPredominantStyleName: true,
    showPredominantStyleDescription: true,
    showPredominantStylePercentage: true,
    showPredominantStyleImage: true,
    showPredominantStyleGuide: false,
    showSecondaryStyleName: true,
    showSecondaryStylePercentage: true,
    showThirdStyleName: true,
    showThirdStylePercentage: true,
  },
  isEditing = false,
  isSelected: _isSelected = false,
  onUpdate,
  onClick: _onClick,
  onPropertyChange: _onPropertyChange,
}) => {
  // Hooks para buscar dados de estilo e nome do usuário
  const styleResults = useStyleResultsForHeader();

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
    // Controles de Estilo Predominante
    showPredominantStyleName = true,
    showPredominantStyleDescription = true,
    showPredominantStylePercentage = true,
    showPredominantStyleImage = true,
    showPredominantStyleGuide = false,
    // Controles de Estilos Secundários
    showSecondaryStyleName = true,
    showSecondaryStylePercentage = true,
    showThirdStyleName = true,
    showThirdStylePercentage = true,
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

      {/* Seção de Resultados de Estilo */}
      <div className="style-results-section" style={{ marginTop: '24px' }}>
        {/* Estilo Predominante */}
        {(showPredominantStyleName ||
          showPredominantStyleDescription ||
          showPredominantStylePercentage ||
          showPredominantStyleImage ||
          showPredominantStyleGuide) && (
          <div className="predominant-style" style={{ marginBottom: '16px' }}>
            <h3
              style={{
                color: '#432818',
                fontSize: `${14 * (scale / 100)}px`,
                fontWeight: 600,
                marginBottom: '8px',
                textAlign: alignment,
              }}
            >
              Seu Estilo Predominante
            </h3>

            {/* Nome do Estilo Predominante */}
            {showPredominantStyleName && (
              <h4
                style={{
                  color: styleResults.primaryStyle.color,
                  fontSize: `${18 * (scale / 100)}px`,
                  fontWeight: 700,
                  margin: '4px 0',
                  textAlign: alignment,
                }}
              >
                {styleResults.primaryStyle.name}
              </h4>
            )}

            {/* Descrição do Estilo Predominante */}
            {showPredominantStyleDescription && (
              <p
                style={{
                  color: '#6B4F43',
                  fontSize: `${13 * (scale / 100)}px`,
                  margin: '8px 0',
                  textAlign: alignment,
                }}
              >
                {styleResults.primaryStyle.description}
              </p>
            )}

            {/* Barrinha de Porcentagem do Estilo Predominante */}
            {showPredominantStylePercentage && (
              <div style={{ margin: '12px 0' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: `${12 * (scale / 100)}px`,
                      color: '#6B4F43',
                    }}
                  >
                    Compatibilidade
                  </span>
                  <span
                    style={{
                      fontSize: `${12 * (scale / 100)}px`,
                      color: styleResults.primaryStyle.color,
                      fontWeight: 600,
                    }}
                  >
                    {styleResults.primaryStyle.percentage}%
                  </span>
                </div>
                <ProgressBar
                  percentage={styleResults.primaryStyle.percentage}
                  color={styleResults.primaryStyle.color}
                />
              </div>
            )}

            {/* Imagem do Estilo Pessoal */}
            {showPredominantStyleImage && styleResults.primaryStyle.image && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: alignment,
                  margin: '12px 0',
                }}
              >
                <img
                  src={styleResults.primaryStyle.image}
                  alt={`Estilo ${styleResults.primaryStyle.name}`}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: `2px solid ${styleResults.primaryStyle.color}`,
                  }}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Imagem do Guia de Estilo */}
            {showPredominantStyleGuide && styleResults.primaryStyle.guideImage && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: alignment,
                  margin: '12px 0',
                }}
              >
                <img
                  src={styleResults.primaryStyle.guideImage}
                  alt={`Guia do estilo ${styleResults.primaryStyle.name}`}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: `1px solid ${styleResults.primaryStyle.color}`,
                  }}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Estilos Secundários */}
        {(showSecondaryStyleName ||
          showSecondaryStylePercentage ||
          showThirdStyleName ||
          showThirdStylePercentage) && (
          <div className="secondary-styles">
            <h3
              style={{
                color: '#432818',
                fontSize: `${14 * (scale / 100)}px`,
                fontWeight: 600,
                marginBottom: '12px',
                textAlign: alignment,
              }}
            >
              Estilos Secundários
            </h3>

            {/* Segundo Estilo */}
            {(showSecondaryStyleName || showSecondaryStylePercentage) && (
              <div style={{ marginBottom: '12px' }}>
                {showSecondaryStyleName && (
                  <h5
                    style={{
                      color: styleResults.secondaryStyle.color,
                      fontSize: `${15 * (scale / 100)}px`,
                      fontWeight: 600,
                      margin: '4px 0',
                      textAlign: alignment,
                    }}
                  >
                    2º - {styleResults.secondaryStyle.name}
                  </h5>
                )}

                {showSecondaryStylePercentage && (
                  <div style={{ margin: '8px 0' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: `${11 * (scale / 100)}px`,
                          color: '#6B4F43',
                        }}
                      >
                        Compatibilidade
                      </span>
                      <span
                        style={{
                          fontSize: `${11 * (scale / 100)}px`,
                          color: styleResults.secondaryStyle.color,
                          fontWeight: 600,
                        }}
                      >
                        {styleResults.secondaryStyle.percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={styleResults.secondaryStyle.percentage}
                      color={styleResults.secondaryStyle.color}
                      height={6}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Terceiro Estilo */}
            {(showThirdStyleName || showThirdStylePercentage) && (
              <div style={{ marginBottom: '12px' }}>
                {showThirdStyleName && (
                  <h5
                    style={{
                      color: styleResults.thirdStyle.color,
                      fontSize: `${15 * (scale / 100)}px`,
                      fontWeight: 600,
                      margin: '4px 0',
                      textAlign: alignment,
                    }}
                  >
                    3º - {styleResults.thirdStyle.name}
                  </h5>
                )}

                {showThirdStylePercentage && (
                  <div style={{ margin: '8px 0' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: `${11 * (scale / 100)}px`,
                          color: '#6B4F43',
                        }}
                      >
                        Compatibilidade
                      </span>
                      <span
                        style={{
                          fontSize: `${11 * (scale / 100)}px`,
                          color: styleResults.thirdStyle.color,
                          fontWeight: 600,
                        }}
                      >
                        {styleResults.thirdStyle.percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={styleResults.thirdStyle.percentage}
                      color={styleResults.thirdStyle.color}
                      height={6}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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
