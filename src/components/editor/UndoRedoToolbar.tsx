import { cn } from '@/lib/utils';
import React from 'react';

interface UndoRedoToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  lastActionDescription?: string | null;
  nextActionDescription?: string | null;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const UndoRedoToolbar: React.FC<UndoRedoToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  lastActionDescription,
  nextActionDescription,
  className,
  showLabels = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const ButtonComponent = ({
    onClick,
    disabled,
    children,
    title,
    label,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    title?: string;
    label?: string;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
          'flex items-center justify-center rounded-md border transition-all duration-200',
          sizeClasses[size],
          disabled
            ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 shadow-sm hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
        )}
      >
        {children}
      </button>
      {showLabels && label && (
        <span className={cn('text-xs text-gray-600 select-none', disabled && 'text-gray-400')}>
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Botão Undo */}
      <ButtonComponent
        onClick={onUndo}
        disabled={!canUndo}
        title={
          canUndo
            ? lastActionDescription
              ? `Desfazer: ${lastActionDescription}`
              : 'Desfazer (Ctrl+Z)'
            : 'Nada para desfazer'
        }
        label={showLabels ? 'Desfazer' : undefined}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="m21 17-3-3-3 3" />
          <path d="M21 10H9.5a3.5 3.5 0 0 0 0 7H17" />
        </svg>
      </ButtonComponent>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Botão Redo */}
      <ButtonComponent
        onClick={onRedo}
        disabled={!canRedo}
        title={
          canRedo
            ? nextActionDescription
              ? nextActionDescription
              : 'Refazer (Ctrl+Y)'
            : 'Nada para refazer'
        }
        label={showLabels ? 'Refazer' : undefined}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 7-6-6v6h-6a3.5 3.5 0 0 0 0 7h6" />
          <path d="m15 14 6-6-6-6" />
        </svg>
      </ButtonComponent>

      {/* Status indicator */}
      {(lastActionDescription || nextActionDescription) && (
        <div className="ml-2 flex flex-col text-xs text-gray-500">
          {canUndo && lastActionDescription && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">↶</span>
              <span className="truncate max-w-[120px]">{lastActionDescription}</span>
            </div>
          )}
          {canRedo && nextActionDescription && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">↷</span>
              <span className="truncate max-w-[120px]">{nextActionDescription}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 🚀 Versão compacta para usar em toolbars pequenas
export const CompactUndoRedo: React.FC<
  Pick<UndoRedoToolbarProps, 'canUndo' | 'canRedo' | 'onUndo' | 'onRedo'>
> = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <UndoRedoToolbar
    canUndo={canUndo}
    canRedo={canRedo}
    onUndo={onUndo}
    onRedo={onRedo}
    size="sm"
    className="bg-white border border-gray-200 rounded-md p-1 shadow-sm"
  />
);

// 🎯 Versão com labels para interfaces maiores
export const LabeledUndoRedo: React.FC<UndoRedoToolbarProps> = props => (
  <UndoRedoToolbar
    {...props}
    showLabels={true}
    size="lg"
    className={cn('bg-gray-50 border border-gray-200 rounded-lg p-3', props.className)}
  />
);

export default UndoRedoToolbar;
