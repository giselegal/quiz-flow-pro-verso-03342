/**
 * 🎯 EDITOR STANDALONE - CLEAN ARCHITECTURE
 * 
 * Versão standalone do editor que funciona sem conflitos
 * Implementação direta sem providers problemáticos
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// 🎯 TIPOS BÁSICOS
interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
}

interface EditorStandaloneProps {
  className?: string;
  stepNumber?: number;
  funnelId?: string;
  debugMode?: boolean;
}

/**
 * 🎨 COMPONENTE DE BLOCO SIMPLES
 */
const SimpleBlockRenderer: React.FC<{
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onDelete }) => {
  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="p-3 border rounded">
            <p>{block.properties.text || 'Digite seu texto aqui...'}</p>
          </div>
        );
      case 'button':
        return (
          <div className="p-3 border rounded">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
              {block.properties.text || 'Botão'}
            </button>
          </div>
        );
      case 'image':
        return (
          <div className="p-3 border rounded">
            <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
              <span className="text-muted-foreground">🖼️ Imagem</span>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="p-3 border rounded">
            <h3 className="font-medium mb-2">Formulário</h3>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Nome"
                className="w-full px-3 py-2 border rounded"
              />
              <input 
                type="email" 
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
              />
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded">
                Enviar
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-3 border-2 border-dashed border-muted rounded">
            <p className="text-muted-foreground">Tipo: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={onSelect}
    >
      {/* Controles */}
      {isSelected && (
        <div className="absolute -top-8 right-0 flex items-center gap-1">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
            {block.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

/**
 * 🎯 EDITOR STANDALONE PRINCIPAL
 */
export const EditorStandalone: React.FC<EditorStandaloneProps> = ({
  className,
  stepNumber = 1,
  funnelId = 'quiz-style-21-steps',
  debugMode = false
}) => {
  // 🎯 ESTADO LOCAL SIMPLES
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLoading] = useState(false);

  console.log('🎯 EditorStandalone: Carregado com sucesso!', { stepNumber, funnelId });

  // 🎯 HANDLERS
  const addBlock = useCallback((type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      properties: {}
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    
    if (debugMode) {
      console.log('✅ Bloco adicionado:', newBlock);
    }
  }, [debugMode]);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    
    if (debugMode) {
      console.log('🗑️ Bloco removido:', blockId);
    }
  }, [selectedBlockId, debugMode]);

  const selectBlock = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleStepChange = useCallback((newStep: number) => {
    if (debugMode) {
      console.log('📍 Step mudou para:', newStep);
    }
  }, [debugMode]);

  // 🎯 DADOS COMPUTADOS
  const selectedBlock = useMemo(() => {
    return blocks.find(b => b.id === selectedBlockId) || null;
  }, [blocks, selectedBlockId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn('h-full w-full flex flex-col bg-background', className)}>
      {/* 🎯 HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Editor Standalone</h1>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            ✅ Funcionando
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Step {stepNumber}/21</span>
          <span>•</span>
          <span>{blocks.length} blocos</span>
          {selectedBlock && (
            <>
              <span>•</span>
              <span className="text-primary">Selecionado: {selectedBlock.type}</span>
            </>
          )}
        </div>
      </div>

      {/* 🎯 CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex">
        {/* 📝 SIDEBAR DE COMPONENTES */}
        <div className="w-64 border-r bg-muted/20 p-4">
          <h3 className="font-medium mb-4">Componentes</h3>
          <div className="space-y-2">
            {[
              { type: 'text', label: '📝 Texto', desc: 'Parágrafo de texto' },
              { type: 'button', label: '🔘 Botão', desc: 'Botão clicável' },
              { type: 'image', label: '🖼️ Imagem', desc: 'Imagem ou foto' },
              { type: 'form', label: '📋 Formulário', desc: 'Campos de entrada' }
            ].map((component) => (
              <button
                key={component.type}
                onClick={() => addBlock(component.type)}
                className="w-full p-3 text-left hover:bg-muted rounded-lg transition-colors border"
              >
                <div className="font-medium text-sm">{component.label}</div>
                <div className="text-xs text-muted-foreground">{component.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 🎨 CANVAS PRINCIPAL */}
        <div className="flex-1 p-4">
          <div className="h-full border border-dashed border-muted-foreground/20 rounded-lg p-4 overflow-auto">
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <div className="text-lg font-medium mb-2">Canvas vazio</div>
                  <div className="text-sm">Adicione componentes da sidebar à esquerda</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block) => (
                  <SimpleBlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => selectBlock(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ⚙️ PROPERTIES PANEL */}
        <div className="w-64 border-l bg-muted/20 p-4">
          <h3 className="font-medium mb-4">Propriedades</h3>
          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <div className="text-sm text-muted-foreground">{selectedBlock.type}</div>
              </div>
              <div>
                <label className="text-sm font-medium">ID</label>
                <div className="text-xs text-muted-foreground font-mono">
                  {selectedBlock.id}
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  ✅ Standalone Mode
                </div>
                <div className="text-xs text-blue-700">
                  Editor funcionando sem conflitos
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Selecione um bloco para ver suas propriedades
            </div>
          )}
        </div>
      </div>

      {/* 🎯 FOOTER COM CONTROLES DE STEP */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleStepChange(Math.max(1, stepNumber - 1))}
            disabled={stepNumber <= 1}
            className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded-lg"
          >
            ← Anterior
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: 21 }, (_, i) => i + 1).map((step) => (
              <button
                key={step}
                onClick={() => handleStepChange(step)}
                className={cn(
                  'w-8 h-8 rounded-full text-sm',
                  step === stepNumber
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {step}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handleStepChange(Math.min(21, stepNumber + 1))}
            disabled={stepNumber >= 21}
            className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded-lg"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* 🐛 DEBUG INFO */}
      {debugMode && (
        <div className="fixed bottom-4 right-4 p-3 bg-black/80 text-white text-xs rounded-lg max-w-sm">
          <div>✅ Editor Standalone</div>
          <div>Step: {stepNumber}/21</div>
          <div>Blocks: {blocks.length}</div>
          <div>Funnel: {funnelId}</div>
          <div>Selected: {selectedBlock?.type || 'none'}</div>
        </div>
      )}
    </div>
  );
};

export default EditorStandalone;