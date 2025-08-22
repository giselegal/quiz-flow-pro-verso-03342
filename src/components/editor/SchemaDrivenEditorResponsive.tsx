import { useEditor } from '@/context/EditorContext';
import { BlockType } from '@/types/editor';
import { QuizMainDemo } from './QuizMainDemo';
import { CanvasDropZone } from './canvas/CanvasDropZone.simple';
import ComponentsSidebar from './components/ComponentsSidebar';
import FunnelStagesPanel from './funnel/FunnelStagesPanelUnified';
import './interactive/styles/quiz-animations.css';
import { FourColumnLayout } from './layout/FourColumnLayout';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { EditorToolbar } from './toolbar/EditorToolbar';

import React, { useState } from 'react';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
  mode?: 'editor' | 'preview' | 'interactive';
  userName?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId: _funnelId,
  className = '',
  mode = 'editor',
  userName,
}) => {
  const {
    computed: { currentBlocks, selectedBlock },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock, updateBlock, deleteBlock },
  } = useEditor();

  const [isInteractiveMode, setIsInteractiveMode] = useState(mode === 'interactive');

  const handleComponentSelect = async (type: string) => {
    try {
      const blockId = await addBlock(type as BlockType);
      if (blockId) {
        setSelectedBlockId(blockId);
        console.log(`➕ Bloco ${type} adicionado via editor responsivo`);
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleUpdateSelectedBlock = async (blockId: string, updates: any) => {
    if (blockId) {
      try {
        await updateBlock(blockId, updates);
        console.log('✅ Bloco atualizado via editor responsivo:', blockId);
      } catch (error) {
        console.error('❌ Erro ao atualizar bloco:', error);
      }
    }
  };

  const handleModeToggle = () => {
    setIsInteractiveMode(!isInteractiveMode);
  };

  // Modo Interativo - Renderiza o Quiz Canvas
  if (isInteractiveMode || mode === 'interactive') {
    return (
      <div className={`h-full w-full bg-background ${className}`}>
        {/* Toolbar com botão para voltar ao editor */}
        <div className="h-14 border-b bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              🎯 Quiz Interativo
            </h1>
            {userName && (
              <span className="text-sm text-gray-600">
                Olá, {userName}!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleModeToggle}
              className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              ✏️ Voltar ao Editor
            </button>
          </div>
        </div>

        {/* Canvas Interativo */}
        <div className="h-[calc(100%-56px)]">
          <QuizMainDemo />
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full bg-background ${className}`}>
      {/* 🎨 TOOLBAR SUPERIOR */}
      <div className="h-14 border-b bg-white flex items-center justify-between px-4">
        <EditorToolbar />
        
        {/* Botão para Modo Interativo */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleModeToggle}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              isInteractiveMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-green-100 hover:bg-green-200 text-green-700'
            }`}
          >
            {isInteractiveMode ? '✏️ Editor' : '🎮 Quiz Interativo'}
          </button>
        </div>
      </div>

      {/* 📐 LAYOUT DE 4 COLUNAS */}
      <div className="h-[calc(100%-56px)]">
        <FourColumnLayout
          stagesPanel={<FunnelStagesPanel />}
          componentsPanel={<ComponentsSidebar onComponentSelect={handleComponentSelect} />}
          canvas={
            <CanvasDropZone
              blocks={currentBlocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
            />
          }
          propertiesPanel={
            <PropertiesPanel
              selectedBlock={selectedBlock || null}
              onUpdate={handleUpdateSelectedBlock}
              onClose={() => setSelectedBlockId(null)}
              onDelete={blockId => deleteBlock(blockId)}
              isPreviewMode={false}
            />
          }
        />
      </div>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
