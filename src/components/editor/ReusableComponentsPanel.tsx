import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditorReusableComponentsSimple } from '@/hooks/useEditorReusableComponents.simple';
import { Copy, Edit3, Package, Plus, Trash2 } from 'lucide-react';

// ============================================================================
// PAINEL DE COMPONENTES REUTILIZÁVEIS PARA O EDITOR
// Integra o sistema de componentes com a interface do editor
// ============================================================================

interface ReusableComponentsPanelProps {
  currentStepNumber?: number;
  onComponentAdd?: (componentType: string) => void;
}

export const ReusableComponentsPanel: React.FC<ReusableComponentsPanelProps> = ({
  currentStepNumber = 1,
  onComponentAdd,
}) => {
  const {
    stepComponents,
    loading,
    getComponentsByCategory,
    getAvailableCategories,
    addReusableComponentToEditor,
    applyComponentTemplate,
  } = useEditorReusableComponents();

  const categories = getAvailableCategories();

  const handleAddComponent = async (componentTypeKey: string) => {
    try {
      await addReusableComponentToEditor(componentTypeKey, currentStepNumber);
      onComponentAdd?.(componentTypeKey);
    } catch (error) {
      console.error('Erro ao adicionar componente:', error);
    }
  };

  const handleApplyTemplate = async (templateKey: string) => {
    try {
      await applyComponentTemplate(templateKey, currentStepNumber);
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Carregando Componentes...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Componentes Reutilizáveis
        </CardTitle>
        <CardDescription>Adicione componentes pré-configurados ao seu quiz</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* ABA: COMPONENTES INDIVIDUAIS */}
          <TabsContent value="components" className="space-y-4">
            {categories.map(category => {
              const categoryComponents = getComponentsByCategory(category);
              if (categoryComponents.length === 0) return null;

              return (
                <div key={category}>
                  <h4 style={{ color: '#6B4F43' }}>
                    {category === 'content' && '📝 Conteúdo'}
                    {category === 'interactive' && '🎯 Interativo'}
                    {category === 'headers' && '📱 Cabeçalhos'}
                    {category === 'forms' && '📋 Formulários'}
                    {category === 'media' && '🖼️ Mídia'}
                    {category === 'visual' && '🎨 Visual'}
                    {category === 'legal' && '⚖️ Legal'}
                    {![
                      'content',
                      'interactive',
                      'headers',
                      'forms',
                      'media',
                      'visual',
                      'legal',
                    ].includes(category) && `📦 ${category}`}
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    {categoryComponents.map(component => (
                      <div key={component.type_key} style={{ backgroundColor: '#FAF9F7' }}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-medium">{component.display_name}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {component.type_key}
                            </Badge>
                          </div>
                          <p style={{ color: '#8B7355' }}>
                            {Object.keys(component.default_properties).length} propriedades
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddComponent(component.type_key)}
                          className="ml-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* ABA: TEMPLATES PRONTOS */}
          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-3">
              {/* TEMPLATE: CABEÇALHO GISELE */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">🎨 Header Gisele Galvão</h5>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyTemplate('gisele-step-header')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Aplicar
                  </Button>
                </div>
                <p style={{ color: '#8B7355' }}>Header + contador de questão personalizado</p>
                <div className="flex gap-1 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    gisele-header
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    style-question
                  </Badge>
                </div>
              </div>

              {/* TEMPLATE: ETAPA DE PERGUNTA COMPLETA */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">❓ Etapa de Pergunta</h5>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyTemplate('gisele-question-step')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Aplicar
                  </Button>
                </div>
                <p style={{ color: '#8B7355' }}>Header + pergunta + opções + botão continuar</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    gisele-header
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    style-question
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    style-options-grid
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    gisele-button
                  </Badge>
                </div>
              </div>

              {/* TEMPLATE: ETAPA COM INPUT */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">📝 Etapa com Input</h5>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyTemplate('gisele-input-step')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Aplicar
                  </Button>
                </div>
                <p style={{ color: '#8B7355' }}>Header + pergunta + campo de entrada + botão</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    gisele-header
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    style-question
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    form-input
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    gisele-button
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* COMPONENTES DA ETAPA ATUAL */}
        {stepComponents[currentStepNumber] && stepComponents[currentStepNumber].length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 style={{ color: '#6B4F43' }}>
              📍 Etapa {currentStepNumber} ({stepComponents[currentStepNumber].length} componentes)
            </h4>
            <div className="space-y-2">
              {stepComponents[currentStepNumber]
                .sort((a, b) => a.order_index - b.order_index)
                .map(component => (
                  <div key={component.id} style={{ backgroundColor: '#FAF9F7' }}>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{component.display_name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {component.order_index}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        aria-label="Editar componente"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        aria-label="Remover componente"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReusableComponentsPanel;
