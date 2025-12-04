/**
 * 🚀 PublishButton - Botão para publicar quiz
 * 
 * Integra com:
 * - Supabase RPC publish_quiz_draft()
 * - Validação completa do quiz
 * - Feedback visual de progresso
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
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PublishButtonProps {
  draftId?: string;
  onPublishSuccess?: (productionId: string) => void;
  className?: string;
}

export function PublishButton({ 
  draftId, 
  onPublishSuccess,
  className = '' 
}: PublishButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    productionId?: string;
    error?: string;
  } | null>(null);
  
  const { quiz, validateQuiz, isDirty } = useQuizStore();
  
  const handlePublish = async () => {
    if (!quiz) {
      toast.error('Nenhum quiz carregado');
      return;
    }
    
    // Validar antes de publicar
    const validation = validateQuiz();
    if (!validation.valid) {
      toast.error(`Erros de validação:\n${validation.errors.join('\n')}`);
      return;
    }
    
    setIsPublishing(true);
    setPublishResult(null);
    
    try {
      const effectiveDraftId = draftId || quiz.metadata?.id;
      
      if (!effectiveDraftId) {
        throw new Error('ID do draft não encontrado. Salve o quiz primeiro.');
      }
      
      // Chamar RPC do Supabase
      const { data, error } = await supabase.rpc('publish_quiz_draft', {
        draft_id: effectiveDraftId,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const productionId = data as string;
      
      setPublishResult({
        success: true,
        productionId,
      });
      
      toast.success('Quiz publicado com sucesso!');
      onPublishSuccess?.(productionId);
      
    } catch (error: any) {
      console.error('❌ Erro ao publicar:', error);
      
      setPublishResult({
        success: false,
        error: error.message || 'Erro desconhecido ao publicar',
      });
      
      toast.error(`Erro ao publicar: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };
  
  const validation = quiz ? validateQuiz() : { valid: false, errors: ['Nenhum quiz carregado'] };
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!quiz || isDirty}
        className={className}
        variant="default"
        size="sm"
      >
        <Rocket className="w-4 h-4 mr-2" />
        Publicar
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Publicar Quiz
            </DialogTitle>
            <DialogDescription>
              Isso criará uma versão de produção do seu quiz que será acessível aos usuários.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Info do Quiz */}
            {quiz && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nome:</span>
                  <span className="text-sm">{quiz.metadata?.name || 'Sem nome'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Versão:</span>
                  <Badge variant="secondary">{quiz.version || '1.0.0'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Steps:</span>
                  <span className="text-sm">{quiz.steps?.length || 0}</span>
                </div>
              </div>
            )}
            
            {/* Status de Validação */}
            <div className={`p-3 rounded-lg ${validation.valid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${validation.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.valid ? 'Validação OK' : 'Erros encontrados'}
                </span>
              </div>
              
              {!validation.valid && (
                <ul className="mt-2 text-xs text-red-600 space-y-1">
                  {validation.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Aviso de alterações não salvas */}
            {isDirty && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Você tem alterações não salvas. Salve antes de publicar.
                  </span>
                </div>
              </div>
            )}
            
            {/* Resultado da publicação */}
            {publishResult && (
              <div className={`p-3 rounded-lg ${publishResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                {publishResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Publicado com sucesso!
                      </span>
                    </div>
                    <p className="text-xs text-green-600">
                      ID de produção: {publishResult.productionId}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700">{publishResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!validation.valid || isDirty || isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Confirmar Publicação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
