/**
 * 🎯 UNIVERSAL BLOCK - FASE 1 Registry Universal Dinâmico
 * 
 * Componente genérico que renderiza qualquer tipo de bloco
 * baseado em schema JSON, eliminando necessidade de criar
 * componentes TSX individuais.
 */

import React from 'react';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { cn } from '@/lib/utils';

export interface UniversalBlockProps {
  type: string;
  properties: Record<string, any>;
  content?: any;
  isSelected?: boolean;
  isEditable?: boolean;
  onClick?: () => void;
  onUpdate?: (updates: Record<string, any>) => void;
  children?: React.ReactNode;
}

/**
 * Renderiza texto com suporte a placeholders
 */
const renderText = (template: string, props: Record<string, any>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return props[key] || '';
  });
};

/**
 * Componente Universal que renderiza blocos dinamicamente
 */
export const UniversalBlock: React.FC<UniversalBlockProps> = ({
  type,
  properties,
  content,
  isSelected = false,
  isEditable = false,
  onClick,
  onUpdate,
  children,
}) => {
  const schema = schemaInterpreter.getBlockSchema(type);

  // Fallback se schema não encontrado
  if (!schema) {
    return (
      <div
        className={cn(
          'p-4 border border-dashed rounded',
          isSelected && 'ring-2 ring-primary'
        )}
        onClick={onClick}
      >
        <div className="text-sm text-muted-foreground">
          Tipo de bloco não reconhecido: <code>{type}</code>
        </div>
        {children}
      </div>
    );
  }

  // Mesclar props com defaults
  const mergedProps = {
    ...schemaInterpreter.getDefaultProps(type),
    ...properties,
  };

  // Renderização baseada em categoria
  const renderContent = () => {
    switch (schema.category) {
      case 'content':
        return renderContentBlock(schema, mergedProps, content);
      case 'interactive':
        return renderInteractiveBlock(schema, mergedProps, content, onUpdate);
      case 'layout':
        return renderLayoutBlock(schema, mergedProps, children);
      case 'media':
        return renderMediaBlock(schema, mergedProps, content);
      case 'quiz':
        return renderQuizBlock(schema, mergedProps, content, onUpdate);
      default:
        return renderGenericBlock(schema, mergedProps, content);
    }
  };

  return (
    <div
      className={cn(
        'universal-block',
        `block-type-${type}`,
        isSelected && 'ring-2 ring-primary',
        mergedProps.className
      )}
      onClick={onClick}
      style={mergedProps.style}
    >
      {renderContent()}
      {children}
    </div>
  );
};

/**
 * Renderizadores específicos por categoria
 */

function renderContentBlock(
  schema: any,
  props: Record<string, any>,
  content: any
): React.ReactNode {
  const text = content?.text || props.text || '';
  const tag = props.tag || 'div';

  return React.createElement(
    tag,
    {
      className: cn(
        props.fontSize && `text-${props.fontSize}`,
        props.fontWeight && `font-${props.fontWeight}`,
        props.textAlign && `text-${props.textAlign}`,
        props.color && `text-${props.color}`
      ),
    },
    text
  );
}

function renderInteractiveBlock(
  schema: any,
  props: Record<string, any>,
  content: any,
  onUpdate?: (updates: Record<string, any>) => void
): React.ReactNode {
  if (schema.type.includes('button')) {
    return (
      <button
        className={cn(
          'px-4 py-2 rounded',
          props.variant === 'primary' && 'bg-primary text-primary-foreground',
          props.variant === 'secondary' && 'bg-secondary text-secondary-foreground',
          props.size === 'sm' && 'text-sm',
          props.size === 'lg' && 'text-lg'
        )}
        onClick={() => props.onClick?.()}
      >
        {props.label || content?.text || 'Button'}
      </button>
    );
  }

  if (schema.type.includes('input')) {
    return (
      <input
        type={props.inputType || 'text'}
        placeholder={props.placeholder}
        className="px-3 py-2 border rounded w-full"
        onChange={(e) => onUpdate?.({ value: e.target.value })}
      />
    );
  }

  return <div>Interactive: {schema.type}</div>;
}

function renderLayoutBlock(
  schema: any,
  props: Record<string, any>,
  children?: React.ReactNode
): React.ReactNode {
  return (
    <div
      className={cn(
        props.layout === 'flex' && 'flex',
        props.layout === 'grid' && 'grid',
        props.gap && `gap-${props.gap}`,
        props.padding && `p-${props.padding}`
      )}
    >
      {children}
    </div>
  );
}

function renderMediaBlock(
  schema: any,
  props: Record<string, any>,
  content: any
): React.ReactNode {
  const src = content?.src || props.src || '';
  const alt = props.alt || '';

  if (schema.type.includes('image')) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          props.width && `w-${props.width}`,
          props.height && `h-${props.height}`,
          props.rounded && 'rounded'
        )}
      />
    );
  }

  return <div>Media: {schema.type}</div>;
}

function renderQuizBlock(
  schema: any,
  props: Record<string, any>,
  content: any,
  onUpdate?: (updates: Record<string, any>) => void
): React.ReactNode {
  if (schema.type.includes('question')) {
    const options = props.options || [];
    return (
      <div className="space-y-3">
        <div className="font-semibold">{props.question || content?.text}</div>
        <div className="space-y-2">
          {options.map((opt: any, idx: number) => (
            <button
              key={idx}
              className="w-full p-3 border rounded text-left hover:bg-accent"
              onClick={() => onUpdate?.({ selectedOption: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <div>Quiz: {schema.type}</div>;
}

function renderGenericBlock(
  schema: any,
  props: Record<string, any>,
  content: any
): React.ReactNode {
  return (
    <div className="p-4 border rounded">
      <div className="text-sm font-medium mb-2">{schema.label}</div>
      <pre className="text-xs overflow-auto">
        {JSON.stringify({ props, content }, null, 2)}
      </pre>
    </div>
  );
}

export default UniversalBlock;
