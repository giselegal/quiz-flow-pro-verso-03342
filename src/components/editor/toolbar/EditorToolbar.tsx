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
import { LayoutGrid, Monitor, Save, Smartphone, Tablet } from 'lucide-react';

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
        'border-b border-gray-700/50 p-4 flex items-center justify-between shadow-2xl backdrop-blur-sm',
        'bg-gradient-to-r from-black via-gray-900 to-black',
        className
      )}
    >
      {/* Logo e informações do projeto */}
      <div className="flex items-center space-x-6">
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
          <Logo className="h-10 w-auto transform-gpu filter drop-shadow-lg" />
        </motion.div>

        {/* Informações do projeto */}
        <div className="flex items-center gap-3 text-sm">
          <Badge
            variant="outline"
            className="text-xs bg-gradient-to-r from-brand-brightBlue/20 to-brand-brightPink/20 text-brand-brightBlue border-brand-brightBlue/30 backdrop-blur-sm"
          >
            Editor Pro
          </Badge>
          <div className="h-4 w-px bg-gray-600"></div>
          <span className="text-gray-300 font-medium">{totalBlocks} blocos</span>
          <div className="h-4 w-px bg-gray-600"></div>
          <span className="text-gray-300">
            Etapa <span className="text-brand-brightPink font-semibold">{funnelNavigation.currentStepNumber || 1}</span> de <span className="text-brand-brightBlue">{funnelNavigation.totalSteps || 21}</span>
          </span>
        </div>
      </div>

      {/* Controles de viewport no centro */}
      <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700/50 backdrop-blur-sm">
        {viewportOptions.map(option => {
          const IconComponent = option.icon;
          const isActive = viewportSize === option.id;
          return (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 w-9 p-0 transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
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
        <Button
          onClick={handleSave}
          size="sm"
          className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white shadow-lg font-medium px-6"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>

        {/* Botão de configurações removido - configurações agora em "Meus Funis" */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </Button> */}
      </div>
    </div>
  );
};
