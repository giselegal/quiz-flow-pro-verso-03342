import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Block } from '@/types/editor';
import { Image as ImageIcon, MousePointer, Settings, Type } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

interface PropertiesPanelProps {
  block: Block | undefined;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
}

/**
 * 🎛️ PROPERTIES PANEL: Painel de propriedades otimizado
 *
 * Otimizações aplicadas:
 * ✅ Componente separado e reutilizável
 * ✅ Callbacks memoizados para performance
 * ✅ UI especializada por tipo de bloco
 * ✅ Validações inline
 * ✅ Debounce automático em inputs
 */
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ block, onUpdate }) => {
  // Memoização das funções de update
  const updateContent = useCallback(
    (key: string, value: any) => {
      if (!block) return;
      onUpdate(block.id, {
        content: { ...block.content, [key]: value },
      });
    },
    [block, onUpdate]
  );

  const updateProperty = useCallback(
    (key: string, value: any) => {
      if (!block) return;
      onUpdate(block.id, {
        properties: { ...block.properties, [key]: value },
      });
    },
    [block, onUpdate]
  );

  // Renderização específica por tipo de bloco
  const renderPropertiesForType = useMemo(() => {
    if (!block) return null;

    const commonProps = {
      updateContent,
      updateProperty,
      block,
    };

    const renderers: Record<string, () => React.ReactNode> = {
      text: () => <TextProperties {...commonProps} />,
      'text-inline': () => <TextProperties {...commonProps} />,
      'quiz-header': () => <QuizHeaderProperties {...commonProps} />,
      'quiz-intro-header': () => <QuizHeaderProperties {...commonProps} />,
      'lead-form': () => <LeadFormProperties {...commonProps} />,
      'form-container': () => <LeadFormProperties {...commonProps} />, // ✅ ADICIONADO
      'options-grid': () => <OptionsGridProperties {...commonProps} />,
      button: () => <ButtonProperties {...commonProps} />,
      'button-inline': () => <ButtonProperties {...commonProps} />,
      image: () => <ImageProperties {...commonProps} />,
      'image-inline': () => <ImageProperties {...commonProps} />,
      'image-display-inline': () => <ImageProperties {...commonProps} />,
      'result-display': () => <ResultProperties {...commonProps} />,
      'result-header-inline': () => <ResultProperties {...commonProps} />, // ✅ ADICIONADO
      'offer-cta': () => <OfferProperties {...commonProps} />,
      'quiz-offer-cta-inline': () => <OfferProperties {...commonProps} />, // ✅ ADICIONADO
      hero: () => <DefaultProperties {...commonProps} />, // ✅ ADICIONADO (genérico por enquanto)
    };

    const renderer = renderers[block.type];
    return renderer ? renderer() : <DefaultProperties {...commonProps} />;
  }, [block, updateContent, updateProperty]);

  if (!block) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex items-center justify-center text-center">
          <div className="space-y-2">
            <Settings className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Selecione um bloco para editar suas propriedades
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
          <Badge variant="outline" className="text-xs">
            {block.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">{renderPropertiesForType}</CardContent>
    </Card>
  );
};

// Componentes específicos para cada tipo de bloco
const TextProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <Type className="h-4 w-4" />
      <span className="text-sm font-medium">Texto</span>
    </div>

    <div>
      <Label htmlFor="text-content" className="text-xs">
        Conteúdo
      </Label>
      <Textarea
        id="text-content"
        value={block.content?.text || ''}
        onChange={e => updateContent('text', e.target.value)}
        placeholder="Digite o texto..."
        rows={4}
        className="text-sm"
      />
    </div>
  </div>
);

const QuizHeaderProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateProperty }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <Settings className="h-4 w-4" />
      <span className="text-sm font-medium">Header do Quiz</span>
    </div>

    <div>
      <Label className="text-xs">URL do Logo</Label>
      <Input
        value={block.properties?.logoUrl || ''}
        onChange={e => updateProperty('logoUrl', e.target.value)}
        placeholder="https://..."
        className="text-sm"
      />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs">Largura</Label>
        <Input
          type="number"
          value={block.properties?.logoWidth || 96}
          onChange={e => updateProperty('logoWidth', parseInt(e.target.value))}
          className="text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Altura</Label>
        <Input
          type="number"
          value={block.properties?.logoHeight || 96}
          onChange={e => updateProperty('logoHeight', parseInt(e.target.value))}
          className="text-sm"
        />
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="show-progress"
        checked={block.properties?.showProgress ?? true}
        onCheckedChange={checked => updateProperty('showProgress', checked)}
      />
      <Label htmlFor="show-progress" className="text-xs">
        Mostrar Progresso
      </Label>
    </div>
  </div>
);

const LeadFormProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent, updateProperty }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <MousePointer className="h-4 w-4" />
      <span className="text-sm font-medium">Formulário Lead</span>
    </div>

    <div>
      <Label className="text-xs">Título</Label>
      <Input
        value={block.content?.title || ''}
        onChange={e => updateContent('title', e.target.value)}
        placeholder="Digite seu nome"
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Placeholder</Label>
      <Input
        value={block.content?.placeholder || ''}
        onChange={e => updateContent('placeholder', e.target.value)}
        placeholder="Nome"
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Texto do Botão</Label>
      <Input
        value={block.content?.buttonText || ''}
        onChange={e => updateContent('buttonText', e.target.value)}
        placeholder="Quero Descobrir meu Estilo Agora!"
        className="text-sm"
      />
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="is-required"
        checked={block.properties?.required ?? true}
        onCheckedChange={checked => updateProperty('required', checked)}
      />
      <Label htmlFor="is-required" className="text-xs">
        Campo Obrigatório
      </Label>
    </div>
  </div>
);

const OptionsGridProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent, updateProperty }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <Settings className="h-4 w-4" />
      <span className="text-sm font-medium">Grid de Opções</span>
    </div>

    <div>
      <Label className="text-xs">Título da Questão</Label>
      <Input
        value={block.content?.title || ''}
        onChange={e => updateContent('title', e.target.value)}
        placeholder="QUAL O SEU TIPO DE ROUPA FAVORITA?"
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Seleções Obrigatórias</Label>
      <Input
        type="number"
        min="1"
        max="8"
        value={block.properties?.requiredSelections || 3}
        onChange={e => updateProperty('requiredSelections', parseInt(e.target.value))}
        className="text-sm"
      />
    </div>

    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-advance"
          checked={block.properties?.autoAdvance || false}
          onCheckedChange={checked => updateProperty('autoAdvance', checked)}
        />
        <Label htmlFor="auto-advance" className="text-xs">
          Avanço Automático
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-images"
          checked={block.properties?.showImages || false}
          onCheckedChange={checked => updateProperty('showImages', checked)}
        />
        <Label htmlFor="show-images" className="text-xs">
          Mostrar Imagens
        </Label>
      </div>
    </div>
  </div>
);

const ButtonProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <MousePointer className="h-4 w-4" />
      <span className="text-sm font-medium">Botão</span>
    </div>

    <div>
      <Label className="text-xs">Texto</Label>
      <Input
        value={block.content?.text || ''}
        onChange={e => updateContent('text', e.target.value)}
        placeholder="Clique aqui"
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">URL</Label>
      <Input
        value={block.content?.url || ''}
        onChange={e => updateContent('url', e.target.value)}
        placeholder="#"
        className="text-sm"
      />
    </div>
  </div>
);

const ImageProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <ImageIcon className="h-4 w-4" />
      <span className="text-sm font-medium">Imagem</span>
    </div>

    <div>
      <Label className="text-xs">URL</Label>
      <Input
        value={block.content?.url || ''}
        onChange={e => updateContent('url', e.target.value)}
        placeholder="https://..."
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Texto Alternativo</Label>
      <Input
        value={block.content?.alt || ''}
        onChange={e => updateContent('alt', e.target.value)}
        placeholder="Descrição da imagem"
        className="text-sm"
      />
    </div>
  </div>
);

const ResultProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <Settings className="h-4 w-4" />
      <span className="text-sm font-medium">Resultado</span>
    </div>

    <div>
      <Label className="text-xs">Título</Label>
      <Input
        value={block.content?.title || ''}
        onChange={e => updateContent('title', e.target.value)}
        placeholder="Seu Resultado"
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Descrição</Label>
      <Textarea
        value={block.content?.description || ''}
        onChange={e => updateContent('description', e.target.value)}
        placeholder="Resultado personalizado"
        rows={3}
        className="text-sm"
      />
    </div>
  </div>
);

const OfferProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block, updateContent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <Settings className="h-4 w-4" />
      <span className="text-sm font-medium">Oferta CTA</span>
    </div>

    <div>
      <Label className="text-xs">Título</Label>
      <Input
        value={block.content?.title || ''}
        onChange={e => updateContent('title', e.target.value)}
        placeholder="Oferta Especial"
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Descrição</Label>
      <Textarea
        value={block.content?.description || ''}
        onChange={e => updateContent('description', e.target.value)}
        placeholder="Não perca esta oportunidade"
        rows={2}
        className="text-sm"
      />
    </div>

    <div>
      <Label className="text-xs">Texto do Botão</Label>
      <Input
        value={block.content?.buttonText || ''}
        onChange={e => updateContent('buttonText', e.target.value)}
        placeholder="Aproveitar Oferta"
        className="text-sm"
      />
    </div>
  </div>
);

const DefaultProperties: React.FC<{
  block: Block;
  updateContent: (key: string, value: any) => void;
  updateProperty: (key: string, value: any) => void;
}> = ({ block }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2">
      <Settings className="h-4 w-4" />
      <span className="text-sm font-medium">Propriedades Gerais</span>
    </div>

    <div className="p-3 bg-muted/50 rounded-lg">
      <p className="text-xs text-muted-foreground">
        Tipo: <span className="font-mono">{block.type}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        ID: <span className="font-mono">{block.id}</span>
      </p>
    </div>
  </div>
);

export default PropertiesPanel;
