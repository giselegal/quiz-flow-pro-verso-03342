/**
 * 💾 SAVE AS FUNNEL BUTTON - Fase 1.2
 * 
 * Permite salvar template local como funnel persistente no Supabase
 * 
 * Uso: Aparece apenas em modo template (?template=X)
 */

import React, { useState } from 'react';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { useUnifiedCRUD } from '@/contexts';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { Save, Loader2 } from 'lucide-react';

export const SaveAsFunnelButton: React.FC = () => {
    const editor = useEditor();
    const crud = useUnifiedCRUD();
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Só mostra em modo template (sem funnelId)
    const isTemplateMode = !editor.state.funnelId;
    const templateId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('template')
        : null;

    if (!isTemplateMode || !templateId) return null;

    const handleSave = async () => {
        if (!name.trim()) {
            toast({
                variant: 'destructive',
                title: 'Nome obrigatório',
                description: 'Por favor, informe um nome para o funil.',
            });
            return;
        }

        setIsSaving(true);

        try {
            // 1. Criar funnel no Supabase
            const funnel = await crud.createFunnel(name.trim(), {
                description: description.trim() || undefined,
                templateId,
                context: FunnelContext.EDITOR,
                category: 'quiz',
                autoPublish: false,
            });

            if (!funnel?.id) {
                throw new Error('Erro ao criar funil: ID não retornado');
            }

            // 2. Salvar todos os steps como component_instances
            const stepBlocks = editor.state.stepBlocks || {};
            const stepKeys = Object.keys(stepBlocks);

            if (stepKeys.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'Nenhuma etapa encontrada',
                    description: 'O template não possui etapas para salvar.',
                });
                return;
            }

            // Salvar em lote para melhor performance
            let savedCount = 0;
            for (const stepKey of stepKeys) {
                const blocks = stepBlocks[stepKey];
                if (blocks && blocks.length > 0) {
                    // Usar bulk save do funnelComponentsService
                    await crud.bulkSaveComponents?.(funnel.id, stepKey, blocks);
                    savedCount++;
                }
            }

            toast({
                title: 'Funil criado com sucesso! 🎉',
                description: `"${name}" foi salvo com ${savedCount} etapas.`,
            });

            // 3. Redirecionar para modo funnel
            window.location.href = `/editor?funnelId=${funnel.id}`;

        } catch (error) {
            console.error('❌ Erro ao salvar funil:', error);
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar funil',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    className="fixed top-3 left-3 z-50 shadow-lg"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar como Funil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Salvar Template como Funil</DialogTitle>
                    <DialogDescription>
                        Converta este template em um funil editável e persistente no banco de dados.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Nome do Funil <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ex: Quiz Estilo Pessoal 2025"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Descrição detalhada do funil..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSaving}
                            rows={3}
                        />
                    </div>
                    {templateId && (
                        <div className="text-sm text-muted-foreground">
                            <strong>Template base:</strong> {templateId}
                        </div>
                    )}
                    {editor.state.stepBlocks && (
                        <div className="text-sm text-muted-foreground">
                            <strong>Etapas:</strong> {Object.keys(editor.state.stepBlocks).length}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !name.trim()}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Salvar Funil
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
