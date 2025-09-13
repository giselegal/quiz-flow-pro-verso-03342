/**
 * 🎯 EDITOR FUNCIONAL PARA PRODUÇÃO URGENTE
 * 
 * Editor simplificado focado no quiz21StepsComplete.ts para deploy imediato:
 * - Carregamento direto do template sem abstrações
 * - Integração com Supabase para persistência
 * - Navegação entre as 21 etapas funcionais
 * - Painel de propriedades básico mas funcional
 */

import React, { useEffect, useMemo, useState } from 'react';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, QUIZ_QUESTIONS_COMPLETE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Settings, Eye, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditorFuncionalProps {
  className?: string;
}

export const EditorFuncional: React.FC<EditorFuncionalProps> = ({ className = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Carregar blocos da etapa atual
  const stepKey = `step-${currentStep}`;
  const currentStepBlocks = useMemo(() => {
    const templateBlocks = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[stepKey];
    if (Array.isArray(templateBlocks)) {
      return templateBlocks as Block[];
    }
    return [];
  }, [stepKey]);

  useEffect(() => {
    setBlocks(currentStepBlocks);
    setSelectedBlock(null);
    console.log(`🔧 EditorFuncional: Carregou ${currentStepBlocks.length} blocos para etapa ${currentStep}`);
  }, [currentStepBlocks, currentStep]);

  // Salvar no Supabase
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('funnels')
        .upsert({
          id: 'quiz21StepsComplete-production',
          name: `Quiz21Steps - Etapa ${currentStep}`,
          template_name: 'quiz21StepsComplete',
          funnel_data: { [stepKey]: blocks },
          updated_at: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      toast({
        title: "✅ Salvo com sucesso",
        description: `Etapa ${currentStep} salva no Supabase`
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "❌ Erro ao salvar",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Atualizar bloco
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const stepTitle = QUIZ_QUESTIONS_COMPLETE[currentStep] || `Etapa ${currentStep}`;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Editor Quiz21Steps</h1>
            <Badge variant="secondary">
              Etapa {currentStep} de 21
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Editar' : 'Preview'}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          
          {/* Navegação das etapas */}
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Etapas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 21 }, (_, i) => i + 1).map(step => (
                <Button
                  key={step}
                  variant={step === currentStep ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setCurrentStep(step)}
                >
                  {step}. {QUIZ_QUESTIONS_COMPLETE[step]?.substring(0, 20) || `Etapa ${step}`}...
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{stepTitle}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.min(21, currentStep + 1))}
                    disabled={currentStep === 21}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 min-h-[500px] bg-gray-50 rounded-lg p-6">
                {blocks.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum bloco encontrado para esta etapa</p>
                    <p className="text-sm mt-2">Template: {stepKey}</p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlock(block)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedBlock?.id === block.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <Badge variant="secondary">
                          {block.type}
                        </Badge>
                        <span className="font-medium text-gray-900">
                          {(block.content as any)?.text || (block.content as any)?.title || block.id}
                        </span>
                      </div>
                      
                      {(block.content as any)?.text && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {String((block.content as any).text).substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Painel de Propriedades */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-sm">Propriedades</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBlock ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Bloco Selecionado</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">{selectedBlock.type}</Badge>
                      <p className="text-xs text-gray-500 font-mono">{selectedBlock.id}</p>
                    </div>
                  </div>

                  {/* Propriedades básicas */}
                  <div className="space-y-3">
                    {(selectedBlock.content as any)?.text && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Texto</label>
                        <textarea
                          value={String((selectedBlock.content as any).text)}
                          onChange={(e) => updateBlock(selectedBlock.id, {
                            content: { ...selectedBlock.content, text: e.target.value }
                          })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={3}
                        />
                      </div>
                    )}
                    
                    {(selectedBlock.content as any)?.title && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Título</label>
                        <input
                          type="text"
                          value={String((selectedBlock.content as any).title)}
                          onChange={(e) => updateBlock(selectedBlock.id, {
                            content: { ...selectedBlock.content, title: e.target.value }
                          })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}

                    {(selectedBlock.content as any)?.color && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Cor</label>
                        <input
                          type="color"
                          value={String((selectedBlock.content as any).color)}
                          onChange={(e) => updateBlock(selectedBlock.id, {
                            content: { ...selectedBlock.content, color: e.target.value }
                          })}
                          className="w-full mt-1 h-10 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Ações</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const newBlocks = [...blocks];
                          const index = blocks.findIndex(b => b.id === selectedBlock.id);
                          if (index > 0) {
                            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
                            setBlocks(newBlocks);
                          }
                        }}
                      >
                        Mover para cima
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const newBlocks = [...blocks];
                          const index = blocks.findIndex(b => b.id === selectedBlock.id);
                          if (index < blocks.length - 1) {
                            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                            setBlocks(newBlocks);
                          }
                        }}
                      >
                        Mover para baixo
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selecione um bloco no canvas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorFuncional;