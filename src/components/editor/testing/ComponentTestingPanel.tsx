import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, Palette, Settings, Type } from "lucide-react";
import React, { useState } from "react";

// Importar todos os componentes inline
import { ButtonInline } from "@/components/blocks/inline/ButtonInline";
import ImageDisplayInline from "@/components/blocks/inline/ImageDisplayInline";
import { TextInline } from "@/components/blocks/inline/TextInline";

interface ComponentTestingPanelProps {
  onSelectComponent?: (componentId: string, componentType: string) => void;
}

/**
 * Painel de Teste de Componentes
 * 
 * Permite testar todos os componentes das etapas em um só lugar
 * com diferentes configurações e propriedades.
 */
export const ComponentTestingPanel: React.FC<ComponentTestingPanelProps> = ({
  onSelectComponent,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [componentProperties, setComponentProperties] = useState<Record<string, any>>({});

  const handleSelectComponent = (id: string, type: string) => {
    setSelectedComponent(id);
    onSelectComponent?.(id, type);
  };

  const handlePropertyChange = (componentId: string, property: string, value: any) => {
    setComponentProperties(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        [property]: value,
      },
    }));
  };

  const getComponentProps = (componentId: string) => {
    return componentProperties[componentId] || {};
  };

  // Configurações de teste para cada tipo de componente
  const testComponents = [
    {
      id: 'text-test-1',
      type: 'text-inline',
      category: 'Texto',
      name: 'Texto Simples',
      component: (
        <TextInline
          text="Este é um texto de exemplo para teste"
          fontSize="16px"
          color="#333333"
          textAlign="left"
          isSelected={selectedComponent === 'text-test-1'}
          onClick={() => handleSelectComponent('text-test-1', 'text-inline')}
          onPropertyChange={(key: string, value: any) => handlePropertyChange('text-test-1', key, value)}
          {...getComponentProps('text-test-1')}
        />
      ),
    },
    {
      id: 'text-test-2',
      type: 'text-inline',
      category: 'Texto',
      name: 'Texto Centralizado',
      component: (
        <TextInline
          text="Texto centralizado com fonte maior"
          fontSize="20px"
          color="#B89B7A"
          textAlign="center"
          fontWeight="bold"
          isSelected={selectedComponent === 'text-test-2'}
          onClick={() => handleSelectComponent('text-test-2', 'text-inline')}
          onPropertyChange={(key: string, value: any) => handlePropertyChange('text-test-2', key, value)}
          {...getComponentProps('text-test-2')}
        />
      ),
    },
    {
      id: 'button-test-1',
      type: 'button-inline',
      category: 'Botão',
      name: 'Botão Primário',
      component: (
        <ButtonInline
          text="Botão Primário"
          variant="primary"
          size="medium"
          backgroundColor="#B89B7A"
          textColor="#ffffff"
          isSelected={selectedComponent === 'button-test-1'}
          onClick={() => handleSelectComponent('button-test-1', 'button-inline')}
          onPropertyChange={(key, value) => handlePropertyChange('button-test-1', key, value)}
          {...getComponentProps('button-test-1')}
        />
      ),
    },
    {
      id: 'button-test-2',
      type: 'button-inline',
      category: 'Botão',
      name: 'Botão Secundário',
      component: (
        <ButtonInline
          text="Botão Secundário"
          variant="secondary"
          size="large"
          backgroundColor="#6B7280"
          textColor="#ffffff"
          isSelected={selectedComponent === 'button-test-2'}
          onClick={() => handleSelectComponent('button-test-2', 'button-inline')}
          onPropertyChange={(key, value) => handlePropertyChange('button-test-2', key, value)}
          {...getComponentProps('button-test-2')}
        />
      ),
    },
    {
      id: 'button-test-3',
      type: 'button-inline',
      category: 'Botão',
      name: 'Botão Outline',
      component: (
        <ButtonInline
          text="Botão Outline"
          variant="outline"
          size="small"
          backgroundColor="#3B82F6"
          textColor="#3B82F6"
          fullWidth={false}
          isSelected={selectedComponent === 'button-test-3'}
          onClick={() => handleSelectComponent('button-test-3', 'button-inline')}
          onPropertyChange={(key, value) => handlePropertyChange('button-test-3', key, value)}
          {...getComponentProps('button-test-3')}
        />
      ),
    },
    {
      id: 'image-test-1',
      type: 'image-display',
      category: 'Imagem',
      name: 'Imagem Exemplo',
      component: (
        <ImageDisplayInline
          src="https://picsum.photos/400/200?random=1"
          alt="Imagem de exemplo"
          width="400px"
          height="200px"
          objectFit="cover"
          textAlign="center"
          isSelected={selectedComponent === 'image-test-1'}
          onClick={() => handleSelectComponent('image-test-1', 'image-display')}
          onPropertyChange={(key: string, value: any) => handlePropertyChange('image-test-1', key, value)}
          {...getComponentProps('image-test-1')}
        />
      ),
    },
    {
      id: 'image-test-2',
      type: 'image-display',
      category: 'Imagem',
      name: 'Imagem Pequena',
      component: (
        <ImageDisplayInline
          src="https://picsum.photos/150/150?random=2"
          alt="Imagem pequena"
          width="150px"
          height="150px"
          objectFit="contain"
          textAlign="left"
          isSelected={selectedComponent === 'image-test-2'}
          onClick={() => handleSelectComponent('image-test-2', 'image-display')}
          onPropertyChange={(key, value) => handlePropertyChange('image-test-2', key, value)}
          {...getComponentProps('image-test-2')}
        />
      ),
    },
  ];

  const groupedComponents = testComponents.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, typeof testComponents>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Texto':
        return <Type className="w-4 h-4" />;
      case 'Botão':
        return <Settings className="w-4 h-4" />;
      case 'Imagem':
        return <Eye className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Teste de Componentes</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {testComponents.length} componentes
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Clique em qualquer componente para testar a personalização
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(groupedComponents).map(([category, components]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              {getCategoryIcon(category)}
              <h3 className="font-medium text-gray-900">{category}</h3>
              <Badge variant="secondary" className="text-xs">
                {components.length}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              {components.map((comp) => (
                <div key={comp.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {comp.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant={selectedComponent === comp.id ? "default" : "outline"} 
                        className="text-xs"
                      >
                        {comp.type}
                      </Badge>
                      {selectedComponent === comp.id && (
                        <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                          Selecionado
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Card 
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      selectedComponent === comp.id 
                        ? 'border-blue-500 bg-blue-50/30 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectComponent(comp.id, comp.type)}
                  >
                    {comp.component}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Como usar:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Clique em qualquer componente para selecioná-lo</li>
            <li>• Use o painel de propriedades à direita para editá-lo</li>
            <li>• Teste diferentes configurações em tempo real</li>
            <li>• Componentes inline permitem edição duplo-clique</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentTestingPanel;
