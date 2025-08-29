import { useEditor } from '@/components/editor/EditorProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

interface EditableEditorHeaderProps {
  className?: string;
  showStepInfo?: boolean;
  showModeSwitch?: boolean;
  showActions?: boolean;
  showUndoRedo?: boolean;
  customTitle?: string;
  onSave?: () => void;
}

// Função helper para análise de etapas
const getStepAnalysis = (step: number) => {
  const stepData = {
    1: { label: 'Intro', desc: 'Apresentação inicial do quiz' },
    2: { label: 'Pergunta 1', desc: 'Primeira pergunta do quiz' },
    3: { label: 'Pergunta 2', desc: 'Segunda pergunta do quiz' },
    // ... adicione mais conforme necessário
  };
  return (
    stepData[step as keyof typeof stepData] || {
      label: `Etapa ${step}`,
      desc: 'Configuração da etapa',
    }
  );
};

// Função helper para copiar para clipboard
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Função helper para validar JSON
const validateEditorJSON = (json: string) => {
  try {
    JSON.parse(json);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

interface EditableEditorHeaderProps {
  className?: string;
  showStepInfo?: boolean;
  showModeSwitch?: boolean;
  showActions?: boolean;
  showUndoRedo?: boolean;
  customTitle?: string;
  onSave?: () => void;
}

/**
 * 🎯 CABEÇALHO EDITÁVEL DO EDITOR
 *
 * Componente reutilizável que combina os melhores recursos dos editores:
 * - Informações da etapa atual
 * - Controles de Undo/Redo
 * - Export/Import JSON
 * - Toggle Edit/Preview
 * - Indicadores de modo
 * - Botão de salvar
 */
export const EditableEditorHeader: React.FC<EditableEditorHeaderProps> = ({
  className = '',
  showStepInfo = true,
  showModeSwitch = true,
  showActions = true,
  showUndoRedo = true,
  customTitle,
  onSave,
}) => {
  const { state, actions } = useEditor();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [virtDisabled, setVirtDisabled] = useState<boolean>(false);

  const safeCurrentStep = state.currentStep || 1;
  const stepAnalysis = getStepAnalysis(safeCurrentStep);

  const handleExportJSON = async () => {
    try {
      const json = actions.exportJSON();
      const success = await copyToClipboard(json);
      if (success) {
        toast({ title: 'Sucesso', description: 'JSON exportado para a área de transferência!' });
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao copiar para área de transferência',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Erro', description: 'Erro ao exportar JSON', variant: 'destructive' });
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const json = e.target?.result as string;
          const validation = validateEditorJSON(json);
          if (!validation.valid) {
            toast({
              title: 'Erro',
              description: `Erro de validação: ${validation.error}`,
              variant: 'destructive',
            });
            return;
          }
          actions.importJSON(json);
          toast({ title: 'Sucesso', description: 'JSON importado com sucesso!' });
        } catch (error) {
          toast({
            title: 'Erro',
            description: 'Erro ao importar JSON: ' + (error as Error).message,
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    }
    event.currentTarget.value = '';
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      toast({ title: 'Sucesso', description: 'Projeto salvo!' });
    }
  };

  // Sync toggle with global flag (diagnostic virtualização Canvas)
  useEffect(() => {
    const current = (globalThis as any).__NO_CANVAS_VIRT__;
    setVirtDisabled(Boolean(current));
  }, []);

  const toggleVirtualization = () => {
    const next = !virtDisabled;
    (globalThis as any).__NO_CANVAS_VIRT__ = next;
    setVirtDisabled(next);
    toast({
      title: next ? 'Virtualização desativada' : 'Virtualização ativada',
      description: next
        ? 'Renderização completa forçada (útil para depuração)'
        : 'Renderização otimizada reativada',
    });
  };

  return (
    <div className={cn('bg-white border-b border-gray-200 p-4', className)}>
      {/* Linha principal do cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          {/* Título e informações da etapa */}
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {customTitle || (
              <>
                {mode === 'edit' ? '✏️ Editor' : '👁️ Preview'} - Etapa {safeCurrentStep}
              </>
            )}
          </h3>

          {showStepInfo && (
            <p className="text-sm text-gray-600">
              {stepAnalysis.label}: {stepAnalysis.desc}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Controles Undo/Redo */}
          {showUndoRedo && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={actions.undo}
                disabled={!actions.canUndo}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-all duration-200',
                  actions.canUndo
                    ? 'text-gray-700 hover:bg-white hover:shadow-sm'
                    : 'text-gray-400 cursor-not-allowed'
                )}
                title="Desfazer (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                type="button"
                onClick={actions.redo}
                disabled={!actions.canRedo}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-all duration-200',
                  actions.canRedo
                    ? 'text-gray-700 hover:bg-white hover:shadow-sm'
                    : 'text-gray-400 cursor-not-allowed'
                )}
                title="Refazer (Ctrl+Y)"
              >
                ↷ Redo
              </button>
            </div>
          )}

          {/* Export/Import Actions */}
          {showActions && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Exportar como JSON"
              >
                📤 Export
              </button>

              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                style={{ display: 'none' }}
                ref={fileInputRef}
                id="import-json"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Importar JSON"
              >
                📥 Import
              </button>

              {/* Toggle Virtualização Canvas (compacto) */}
              <button
                type="button"
                onClick={toggleVirtualization}
                className={cn(
                  'px-2 py-2 text-xs rounded-md transition-colors',
                  virtDisabled
                    ? 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
                title={
                  virtDisabled
                    ? 'Virtualização do Canvas: OFF (clicar para ativar)'
                    : 'Virtualização do Canvas: ON (clicar para desativar)'
                }
              >
                ⚙️ Virt {virtDisabled ? 'OFF' : 'ON'}
              </button>
            </div>
          )}

          {/* Mode Switch */}
          {showModeSwitch && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={cn(
                  'px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                  mode === 'edit'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                ✏️ Editar
              </button>
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={cn(
                  'px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium',
                  mode === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                👁️ Preview
              </button>
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            💾 Salvar
          </Button>
        </div>
      </div>

      {/* Linha de informações do modo */}
      <div className="mt-3 p-3 rounded-lg border">
        {mode === 'edit' ? (
          <div
            className={cn(
              'flex items-center justify-between text-sm',
              'bg-blue-50 border-blue-200 text-blue-900'
            )}
          >
            <div>
              <strong>✏️ Modo Edição Visual:</strong> Conteúdo real com overlays de seleção
              interativos
            </div>
            <div className="text-blue-700">
              {state.selectedBlockId
                ? `Editando: ${state.selectedBlockId}`
                : `${state.stepBlocks[`step-${safeCurrentStep}`]?.length || 0} blocos disponíveis - Clique para editar`}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'flex items-center justify-between text-sm',
              'bg-green-50 border-green-200 text-green-900'
            )}
          >
            <div>
              <strong>👁️ Modo Preview:</strong> Visualização idêntica à produção final
            </div>
            <div className="text-green-700">Navegação e interações funcionais</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableEditorHeader;
