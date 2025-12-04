/**
 * 📋 DuplicateFunnelButton - Duplicar funil existente
 * 
 * Integra com:
 * - Supabase RPC duplicate_quiz_template()
 * - Navegação para o novo funil
 */

import { useState } from 'react';
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
import { Copy, Loader2, CheckCircle } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateQuizId } from '@/lib/utils/generateId';

interface DuplicateFunnelButtonProps {
  templateSlug?: string;
  onDuplicateSuccess?: (newFunnelId: string) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function DuplicateFunnelButton({
  templateSlug,
  onDuplicateSuccess,
  className = '',
  variant = 'outline',
}: DuplicateFunnelButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [newName, setNewName] = useState('');
  const [duplicateResult, setDuplicateResult] = useState<{
    success: boolean;
    funnelId?: string;
    error?: string;
  } | null>(null);
  
  const { quiz } = useQuizStore();
  
  const handleDuplicate = async () => {
    if (!newName.trim()) {
      toast.error('Digite um nome para o novo funil');
      return;
    }
    
    setIsDuplicating(true);
    setDuplicateResult(null);
    
    try {
      const effectiveSlug = templateSlug || (quiz?.metadata as any)?.slug || quiz?.metadata?.id || 'quiz21StepsComplete';
      const newFunnelId = generateQuizId();
      
      // Chamar RPC do Supabase
      const { data, error } = await supabase.rpc('duplicate_quiz_template', {
        template_slug: effectiveSlug,
        new_funnel_id: newFunnelId,
        new_name: newName.trim(),
      });
      
      if (error) {
        // Se a RPC não existir, fazer duplicação local
        if (error.message.includes('function') || error.code === '42883') {
          console.warn('⚠️ RPC não disponível, duplicando localmente...');
          
          // Duplicação local via localStorage
          if (quiz) {
            const duplicatedQuiz = {
              ...JSON.parse(JSON.stringify(quiz)),
              metadata: {
                ...quiz.metadata,
                id: newFunnelId,
                name: newName.trim(),
                slug: `${effectiveSlug}-copy-${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };
            
            localStorage.setItem(
              `quiz-saved-${newFunnelId}`,
              JSON.stringify({ quiz: duplicatedQuiz, funnelId: newFunnelId })
            );
            
            setDuplicateResult({
              success: true,
              funnelId: newFunnelId,
            });
            
            toast.success('Funil duplicado com sucesso!');
            onDuplicateSuccess?.(newFunnelId);
            
            // Navegar para o novo funil
            setTimeout(() => {
              window.location.href = `/editor?funnel=${newFunnelId}`;
            }, 1500);
            
            return;
          }
        }
        
        throw new Error(error.message);
      }
      
      const resultId = (data as string) || newFunnelId;
      
      setDuplicateResult({
        success: true,
        funnelId: resultId,
      });
      
      toast.success('Funil duplicado com sucesso!');
      onDuplicateSuccess?.(resultId);
      
      // Navegar para o novo funil
      setTimeout(() => {
        window.location.href = `/editor?funnel=${resultId}`;
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Erro ao duplicar:', error);
      
      setDuplicateResult({
        success: false,
        error: error.message || 'Erro desconhecido ao duplicar',
      });
      
      toast.error(`Erro ao duplicar: ${error.message}`);
    } finally {
      setIsDuplicating(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Sugerir nome baseado no atual
      const baseName = quiz?.metadata?.name || 'Meu Quiz';
      setNewName(`${baseName} (Cópia)`);
      setDuplicateResult(null);
    }
  };
  
  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant={variant}
        size="sm"
        className={className}
      >
        <Copy className="w-4 h-4 mr-2" />
        Duplicar
      </Button>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Duplicar Funil
            </DialogTitle>
            <DialogDescription>
              Crie uma cópia completa deste funil com um novo nome.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newName">Nome do novo funil</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite o nome do novo funil..."
                disabled={isDuplicating}
              />
            </div>
            
            {/* Resultado da duplicação */}
            {duplicateResult && (
              <div className={`p-3 rounded-lg ${duplicateResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                {duplicateResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Funil duplicado com sucesso!
                      </span>
                    </div>
                    <p className="text-xs text-green-600">
                      Redirecionando para o novo funil...
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-red-700">
                    {duplicateResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDuplicating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDuplicate}
              disabled={!newName.trim() || isDuplicating}
            >
              {isDuplicating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Duplicando...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Criar Cópia
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
