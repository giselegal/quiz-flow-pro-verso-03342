/**
 * 🎯 FIX 1.2: BOTÃO "SALVAR COMO FUNIL"
 * 
 * Converte template → funnel persistente no Supabase
 * Resolve "phantom funnel" bug
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEditorContext } from '@/core';
// Usar ServiceRegistry para acessar o serviço canônico
import { ServiceRegistry } from '@/services/ServiceRegistry';
import { Save } from 'lucide-react';
import { templateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/appLogger';

export const SaveAsFunnelButton: React.FC = () => {
  const funnelService = ServiceRegistry.get('funnelService');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { editor } = useEditorContext();
  const { toast } = useToast();

  // Mostrar sempre que NÃO estiver em modo funnel (mais flexível que exigir ?template=)
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const isFunnelMode = Boolean(params.get('funnelId') || params.get('funnel'));

  if (isFunnelMode) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Digite um nome para o funil',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // 1) Criar funil via serviço canônico (schema-safe)
      const funnel = await funnelService.createFunnel({
        name: name.trim(),
      });

      // 2) Preparar TODOS os steps (estado do editor + fallback de template)
      const allBlocks: Record<string, any[]> = { ...(editor.state.stepBlocks || {}) };
      try {
        const STEP_IDS = templateService.getStepOrder();
        for (const stepId of STEP_IDS) {
          if (!allBlocks[stepId] || allBlocks[stepId].length === 0) {
            const res = await templateService.getStep(stepId);
            if (res?.success && Array.isArray(res.data)) {
              allBlocks[stepId] = res.data as any[];
            } else if (!allBlocks[stepId]) {
              allBlocks[stepId] = [];
            }
          }
        }
      } catch (e) {
        appLogger.warn('⚠️ Falha ao pré-carregar steps via TemplateService; seguindo com estado atual', { data: [e] });
      }

      // 3) Persistir blocos por etapa usando o caminho oficial (component_instances + bulk com fallback)
      const entries = Object.entries(allBlocks);
      for (const [stepKey, blocks] of entries) {
        await funnelService.saveStepBlocks(funnel.id, stepKey, blocks as any[]);
      }

      toast({
        title: '✅ Funil criado!',
        description: `"${name}" foi salvo com sucesso`,
      });

      // 3. Redirecionar para modo funnel
      setTimeout(() => {
        window.location.href = `/editor?funnelId=${funnel.id}`;
      }, 500);

    } catch (error: any) {
      appLogger.error('❌ Erro ao salvar como funil:', { data: [error] });
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-3 left-3 z-20 pointer-events-auto gap-2"
      >
        <Save className="h-4 w-4" />
        Salvar como Funil
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>💾 Salvar Template como Funil</DialogTitle>
            <DialogDescription>
              Isso criará um funil persistente no banco de dados.
              Você poderá editá-lo e salvá-lo automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="funnel-name">Nome do Funil</Label>
              <Input
                id="funnel-name"
                placeholder="Ex: Quiz Estilo Fashion 2025"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Funil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
