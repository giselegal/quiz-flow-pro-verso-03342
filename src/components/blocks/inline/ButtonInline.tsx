import React from 'react';

interface ButtonInlineProps {
  text: string;
  style?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export const ButtonInline: React.FC<ButtonInlineProps> = ({
  text,
  style = 'primary',
  size = 'medium',
  backgroundColor = '#007bff',
  textColor = '#ffffff',
  onClick,
  className = ''
}) => {
  const sizeStyles = {
    small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1.125rem' }
  };
  
  const baseStyles = {
    ...sizeStyles[size],
    backgroundColor: style === 'outline' ? 'transparent' : backgroundColor,
    color: style === 'outline' ? backgroundColor : textColor,
    border: style === 'outline' ? `2px solid ${backgroundColor}` : 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  };
  
  return (
    <button 
      style={baseStyles}
      onClick={onClick}
      className={className}
    >
      {text}
    </button>
  );
};

export default ButtonInline;