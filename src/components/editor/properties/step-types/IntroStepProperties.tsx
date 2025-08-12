import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import ColorPicker from '@/components/visual-controls/ColorPicker';

interface IntroStepPropertiesProps {
  properties: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}

/**
 * Painel de propriedades específico para Etapa 1 - Introdução
 */
export const IntroStepProperties: React.FC<IntroStepPropertiesProps> = ({
  properties,
  onUpdate,
}) => {
  const {
    title = 'Descubra Seu Estilo Predominante',
    subtitle = 'Quiz personalizado para descobrir seu estilo único',
    imageUrl = '',
    inputLabel = 'NOME *',
    inputPlaceholder = 'Digite seu nome',
    buttonText = 'Iniciar Quiz',
    required = true,
    backgroundColor = '#FAF9F7',
    textColor = '#432818',
    buttonColor = '#B89B7A',
    showProgress = false,
  } = properties;

  return (
    <div className="space-y-6">
      {/* Conteúdo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título Principal</Label>
            <Input
              id="title"
              value={title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Título da página de introdução"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={e => onUpdate('subtitle', e.target.value)}
              placeholder="Descrição do quiz"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Imagem Hero</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={e => onUpdate('imageUrl', e.target.value)}
              placeholder="URL da imagem principal"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Campo de Nome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inputLabel">Label do Campo</Label>
            <Input
              id="inputLabel"
              value={inputLabel}
              onChange={e => onUpdate('inputLabel', e.target.value)}
              placeholder="Texto do label"
            />
          </div>

          <div>
            <Label htmlFor="inputPlaceholder">Placeholder</Label>
            <Input
              id="inputPlaceholder"
              value={inputPlaceholder}
              onChange={e => onUpdate('inputPlaceholder', e.target.value)}
              placeholder="Texto do placeholder"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={required}
              onCheckedChange={checked => onUpdate('required', checked)}
            />
            <Label htmlFor="required">Campo Obrigatório</Label>
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
              placeholder="Texto do botão principal"
            />
          </div>

          <div>
            <Label htmlFor="buttonColor">Cor do Botão</Label>
            <ColorPicker value={buttonColor} onChange={color => onUpdate('buttonColor', color)} />
          </div>
        </CardContent>
      </Card>

      <Separator />

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
              id="showProgress"
              checked={showProgress}
              onCheckedChange={checked => onUpdate('showProgress', checked)}
            />
            <Label htmlFor="showProgress">Mostrar Barra de Progresso</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntroStepProperties;
