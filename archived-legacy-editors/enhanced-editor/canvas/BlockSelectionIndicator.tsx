/**
 * 🎯 BlockSelectionIndicator - Indicador visual para bloco selecionado
 * Melhora a experiência visual do painel de propriedades
 */

import { motion } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          style={{ backgroundColor: '#FAF9F7' }}
        />
      )}

      {/* Toolbar de ações - aparece no hover ou quando selecionado */}
      {(isSelected || false) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ borderColor: '#E5DDD5' }}
        >
          <span style={{ color: '#6B4F43' }}>{blockType}</span>

          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              style={{ backgroundColor: '#FAF9F7' }}
            >
              <Edit3 style={{ color: '#B89B7A' }} />
            </Button>
          )}

          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              style={{ backgroundColor: '#FAF9F7' }}
            >
              <Trash2 style={{ color: '#432818' }} />
            </Button>
          )}
        </motion.div>
      )}

      {/* Efeito hover sutil */}
      <div style={{ backgroundColor: '#E5DDD5' }} />
    </div>
  );
};

export default BlockSelectionIndicator;
