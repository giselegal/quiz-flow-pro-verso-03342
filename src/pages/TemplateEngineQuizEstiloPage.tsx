/**
 * Página de integração: TemplateEngine ↔ /quiz-estilo
 * Permite editar o funil de produção com o editor moderno
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTemplateEngine } from '@/features/templateEngine/hooks/useTemplateEngine';
import { QuizToTemplateAdapter } from '@/features/templateEngine/adapters/QuizToTemplateAdapter';
import { QUIZ_STEPS, STEP_ORDER } from '@/data/quizSteps';
import { useToast } from '@/hooks/use-toast';

const TEMPLATE_SLUG = 'quiz-estilo-production';

export default function TemplateEngineQuizEstiloPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { template, isLoading, saveTemplate, setTemplate } = 
    useTemplateEngine(TEMPLATE_SLUG);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar template a partir de QUIZ_STEPS se não existir
  useEffect(() => {
    if (!isLoading && !template && !isInitialized) {
      setIsInitialized(true);
      
      // Converter QUIZ_STEPS para TemplateDraft
      const draft = QuizToTemplateAdapter.convert(
        QUIZ_STEPS,
        STEP_ORDER,
        {
          name: 'Quiz Estilo - Produção',
          slug: TEMPLATE_SLUG,
          description: 'Funil de produção do quiz de estilo pessoal com 21 etapas',
        }
      );

      setTemplate(draft);
      
      toast({
        title: 'Template inicializado',
        description: 'Convertido a partir dos steps de produção.',
      });
    }
  }, [isLoading, template, isInitialized, setTemplate, toast]);

  const handleSave = async () => {
    if (!template) return;
    
    try {
      await saveTemplate(template);
      
      toast({
        title: 'Salvo com sucesso',
        description: 'Template persistido no Supabase.',
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Inicializando template...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/quiz-estilo')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Quiz
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-lg font-semibold">Editor Avançado - TemplateEngine</h1>
            <p className="text-xs text-muted-foreground">
              Quiz Estilo ({STEP_ORDER.length} etapas) • ID: {template.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={!template}>
          <Save className="w-4 h-4 mr-2" />
          Salvar no Supabase
        </Button>
      </div>

      {/* Alert de integração */}
      <Alert className="m-4">
        <AlertCircle className="h-4 h-4" />
        <AlertDescription>
          <strong>Integração ativa:</strong> Este editor está conectado ao funil de produção{' '}
          <code className="bg-muted px-1 rounded">/quiz-estilo</code>. 
          Alterações são salvas no Supabase. Utilize o botão "Salvar" acima para persistir mudanças.
        </AlertDescription>
      </Alert>

      {/* Instruções temporárias */}
      <div className="m-4 p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Nota de Desenvolvimento:</strong> Para usar o editor completo do TemplateEngine,
          será necessário integrar com a API backend. No momento, use o editor WYSIWYG via{' '}
          <code className="bg-background px-1 rounded">/editor/quiz-estilo</code> para edição funcional.
        </p>
      </div>
    </div>
  );
}
