import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Edit3, Move, Settings, Trash2, Copy } from 'lucide-react';

// =====================================================================
// 🎯 MODULAR COMPONENT SYSTEM - Componentes Editáveis e Reutilizáveis
// =====================================================================

interface ModularComponentProps {
  id: string;
  type: string;
  title?: string;
  children: React.ReactNode;
  isSelected?: boolean;
  isEditable?: boolean;
  isDraggable?: boolean;
  className?: string;
  containerStyle?: React.CSSProperties;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
}

export const ModularComponent: React.FC<ModularComponentProps> = ({
  id,
  type,
  title,
  children,
  isSelected = false,
  isEditable = true,
  isDraggable = true,
  className = '',
  containerStyle = {},
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onMove
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    onSelect?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.(id);
  };

  return (
    <div
      className={`
        relative group modular-component
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
        ${isDraggable ? 'cursor-move' : 'cursor-pointer'}
        transition-all duration-200 ease-in-out
        ${className}
      `}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '60px',
        borderRadius: '8px',
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
        ...containerStyle
      }}
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-component-id={id}
      data-component-type={type}
    >
      {/* Header com controles */}
      {isEditable && (isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 flex items-center space-x-1 z-10">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {type}
          </Badge>
          {title && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              {title}
            </Badge>
          )}
        </div>
      )}

      {/* Controles de ação */}
      {isEditable && (isSelected || isHovered) && (
        <div className="absolute -top-2 -right-2 flex items-center space-x-1 z-20">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-gray-50"
            onClick={handleEdit}
            title="Editar propriedades"
          >
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-gray-50"
            onClick={handleDuplicate}
            title="Duplicar componente"
          >
            <Copy className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-red-50 hover:text-red-600"
            onClick={handleDelete}
            title="Remover componente"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Controles de movimento */}
      {isDraggable && (isSelected || isHovered) && (
        <div className="absolute top-2 left-2 z-10">
          <div className="flex flex-col space-y-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0 bg-white/80 shadow-sm border opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onMove?.(id, 'up');
              }}
              title="Mover para cima"
            >
              <Move className="h-2 w-2 rotate-180" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0 bg-white/80 shadow-sm border opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onMove?.(id, 'down');
              }}
              title="Mover para baixo"
            >
              <Move className="h-2 w-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Conteúdo do componente */}
      <div 
        className="flex-1 p-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        {children}
      </div>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 rounded-lg bg-blue-500/5" />
      )}
    </div>
  );
};

// =====================================================================
// 🎨 FLEXBOX CONTAINER MODULAR
// =====================================================================

interface FlexContainerProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: number;
  className?: string;
  children: React.ReactNode;
}

export const FlexContainer: React.FC<FlexContainerProps> = ({
  direction = 'column',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 16,
  className = '',
  children
}) => {
  const flexDirectionMap = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  };

  const flexWrapMap = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  const justifyContentMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const alignItemsMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  return (
    <div
      className={`
        flex
        ${flexDirectionMap[direction]}
        ${flexWrapMap[wrap]}
        ${justifyContentMap[justify]}
        ${alignItemsMap[align]}
        ${className}
      `}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  );
};

// =====================================================================
// 🧩 COMPONENTES MODULARES ESPECÍFICOS
// =====================================================================

interface TextModuleProps {
  id: string;
  text?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  isEditable?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const TextModule: React.FC<TextModuleProps> = ({
  id,
  text = 'Texto editável',
  size = 'base',
  weight = 'normal',
  color = '#000000',
  align = 'left',
  className = '',
  isEditable = true,
  onSelect,
  onEdit
}) => {
  const sizeMap = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <ModularComponent
      id={id}
      type="text"
      title="Texto"
      isEditable={isEditable}
      onSelect={onSelect}
      onEdit={onEdit}
      className={className}
    >
      <p
        className={`
          ${sizeMap[size]}
          ${weightMap[weight]}
          ${alignMap[align]}
          transition-colors duration-200
        `}
        style={{ color }}
      >
        {text}
      </p>
    </ModularComponent>
  );
};

interface ImageModuleProps {
  id: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  rounded?: boolean;
  className?: string;
  isEditable?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const ImageModule: React.FC<ImageModuleProps> = ({
  id,
  src = 'https://via.placeholder.com/300x200',
  alt = 'Imagem',
  width = 300,
  height = 200,
  objectFit = 'cover',
  rounded = false,
  className = '',
  isEditable = true,
  onSelect,
  onEdit
}) => {
  return (
    <ModularComponent
      id={id}
      type="image"
      title="Imagem"
      isEditable={isEditable}
      onSelect={onSelect}
      onEdit={onEdit}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        className={`
          transition-all duration-200
          ${rounded ? 'rounded-lg' : ''}
        `}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit,
          maxWidth: '100%'
        }}
      />
    </ModularComponent>
  );
};

interface ButtonModuleProps {
  id: string;
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  isEditable?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onClick?: () => void;
}

export const ButtonModule: React.FC<ButtonModuleProps> = ({
  id,
  text = 'Botão',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  isEditable = true,
  onSelect,
  onEdit,
  onClick
}) => {
  return (
    <ModularComponent
      id={id}
      type="button"
      title="Botão"
      isEditable={isEditable}
      onSelect={onSelect}
      onEdit={onEdit}
      className={className}
    >
      <Button
        variant={variant as any}
        size={size === 'md' ? 'default' : size as any}
        disabled={disabled}
        onClick={onClick}
        className={fullWidth ? 'w-full' : ''}
      >
        {text}
      </Button>
    </ModularComponent>
  );
};
