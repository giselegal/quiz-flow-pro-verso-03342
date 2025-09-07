import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { useEditor as useEditorLegacy } from '@/context/EditorContext';
import { useEditorOptional as useEditorModernOptional } from '@/components/editor/EditorProvider';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { makeStepKey } from '@/utils/stepKey';
import { motion } from 'framer-motion';
import { LayoutGrid, Monitor, Save, Settings, Smartphone, Tablet } from 'lucide-react';

interface EditorToolbarProps {
  className?: string;
}

/**
 * 🎨 TOOLBAR SUPERIOR UNIFICADA
 *
 * Centraliza todos os controles principais do editor integrados com EditorContext:
 * - Informações do projeto
 * - Controles de viewport (Desktop/Tablet/Mobile)
 * - Ações principais (Save, Preview, Undo/Redo)
 * - Configurações globais
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({ className = '' }) => {
  // Tenta usar o contexto moderno primeiro (não lança erro fora do provider)
  const modern = useEditorModernOptional();
  // Fallback para o contexto legado (possui fallback no-op seguro no projeto)
  const legacy = useEditorLegacy();

  // Viewport control: o moderno não gerencia viewport; manter local state
  const [localViewport, setLocalViewport] = useState<'sm' | 'md' | 'lg' | 'xl'>('xl');
  const viewportSize = (legacy?.uiState?.viewportSize as any) || localViewport;
  const setViewportSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    if (legacy?.uiState?.setViewportSize) {
      legacy.uiState.setViewportSize(size);
    }
    setLocalViewport(size);
  };

  // Save action: legado tem persistenceActions.save; no moderno, usar no-op
  const save = legacy?.persistenceActions?.save || (async () => { console.log('save (no-op)'); });

  // Total de blocos: legado expõe computed.totalBlocks; moderno calcula a partir do step atual
  const totalBlocks = useMemo(() => {
    if (legacy?.computed?.totalBlocks != null) return legacy.computed.totalBlocks;
    if (modern?.state) {
      const stepKey = makeStepKey(modern.state.currentStep || 1);
      const blocks = modern.state.stepBlocks?.[stepKey] || [];
      return Array.isArray(blocks) ? blocks.length : 0;
    }
    return 0;
  }, [legacy?.computed?.totalBlocks, modern?.state]);

  const funnelNavigation = useFunnelNavigation();

  const handleSave = async () => {
    try {
      await save();
      console.log('✅ Projeto salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar projeto:', error);
    }
  };

  const viewportOptions = [
    { id: 'sm', icon: Smartphone, label: 'Mobile', size: '375px' },
    { id: 'md', icon: Tablet, label: 'Tablet', size: '768px' },
    { id: 'lg', icon: Monitor, label: 'Desktop', size: '1024px' },
    { id: 'xl', icon: LayoutGrid, label: 'Desktop XL', size: '1920px' },
  ];
  return (
    <div
      className={cn(
        'border-b border-amber-700/30 p-3 flex items-center justify-between shadow-lg backdrop-blur-sm',
        className
      )}
      style={{ backgroundColor: '#d1b586' }}
    >
      {/* Logo e informações do projeto */}
      <div className="flex items-center space-x-4">
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
          <Logo className="h-8 w-auto transform-gpu" />
        </motion.div>

        {/* Informações do projeto */}
        <div className="flex items-center gap-2 text-sm text-white/90">
          <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
            4 Colunas
          </Badge>
          <span>•</span>
          <span>{totalBlocks} blocos</span>
          <span>•</span>
          <span>
            Etapa {funnelNavigation.currentStepNumber || 1} de {funnelNavigation.totalSteps || 21}
          </span>
        </div>
      </div>

      {/* Controles de viewport no centro */}
      <div className="flex items-center space-x-3">
        {viewportOptions.map(option => {
          const IconComponent = option.icon;
          return (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className={cn(
                'text-white hover:bg-white/20 transition-all',
                viewportSize === option.id && 'bg-white/30 shadow-md'
              )}
              onClick={() => setViewportSize(option.id as any)}
              title={`${option.label} (${option.size})`}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Botões de ação à direita */}
      <div className="flex items-center space-x-3">
        {/* Preview button removido */}
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPreviewing(!isPreviewing)}
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
        </Button> */}

        <Button onClick={handleSave} size="sm" style={{ backgroundColor: '#FAF9F7' }}>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
