import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import ColorPicker from '@/components/visual-controls/ColorPicker';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionStepPropertiesProps {
  properties: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}

/**
 * Painel de propriedades específico para Etapas 2-14 - Questões do Quiz
 */
export const QuestionStepProperties: React.FC<QuestionStepPropertiesProps> = ({
  properties,
  onUpdate,
}) => {
  const {
    questionTitle = 'Pergunta do Quiz',
    questionDescription = '',
    options = [],
    multiSelect = 3,
    autoAdvance = true,
    layout = '2col',
    showImages = true,
    imageSize = { width: 256, height: 256 },
    columns = 2,
    borderColor = '#E5E7EB',
    selectedBorderColor = '#B89B7A',
    hoverColor = '#F3E8D3',
    validationMessage = 'Selecione as opções necessárias para avançar.',
    buttonText = 'Próxima Questão →',
    buttonDisabledText = 'Selecione pelo menos 3 opções',
    showProgress = true,
    progressValue = 50,
  } = properties;

  const handleAddOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      imageUrl: '',
      styleCategory: 'Natural',
      points: 1,
    };
    onUpdate('options', [...options, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_: any, i: number) => i !== index);
    onUpdate('options', updatedOptions);
  };

  const handleUpdateOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    onUpdate('options', updatedOptions);
  };

  return (
    <div className="space-y-6">
      {/* Configuração da Pergunta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Pergunta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="questionTitle">Título da Pergunta</Label>
            <Input
              id="questionTitle"
              value={questionTitle}
              onChange={e => onUpdate('questionTitle', e.target.value)}
              placeholder="Digite a pergunta"
            />
          </div>

          <div>
            <Label htmlFor="questionDescription">Descrição (Opcional)</Label>
            <Input
              id="questionDescription"
              value={questionDescription}
              onChange={e => onUpdate('questionDescription', e.target.value)}
              placeholder="Instruções adicionais"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Seleção */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Regras de Seleção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="multiSelect">Número de Seleções Obrigatórias</Label>
            <div className="mt-2">
              <Slider
                value={[multiSelect]}
                onValueChange={value => onUpdate('multiSelect', value[0])}
                max={8}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>1</span>
                <span className="font-medium">{multiSelect} seleções</span>
                <span>8</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoAdvance"
              checked={autoAdvance}
              onCheckedChange={checked => onUpdate('autoAdvance', checked)}
            />
            <Label htmlFor="autoAdvance">Avançar Automaticamente</Label>
          </div>

          <div>
            <Label htmlFor="validationMessage">Mensagem de Validação</Label>
            <Input
              id="validationMessage"
              value={validationMessage}
              onChange={e => onUpdate('validationMessage', e.target.value)}
              placeholder="Mensagem quando não atinge o mínimo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout e Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="layout">Tipo de Layout</Label>
            <Select value={layout} onValueChange={value => onUpdate('layout', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1col">1 Coluna</SelectItem>
                <SelectItem value="2col">2 Colunas</SelectItem>
                <SelectItem value="3col">3 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="columns">Número de Colunas no Grid</Label>
            <div className="mt-2">
              <Slider
                value={[columns]}
                onValueChange={value => onUpdate('columns', value[0])}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>1</span>
                <span className="font-medium">{columns} colunas</span>
                <span>4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showImages"
              checked={showImages}
              onCheckedChange={checked => onUpdate('showImages', checked)}
            />
            <Label htmlFor="showImages">Mostrar Imagens nas Opções</Label>
          </div>

          {showImages && (
            <div className="space-y-2">
              <Label>Tamanho das Imagens</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="imageWidth" className="text-xs">
                    Largura (px)
                  </Label>
                  <Input
                    id="imageWidth"
                    type="number"
                    value={imageSize.width}
                    onChange={e =>
                      onUpdate('imageSize', { ...imageSize, width: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="imageHeight" className="text-xs">
                    Altura (px)
                  </Label>
                  <Input
                    id="imageHeight"
                    type="number"
                    value={imageSize.height}
                    onChange={e =>
                      onUpdate('imageSize', { ...imageSize, height: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Borda Padrão</Label>
            <ColorPicker value={borderColor} onChange={color => onUpdate('borderColor', color)} />
          </div>

          <div>
            <Label>Borda Selecionada</Label>
            <ColorPicker
              value={selectedBorderColor}
              onChange={color => onUpdate('selectedBorderColor', color)}
            />
          </div>

          <div>
            <Label>Cor do Hover</Label>
            <ColorPicker value={hoverColor} onChange={color => onUpdate('hoverColor', color)} />
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Botão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Botão de Ação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="buttonText">Texto do Botão</Label>
            <Input
              id="buttonText"
              value={buttonText}
              onChange={e => onUpdate('buttonText', e.target.value)}
              placeholder="Texto quando ativo"
            />
          </div>

          <div>
            <Label htmlFor="buttonDisabledText">Texto Quando Desabilitado</Label>
            <Input
              id="buttonDisabledText"
              value={buttonDisabledText}
              onChange={e => onUpdate('buttonDisabledText', e.target.value)}
              placeholder="Texto quando não atingiu o mínimo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Opções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Opções da Pergunta
            <Button size="sm" onClick={handleAddOption} className="h-8 px-2">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {options.map((option: any, index: number) => (
              <Card key={option.id || index} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <Label className="text-xs font-medium">Opção {index + 1}</Label>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveOption(index)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`option-text-${index}`} className="text-xs">
                        Texto
                      </Label>
                      <Input
                        id={`option-text-${index}`}
                        value={option.text || ''}
                        onChange={e => handleUpdateOption(index, 'text', e.target.value)}
                        placeholder="Texto da opção"
                      />
                    </div>

                    {showImages && (
                      <div>
                        <Label htmlFor={`option-image-${index}`} className="text-xs">
                          Imagem URL
                        </Label>
                        <Input
                          id={`option-image-${index}`}
                          value={option.imageUrl || ''}
                          onChange={e => handleUpdateOption(index, 'imageUrl', e.target.value)}
                          placeholder="URL da imagem"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`option-category-${index}`} className="text-xs">
                          Categoria
                        </Label>
                        <Select
                          value={option.styleCategory || 'Natural'}
                          onValueChange={value => handleUpdateOption(index, 'styleCategory', value)}
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
                      </div>

                      <div>
                        <Label htmlFor={`option-points-${index}`} className="text-xs">
                          Pontos
                        </Label>
                        <Input
                          id={`option-points-${index}`}
                          type="number"
                          min="1"
                          max="10"
                          value={option.points || 1}
                          onChange={e =>
                            handleUpdateOption(index, 'points', parseInt(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Barra de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Progresso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showProgress"
              checked={showProgress}
              onCheckedChange={checked => onUpdate('showProgress', checked)}
            />
            <Label htmlFor="showProgress">Mostrar Barra de Progresso</Label>
          </div>

          {showProgress && (
            <div>
              <Label htmlFor="progressValue">Valor do Progresso (%)</Label>
              <div className="mt-2">
                <Slider
                  value={[progressValue]}
                  onValueChange={value => onUpdate('progressValue', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>0%</span>
                  <span className="font-medium">{progressValue}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionStepProperties;
