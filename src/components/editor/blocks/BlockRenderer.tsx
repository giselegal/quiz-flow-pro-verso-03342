/**
 * 🎨 BLOCK RENDERER SYSTEM
 * 
 * Renderiza blocos atômicos com overlay de edição
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import {
  LogoBlock,
  HeadlineBlock,
  ImageBlock,
  TextBlock,
  FormInputBlock,
  ButtonBlock,
  GridOptionsBlock,
  FooterBlock,
  SpacerBlock,
  ProgressBarBlock
} from './atomic';
import type { StepBlockSchema } from '@/data/stepBlockSchemas';

const BLOCK_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  LogoBlock,
  HeadlineBlock,
  ImageBlock,
  TextBlock,
  FormInputBlock,
  ButtonBlock,
  GridOptionsBlock,
  FooterBlock,
  SpacerBlock,
  ProgressBarBlock
};

interface BlockRendererProps {
  block: StepBlockSchema;
  mode: 'edit' | 'preview';
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<StepBlockSchema>) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onReorder?: (id: string, direction: 'up' | 'down') => void;
  contextData?: Record<string, any>;
  className?: string;
}

/**
 * Processa placeholders dinâmicos {{variável}}
 */
const processPlaceholders = (
  props: Record<string, any>,
  contextData: Record<string, any> = {}
): Record<string, any> => {
  const processed: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
      const varName = value.slice(2, -2);
      processed[key] = contextData[varName] ?? value;
    } else {
      processed[key] = value;
    }
  }

  return processed;
};

export const BlockRenderer = memo(({
  block,
  mode,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onReorder,
  contextData = {},
  className = ''
}: BlockRendererProps) => {
  const Component = BLOCK_COMPONENT_MAP[block.type];

  if (!Component) {
    console.error(`❌ Bloco "${block.type}" não encontrado no registry`);
    return (
      <div className="p-4 border-2 border-dashed border-red-500 rounded-lg text-center">
        <p className="text-red-500 font-semibold">Bloco não encontrado: {block.type}</p>
      </div>
    );
  }

  // Processar props com placeholders dinâmicos
  const processedProps = processPlaceholders(block.props, contextData);

  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'edit') {
      e.stopPropagation();
      onSelect?.(block.id);
    }
  };

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        mode === 'edit' && [
          'cursor-pointer',
          'hover:ring-2 hover:ring-blue-300/50',
          'rounded-lg p-2',
          isSelected && 'ring-2 ring-blue-500 bg-blue-50/30'
        ],
        className
      )}
      onClick={handleClick}
    >
      {/* 🎯 EDIT MODE OVERLAY */}
      {mode === 'edit' && (
        <>
          {/* Drag handle */}
          <div
            className={cn(
              'absolute -left-8 top-1/2 -translate-y-1/2 z-10',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'cursor-grab active:cursor-grabbing'
            )}
          >
            <div className="p-1.5 bg-white border border-gray-300 rounded shadow-sm">
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Action buttons */}
          {isSelected && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-white border border-gray-300 rounded-lg shadow-md p-1">
              {/* Move up */}
              {block.movable !== false && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder?.(block.id, 'up');
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  title="Mover para cima"
                >
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {/* Move down */}
              {block.movable !== false && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder?.(block.id, 'down');
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  title="Mover para baixo"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {/* Duplicate */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate?.(block.id);
                }}
                className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                title="Duplicar"
              >
                <Copy className="w-4 h-4 text-blue-600" />
              </button>

              {/* Delete */}
              {block.deletable !== false && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(block.id);
                  }}
                  className="p-1.5 hover:bg-red-100 rounded transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          )}

          {/* Block label */}
          <div
            className={cn(
              'absolute -top-6 left-0 z-10',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200'
            )}
          >
            {block.type}
          </div>
        </>
      )}

      {/* 🎯 RENDER BLOCK COMPONENT */}
      <Component {...processedProps} mode={mode} />
    </div>
  );
});

BlockRenderer.displayName = 'BlockRenderer';
