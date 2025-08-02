
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, Plus, Minus } from 'lucide-react';
import { EditorBlock } from '@/types/editor';
import { stepTemplateService } from '@/services/stepTemplateService';

interface DynamicPropertiesPanelProps {
  selectedBlockId: string | null;
  blocks: EditorBlock[];
  onClose: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  // Detectar tipo de etapa baseado no stepNumber
  const stepInfo = useMemo(() => {
    if (selectedBlock?.content?.stepNumber) {
      const stepNumber = selectedBlock.content.stepNumber;
      const templateData = stepTemplateService.getStepTemplate(stepNumber);
      return {
        stepNumber,
        templateData,
        isQuizQuestion: stepNumber >= 3 && stepNumber <= 11,
        isStrategicQuestion: stepNumber >= 13 && stepNumber <= 18,
        isTransition: stepNumber === 12 || stepNumber === 19,
        isResult: stepNumber === 20,
        isOffer: stepNumber === 21
      };
    }
    return null;
  }, [selectedBlock]);

  if (!selectedBlockId || !selectedBlock) {
    return (
      <div className="h-full p-4 space-y-4 bg-white">
        <div className="text-center text-[#432818]/60 mt-8">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-medium mb-2">Selecione um Componente</h3>
          <p className="text-sm">Clique em qualquer elemento do canvas para editar suas propriedades aqui.</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    onUpdate(selectedBlockId, {
      ...selectedBlock.content,
      [field]: value
    });
  };

  const handleNestedUpdate = (path: string, value: any) => {
    const pathArray = path.split('.');
    const newContent = { ...selectedBlock.content };
    
    let current = newContent;
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;
    
    onUpdate(selectedBlockId, newContent);
  };

  const handleArrayUpdate = (field: string, index: number, newValue: any) => {
    const currentArray = selectedBlock.content[field] || [];
    const newArray = [...currentArray];
    newArray[index] = newValue;
    handleUpdate(field, newArray);
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    const currentArray = selectedBlock.content[field] || [];
    handleUpdate(field, [...currentArray, defaultItem]);
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = selectedBlock.content[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleUpdate(field, newArray);
  };

  const resetToDefault = () => {
    if (stepInfo?.templateData) {
      onUpdate(selectedBlockId, stepInfo.templateData.content || {});
    }
  };

  const getBlockTypeLabel = () => {
    if (stepInfo) {
      return `Etapa ${stepInfo.stepNumber}`;
    }
    return selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-[#432818]">{getBlockTypeLabel()}</h2>
          {stepInfo && (
            <Badge variant="secondary" className="text-xs">
              {stepInfo.isQuizQuestion ? 'Quiz' : 
               stepInfo.isStrategicQuestion ? 'Estratégica' :
               stepInfo.isTransition ? 'Transição' :
               stepInfo.isResult ? 'Resultado' :
               stepInfo.isOffer ? 'Oferta' : 'Etapa'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetToDefault} title="Resetar para padrão">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(selectedBlockId)} className="text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="options">Opções</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto">
          <TabsContent value="content" className="p-4 space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={selectedBlock.content.title || ''}
                onChange={(e) => handleUpdate('title', e.target.value)}
                placeholder="Digite o título"
              />
            </div>

            {/* Subtítulo */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={selectedBlock.content.subtitle || ''}
                onChange={(e) => handleUpdate('subtitle', e.target.value)}
                placeholder="Digite o subtítulo"
              />
            </div>

            {/* Texto (para blocos de texto) */}
            {(selectedBlock.type === 'text' || selectedBlock.content.text !== undefined) && (
              <div className="space-y-2">
                <Label htmlFor="text">Texto</Label>
                <Textarea
                  id="text"
                  value={selectedBlock.content.text || ''}
                  onChange={(e) => handleUpdate('text', e.target.value)}
                  placeholder="Digite o texto"
                  className="min-h-[100px]"
                />
              </div>
            )}

            {/* Pergunta (para questões) */}
            {(stepInfo?.isQuizQuestion || stepInfo?.isStrategicQuestion) && (
              <div className="space-y-2">
                <Label htmlFor="question">Pergunta</Label>
                <Textarea
                  id="question"
                  value={selectedBlock.content.question || ''}
                  onChange={(e) => handleUpdate('question', e.target.value)}
                  placeholder="Digite a pergunta"
                  className="min-h-[80px]"
                />
              </div>
            )}

            {/* URL da Imagem */}
            {(selectedBlock.type === 'image' || selectedBlock.content.imageUrl !== undefined) && (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={selectedBlock.content.imageUrl || ''}
                  onChange={(e) => handleUpdate('imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="options" className="p-4 space-y-4">
            {/* MultiSelect (apenas para questões de quiz) */}
            {stepInfo?.isQuizQuestion && (
              <div className="space-y-2">
                <Label htmlFor="multiSelect">Seleções Permitidas</Label>
                <Input
                  id="multiSelect"
                  type="number"
                  min="0"
                  max="10"
                  value={selectedBlock.content.multiSelect || 0}
                  onChange={(e) => handleUpdate('multiSelect', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-[#8F7A6A]">
                  {selectedBlock.content.multiSelect === 0 ? 'Escolha única' : `Múltipla escolha (até ${selectedBlock.content.multiSelect} opções)`}
                </p>
              </div>
            )}

            {/* Opções (para questões) */}
            {(stepInfo?.isQuizQuestion || stepInfo?.isStrategicQuestion) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Opções de Resposta</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => addArrayItem('options', { 
                      id: Date.now().toString(), 
                      text: 'Nova opção',
                      value: '',
                      imageUrl: '',
                      category: stepInfo?.isQuizQuestion ? 'Natural' : undefined
                    })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                {(selectedBlock.content.options || []).map((option: any, index: number) => (
                  <Card key={index} className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Opção {index + 1}</Label>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeArrayItem('options', index)}
                        className="text-red-500"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Input
                      value={option.text || ''}
                      onChange={(e) => handleArrayUpdate('options', index, { ...option, text: e.target.value })}
                      placeholder="Texto da opção"
                    />
                    
                    {stepInfo?.isQuizQuestion && (
                      <Select 
                        value={option.category || 'Natural'} 
                        onValueChange={(value) => handleArrayUpdate('options', index, { ...option, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Natural">Natural</SelectItem>
                          <SelectItem value="Clássico">Clássico</SelectItem>
                          <SelectItem value="Contemporâneo">Contemporâneo</SelectItem>
                          <SelectItem value="Elegante">Elegante</SelectItem>
                          <SelectItem value="Romântico">Romântico</SelectItem>
                          <SelectItem value="Sexy">Sexy</SelectItem>
                          <SelectItem value="Dramático">Dramático</SelectItem>
                          <SelectItem value="Criativo">Criativo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    <Input
                      value={option.imageUrl || ''}
                      onChange={(e) => handleArrayUpdate('options', index, { ...option, imageUrl: e.target.value })}
                      placeholder="URL da imagem (opcional)"
                    />
                  </Card>
                ))}
                
                {(!selectedBlock.content.options || selectedBlock.content.options.length === 0) && (
                  <div className="text-center py-6 text-[#8F7A6A] border-2 border-dashed border-[#B89B7A]/20 rounded-lg">
                    <p>Nenhuma opção adicionada</p>
                    <p className="text-xs mt-1">Clique em "Adicionar" para criar opções de resposta</p>
                  </div>
                )}
              </div>
            )}

            {/* Configurações específicas por tipo de etapa */}
            {stepInfo?.isResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showPercentages">Mostrar Percentuais</Label>
                  <Switch
                    id="showPercentages"
                    checked={selectedBlock.content.showPercentages !== false}
                    onCheckedChange={(checked) => handleUpdate('showPercentages', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showSecondaryStyles">Mostrar Estilos Secundários</Label>
                  <Switch
                    id="showSecondaryStyles"
                    checked={selectedBlock.content.showSecondaryStyles !== false}
                    onCheckedChange={(checked) => handleUpdate('showSecondaryStyles', checked)}
                  />
                </div>
              </div>
            )}

            {stepInfo?.isOffer && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={selectedBlock.content.price || ''}
                    onChange={(e) => handleUpdate('price', e.target.value)}
                    placeholder="39,00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Preço Original</Label>
                  <Input
                    id="originalPrice"
                    value={selectedBlock.content.originalPrice || ''}
                    onChange={(e) => handleUpdate('originalPrice', e.target.value)}
                    placeholder="175,00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ctaText">Texto do Botão</Label>
                  <Input
                    id="ctaText"
                    value={selectedBlock.content.ctaText || ''}
                    onChange={(e) => handleUpdate('ctaText', e.target.value)}
                    placeholder="Quero meu Guia + Bônus"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">URL do Botão</Label>
                  <Input
                    id="ctaUrl"
                    value={selectedBlock.content.ctaUrl || ''}
                    onChange={(e) => handleUpdate('ctaUrl', e.target.value)}
                    placeholder="https://exemplo.com/comprar"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={selectedBlock.content.style?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleNestedUpdate('style.backgroundColor', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Cor do Texto</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={selectedBlock.content.style?.textColor || '#000000'}
                  onChange={(e) => handleNestedUpdate('style.textColor', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                <Select 
                  value={selectedBlock.content.style?.fontSize || 'base'}
                  onValueChange={(value) => handleNestedUpdate('style.fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Pequeno</SelectItem>
                    <SelectItem value="sm">Pequeno</SelectItem>
                    <SelectItem value="base">Normal</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                    <SelectItem value="xl">Extra Grande</SelectItem>
                    <SelectItem value="2xl">2x Grande</SelectItem>
                    <SelectItem value="3xl">3x Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textAlign">Alinhamento do Texto</Label>
                <Select 
                  value={selectedBlock.content.style?.textAlign || 'left'}
                  onValueChange={(value) => handleNestedUpdate('style.textAlign', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
