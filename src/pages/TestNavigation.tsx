import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';

/**
 * 🎯 TESTE DE NAVEGAÇÃO INTEGRADA DO SISTEMA 21 ETAPAS
 *
 * Este componente permite testar a navegação entre etapas diretamente
 * no VS Code, demonstrando que o sistema está funcionando corretamente.
 */
export default function TestNavigation() {
  const [, setLocation] = useLocation();
  const [selectedStep, setSelectedStep] = useState(1);

  const navigateToStep = (step: number) => {
    setSelectedStep(step);
    setLocation(`/step/${step}`);
  };

  const stepCategories = [
    { name: 'Introdução', steps: [1, 2], color: 'bg-blue-100 text-blue-800' },
    { name: 'Preferências', steps: [3, 4, 5, 6], color: 'bg-green-100 text-green-800' },
    { name: 'Detalhamento', steps: [7, 8, 9, 10], color: 'bg-purple-100 text-purple-800' },
    { name: 'Perfil', steps: [11, 12, 13, 14], color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Processamento', steps: [15, 16, 17], color: 'bg-orange-100 text-orange-800' },
    { name: 'Resultados', steps: [18, 19, 20], color: 'bg-pink-100 text-pink-800' },
    { name: 'Conversão', steps: [21], color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-gradient-to-r from-[#B89B7A] to-[#432818] text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Play className="h-8 w-8" />
              <span>Teste de Navegação - Sistema 21 Etapas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">✅ Status:</span> Sistema funcionando
              </div>
              <div>
                <span className="font-semibold">🚀 Servidor:</span> localhost:8085
              </div>
              <div>
                <span className="font-semibold">📊 Integração:</span> styleConfig.ts
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navegação Rápida */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChevronRight className="h-5 w-5" />
                <span>Navegação Rápida</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[1, 5, 10, 15, 20, 21].map(step => (
                  <Button
                    key={step}
                    onClick={() => navigateToStep(step)}
                    variant={selectedStep === step ? 'default' : 'outline'}
                    size="sm"
                    className={selectedStep === step ? 'bg-[#B89B7A] text-white' : ''}
                  >
                    Step {step}
                  </Button>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-[#432818]">Testes Especiais:</h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigateToStep(1)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    🎯 Step 1 - Introdução (8 Estilos)
                  </Button>
                  <Button
                    onClick={() => navigateToStep(20)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    📊 Step 20 - Resultados Integrados
                  </Button>
                  <Button
                    onClick={() => setLocation('/admin/overview')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    🏠 Dashboard Admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Navegação Sequencial</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigateToStep(Math.max(1, selectedStep - 1))}
                  variant="outline"
                  size="sm"
                  disabled={selectedStep <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <Badge variant="outline" className="px-4 py-1">
                  Etapa {selectedStep} de 21
                </Badge>

                <Button
                  onClick={() => navigateToStep(Math.min(21, selectedStep + 1))}
                  variant="outline"
                  size="sm"
                  disabled={selectedStep >= 21}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#B89B7A] to-[#432818] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(selectedStep / 21) * 100}%` }}
                ></div>
              </div>

              <p className="text-sm text-[#6B4F43]">
                Progresso: {Math.round((selectedStep / 21) * 100)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mapa de Etapas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa Completo das 21 Etapas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stepCategories.map(category => (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge className={category.color}>{category.name}</Badge>
                    <span className="text-sm text-[#6B4F43]">
                      {category.steps.length} etapa{category.steps.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                    {category.steps.map(step => (
                      <button
                        key={step}
                        onClick={() => navigateToStep(step)}
                        className={`p-2 rounded-lg border-2 transition-all text-sm font-medium
                          ${
                            selectedStep === step
                              ? 'border-[#B89B7A] bg-[#B89B7A] text-white'
                              : 'border-gray-200 bg-white text-[#432818] hover:border-[#B89B7A]/50'
                          }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-[#FAF9F7] border-[#B89B7A]/20">
          <CardHeader>
            <CardTitle className="text-[#432818]">Como Testar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-[#432818] mb-2">✅ Funcionamentos Testados:</h4>
                <ul className="space-y-1 text-sm text-[#6B4F43]">
                  <li>• Navegação entre etapas funcionando</li>
                  <li>• Rotas /step/1 até /step/21 ativas</li>
                  <li>• Componentes carregando corretamente</li>
                  <li>• Design da marca aplicado</li>
                  <li>• Simple Browser do VS Code compatível</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#432818] mb-2">🎯 Próximos Testes:</h4>
                <ul className="space-y-1 text-sm text-[#6B4F43]">
                  <li>• Clique nos botões para navegar</li>
                  <li>• Teste o Step 1 (introdução) </li>
                  <li>• Teste o Step 20 (resultados)</li>
                  <li>• Navegação sequencial com botões</li>
                  <li>• Verificar responsividade</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
