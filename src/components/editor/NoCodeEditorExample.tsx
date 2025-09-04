/**
 * 🎯 INTEGRATION EXAMPLE - NOCODE PROPERTIES PANEL
 * 
 * Exemplo de como integrar o novo painel de propriedades NOCODE
 * no editor principal do quiz com todas as 21 etapas.
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Eye, 
  Play, 
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import NoCodePropertiesPanel from './properties/NoCodePropertiesPanel';
import ComprehensiveStepNavigation from './properties/ComprehensiveStepNavigation';
import type { Block } from '@/types/editor';

interface NoCodeEditorExampleProps {
  className?: string;
}

/**
 * Exemplo de integração completa do sistema NOCODE
 */
export const NoCodeEditorExample: React.FC<NoCodeEditorExampleProps> = ({
  className
}) => {
  // Estados do editor
  const [activeMode, setActiveMode] = useState<'edit' | 'preview' | 'comprehensive'>('edit');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);

  // Mock data - em produção viria do estado global do editor
  const mockBlock: Block = {
    id: 'step1-title',
    type: 'text',
    order: 1,
    content: {
      text: 'Olá, {userName}! Descubra seu estilo predominante.'
    },
    properties: {
      fontSize: 'text-3xl',
      fontWeight: 'font-bold', 
      textAlign: 'center',
      color: '#432818',
      backgroundColor: '#F8F9FA',
      marginTop: 12,
      marginBottom: 10,
      padding: 24,
      borderRadius: 8
    }
  };

  // Handlers
  const handleBlockUpdate = useCallback((updates: Record<string, any>) => {
    console.log('🔄 Atualizando bloco:', selectedBlock?.id, updates);
    // Aqui você integraria com seu sistema de estado global
    // Ex: dispatch(updateBlock(selectedBlock.id, updates));
  }, [selectedBlock]);

  const handleBlockDuplicate = useCallback(() => {
    console.log('📋 Duplicando bloco:', selectedBlock?.id);
    // Implementar lógica de duplicação
  }, [selectedBlock]);

  const handleBlockDelete = useCallback(() => {
    console.log('🗑️ Deletando bloco:', selectedBlock?.id);
    setSelectedBlock(null);
    // Implementar lógica de exclusão
  }, [selectedBlock]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    setSelectedBlock(null);
    console.log('📍 Mudando para etapa:', step);
  }, []);

  const handleComprehensiveBlockUpdate = useCallback((stepKey: string, blockId: string, updates: Record<string, any>) => {
    console.log('🔄 Atualizando bloco comprehensive:', { stepKey, blockId, updates });
    // Implementar atualização para navegação comprehensive
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Editor NOCODE - Quiz 21 Etapas</h1>
            <Badge variant="outline">
              Etapa {currentStep} de 21
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Toggle */}
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
              <TabsList>
                <TabsTrigger value="edit" className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Editar
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="comprehensive" className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  Completo
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Device Preview */}
            {(activeMode === 'preview') && (
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeMode === 'comprehensive' ? (
          // Modo navegação completa das 21 etapas
          <ComprehensiveStepNavigation
            onBlockUpdate={handleComprehensiveBlockUpdate}
            onBlockDuplicate={(stepKey, blockId) => console.log('Duplicate:', stepKey, blockId)}
            onBlockDelete={(stepKey, blockId) => console.log('Delete:', stepKey, blockId)}
            onStepValidate={(stepKey) => {
              console.log('Validate:', stepKey);
              return true;
            }}
            className="w-full"
          />
        ) : (
          <>
            {/* Canvas Principal */}
            <div className="flex-1 flex flex-col">
              {activeMode === 'edit' && (
                <div className="p-4 bg-white border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Clique em um bloco para editá-lo:</span>
                    <Button
                      variant={selectedBlock ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedBlock(selectedBlock ? null : mockBlock)}
                    >
                      {selectedBlock ? 'Desselecionar' : 'Selecionar'} Bloco Mock
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-auto p-6">
                {activeMode === 'edit' ? (
                  // Mode de edição
                  <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                      <CardTitle>Canvas da Etapa {currentStep}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Bloco Mock */}
                        <div
                          className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            selectedBlock ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedBlock(selectedBlock ? null : mockBlock)}
                        >
                          <div className="text-center">
                            <div
                              className="text-3xl font-bold text-gray-800 mb-2"
                              style={{
                                fontSize: mockBlock.properties?.fontSize,
                                fontWeight: mockBlock.properties?.fontWeight,
                                textAlign: mockBlock.properties?.textAlign as any,
                                color: mockBlock.properties?.color,
                                backgroundColor: mockBlock.properties?.backgroundColor,
                                marginTop: `${mockBlock.properties?.marginTop}px`,
                                marginBottom: `${mockBlock.properties?.marginBottom}px`,
                                padding: `${mockBlock.properties?.padding}px`,
                                borderRadius: `${mockBlock.properties?.borderRadius}px`
                              }}
                            >
                              {/* Simular interpolação */}
                              {mockBlock.content?.text?.replace('{userName}', 'Ana') || 'Texto do bloco'}
                            </div>
                            
                            {selectedBlock && (
                              <Badge variant="default" className="mt-2">
                                Bloco Selecionado: {mockBlock.type}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Instruções */}
                        <div className="text-center text-gray-600 text-sm">
                          <p>Este é um exemplo do canvas do editor.</p>
                          <p>Clique no bloco acima para editá-lo no painel de propriedades.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Mode de preview
                  <div className={`mx-auto transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'max-w-sm' :
                    previewDevice === 'tablet' ? 'max-w-2xl' : 'max-w-6xl'
                  }`}>
                    <Card>
                      <CardContent className="p-8">
                        <div className="text-center">
                          <h2 className="text-3xl font-bold mb-4">Preview da Etapa {currentStep}</h2>
                          <p className="text-gray-600">
                            Este seria o preview real da etapa renderizada para o usuário final.
                          </p>
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800">
                              Dispositivo: {previewDevice} | Interpolação ativa | Validação em tempo real
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Painel de Propriedades NOCODE */}
            {activeMode === 'edit' && (
              <div className="w-96 border-l bg-white">
                <NoCodePropertiesPanel
                  selectedBlock={selectedBlock}
                  currentStep={currentStep}
                  totalSteps={21}
                  onUpdate={handleBlockUpdate}
                  onDuplicate={handleBlockDuplicate}
                  onDelete={handleBlockDelete}
                  onStepChange={handleStepChange}
                  previewMode={previewMode}
                  onPreviewToggle={setPreviewMode}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer com informações */}
      <div className="bg-white border-t p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Modo: {activeMode}</span>
            {selectedBlock && <span>Bloco: {selectedBlock.id}</span>}
          </div>
          <div className="flex items-center gap-4">
            <span>Total de propriedades: {selectedBlock ? Object.keys({...selectedBlock.properties, ...selectedBlock.content}).length : 0}</span>
            <Badge variant="outline" className="text-xs">
              Sistema NOCODE Ativo
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoCodeEditorExample;