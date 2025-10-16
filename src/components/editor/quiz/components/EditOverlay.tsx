/**
 * 🎯 EDIT OVERLAY - Controles de edição sobre componentes finais
 * 
 * Overlay transparente exibido apenas em Edit Mode.
 * Fornece drag handles, seleção visual, e botões de ação.
 */

import React from 'react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BlockComponent } from '../types';

export interface EditOverlayProps {
  block: BlockComponent;
  isSelected: boolean;
  isMultiSelected: boolean;
  hasErrors: boolean;
  errors: any[];
  onDelete: () => void;
  onDuplicate: () => void;
  isContainer?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const EditOverlay: React.FC<EditOverlayProps> = ({
  block,
  isSelected,
  isMultiSelected,
  hasErrors,
  errors,
  onDelete,
  onDuplicate,
  isContainer,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Selection Border */}
      {(isSelected || isMultiSelected) && (
        <div 
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-all",
            isSelected && "border-2 border-blue-500 ring-2 ring-blue-200",
            isMultiSelected && "border-2 border-blue-400 bg-blue-50/20"
          )}
        />
      )}
      
      {/* Drag Handle (canto superior esquerdo) */}
      <div className="absolute left-2 top-2 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity cursor-move">
        <div className="bg-white/90 backdrop-blur-sm rounded p-1 shadow-sm border border-gray-200">
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      
      {/* Action Buttons (canto superior direito) */}
      <div className="absolute right-2 top-2 flex gap-1 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy className="w-3.5 h-3.5 text-blue-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicar bloco</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 bg-white/90 backdrop-blur-sm hover:bg-red-50 border border-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Deletar bloco</TooltipContent>
        </Tooltip>
      </div>
      
      {/* Error Badge */}
      {hasErrors && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute -top-1 -right-1 pointer-events-auto">
              <Badge variant="destructive" className="text-[9px] h-5 px-1.5">
                {errors.length}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <div className="space-y-1">
              {errors.map((e, idx) => (
                <p key={e.id || idx} className="text-xs">
                  {e.message}
                </p>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
      
      {/* Container Controls */}
      {isContainer && onToggleExpand && (
        <button
          className="absolute left-2 bottom-2 pointer-events-auto text-xs px-2 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
        >
          {isExpanded ? '▼ Collapse' : '▶ Expand'} ({block.type})
        </button>
      )}
    </div>
  );
};

export default EditOverlay;
