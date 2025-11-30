import React, { useCallback, useMemo } from 'react';
import { Settings, X, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SinglePropertiesPanel from '@/components/editor/properties/SinglePropertiesPanel';
import { normalizeBlockData, createSynchronizedBlockUpdate } from '@/core/adapters/BlockDataNormalizer';
import type { Block } from '@/types/editor';
import type { UnifiedBlock } from '@/hooks/useUnifiedProperties';

interface PropertiesColumnProps {
    selectedBlock?: Block | undefined;
    onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
    onClearSelection: () => void;
    blocks?: Block[] | null;
    onBlockSelect?: (blockId: string) => void;
}

const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
    selectedBlock,
    onBlockUpdate,
    onClearSelection,
    blocks,
}) => {
    const normalizedBlock = useMemo<UnifiedBlock | null>(() => {
        if (!selectedBlock) {
            return null;
        }

        try {
            return normalizeBlockData(selectedBlock) as unknown as UnifiedBlock;
        } catch (error) {
            console.error('[PropertiesColumn] Falha ao normalizar bloco selecionado', error);
            return null;
        }
    }, [selectedBlock]);

    const handleUpdate = useCallback((updates: Record<string, any>) => {
        if (!selectedBlock) {
            return;
        }

        const synchronized = createSynchronizedBlockUpdate(selectedBlock, updates);
        onBlockUpdate(selectedBlock.id, synchronized);
    }, [selectedBlock, onBlockUpdate]);

    return (
        <div className="flex h-full flex-col border-l bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Settings className="h-4 w-4 text-primary" />
                    Propriedades
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onClearSelection}
                    aria-label="Limpar seleção"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-hidden">
                {normalizedBlock ? (
                    <SinglePropertiesPanel
                        selectedBlock={normalizedBlock}
                        onUpdate={handleUpdate}
                        onClose={onClearSelection}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-muted-foreground">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-muted-foreground/40">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                                Nenhum bloco selecionado
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Clique em um elemento do canvas para editar suas configurações.
                            </p>
                        </div>
                        {Array.isArray(blocks) && blocks.length === 0 && (
                            <Alert className="w-full max-w-xs" variant="secondary">
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    Arraste componentes da biblioteca para o canvas e comece a configurar o quiz.
                                </AlertDescription>
                            </Alert>
                        )}
                        {Array.isArray(blocks) && blocks.length > 0 && (
                            <Alert className="w-full max-w-xs" variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    Existem {blocks.length} blocos disponíveis, mas nenhum está selecionado.
                                    Clique em um bloco para visualizar suas propriedades.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(PropertiesColumn, (prevProps, nextProps) => {
    const prevSelected = prevProps.selectedBlock;
    const nextSelected = nextProps.selectedBlock;

    if (prevSelected?.id !== nextSelected?.id) {
        return false;
    }

    if (prevSelected && nextSelected) {
        const sameProperties = JSON.stringify(prevSelected.properties) === JSON.stringify(nextSelected.properties);
        const sameContent = JSON.stringify(prevSelected.content) === JSON.stringify(nextSelected.content);

        if (!sameProperties || !sameContent) {
            return false;
        }
    }

    return (
        prevProps.blocks?.length === nextProps.blocks?.length &&
        prevProps.onBlockUpdate === nextProps.onBlockUpdate &&
        prevProps.onClearSelection === nextProps.onClearSelection
    );
});
