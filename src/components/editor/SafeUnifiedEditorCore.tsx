/**
 * 🛡️ SAFE UNIFIED EDITOR CORE - Versão Segura do Editor Core
 * 
 * Versão que não depende de hooks de contexto e funciona de forma independente
 * para evitar o React Error #300.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Layout, 
  Brain, 
  Settings, 
  Target,
  Component, 
  Crown, 
  Eye, 
  CheckCircle, 
  Activity,
  Loader2
} from 'lucide-react';

interface SafeUnifiedEditorCoreProps {
  funnelId?: string;
  templateId?: string;
  mode?: 'visual' | 'headless' | 'production' | 'funnel';
  className?: string;
}

export default function SafeUnifiedEditorCore({
  funnelId,
  templateId,
  mode = 'visual',
  className = 'h-full w-full'
}: SafeUnifiedEditorCoreProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(21);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'funnel' | 'steps' | 'templates' | 'preview'>('funnel');
  const [error, setError] = useState<string | null>(null);

  // Simular carregamento inicial
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Detectar tipo de funil
  const funnelType = useMemo(() => {
    if (templateId === 'quiz-estilo-21-steps' || funnelId?.includes('quiz-estilo')) {
      return {
        id: 'quiz-estilo',
        name: 'Quiz de Estilo Pessoal',
        description: 'Quiz completo de 21 etapas para descobrir o estilo pessoal',
        icon: Target,
        color: 'blue',
        features: ['21 etapas', 'Sistema de pontuação', 'Ofertas personalizadas', 'Preview em tempo real']
      };
    }
    return {
      id: 'generic',
      name: 'Editor Genérico',
      description: 'Editor para funis personalizados',
      icon: Layout,
      color: 'gray',
      features: ['Edição livre', 'Componentes personalizáveis', 'Preview em tempo real']
    };
  }, [templateId, funnelId]);

  const handleSave = () => {
    setIsDirty(false);
    console.log('💾 Salvando funil...');
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Erro no Editor</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setError(null)} className="w-full">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`safe-unified-editor-core ${className} bg-background`}>
      <div className="h-screen flex flex-col">
        {/* Header do Editor */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {funnelType.name}
              </h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <funnelType.icon className="w-3 h-3" />
                {funnelType.id}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={!isDirty}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar com navegação */}
          <div className="w-80 border-r border-gray-200 bg-gray-50">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="funnel" className="text-xs">Funil</TabsTrigger>
                <TabsTrigger value="steps" className="text-xs">Etapas</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
                <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
              </TabsList>

              <div className="flex-1 p-4">
                <TabsContent value="funnel" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Editor de Funil</CardTitle>
                      <CardDescription>
                        Configure as etapas do seu funil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Total de Etapas</label>
                          <input
                            type="number"
                            value={totalSteps}
                            onChange={(e) => setTotalSteps(parseInt(e.target.value) || 1)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            min="1"
                            max="50"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Etapa Atual</label>
                          <input
                            type="number"
                            value={currentStep}
                            onChange={(e) => handleStepChange(parseInt(e.target.value) || 1)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            min="1"
                            max={totalSteps}
                          />
                        </div>

                        <Button 
                          onClick={() => setIsDirty(true)}
                          className="w-full"
                        >
                          Marcar como Modificado
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="steps" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Editor de Etapas</CardTitle>
                      <CardDescription>
                        Edite as etapas individuais
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                          <div
                            key={step}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              currentStep === step 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => handleStepChange(step)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Etapa {step}</span>
                              {currentStep === step && (
                                <Badge variant="default" className="text-xs">
                                  Ativa
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="templates" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Templates</CardTitle>
                      <CardDescription>
                        Gerencie templates de funil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-gray-500">
                        <Crown className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Gerenciador de templates será implementado aqui</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Preview</CardTitle>
                      <CardDescription>
                        Visualize seu funil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-gray-500">
                        <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Preview será implementado aqui</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Área principal de edição */}
          <div className="flex-1 bg-white">
            <div className="h-full p-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Layout className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Editor Visual - {funnelType.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {funnelType.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <Component className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Editar Funil</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Settings className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Configurar Etapas</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Crown className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">Gerenciar Templates</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm font-medium">Preview</p>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Etapa atual: {currentStep} de {totalSteps}</p>
                  <p>Status: {isDirty ? 'Modificado' : 'Salvo'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
