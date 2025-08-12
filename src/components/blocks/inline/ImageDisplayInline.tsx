/**
 * 🖼️ COMPONENTE IMAGEM INLINE
 * ===========================
 *
 * Componente para exibição de imagens otimizado
 * totalmente integrado com o sistema de propriedades unificado.
 */

import React, { useState } from 'react';

interface ImageDisplayInlineProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: number;
  shadow?: boolean;
  alignment?: 'left' | 'center' | 'right';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  loading?: 'lazy' | 'eager';
  quality?: 'high' | 'medium' | 'low';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  // Propriedades de edição
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  isSelected?: boolean;
}

const ImageDisplayInline: React.FC<ImageDisplayInlineProps> = ({
  src,
  alt = 'Imagem',
  width = '100%',
  height = 'auto',
  borderRadius = 12,
  shadow = true,
  alignment = 'center',
  objectFit = 'cover',
  loading = 'lazy',
  quality = 'high',
  className = '',
  style = {},
  onClick,
  // Propriedades de edição
  isEditable = true, // ATIVADO POR PADRÃO
  onPropertyChange,
  isSelected = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState('');

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable && !isEditing) {
      setIsEditing(true);
      setTempSrc(src);
    }
    onClick?.();
  };

  const handleSave = () => {
    if (onPropertyChange && tempSrc.trim()) {
      onPropertyChange('src', tempSrc.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSrc('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: alignment,
    width: '100%',
    position: 'relative',
    border: isEditable && isSelected ? '2px dashed #B89B7A' : 'none',
    borderRadius: isEditable && isSelected ? '8px' : '0',
    padding: isEditable && isSelected ? '4px' : '0',
    cursor: isEditable ? 'pointer' : 'default',
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: `${borderRadius}px`,
    objectFit,
    boxShadow: shadow ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.3s ease',
    filter: quality === 'low' ? 'blur(0.5px)' : 'none',
    opacity: isLoading ? 0.7 : 1,
  };

  if (isEditing && isEditable) {
    return (
      <div className={`image-display-inline editing ${className}`} style={containerStyle}>
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 1000,
            minWidth: '300px',
          }}
        >
          <h3 style={{ marginBottom: '15px', color: '#432818' }}>Editar Imagem</h3>
          <input
            type="text"
            value={tempSrc}
            onChange={e => setTempSrc(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="URL da imagem..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #B89B7A',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '14px',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '6px 12px',
                border: '1px solid #B89B7A',
                borderRadius: '4px',
                background: '#B89B7A',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Salvar
            </button>
          </div>
        </div>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
          onClick={handleCancel}
        />
      </div>
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`image-display-inline error ${className}`} style={containerStyle}>
        <div
          style={{
            ...imageStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            border: '2px dashed #ddd',
            color: '#999',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          Erro ao carregar imagem
        </div>
      </div>
    );
  }

  return (
    <div
      className={`image-display-inline ${className}`}
      style={containerStyle}
      onClick={handleEditClick}
    >
      {isEditable && isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: '#B89B7A',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            zIndex: 10,
            cursor: 'pointer',
          }}
        >
          ✎
        </div>
      )}
      {isLoading && (
        <div
          style={{
            ...imageStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#999',
          }}
        >
          Carregando...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          ...imageStyle,
          display: isLoading ? 'none' : 'block',
        }}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
        title={isEditable ? 'Clique para editar imagem' : alt}
      />
    </div>
  );
};

export default ImageDisplayInline;
