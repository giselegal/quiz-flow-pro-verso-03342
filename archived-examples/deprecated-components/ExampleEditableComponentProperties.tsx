// EXEMPLO PRÁTICO - Painel de Propriedades para ExampleEditableComponent

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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

/**
 * Painel de Propriedades para ExampleEditableComponent
 *
 * Este é um exemplo prático de como implementar um painel
 * de propriedades específico seguindo o checklist.
 *
 * @example
 * ```tsx
 * {renderExampleEditableComponentProperties(
 *   "example-1",
 *   {
 *     enabled: true,
 *     title: "Meu Título",
 *     backgroundColor: "#f0f9ff"
 *   },
 *   (property, value) => onPropertyChange(property, value)
 * )}
 * ```
 */

export const renderExampleEditableComponentProperties = (
  componentId: string,
  properties: any = {},
  onPropertyChange: (property: string, value: any) => void
) => {
  // ✅ 1. VALORES PADRÃO (IMPORTANTES PARA CONSISTÊNCIA)
  const defaultProperties = {
    enabled: true,
    title: 'Título do Exemplo',
    subtitle: 'Subtítulo opcional',
    showBadge: true,
    backgroundColor: '#f0f9ff',
    textColor: '#1e40af',
    borderRadius: 8,
    padding: '16px',
    textAlign: 'center',
    size: 'medium',
    animation: true,
    shadow: true,
  };

  // ✅ 2. MERGE COM PROPRIEDADES ATUAIS
  const currentProps = { ...defaultProperties, ...properties };

  // ✅ 3. FUNÇÃO DE DEBUG PARA ALTERAÇÕES
  const handlePropertyChange = (property: string, value: any) => {
    console.log(`ExampleComponent ${componentId} property changed: ${property} = ${value}`);
    onPropertyChange(property, value);
  };

  // ✅ 4. FUNÇÃO PARA RESET DE PROPRIEDADES
  const handleReset = () => {
    Object.entries(defaultProperties).forEach(([key, value]) => {
      onPropertyChange(key, value);
    });
    console.log(`ExampleComponent ${componentId} properties reset to defaults`);
  };

  return (
    <div className="space-y-6 p-4">
      {/* ✅ 5. CABEÇALHO COM INFORMAÇÕES DO COMPONENTE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            Componente de Exemplo
            <Button variant="outline" size="sm" onClick={handleReset}>
              Resetar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          Este é um componente de exemplo que demonstra todas as funcionalidades do sistema de
          edição.
        </CardContent>
      </Card>

      {/* ✅ 6. CONTROLES BÁSICOS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configurações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Switch de habilitação */}
          <div className="flex items-center justify-between">
            <Label htmlFor={`${componentId}-enabled`}>Componente Habilitado</Label>
            <Switch
              id={`${componentId}-enabled`}
              checked={currentProps.enabled}
              onCheckedChange={value => handlePropertyChange('enabled', value)}
            />
          </div>

          {/* Tamanho do componente */}
          <div className="space-y-2">
            <Label>Tamanho do Componente</Label>
            <Select
              value={currentProps.size}
              onValueChange={value => handlePropertyChange('size', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Pequeno</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ✅ 7. CONTROLES DE CONTEÚDO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campo de título */}
          <div className="space-y-2">
            <Label htmlFor={`${componentId}-title`}>Título</Label>
            <Input
              id={`${componentId}-title`}
              value={currentProps.title}
              onChange={e => handlePropertyChange('title', e.target.value)}
              placeholder="Digite o título..."
            />
          </div>

          {/* Campo de subtítulo */}
          <div className="space-y-2">
            <Label htmlFor={`${componentId}-subtitle`}>Subtítulo (opcional)</Label>
            <Textarea
              id={`${componentId}-subtitle`}
              value={currentProps.subtitle}
              onChange={e => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Digite o subtítulo..."
              rows={2}
            />
          </div>

          {/* Switch para badge */}
          <div className="flex items-center justify-between">
            <Label htmlFor={`${componentId}-show-badge`}>Mostrar Badge</Label>
            <Switch
              id={`${componentId}-show-badge`}
              checked={currentProps.showBadge}
              onCheckedChange={value => handlePropertyChange('showBadge', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ✅ 8. CONTROLES DE ESTILO VISUAL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Alinhamento do texto */}
          <div className="space-y-2">
            <Label>Alinhamento do Texto</Label>
            <Select
              value={currentProps.textAlign}
              onValueChange={value => handlePropertyChange('textAlign', value)}
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

          {/* Cor de fundo */}
          <div className="space-y-2">
            <Label htmlFor={`${componentId}-bg-color`}>Cor de Fundo</Label>
            <div className="flex gap-2">
              <Input
                id={`${componentId}-bg-color`}
                type="color"
                value={currentProps.backgroundColor}
                onChange={e => handlePropertyChange('backgroundColor', e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={currentProps.backgroundColor}
                onChange={e => handlePropertyChange('backgroundColor', e.target.value)}
                placeholder="#f0f9ff"
                className="flex-1"
              />
            </div>
          </div>

          {/* Cor do texto */}
          <div className="space-y-2">
            <Label htmlFor={`${componentId}-text-color`}>Cor do Texto</Label>
            <div className="flex gap-2">
              <Input
                id={`${componentId}-text-color`}
                type="color"
                value={currentProps.textColor}
                onChange={e => handlePropertyChange('textColor', e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={currentProps.textColor}
                onChange={e => handlePropertyChange('textColor', e.target.value)}
                placeholder="#1e40af"
                className="flex-1"
              />
            </div>
          </div>

          {/* Border radius */}
          <div className="space-y-2">
            <Label>Bordas Arredondadas</Label>
            <div className="px-2">
              <Slider
                value={[currentProps.borderRadius]}
                onValueChange={values => handlePropertyChange('borderRadius', values[0])}
                min={0}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0px</span>
                <span className="font-medium">{currentProps.borderRadius}px</span>
                <span>50px</span>
              </div>
            </div>
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <Label htmlFor={`${componentId}-padding`}>Espaçamento Interno</Label>
            <Input
              id={`${componentId}-padding`}
              value={currentProps.padding}
              onChange={e => handlePropertyChange('padding', e.target.value)}
              placeholder="16px"
            />
          </div>
        </CardContent>
      </Card>

      {/* ✅ 9. CONTROLES DE EFEITOS E ANIMAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Efeitos e Animações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Switch para animações */}
          <div className="flex items-center justify-between">
            <Label htmlFor={`${componentId}-animation`}>Animações Habilitadas</Label>
            <Switch
              id={`${componentId}-animation`}
              checked={currentProps.animation}
              onCheckedChange={value => handlePropertyChange('animation', value)}
            />
          </div>

          {/* Switch para sombra */}
          <div className="flex items-center justify-between">
            <Label htmlFor={`${componentId}-shadow`}>Sombra</Label>
            <Switch
              id={`${componentId}-shadow`}
              checked={currentProps.shadow}
              onCheckedChange={value => handlePropertyChange('shadow', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ✅ 10. INFORMAÇÕES DE DEBUG (MODO DESENVOLVIMENTO) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-gray-50 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono space-y-1">
              <div>Component ID: {componentId}</div>
              <div>Properties Count: {Object.keys(currentProps).length}</div>
              <div>Last Update: {new Date().toLocaleTimeString()}</div>
            </div>
            <details className="mt-2">
              <summary className="text-xs cursor-pointer">Ver JSON das Propriedades</summary>
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                {JSON.stringify(currentProps, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/*
 * ✅ CHECKLIST DE VERIFICAÇÃO DO PAINEL:
 *
 * [x] Função de renderização específica criada
 * [x] Valores padrão definidos
 * [x] Merge com propriedades atuais
 * [x] Debug logs implementados
 * [x] Organização em cards por categoria
 * [x] Controles apropriados por tipo de propriedade
 * [x] Labels descritivos
 * [x] Feedback visual dos valores
 * [x] Função de reset
 * [x] Informações de debug para desenvolvimento
 *
 * INTEGRAÇÃO NECESSÁRIA:
 * 1. Adicionar import no ComponentSpecificPropertiesPanel.tsx
 * 2. Adicionar case no switch para 'example-editable-component'
 * 3. Chamar renderExampleEditableComponentProperties()
 * 4. Testar no painel de propriedades
 */
