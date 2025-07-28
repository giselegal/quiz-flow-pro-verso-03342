
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';
import { QuestionPropertiesPanel } from '@/components/editor/properties/QuestionPropertiesPanel';

interface ContentPropertiesEditorProps {
  block: Block;
  onUpdate: (updates: any) => void;
}

export function ContentPropertiesEditor({ block, onUpdate }: ContentPropertiesEditorProps) {
  const { content = {}, type } = block;

  // Para blocos de quiz-question-configurable, usar o painel especializado
  if (type === 'quiz-question-configurable') {
    return (
      <QuestionPropertiesPanel
        block={block}
        onUpdate={onUpdate}
      />
    );
  }

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const renderBasicFields = () => (
    <>
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Digite o título"
        />
      </div>

      {/* Subtítulo */}
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          value={content.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          placeholder="Digite o subtítulo"
        />
      </div>

      {/* Texto */}
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={content.text || ''}
          onChange={(e) => handleInputChange('text', e.target.value)}
          placeholder="Digite o texto"
          rows={4}
        />
      </div>
    </>
  );

  const renderImageFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={content.imageUrl || content.src || ''}
          onChange={(e) => handleInputChange('imageUrl', e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alt">Texto Alternativo</Label>
        <Input
          id="alt"
          value={content.alt || ''}
          onChange={(e) => handleInputChange('alt', e.target.value)}
          placeholder="Descrição da imagem"
        />
      </div>
    </>
  );

  const renderButtonFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={content.buttonText || content.text || ''}
          onChange={(e) => handleInputChange('buttonText', e.target.value)}
          placeholder="Clique aqui"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="buttonUrl">URL do Botão</Label>
        <Input
          id="buttonUrl"
          value={content.buttonUrl || content.href || ''}
          onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
          placeholder="https://exemplo.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="variant">Estilo do Botão</Label>
        <Select 
          value={content.variant || 'primary'}
          onValueChange={(value) => handleInputChange('variant', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estilo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primário</SelectItem>
            <SelectItem value="secondary">Secundário</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
            <SelectItem value="ghost">Fantasma</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderVideoFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Vídeo</Label>
        <Input
          id="videoUrl"
          value={content.videoUrl || content.src || ''}
          onChange={(e) => handleInputChange('videoUrl', e.target.value)}
          placeholder="https://youtube.com/embed/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="autoplay">Reprodução Automática</Label>
        <Switch
          checked={content.autoplay || false}
          onCheckedChange={(checked) => handleInputChange('autoplay', checked)}
        />
      </div>
    </>
  );

  const renderSpacerFields = () => (
    <div className="space-y-2">
      <Label htmlFor="height">Altura do Espaçador</Label>
      <Select 
        value={content.height || 'medium'}
        onValueChange={(value) => handleInputChange('height', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a altura" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">Pequeno (20px)</SelectItem>
          <SelectItem value="medium">Médio (40px)</SelectItem>
          <SelectItem value="large">Grande (80px)</SelectItem>
          <SelectItem value="xlarge">Extra Grande (120px)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderListFields = () => (
    <div className="space-y-2">
      <Label htmlFor="items">Itens da Lista</Label>
      <Textarea
        id="items"
        value={content.items ? content.items.join('\n') : ''}
        onChange={(e) => handleInputChange('items', e.target.value.split('\n').filter(Boolean))}
        placeholder="Digite cada item em uma linha"
        rows={6}
      />
    </div>
  );

  const renderTwoColumnFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="leftContent">Conteúdo da Coluna Esquerda</Label>
        <Textarea
          id="leftContent"
          value={content.leftContent || ''}
          onChange={(e) => handleInputChange('leftContent', e.target.value)}
          placeholder="Conteúdo da coluna esquerda"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rightContent">Conteúdo da Coluna Direita</Label>
        <Textarea
          id="rightContent"
          value={content.rightContent || ''}
          onChange={(e) => handleInputChange('rightContent', e.target.value)}
          placeholder="Conteúdo da coluna direita"
          rows={4}
        />
      </div>
    </>
  );

  // Renderizar campos específicos baseado no tipo
  switch (type) {
    case 'header':
    case 'headline':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          <div className="space-y-2">
            <Label htmlFor="level">Nível do Título</Label>
            <Select 
              value={content.level?.toString() || '1'}
              onValueChange={(value) => handleInputChange('level', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1 - Título Principal</SelectItem>
                <SelectItem value="2">H2 - Subtítulo</SelectItem>
                <SelectItem value="3">H3 - Título Menor</SelectItem>
                <SelectItem value="4">H4 - Título Pequeno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          {renderImageFields()}
        </div>
      );

    case 'button':
    case 'cta':
      return (
        <div className="space-y-4">
          {renderButtonFields()}
        </div>
      );

    case 'video':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          {renderVideoFields()}
        </div>
      );

    case 'spacer':
      return (
        <div className="space-y-4">
          {renderSpacerFields()}
        </div>
      );

    case 'benefits':
    case 'testimonials':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          {renderListFields()}
        </div>
      );

    case 'two-column':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          {renderTwoColumnFields()}
        </div>
      );

    case 'options-grid':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          <div className="space-y-2">
            <Label htmlFor="columns">Número de Colunas</Label>
            <Select 
              value={content.columns?.toString() || '2'}
              onValueChange={(value) => handleInputChange('columns', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o número de colunas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Coluna</SelectItem>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
                <SelectItem value="4">4 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderListFields()}
        </div>
      );

    case 'pricing':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              value={content.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="R$ 97,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Preço Original</Label>
            <Input
              id="originalPrice"
              value={content.originalPrice || ''}
              onChange={(e) => handleInputChange('originalPrice', e.target.value)}
              placeholder="R$ 197,00"
            />
          </div>
        </div>
      );

    case 'guarantee':
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          <div className="space-y-2">
            <Label htmlFor="period">Período de Garantia</Label>
            <Input
              id="period"
              value={content.period || ''}
              onChange={(e) => handleInputChange('period', e.target.value)}
              placeholder="30 dias"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          {renderBasicFields()}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Tipo de bloco: <strong>{type}</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Propriedades básicas disponíveis para edição.
            </p>
          </div>
        </div>
      );
  }
}
