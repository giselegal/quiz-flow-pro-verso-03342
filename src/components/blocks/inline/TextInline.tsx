import React, { useState } from 'react';

interface TextInlineProps {
  text?: string;
  content?: string; // Suporte para ambos
  fontSize?: string;
  alignment?: 'left' | 'center' | 'right';
  textAlign?: string; // Suporte para textAlign também
  color?: string;
  fontWeight?: string;
  width?: string; // Propriedade de largura
  maxWidth?: string; // Largura máxima
  className?: string;
  // Propriedades de edição
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TextInline: React.FC<TextInlineProps> = ({
  text = '',
  content = '',
  fontSize = '1rem',
  alignment = 'left',
  textAlign,
  color = '#000000',
  fontWeight = 'normal',
  width = '100%', // Padrão 100% da largura
  maxWidth,
  className = '',
  // Propriedades de edição
  isEditable = true, // ATIVADO POR PADRÃO
  onPropertyChange,
  onClick,
  isSelected = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState('');

  // Usar content se disponível, senão text
  const displayText = content || text || 'Clique para editar texto';

  // Usar textAlign se disponível, senão alignment
  const finalAlignment = textAlign || alignment;

  const styles: React.CSSProperties = {
    fontSize,
    textAlign: finalAlignment as 'left' | 'center' | 'right',
    color,
    fontWeight,
    width, // Aplicar largura configurável
    maxWidth, // Aplicar largura máxima se definida
    margin: 0,
    padding: isEditable ? '8px' : 0,
    whiteSpace: 'pre-wrap',
    cursor: isEditable ? 'pointer' : 'default',
    border: isEditable && isSelected ? '2px dashed #B89B7A' : 'transparent',
    borderRadius: '4px',
    minHeight: isEditable ? '24px' : 'auto',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box', // Garantir que padding não afete largura
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Primeiro notifica a seleção do componente
    onClick?.();

    // Depois verifica se deve iniciar a edição inline
    if (isEditable && !isEditing) {
      setIsEditing(true);
      setTempContent(displayText);
    }
  };

  const handleSave = () => {
    if (onPropertyChange) {
      onPropertyChange('content', tempContent);
      onPropertyChange('text', tempContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContent('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing && isEditable) {
    return (
      <div style={{ position: 'relative' }}>
        <textarea
          value={tempContent}
          onChange={e => setTempContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          style={{
            ...styles,
            width: '100%', // Garantir largura total no modo de edição
            minHeight: '60px',
            resize: 'vertical',
            fontFamily: 'inherit',
            border: '2px solid #B89B7A',
          }}
          placeholder="Digite seu texto aqui..."
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            right: '0',
            fontSize: '12px',
            color: '#666',
            background: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Ctrl+Enter para salvar • Esc para cancelar
        </div>
      </div>
    );
  }

  return (
    <p
      style={styles}
      className={className}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: displayText }}
      title={isEditable ? 'Clique para editar' : undefined}
    />
  );
};

export default TextInline;
