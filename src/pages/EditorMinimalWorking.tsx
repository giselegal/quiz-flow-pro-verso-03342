import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EditorMinimalWorking: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState(1);

  const steps = Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? 'Introdução' : i === 20 ? 'Resultado' : `Pergunta ${i}`,
    description: i === 0 ? 'Página inicial do quiz' : i === 20 ? 'Página de resultado final' : `Pergunta número ${i}`,
    isActive: i + 1 === selectedStep
  }));

  const handleStepSelect = (stepId: number) => {
    setSelectedStep(stepId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">Editor de Quiz</h1>
          <p className="text-orange-700">Sistema funcionando - 21 etapas configuradas</p>
        </div>

        {/* Main Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Steps Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-900">Etapas do Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {steps.map((step) => (
                    <Button
                      key={step.id}
                      variant={step.isActive ? "default" : "outline"}
                      className={`w-full justify-start h-auto p-3 ${
                        step.isActive 
                          ? "bg-orange-600 hover:bg-orange-700" 
                          : "border-orange-200 text-orange-800 hover:bg-orange-50"
                      }`}
                      onClick={() => handleStepSelect(step.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">Etapa {step.id}</div>
                        <div className="text-sm opacity-70">{step.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-900">
                  Editando: Etapa {selectedStep} - {steps[selectedStep - 1]?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-64 bg-orange-50 rounded-lg p-6 border-2 border-dashed border-orange-200">
                  <div className="text-center space-y-4">
                    <div className="text-orange-900 font-semibold text-lg">
                      {steps[selectedStep - 1]?.name}
                    </div>
                    <div className="text-orange-700">
                      {steps[selectedStep - 1]?.description}
                    </div>
                    
                    {selectedStep === 1 && (
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded border border-orange-200">
                          <strong>Componentes da Etapa 1:</strong>
                          <ul className="mt-2 text-sm space-y-1">
                            <li>• Logo e imagem principal</li>
                            <li>• Barra de progresso</li>
                            <li>• Título e texto motivacional</li>
                            <li>• Campo de nome</li>
                            <li>• Botão "Começar o Quiz"</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedStep === 21 && (
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded border border-orange-200">
                          <strong>Componentes da Página de Resultado:</strong>
                          <ul className="mt-2 text-sm space-y-1">
                            <li>• Resultado do estilo pessoal</li>
                            <li>• Descrição detalhada</li>
                            <li>• Recomendações de produtos</li>
                            <li>• Call-to-action para compra</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedStep > 1 && selectedStep < 21 && (
                      <div className="bg-white p-4 rounded border border-orange-200">
                        <strong>Pergunta {selectedStep - 1}</strong>
                        <p className="mt-2 text-sm text-orange-700">
                          Configure a pergunta, opções de resposta e pesos para o cálculo do estilo.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-orange-700">
                  <span className="font-medium">Status:</span> Sistema ativo e funcionando
                </div>
                <div className="text-orange-700">
                  <span className="font-medium">Etapa atual:</span> {selectedStep}/21
                </div>
                <div className="text-orange-700">
                  <span className="font-medium">Última atualização:</span> {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorMinimalWorking;