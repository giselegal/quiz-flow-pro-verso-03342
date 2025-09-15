/**
 * 🎨 UNIVERSAL BLOCK RENDERER v3.0 - CLEAN ARCHITECTURE
 * 
 * Renderer universal de blocos otimizado com Clean Architecture
 * Performance máxima e flexibilidade total
 */

import React, { memo, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

// 🎯 INTERFACES (EXPORTADAS)
export interface Block {
  id: string;
  type: string;
  properties?: Record<string, any>;
}

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreviewing?: boolean;
  mode?: 'production' | 'preview' | 'editor';
  onSelect?: (blockId: string) => void;
  onClick?: () => void; // Legacy compatibility
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onDelete?: (blockId: string) => void;
  onPropertyChange?: (key: string, value: any) => void; // Legacy compatibility
  className?: string;
  style?: React.CSSProperties;
}

// 🎨 COMPONENTES DE BLOCOS BÁSICOS
const TextBlock: React.FC<{ block: Block; isSelected?: boolean; onUpdate?: (updates: any) => void }> = memo(({ 
  block, 
  isSelected, 
  onUpdate 
}) => {
  const text = block.properties?.text || 'Digite seu texto aqui...';
  
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLDivElement>) => {
    onUpdate?.({ properties: { ...block.properties, text: e.currentTarget.textContent } });
  }, [onUpdate, block.properties]);

  return (
    <div
      contentEditable={!isSelected ? false : true}
      onBlur={handleTextChange}
      className={cn(
        'min-h-[2rem] p-2 rounded border-2 transition-all',
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-transparent hover:border-muted-foreground/20'
      )}
      suppressContentEditableWarning
    >
      {text}
    </div>
  );
});

const ButtonBlock: React.FC<{ block: Block; isSelected?: boolean; onUpdate?: (updates: any) => void }> = memo(({ 
  block, 
  isSelected
}) => {
  const text = block.properties?.text || 'Botão';
  const url = block.properties?.url || '#';
  
  return (
    <div className={cn(
      'inline-block p-2 rounded border-2 transition-all',
      isSelected 
        ? 'border-primary bg-primary/5' 
        : 'border-transparent hover:border-muted-foreground/20'
    )}>
      <button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          if (url && url !== '#') {
            window.open(url, '_blank');
          }
        }}
      >
        {text}
      </button>
    </div>
  );
});

const ImageBlock: React.FC<{ block: Block; isSelected?: boolean }> = memo(({ 
  block, 
  isSelected 
}) => {
  const src = block.properties?.src || 'https://via.placeholder.com/300x200';
  const alt = block.properties?.alt || 'Imagem';
  
  return (
    <div className={cn(
      'inline-block p-2 rounded border-2 transition-all',
      isSelected 
        ? 'border-primary bg-primary/5' 
        : 'border-transparent hover:border-muted-foreground/20'
    )}>
      <img 
        src={src} 
        alt={alt}
        className="max-w-full h-auto rounded"
        style={{ maxHeight: '400px' }}
      />
    </div>
  );
});

const FormBlock: React.FC<{ block: Block; isSelected?: boolean }> = memo(({ 
  block, 
  isSelected 
}) => {
  const title = block.properties?.title || 'Formulário';
  const fields = block.properties?.fields || [
    { type: 'text', label: 'Nome', placeholder: 'Digite seu nome' },
    { type: 'email', label: 'Email', placeholder: 'seu@email.com' }
  ];
  
  return (
    <div className={cn(
      'p-4 rounded border-2 transition-all bg-background',
      isSelected 
        ? 'border-primary bg-primary/5' 
        : 'border-muted hover:border-muted-foreground/20'
    )}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {fields.map((field: any, index: number) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Enviar
        </button>
      </div>
    </div>
  );
});

// 🎯 REGISTRY DE BLOCOS
const BLOCK_COMPONENTS = {
  text: TextBlock,
  button: ButtonBlock,
  image: ImageBlock,
  form: FormBlock,
} as const;

/**
 * 🎨 Universal Block Renderer v3.0
 * 
 * Features v3.0:
 * - Clean Architecture integration
 * - Performance otimizada com memo
 * - Suporte a edição inline
 * - Registry extensível de componentes
 * - Feedback visual aprimorado
 */
export const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreviewing = false,
  onSelect,
  onClick, // Legacy compatibility
  onUpdate,
  onDelete,
  onPropertyChange, // Legacy compatibility
  className,
  style
}) => {
  // 🚩 FEATURE FLAGS (mock por enquanto)
  const featureFlags = { useCleanArchitecture: true };
  
  // 🎯 COMPONENT RESOLUTION
  const BlockComponent = useMemo(() => {
    return BLOCK_COMPONENTS[block.type as keyof typeof BLOCK_COMPONENTS] || null;
  }, [block.type]);

  // 🎯 HANDLERS COM COMPATIBILIDADE LEGACY
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isPreviewing) {
      e.stopPropagation();
      // Usar onSelect se disponível, caso contrário onClick (legacy)
      if (onSelect) {
        onSelect(block.id);
      } else if (onClick) {
        onClick();
      }
    }
  }, [isPreviewing, onSelect, onClick, block.id]);

  const handleUpdate = useCallback((updates: Partial<Block>) => {
    if (onUpdate) {
      onUpdate(block.id, updates);
    } else if (onPropertyChange && updates.properties) {
      // Legacy compatibility: chamar onPropertyChange para cada propriedade
      Object.entries(updates.properties).forEach(([key, value]) => {
        onPropertyChange(key, value);
      });
    }
  }, [onUpdate, onPropertyChange, block.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && isSelected && !isPreviewing) {
      e.preventDefault();
      onDelete?.(block.id);
    }
  }, [isSelected, isPreviewing, onDelete, block.id]);

  // 🎨 FALLBACK PARA TIPOS DESCONHECIDOS
  if (!BlockComponent) {
    return (
      <div 
        className={cn(
          'p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg',
          'bg-muted/10 text-center text-muted-foreground',
          isSelected && 'border-destructive bg-destructive/5',
          className
        )}
        style={style}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="text-sm font-medium mb-1">
          Tipo desconhecido: {block.type}
        </div>
        <div className="text-xs">
          Componente não registrado no sistema
        </div>
        {featureFlags.useCleanArchitecture && (
          <div className="text-xs mt-2 text-primary">
            Clean Architecture v3.0
          </div>
        )}
      </div>
    );
  }

  // 🎨 RENDER PRINCIPAL
  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        !isPreviewing && 'cursor-pointer',
        className
      )}
      style={style}
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Indicador de seleção */}
      {isSelected && !isPreviewing && (
        <div className="absolute -inset-1 border-2 border-primary rounded-lg pointer-events-none">
          <div className="absolute -top-6 left-0 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
            {block.type}
          </div>
        </div>
      )}

      {/* Controles de hover */}
      {!isPreviewing && (
        <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            {featureFlags.useCleanArchitecture && (
              <span className="px-1 py-0.5 bg-blue-500 text-white text-xs rounded">
                v3.0
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(block.id);
              }}
              className="w-6 h-6 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Componente do bloco */}
      <BlockComponent 
        block={block} 
        isSelected={isSelected}
        onUpdate={handleUpdate}
      />
    </div>
  );
});

UniversalBlockRenderer.displayName = 'UniversalBlockRenderer';

export default UniversalBlockRenderer;