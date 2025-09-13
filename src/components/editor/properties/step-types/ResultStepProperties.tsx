import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import ColorPicker from '@/components/visual-controls/ColorPicker';
import { Plus, Trash2 } from 'lucide-react';

interface ResultStepPropertiesProps {
  properties: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}

/**
 * Painel de propriedades específico para Etapas de Resultado (17-18)
 */
export const ResultStepProperties: React.FC<ResultStepPropertiesProps> = ({
  properties,
  onUpdate,
}) => {
  const {
    title = 'Seu Resultado',
    description = 'Baseado nas suas respostas, descobrimos seu estilo:',
    mainResultTitle = 'Seu Estilo Predominante',
    mainResultDescription = 'Descrição do estilo descoberto',
    resultImage = '',
    ctaText = 'Ver Guia Completo',
    ctaUrl = '',
    ctaColor = '#B89B7A',
    showSecondaryStyles = true,
    secondaryStyles = [],
    bonusItems = [],
    personalizationLevel = 'high',
    showProgress = false,
    backgroundColor = '#FAF9F7',
    textColor = '#432818',
  } = properties;

  const handleAddSecondaryStyle = () => {
    const newStyle = {
      id: `secondary-${Date.now()}`,
      name: 'Estilo Secundário',
      description: 'Descrição do estilo secundário',
      percentage: '25%',
      image: '',
    };
    onUpdate('secondaryStyles', [...secondaryStyles, newStyle]);
  };

  const handleRemoveSecondaryStyle = (index: number) => {
    const updatedStyles = secondaryStyles.filter((_: any, i: number) => i !== index);
    onUpdate('secondaryStyles', updatedStyles);
  };

  const handleUpdateSecondaryStyle = (index: number, field: string, value: any) => {
    const updatedStyles = [...secondaryStyles];
    updatedStyles[index] = { ...updatedStyles[index], [field]: value };
    onUpdate('secondaryStyles', updatedStyles);
  };

  const handleAddBonusItem = () => {
    const newBonus = {
      id: `bonus-${Date.now()}`,
      title: 'Bônus',
      description: 'Descrição do bônus',
      image: '',
    };
    onUpdate('bonusItems', [...bonusItems, newBonus]);
  };

  const handleRemoveBonusItem = (index: number) => {
    const updatedBonus = bonusItems.filter((_: any, i: number) => i !== index);
    onUpdate('bonusItems', updatedBonus);
  };

  const handleUpdateBonusItem = (index: number, field: string, value: any) => {
    const updatedBonus = [...bonusItems];
    updatedBonus[index] = { ...updatedBonus[index], [field]: value };
    onUpdate('bonusItems', updatedBonus);
  };

  return (
    <div className="space-y-6">
      {/* Conteúdo Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="result-title">Título da Página</Label>
            <Input
              id="result-title"
              value={title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Título principal da página de resultado"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição Introdutória</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Texto introdutório antes do resultado"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resultado Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Resultado Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mainResultTitle">Título do Resultado</Label>
            <Input
              id="mainResultTitle"
              value={mainResultTitle}
              onChange={e => onUpdate('mainResultTitle', e.target.value)}
              placeholder="Nome do estilo descoberto"
            />
          </div>

          <div>
            <Label htmlFor="mainResultDescription">Descrição do Resultado</Label>
            <Textarea
              id="mainResultDescription"
              value={mainResultDescription}
              onChange={e => onUpdate('mainResultDescription', e.target.value)}
              placeholder="Descrição detalhada do estilo"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="resultImage">Imagem do Resultado</Label>
            <Input
              id="resultImage"
              value={resultImage}
              onChange={e => onUpdate('resultImage', e.target.value)}
              placeholder="URL da imagem representativa"
            />
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ctaText">Texto do Botão</Label>
            <Input
              id="ctaText"
              value={ctaText}
              onChange={e => onUpdate('ctaText', e.target.value)}
              placeholder="Texto do botão principal"
            />
          </div>

          <div>
            <Label htmlFor="ctaUrl">URL de Destino</Label>
            <Input
              id="ctaUrl"
              value={ctaUrl}
              onChange={e => onUpdate('ctaUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="ctaColor">Cor do Botão</Label>
            <ColorPicker value={ctaColor} onChange={color => onUpdate('ctaColor', color)} />
          </div>
        </CardContent>
      </Card>

      {/* Estilos Secundários */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Estilos Secundários
            <div className="flex items-center space-x-2">
              <Switch
                id="showSecondaryStyles"
                checked={showSecondaryStyles}
                onCheckedChange={checked => onUpdate('showSecondaryStyles', checked)}
              />
              <Button
                size="sm"
                onClick={handleAddSecondaryStyle}
                disabled={!showSecondaryStyles}
                className="h-8 px-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        {showSecondaryStyles && (
          <CardContent>
            <div className="space-y-4">
              {secondaryStyles.map((style: any, index: number) => (
                <Card key={style.id || index} className="border-dashed">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <Label className="text-xs font-medium">Estilo Secundário {index + 1}</Label>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveSecondaryStyle(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`style-name-${index}`} className="text-xs">
                          Nome do Estilo
                        </Label>
                        <Input
                          id={`style-name-${index}`}
                          value={style.name || ''}
                          onChange={e => handleUpdateSecondaryStyle(index, 'name', e.target.value)}
                          placeholder="Nome do estilo"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`style-description-${index}`} className="text-xs">
                          Descrição
                        </Label>
                        <Textarea
                          id={`style-description-${index}`}
                          value={style.description || ''}
                          onChange={e =>
                            handleUpdateSecondaryStyle(index, 'description', e.target.value)
                          }
                          placeholder="Descrição do estilo"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`style-percentage-${index}`} className="text-xs">
                            Porcentagem
                          </Label>
                          <Input
                            id={`style-percentage-${index}`}
                            value={style.percentage || ''}
                            onChange={e =>
                              handleUpdateSecondaryStyle(index, 'percentage', e.target.value)
                            }
                            placeholder="25%"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`style-image-${index}`} className="text-xs">
                            Imagem URL
                          </Label>
                          <Input
                            id={`style-image-${index}`}
                            value={style.image || ''}
                            onChange={e =>
                              handleUpdateSecondaryStyle(index, 'image', e.target.value)
                            }
                            placeholder="URL da imagem"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Itens Bônus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Bônus e Benefícios
            <Button size="sm" onClick={handleAddBonusItem} className="h-8 px-2">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Bônus
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bonusItems.map((bonus: any, index: number) => (
              <Card key={bonus.id || index} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <Label className="text-xs font-medium">Bônus {index + 1}</Label>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveBonusItem(index)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`bonus-title-${index}`} className="text-xs">
                        Título
                      </Label>
                      <Input
                        id={`bonus-title-${index}`}
                        value={bonus.title || ''}
                        onChange={e => handleUpdateBonusItem(index, 'title', e.target.value)}
                        placeholder="Título do bônus"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`bonus-description-${index}`} className="text-xs">
                        Descrição
                      </Label>
                      <Textarea
                        id={`bonus-description-${index}`}
                        value={bonus.description || ''}
                        onChange={e => handleUpdateBonusItem(index, 'description', e.target.value)}
                        placeholder="Descrição do bônus"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`bonus-image-${index}`} className="text-xs">
                        Imagem URL
                      </Label>
                      <Input
                        id={`bonus-image-${index}`}
                        value={bonus.image || ''}
                        onChange={e => handleUpdateBonusItem(index, 'image', e.target.value)}
                        placeholder="URL da imagem"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Configurações de Personalização */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Personalização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="personalizationLevel">Nível de Personalização</Label>
            <select
              id="personalizationLevel"
              value={personalizationLevel}
              onChange={e => onUpdate('personalizationLevel', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Básico</option>
              <option value="medium">Intermediário</option>
              <option value="high">Avançado</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Visuais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <ColorPicker
              value={backgroundColor}
              onChange={color => onUpdate('backgroundColor', color)}
            />
          </div>

          <div>
            <Label htmlFor="textColor">Cor do Texto</Label>
            <ColorPicker value={textColor} onChange={color => onUpdate('textColor', color)} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="result-showProgress"
              checked={showProgress}
              onCheckedChange={checked => onUpdate('showProgress', checked)}
            />
            <Label htmlFor="result-showProgress">Mostrar Indicador de Progresso</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultStepProperties;
