import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import ColorPicker from '@/components/visual-controls/ColorPicker';

interface IntroStepPropertiesProps {
  properties: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}

/**
 * Painel de propriedades específico para Etapa 1 - Introdução
 * ✅ CORRIGIDO: Inclui propriedades do quiz-intro-header
 */
export const IntroStepProperties: React.FC<IntroStepPropertiesProps> = ({
  properties,
  onUpdate,
}) => {
  // ✅ Propriedades gerais do step
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

  // ✅ Propriedades específicas do quiz-intro-header
  const {
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo',
    logoWidth = 96,
    logoHeight = 96,
    showBackButton = false,
    progressValue = 0,
    progressMax = 100,
    showProgressBar = false,
  } = properties;

  return (
    <div className="space-y-6">
      {/* ✅ NOVO: Cabeçalho do Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cabeçalho do Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">URL da Logo</Label>
            <Input
              id="logoUrl"
              value={logoUrl}
              onChange={e => onUpdate('logoUrl', e.target.value)}
              placeholder="URL da imagem da logo"
            />
          </div>

          <div>
            <Label htmlFor="logoAlt">Texto Alternativo da Logo</Label>
            <Input
              id="logoAlt"
              value={logoAlt}
              onChange={e => onUpdate('logoAlt', e.target.value)}
              placeholder="Descrição da logo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logoWidth">Largura da Logo: {logoWidth}px</Label>
              <Slider
                id="logoWidth"
                min={24}
                max={240}
                step={2}
                value={[logoWidth]}
                onValueChange={([value]) => onUpdate('logoWidth', value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="logoHeight">Altura da Logo: {logoHeight}px</Label>
              <Slider
                id="logoHeight"
                min={24}
                max={240}
                step={2}
                value={[logoHeight]}
                onValueChange={([value]) => onUpdate('logoHeight', value)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showBackButton"
              checked={showBackButton}
              onCheckedChange={checked => onUpdate('showBackButton', checked)}
            />
            <Label htmlFor="showBackButton">Mostrar Botão Voltar</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showProgressBar"
              checked={showProgressBar}
              onCheckedChange={checked => onUpdate('showProgress', checked)}
            />
            <Label htmlFor="showProgressBar">Mostrar Barra de Progresso</Label>
          </div>

          {showProgressBar && (
            <div>
              <Label htmlFor="progressValue">Progresso: {progressValue}%</Label>
              <Slider
                id="progressValue"
                min={0}
                max={100}
                step={1}
                value={[progressValue]}
                onValueChange={([value]) => onUpdate('progressValue', value)}
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

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
            <Label htmlFor="imageUrl">URL da Imagem</Label>
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
