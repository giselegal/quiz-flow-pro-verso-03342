import { useState } from "react";

// Importar componentes
import { EditorNotification } from "@/components/editor/EditorNotification";
import { ComponentSpecificPropertiesPanel } from "@/components/editor/properties/ComponentSpecificPropertiesPanel";
import ComponentTestingPanel from "@/components/editor/testing/ComponentTestingPanel";

/**
 * Página de Teste de Componentes
 *
 * Interface dedicada para testar todos os componentes das etapas
 * com o sistema de personalização integrado.
 */
export default function ComponentTestingPage() {
  const [selectedComponent, setSelectedComponent] = useState<{
    id: string;
    type: string;
    properties?: Record<string, any>;
  } | null>(null);

  const [componentUpdates, setComponentUpdates] = useState<Record<string, any>>({});

  const handleSelectComponent = (componentId: string, componentType: string) => {
    // Recuperar propriedades salvas ou usar padrões
    const savedProperties = componentUpdates[componentId] || {};

    setSelectedComponent({
      id: componentId,
      type: componentType,
      properties: savedProperties,
    });
  };

  const handleUpdateComponent = (componentId: string, updates: Record<string, any>) => {
    // Debug para quiz-intro-header
    if (componentId === "quiz-intro-header-test-1") {
      console.log("handleUpdateComponent for quiz-intro-header:", updates);
    }

    // Salvar atualizações do componente
    setComponentUpdates(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        ...updates,
      },
    }));

    // Atualizar componente selecionado se for o mesmo
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(prev =>
        prev
          ? {
              ...prev,
              properties: {
                ...prev.properties,
                ...updates,
              },
            }
          : null
      );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-stone-50 to-white">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-stone-800">🧪 Teste de Componentes das Etapas</h1>
          <p className="text-sm text-stone-600 mt-1">
            Interface para testar personalização de todos os componentes
          </p>
        </div>
      </div>

      {/* Layout principal - Corrigido para melhor visualização dos textos */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Painel esquerdo: Lista de componentes - Aumentado para 60% */}
        <div className="w-3/5 border-r border-stone-200 bg-white/50">
          <div className="h-full overflow-auto p-6">
            <ComponentTestingPanel
              onSelectComponent={handleSelectComponent}
              componentUpdates={componentUpdates}
              onUpdateComponent={handleUpdateComponent}
            />
          </div>
        </div>

        {/* Painel direito: Propriedades - Reduzido para 40% */}
        <div className="w-2/5 bg-white/30">
          <div className="h-full overflow-auto">
            {selectedComponent ? (
              <ComponentSpecificPropertiesPanel
                selectedBlock={{
                  id: selectedComponent.id,
                  type: selectedComponent.type,
                  properties: selectedComponent.properties || {},
                }}
                onUpdate={handleUpdateComponent}
                onClose={() => setSelectedComponent(null)}
                onPreview={() => {
                  console.log("Preview component:", selectedComponent);
                }}
              />
            ) : (
              <div className="h-full p-6 flex items-center justify-center text-stone-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Selecione um Componente</h3>
                  <p className="text-sm">
                    Clique em qualquer componente à esquerda
                    <br />
                    para ver suas propriedades de personalização
                  </p>
                  <div className="mt-6 space-y-2 text-xs text-stone-400">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span>Componentes de Texto</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>Componentes de Botão</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span>Componentes de Imagem</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notificação de sucesso */}
      <EditorNotification
        type="success"
        message={
          selectedComponent
            ? `Componente ${selectedComponent.type} selecionado`
            : "Ambiente de teste carregado"
        }
      />

      {/* Footer */}
      <div className="absolute bottom-4 left-6 text-xs text-stone-400">
        <div className="flex items-center space-x-4">
          <span>💡 Dica: Clique nos componentes para testar a personalização</span>
          <span>|</span>
          <span>📊 Total: 7 componentes disponíveis</span>
        </div>
      </div>
    </div>
  );
}
