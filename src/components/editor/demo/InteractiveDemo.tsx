// =====================================================================
// components/editor/demo/InteractiveDemo.tsx - Demo interativo
// =====================================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Monitor, Tablet, Smartphone, Settings, History, 
  Palette, Layers, Sparkles, CheckCircle, PlayCircle,
  MousePointerClick, Keyboard, Eye, Code2
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  completed: boolean;
}

export const InteractiveDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const demoSteps: DemoStep[] = [
    {
      id: 'responsive',
      title: 'Preview Responsivo',
      description: 'Teste a visualização em diferentes dispositivos',
      icon: <Monitor className="w-5 h-5" />,
      component: <ResponsivePreviewDemo onComplete={() => completeStep('responsive')} />,
      completed: false
    },
    {
      id: 'steps',
      title: 'Gerenciamento de Etapas',
      description: 'Crie, edite e organize etapas do quiz',
      icon: <Layers className="w-5 h-5" />,
      component: <StepsManagementDemo onComplete={() => completeStep('steps')} />,
      completed: false
    },
    {
      id: 'components',
      title: 'Biblioteca de Componentes',
      description: 'Explore e adicione componentes',
      icon: <Sparkles className="w-5 h-5" />,
      component: <ComponentsDemo onComplete={() => completeStep('components')} />,
      completed: false
    },
    {
      id: 'properties',
      title: 'Painel de Propriedades',
      description: 'Configure propriedades avançadas',
      icon: <Settings className="w-5 h-5" />,
      component: <PropertiesDemo onComplete={() => completeStep('properties')} />,
      completed: false
    },
    {
      id: 'history',
      title: 'Histórico e Undo/Redo',
      description: 'Navegue pelo histórico de alterações',
      icon: <History className="w-5 h-5" />,
      component: <HistoryDemo onComplete={() => completeStep('history')} />,
      completed: false
    }
  ];

  const completeStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const progressPercentage = (completedSteps.size / demoSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Demo Interativo
              </h1>
              <p className="text-gray-600">
                Explore todas as funcionalidades do editor visual
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Badge variant="outline" className="bg-white">
              {completedSteps.size} de {demoSteps.length} concluídos
            </Badge>
            <div className="w-48">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>

        {/* Demo Navigation */}
        <Tabs value={demoSteps[currentStep]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {demoSteps.map((step, index) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                onClick={() => setCurrentStep(index)}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center space-x-1">
                  {completedSteps.has(step.id) ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {demoSteps.map((step) => (
            <TabsContent key={step.id} value={step.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {step.icon}
                    <span>{step.title}</span>
                    {completedSteps.has(step.id) && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Concluído
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-gray-600">{step.description}</p>
                </CardHeader>
                <CardContent>
                  {step.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          
          <div className="flex space-x-2">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : completedSteps.has(demoSteps[index].id)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
            disabled={currentStep === demoSteps.length - 1}
          >
            Próximo
          </Button>
        </div>

        {/* Completion Message */}
        {completedSteps.size === demoSteps.length && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Parabéns!
              </h3>
              <p className="text-gray-600 mb-4">
                Você explorou todas as funcionalidades do editor visual!
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Começar a Usar o Editor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Demo Components
const ResponsivePreviewDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasInteracted, setHasInteracted] = useState(false);

  const devices = [
    { id: 'desktop' as const, name: 'Desktop', icon: <Monitor className="w-4 h-4" />, width: '100%' },
    { id: 'tablet' as const, name: 'Tablet', icon: <Tablet className="w-4 h-4" />, width: '768px' },
    { id: 'mobile' as const, name: 'Mobile', icon: <Smartphone className="w-4 h-4" />, width: '375px' }
  ];

  const handleDeviceChange = (device: typeof selectedDevice) => {
    setSelectedDevice(device);
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(onComplete, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        {devices.map((device) => (
          <Button
            key={device.id}
            variant={selectedDevice === device.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleDeviceChange(device.id)}
            className="flex items-center space-x-2"
          >
            {device.icon}
            <span>{device.name}</span>
          </Button>
        ))}
      </div>

      <div className="flex justify-center">
        <div 
          className="bg-white rounded-lg shadow-lg border transition-all duration-300 overflow-hidden"
          style={{ width: devices.find(d => d.id === selectedDevice)?.width, minHeight: '400px' }}
        >
          <div className="bg-gray-100 px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 ml-2">Preview - {selectedDevice}</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quiz Interativo</h3>
            <p className="text-gray-600 mb-4">
              Este é um exemplo de como seu quiz aparecerá em {selectedDevice}.
            </p>
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500">Progresso: 3 de 5 questões</p>
            </div>
          </div>
        </div>
      </div>

      {hasInteracted && (
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Preview responsivo testado!
          </Badge>
        </div>
      )}
    </div>
  );
};

const StepsManagementDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: '1', name: 'Boas-vindas', active: true },
    { id: '2', name: 'Pergunta 1', active: false },
    { id: '3', name: 'Pergunta 2', active: false }
  ]);
  const [hasAddedStep, setHasAddedStep] = useState(false);

  const addStep = () => {
    const newStep = {
      id: (steps.length + 1).toString(),
      name: `Nova Etapa ${steps.length + 1}`,
      active: false
    };
    setSteps([...steps, newStep]);
    if (!hasAddedStep) {
      setHasAddedStep(true);
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Etapas do Quiz</h4>
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border ${
                  step.active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{step.name}</span>
                  {step.active && <Badge variant="outline">Ativa</Badge>}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addStep}
              className="w-full border-dashed"
            >
              + Adicionar Nova Etapa
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Funcionalidades</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <MousePointerClick className="w-4 h-4 text-blue-600" />
              <span>Clique para selecionar etapa</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Reordene com drag & drop</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Edite nome e propriedades</span>
            </div>
          </div>
        </div>
      </div>

      {hasAddedStep && (
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Etapa adicionada com sucesso!
          </Badge>
        </div>
      )}
    </div>
  );
};

const ComponentsDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  const components = [
    { id: 'text', name: 'Texto', icon: '📝' },
    { id: 'button', name: 'Botão', icon: '🔘' },
    { id: 'image', name: 'Imagem', icon: '🖼️' },
    { id: 'quiz', name: 'Questão', icon: '❓' }
  ];

  const selectComponent = (componentId: string) => {
    if (!selectedComponents.includes(componentId)) {
      const newSelected = [...selectedComponents, componentId];
      setSelectedComponents(newSelected);
      if (newSelected.length >= 2) {
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {components.map((component) => (
          <Button
            key={component.id}
            variant={selectedComponents.includes(component.id) ? "default" : "outline"}
            onClick={() => selectComponent(component.id)}
            className="h-20 flex flex-col items-center space-y-2"
          >
            <span className="text-2xl">{component.icon}</span>
            <span className="text-sm">{component.name}</span>
          </Button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Clique nos componentes para adicioná-los ao canvas
      </div>

      {selectedComponents.length >= 2 && (
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Componentes selecionados!
          </Badge>
        </div>
      )}
    </div>
  );
};

const PropertiesDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [changedProperties, setChangedProperties] = useState<string[]>([]);

  const properties = [
    { id: 'layout', name: 'Layout', icon: <Layers className="w-4 h-4" /> },
    { id: 'colors', name: 'Cores', icon: <Palette className="w-4 h-4" /> },
    { id: 'text', name: 'Texto', icon: <Code2 className="w-4 h-4" /> }
  ];

  const changeProperty = (propertyId: string) => {
    if (!changedProperties.includes(propertyId)) {
      const newChanged = [...changedProperties, propertyId];
      setChangedProperties(newChanged);
      if (newChanged.length >= 2) {
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card
            key={property.id}
            className={`cursor-pointer transition-colors ${
              changedProperties.includes(property.id) 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => changeProperty(property.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                {property.icon}
                <span className="font-medium">{property.name}</span>
                {changedProperties.includes(property.id) && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Clique nas seções para configurar propriedades
      </div>

      {changedProperties.length >= 2 && (
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Propriedades configuradas!
          </Badge>
        </div>
      )}
    </div>
  );
};

const HistoryDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [actions, setActions] = useState<string[]>(['Bloco adicionado']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addAction = () => {
    const newAction = `Ação ${actions.length + 1}`;
    setActions([...actions, newAction]);
    setCurrentIndex(actions.length);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (actions.length >= 3) {
        setTimeout(onComplete, 500);
      }
    }
  };

  const redo = () => {
    if (currentIndex < actions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Button onClick={undo} disabled={currentIndex === 0} size="sm">
          <History className="w-4 h-4 mr-2" />
          Desfazer
        </Button>
        <Button onClick={addAction} size="sm">
          Fazer Ação
        </Button>
        <Button onClick={redo} disabled={currentIndex === actions.length - 1} size="sm">
          Refazer
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <h4 className="font-semibold mb-2 text-center">Histórico de Ações</h4>
        <div className="space-y-1">
          {actions.map((action, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${
                index <= currentIndex
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {action}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Keyboard className="w-4 h-4" />
          <span>Use Ctrl+Z e Ctrl+Y para navegar</span>
        </div>
      </div>

      {actions.length >= 3 && currentIndex < actions.length - 1 && (
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Histórico testado!
          </Badge>
        </div>
      )}
    </div>
  );
};
