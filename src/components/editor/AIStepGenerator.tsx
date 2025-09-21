/**
 * 🤖 AI STEP GENERATOR - INTEGRATION WITH FUNNEL AI AGENT
 * 
 * Componente que conecta o useAI hook com o SimpleBuilder para
 * gerar etapas dinâmicas usando IA real.
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAI } from '@/hooks/useAI';
import { useSimpleBuilder } from './SimpleBuilderProviderFixed';
import { Sparkles, Loader2, Wand2, Lightbulb } from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';

interface AIStepGeneratorProps {
  onClose?: () => void;
  onStepsGenerated?: (steps: any[]) => void;
}

/**
 * Gerador de etapas com IA integrado ao SimpleBuilder
 */
export const AIStepGenerator: React.FC<AIStepGeneratorProps> = ({ onClose }) => {
  const { generateFunnel, isLoading, error, isConfigured } = useAI();
  const { actions } = useSimpleBuilder();
  const { addNotification } = useNotification();

  const [prompt, setPrompt] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  /**
   * Gera funil com IA e aplica no SimpleBuilder
   */
  const handleGenerateSteps = useCallback(async () => {
    if (!prompt.trim()) {
      addNotification('Por favor, descreva o tipo de quiz que deseja criar');
      return;
    }

    const fullPrompt = `
Crie um quiz interativo para: ${prompt}
Tipo de negócio: ${businessType}
Público-alvo: ${targetAudience}

Gere 5-8 etapas incluindo:
1. Página de introdução com campo de nome
2. 3-5 perguntas principais com opções visuais
3. Página de resultado personalizada

Cada pergunta deve ter 3-4 opções com categorias para cálculo.
`.trim();

    console.log('🤖 AIStepGenerator: Gerando funil com prompt:', fullPrompt);

    try {
      const generatedSteps = await generateFunnel(fullPrompt);
      
      if (generatedSteps) {
        console.log('✅ AIStepGenerator: Steps gerados pela IA:', generatedSteps);
        
        // Aplicar steps no SimpleBuilder
        actions.applyAISteps(generatedSteps);
        
        addNotification(`✨ Funil gerado com sucesso! ${generatedSteps.length} etapas criadas`);
        
        // Voltar para etapa 1
        actions.goToStep(1);
        
        onClose?.();
      } else {
        addNotification('❌ Erro ao gerar funil. Tente novamente.');
      }
    } catch (error) {
      console.error('❌ AIStepGenerator error:', error);
      addNotification('❌ Erro ao conectar com IA. Verifique sua configuração.');
    }
  }, [prompt, businessType, targetAudience, generateFunnel, actions, addNotification, onClose]);

  if (!isConfigured) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Configuração Necessária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Para usar o gerador de IA, configure a chave VITE_GITHUB_MODELS_TOKEN no arquivo .env
          </p>
          <Button variant="outline" onClick={onClose} className="w-full">
            Fechar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Gerador de Quiz com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt principal */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Descreva seu quiz *
          </label>
          <Textarea
            placeholder="Ex: Quiz de estilo pessoal para mulheres descobrirem seu tipo de roupa ideal..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Tipo de negócio */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Tipo de negócio
          </label>
          <Input
            placeholder="Ex: Consultoria de imagem, Coaching, E-commerce..."
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          />
        </div>

        {/* Público-alvo */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Público-alvo
          </label>
          <Input
            placeholder="Ex: Mulheres de 25-45 anos, executivas..."
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Dica */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
          <Lightbulb className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
          <p>
            Seja específico sobre seu público e objetivo. Quanto mais detalhes, melhor será o resultado da IA.
          </p>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleGenerateSteps}
            disabled={isLoading || !prompt.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Quiz
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStepGenerator;