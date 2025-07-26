import React from 'react';

interface ButtonBlockProps {
  text?: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  text = 'Clique Aqui',
  link = '#',
  backgroundColor = '#B89B7A',
  textColor = '#ffffff',
  paddingX = 24,
  paddingY = 12,
  borderRadius = 8,
  fullWidth = false,
  className = '',
  onClick
}) => {
  const style = {
    backgroundColor,
    color: textColor,
    padding: `${paddingY}px ${paddingX}px`,
    borderRadius: `${borderRadius}px`,
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto'
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  if (link && link !== '#') {
    return (
      <a
        href={link}
        className={`hover:opacity-90 ${className}`}
        style={style}
        onClick={handleClick}
      >
        {text}
      </a>
    );
  }

  return (
    <button
      className={`hover:opacity-90 ${className}`}
      style={style}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};
