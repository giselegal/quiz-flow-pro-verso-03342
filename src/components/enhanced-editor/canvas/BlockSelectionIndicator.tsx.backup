/**
 * 🎯 BlockSelectionIndicator - Indicador visual para bloco selecionado
 * Melhora a experiência visual do painel de propriedades
 */

import React from "react";
import { motion } from "framer-motion";
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlockSelectionIndicatorProps {
  isSelected: boolean;
  blockType: string;
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export const BlockSelectionIndicator: React.FC<BlockSelectionIndicatorProps> = ({
  isSelected,
  blockType,
  onEdit,
  onDelete,
  children,
}) => {
  return (
    <div className="relative group">
      {children}
      
      {/* Indicador de seleção */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-1 bg-blue-500/20 border-2 border-blue-500 rounded-lg pointer-events-none"
        />
      )}
      
      {/* Toolbar de ações - aparece no hover ou quando selecionado */}
      {(isSelected || false) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-8 left-0 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg px-2 py-1 z-10"
        >
          <span className="text-xs text-gray-600 font-medium">{blockType}</span>
          
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-6 w-6 p-0 hover:bg-blue-50"
            >
              <Edit3 className="w-3 h-3 text-blue-600" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-6 w-6 p-0 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </Button>
          )}
        </motion.div>
      )}
      
      {/* Efeito hover sutil */}
      <div className="absolute inset-0 group-hover:bg-gray-100/30 rounded-lg transition-colors pointer-events-none" />
    </div>
  );
};

export default BlockSelectionIndicator;