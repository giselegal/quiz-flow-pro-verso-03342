/**
 * 🎯 EDITOR PRO REFATORADO
 * 
 * Editor principal dividido em componentes modulares com lazy loading
 */

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Block } from '@/types/editor';
import { useEditor } from '../EditorProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { createBlockFromComponent } from '@/utils/editorUtils';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CANVAS_ROOT_ID, SLOT_ID_PREFIX, BLOCK_ID_PREFIX } from '@/components/editor/dnd/constants';
import {
  Circle,
  FileText,
  Zap,
  Type as TypeIcon,
  Target,
  Palette,
  BarChart3,
  MessageSquare,
  Shield,
  Rocket,
  Sparkles,
  DollarSign,
  Info
} from 'lucide-react';

// Lazy loading dos componentes pesados
const EditorLayout = React.lazy(() => import('./EditorLayout'));
const EditorCanvas = React.lazy(() => import('./EditorCanvas'));
const EditorToolbar = React.lazy(() => import('./EditorToolbar'));

// Loading component otimizado
const LoadingFallback = () => (
  <div className="h-screen w-full bg-background flex items-center justify-center">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-muted h-3 w-3"></div>
      <div className="rounded-full bg-muted h-3 w-3"></div>
      <div className="rounded-full bg-muted h-3 w-3"></div>
    </div>
  </div>
);

interface EditorProProps {
  onSave?: (blocks: Block[]) => void;
}

const EditorPro: React.FC<EditorProProps> = ({ onSave }) => {
  const { state, actions } = useEditor();
  const currentStep = state.currentStep;
  const selectedBlockId = state.selectedBlockId;
  const currentStepKey = `step-${currentStep}`;
  const blocks = state.stepBlocks[currentStepKey] || [];

  const { debounce } = useOptimizedScheduler();
  const notification = useNotification();
  const isDev = ((import.meta as any)?.env?.DEV ?? false) as boolean;

  // Estado local para UI
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const canUndo = Boolean((actions as any)?.canUndo);
  const canRedo = Boolean((actions as any)?.canRedo);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handlers otimizados
  const handleBlockSelect = useCallback((id: string) => {
    if (isDev) console.log('[EditorPro] select block ->', id);
    actions.setSelectedBlockId(id);
  }, [actions, isDev]);

  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      if (isDev) console.log('[EditorPro] update block (debounced) ->', { blockId, updates });
      debounce(`update:${blockId}`, () => {
        actions.updateBlock(currentStepKey, blockId, updates as any);
      }, 300);
    },
    [actions, debounce, currentStepKey, isDev]
  );

  const handleComponentSelect = useCallback((componentType: string) => {
    const newBlock = createBlockFromComponent(componentType as any, blocks);
    if (newBlock) {
      // Adicionar bloco ao estado
      actions.addBlock(currentStepKey, newBlock);
      actions.setSelectedBlockId(newBlock.id);
      notification.success?.(`Componente ${componentType} adicionado`);
      if (isDev) console.log('[EditorPro] add component ->', { componentType, step: currentStep, newBlock });
    }
  }, [blocks, actions, currentStepKey, notification, currentStep, isDev]);

  // Inserção por duplo clique na sidebar (evento global)
  React.useEffect(() => {
    const onDoubleClickAdd = (ev: Event) => {
      try {
        const detail: any = (ev as any).detail || {};
        const type = detail.blockType as string;
        if (type) {
          if (isDev) console.log('[EditorPro] double-click add ->', { type, detail });
          handleComponentSelect(type);
        }
      } catch { }
    };
    window.addEventListener('editor-add-component', onDoubleClickAdd as EventListener);
    return () => window.removeEventListener('editor-add-component', onDoubleClickAdd as EventListener);
  }, [handleComponentSelect, isDev]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave?.(blocks);
      notification.success?.('Projeto salvo com sucesso!');
    } catch (error) {
      notification.error?.('Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  }, [blocks, onSave, notification]);

  const handleUndo = useCallback(() => {
    if (isDev) console.log('[EditorPro] undo');
    (actions as any)?.undo?.();
  }, [actions, isDev]);

  const handleRedo = useCallback(() => {
    if (isDev) console.log('[EditorPro] redo');
    (actions as any)?.redo?.();
  }, [actions, isDev]);

  // Dados reais simples para ComponentsSidebar e StepSidebar
  const availableComponents = React.useMemo(() => ([
    { type: 'quiz-intro-header', name: 'Header Quiz', icon: 'note', category: 'Estrutura', description: 'Cabeçalho com título e descrição' },
    { type: 'options-grid', name: 'Grade Opções', icon: 'flash', category: 'Interação', description: 'Grid de opções para questões' },
    { type: 'form-container', name: 'Formulário', icon: 'note', category: 'Captura', description: 'Campo de entrada de dados' },
    { type: 'text', name: 'Texto', icon: 'doc', category: 'Conteúdo', description: 'Bloco de texto simples' },
    { type: 'button', name: 'Botão', icon: 'button', category: 'Interação', description: 'Botão de ação' },
    { type: 'result-header-inline', name: 'Header Resultado', icon: 'target', category: 'Resultado', description: 'Cabeçalho personalizado de resultado' },
    { type: 'style-card-inline', name: 'Card Estilo', icon: 'palette', category: 'Resultado', description: 'Card com características do estilo' },
    { type: 'secondary-styles', name: 'Estilos Secundários', icon: 'chart', category: 'Resultado', description: 'Lista de estilos complementares' },
    { type: 'testimonials', name: 'Depoimentos', icon: 'chat', category: 'Social Proof', description: 'Lista de depoimentos' },
    { type: 'guarantee', name: 'Garantia', icon: 'shield', category: 'Confiança', description: 'Selo de garantia' },
    { type: 'hero', name: 'Hero Section', icon: 'rocket', category: 'Layout', description: 'Seção hero para transições e ofertas' },
    { type: 'benefits', name: 'Benefícios', icon: 'sparkle', category: 'Vendas', description: 'Lista de benefícios do produto' },
    { type: 'quiz-offer-cta-inline', name: 'CTA Oferta', icon: 'money', category: 'Conversão', description: 'Call-to-action para ofertas especiais' },
  ]), []);

  const groupedComponents = React.useMemo(() => {
    return availableComponents.reduce((acc: Record<string, any[]>, c) => {
      acc[c.category] = acc[c.category] || [];
      acc[c.category].push(c);
      return acc;
    }, {});
  }, [availableComponents]);

  const renderIcon = React.useCallback((_name: string, className = 'w-4 h-4') => {
    const name = String(_name || '').toLowerCase();
    const commonProps = { className } as { className?: string };
    switch (name) {
      case 'note':
      case 'doc':
      case 'text':
        return <FileText {...commonProps} />;
      case 'flash':
      case 'zap':
        return <Zap {...commonProps} />;
      case 'type':
        return <TypeIcon {...commonProps} />;
      case 'button':
      case 'pointer':
        return <Circle {...commonProps} />; // fallback discreto
      case 'target':
        return <Target {...commonProps} />;
      case 'palette':
        return <Palette {...commonProps} />;
      case 'chart':
      case 'stats':
        return <BarChart3 {...commonProps} />;
      case 'chat':
      case 'message':
        return <MessageSquare {...commonProps} />;
      case 'shield':
        return <Shield {...commonProps} />;
      case 'rocket':
        return <Rocket {...commonProps} />;
      case 'sparkle':
      case 'sparkles':
        return <Sparkles {...commonProps} />;
      case 'money':
      case 'dollar':
        return <DollarSign {...commonProps} />;
      case 'info':
        return <Info {...commonProps} />;
      default:
        return <Circle {...commonProps} />;
    }
  }, []);

  const getStepAnalysis = React.useCallback((step: number) => ({
    icon: 'info',
    label: `Etapa ${step}`,
    desc: blocks.length > 0 && state.currentStep === step ? `${blocks.length} blocos` : 'Configuração padrão',
  }), [blocks.length, state.currentStep]);

  // Atualiza a validação da etapa atual com base na existência de blocos
  useEffect(() => {
    if ((actions as any)?.setStepValid) {
      (actions as any).setStepValid(currentStep, blocks.length > 0);
      if (isDev) console.log('[EditorPro] stepValidation update', { step: currentStep, valid: blocks.length > 0, blocks: blocks.length });
    }
  }, [blocks.length, currentStep, actions, isDev]);

  useEffect(() => {
    if (isDev) console.log('[EditorPro] currentStep changed ->', currentStep);
  }, [currentStep, isDev]);

  const getIndexFromOver = useCallback((overId: string | null): number => {
    if (!overId) return blocks.length;
    const id = String(overId);
    // Canvas raiz pode estar escopado: `canvas-drop-zone-<scope>`
    if (id === CANVAS_ROOT_ID || id.startsWith(`${CANVAS_ROOT_ID}-`)) return blocks.length;
    if (id.startsWith(SLOT_ID_PREFIX)) {
      // Slots agora são `drop-zone-<scope>-<pos>`; pegue o último segmento como posição
      const parts = id.replace(SLOT_ID_PREFIX, '').split('-');
      const last = parts[parts.length - 1];
      const n = parseInt(last, 10);
      return Number.isFinite(n) ? Math.max(0, Math.min(n, blocks.length)) : blocks.length;
    }
    if (id.startsWith(BLOCK_ID_PREFIX)) {
      const cleaned = id.replace(BLOCK_ID_PREFIX, '');
      // Formato escopado: `${scope}-${blockId}` → remova o primeiro segmento (scope)
      const cleanedParts = cleaned.split('-');
      const maybeBlockId = cleanedParts.length > 1 ? cleanedParts.slice(1).join('-') : cleaned;
      const idx = blocks.findIndex(b => String(b.id) === maybeBlockId);
      return idx >= 0 ? idx : blocks.length;
    }
    return blocks.length;
  }, [blocks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeType = (active.data.current as any)?.type;

    // Reorder de blocos existentes
    if (activeType === 'canvas-block') {
      // Suporta formato escopado `${scope}-${blockId}`
      const raw = String(active.id).replace(BLOCK_ID_PREFIX, '');
      const parts = raw.split('-');
      const activeId = parts.length > 1 ? parts.slice(1).join('-') : raw;
      const oldIndex = blocks.findIndex(b => String(b.id) === activeId);
      const newIndex = getIndexFromOver(String(over.id));
      if (isDev) console.log('[EditorPro] reorder', { oldIndex, newIndex, activeId, over: String(over.id) });
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        (actions as any)?.reorderBlocks?.(currentStepKey, oldIndex, newIndex);
      }
      return;
    }

    // Inserção a partir da sidebar
    if (activeType === 'sidebar-component') {
      const compType = (active.data.current as any)?.blockType as string;
      const insertIndex = getIndexFromOver(String(over.id));
      if (isDev) console.log('[EditorPro] insert from sidebar', { compType, insertIndex });
      const newBlock = createBlockFromComponent(compType as any, blocks);
      if (newBlock) {
        (actions as any)?.addBlockAtIndex?.(currentStepKey, newBlock, insertIndex);
        (actions as any)?.setSelectedBlockId?.(newBlock.id);
        notification.success?.(`Componente ${compType} adicionado`);
      }
    }
  }, [actions, blocks, currentStepKey, getIndexFromOver, notification, isDev]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Suspense fallback={<LoadingFallback />}>
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            isSaving={isSaving}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Layout Principal */}
          <EditorLayout
            currentStep={currentStep}
            blocks={blocks}
            selectedBlock={blocks.find(b => b.id === selectedBlockId) || null}
            onStepChange={actions.setCurrentStep}
            onComponentSelect={handleComponentSelect}
            onBlockSelect={handleBlockSelect}
            groupedComponents={groupedComponents}
            renderIcon={renderIcon}
            getStepAnalysis={getStepAnalysis}
            stepValidation={(state as any)?.stepValidation as Record<number, boolean>}
            onUpdateSelectedBlock={(updates: Partial<Block>) => {
              const id = selectedBlockId;
              if (id) actions.updateBlock(currentStepKey, id, updates as any);
            }}
            onDeleteSelectedBlock={() => {
              const id = selectedBlockId;
              if (id) actions.removeBlock(currentStepKey, id);
            }}
          >
            {/* Canvas */}
            <EditorCanvas
              blocks={blocks}
              selectedBlock={blocks.find(b => b.id === selectedBlockId) || null}
              currentStep={currentStep}
              onSelectBlock={handleBlockSelect}
              onUpdateBlock={handleBlockUpdate}
              onDeleteBlock={(blockId) => actions.removeBlock(currentStepKey, blockId)}
              isPreviewMode={isPreviewMode}
            />
          </EditorLayout>
        </div>
      </Suspense>
    </DndContext>
  );
};
EditorPro.displayName = 'EditorPro';

export default EditorPro;