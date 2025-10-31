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
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { supabase } from '@/integrations/supabase/customClient';
import { Save } from 'lucide-react';

export const SaveAsFunnelButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const editor = useEditor();
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
      // 1. Criar funnel no Supabase
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || 'anonymous';

      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .insert({
          name: name.trim(),
          user_id: userId,
          type: 'quiz',
          status: 'draft',
          category: 'quiz',
          context: 'editor',
          is_active: true,
        })
        .select()
        .single();

      if (funnelError || !funnel) {
        throw new Error(funnelError?.message || 'Erro ao criar funnel');
      }

      // 2. Salvar todos os steps como component_instances (schema alinhado)
      const allBlocks = editor.state.stepBlocks || {};
      const componentInstances: any[] = [];

      for (const [stepKey, blocks] of Object.entries(allBlocks)) {
        const stepNumber = parseInt(stepKey.replace(/\D/g, ''), 10);

        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          componentInstances.push({
            funnel_id: funnel.id,
            step_number: stepNumber,
            order_index: i + 1,
            instance_key: `${stepKey}-${String(block.id || i)}`,
            component_type_key: String(block.type),
            properties: {
              ...(block.properties || {}),
              // Preserva content como parte das propriedades quando existir
              ...(block.content ? { __content: block.content } : {}),
            },
            is_active: true,
            created_by: userId,
          });
        }
      }

      if (componentInstances.length > 0) {
        const { error: instancesError } = await supabase
          .from('component_instances')
          .insert(componentInstances);

        if (instancesError) {
          console.warn('⚠️ Erro ao salvar component_instances:', instancesError);
        }
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
      console.error('❌ Erro ao salvar como funil:', error);
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
        className="fixed top-3 left-3 z-[10000] pointer-events-auto gap-2"
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
