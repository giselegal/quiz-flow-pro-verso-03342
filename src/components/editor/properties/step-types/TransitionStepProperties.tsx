import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import ColorPicker from '@/components/visual-controls/ColorPicker';

interface TransitionStepPropertiesProps {
  properties: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}

/**
 * Painel de propriedades específico para Etapas de Transição (15, 19)
 */
export const TransitionStepProperties: React.FC<TransitionStepPropertiesProps> = ({
  properties,
  onUpdate,
}) => {
  const {
    title = 'Processando suas respostas...',
    description = 'Aguarde enquanto analisamos seu perfil',
    backgroundImage = '',
    textColor = '#432818',
    backgroundColor = '#FAF9F7',
    showProgress = false,
    progressValue = 75,
    delay = 3000,
    animationType = 'pulse',
    showLoadingSpinner = true,
    customMessage = '',
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
            <Label htmlFor="transition-title">Título Principal</Label>
            <Input
              id="transition-title"
              value={title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Título da tela de transição"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Descrição do que está acontecendo"
            />
          </div>

          <div>
            <Label htmlFor="customMessage">Mensagem Personalizada (Opcional)</Label>
            <Input
              id="customMessage"
              value={customMessage}
              onChange={e => onUpdate('customMessage', e.target.value)}
              placeholder="Mensagem adicional específica"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuração Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="backgroundImage">Imagem de Fundo</Label>
            <Input
              id="backgroundImage"
              value={backgroundImage}
              onChange={e => onUpdate('backgroundImage', e.target.value)}
              placeholder="URL da imagem de fundo"
            />
          </div>

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
        </CardContent>
      </Card>

      {/* Configurações de Animação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Animação e Comportamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="delay">Tempo de Exibição (ms)</Label>
            <div className="mt-2">
              <Slider
                value={[delay]}
                onValueChange={value => onUpdate('delay', value[0])}
                max={10000}
                min={1000}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>1s</span>
                <span className="font-medium">{(delay / 1000).toFixed(1)}s</span>
                <span>10s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showLoadingSpinner"
              checked={showLoadingSpinner}
              onCheckedChange={checked => onUpdate('showLoadingSpinner', checked)}
            />
            <Label htmlFor="showLoadingSpinner">Mostrar Spinner de Carregamento</Label>
          </div>

          <div>
            <Label htmlFor="animationType">Tipo de Animação</Label>
            <select
              id="animationType"
              value={animationType}
              onChange={e => onUpdate('animationType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pulse">Pulse</option>
              <option value="fade">Fade</option>
              <option value="bounce">Bounce</option>
              <option value="slide">Slide</option>
              <option value="none">Sem Animação</option>
            </select>
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
              id="transition-showProgress"
              checked={showProgress}
              onCheckedChange={checked => onUpdate('showProgress', checked)}
            />
            <Label htmlFor="transition-showProgress">Mostrar Barra de Progresso</Label>
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

export default TransitionStepProperties;
