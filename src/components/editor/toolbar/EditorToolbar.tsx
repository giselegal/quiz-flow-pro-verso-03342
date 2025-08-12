import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  viewportSize?: 'sm' | 'md' | 'lg' | 'xl';
  onViewportSizeChange?: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isPreviewing,
  onTogglePreview,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  viewportSize = 'lg',
  onViewportSizeChange = () => {},
}) => {
  return (
    <div
      className="border-b border-amber-700/30 p-3 flex items-center justify-between shadow-lg backdrop-blur-sm"
      style={{ backgroundColor: '#d1b586' }}
    >
      {/* Logo à esquerda com animação Framer Motion */}
      <div className="flex items-center">
        <motion.div
          className="relative group cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{
            scale: 1.05,
            rotate: [0, -1, 1, 0],
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{
              filter: [
                'brightness(1) saturate(1)',
                'brightness(1.1) saturate(1.1)',
                'brightness(1) saturate(1)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Logo className="h-8 w-auto transform-gpu" />
          </motion.div>

          {/* Glow effect animado */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-white/10 blur-sm -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{
              opacity: 0.3,
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
          />
        </motion.div>
      </div>

      {/* Ferramentas no centro */}
      <div className="flex items-center space-x-3">
        {onUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer"
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </Button>
        )}

        {onRedo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer"
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </Button>
        )}

        <div className="h-6 w-px bg-white/30 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-white hover:bg-white/20 transition-all',
            viewportSize === 'sm' && 'bg-white/30 shadow-md'
          )}
          onClick={() => onViewportSizeChange('sm')}
          title="Mobile"
        >
          <Smartphone className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-white hover:bg-white/20 transition-all',
            viewportSize === 'md' && 'bg-white/30 shadow-md'
          )}
          onClick={() => onViewportSizeChange('md')}
          title="Tablet"
        >
          <Tablet className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-white hover:bg-white/20 transition-all',
            viewportSize === 'lg' && 'bg-white/30 shadow-md'
          )}
          onClick={() => onViewportSizeChange('lg')}
          title="Desktop"
        >
          <Monitor className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-white hover:bg-white/20 transition-all',
            viewportSize === 'xl' && 'bg-white/30 shadow-md'
          )}
          onClick={() => onViewportSizeChange('xl')}
          title="Desktop Large"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {/* Botões de ação à direita */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="border-white/30 text-white hover:bg-white/20 bg-transparent"
        >
          {isPreviewing ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Editar
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </>
          )}
        </Button>

        <Button onClick={onSave} size="sm" style={{ backgroundColor: '#FAF9F7' }}>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </div>
  );
};
