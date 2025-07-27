
import React from 'react';
import { Block } from '@/types/editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { QuestionPropertiesPanel } from '../../properties/QuestionPropertiesPanel';

interface ContentPropertiesEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

export function ContentPropertiesEditor({ block, onUpdate }: ContentPropertiesEditorProps) {
  const isQuizQuestionBlock = block.type === 'quiz-question' || 
                              block.type === 'quiz-question-configurable' ||
                              block.type === 'QuizQuestionBlock' ||
                              block.type === 'QuizQuestionBlockConfigurable';

  if (isQuizQuestionBlock) {
    return (
      <QuestionPropertiesPanel
        selectedBlock={block}
        onBlockPropertyChange={(property, value) => {
          onUpdate({ [property]: value });
        }}
        onNestedPropertyChange={(path, value) => {
          const pathArray = path.split('.');
          const updatedContent = { ...block.content };
          let current = updatedContent;
          
          for (let i = 0; i < pathArray.length - 1; i++) {
            if (!current[pathArray[i]]) {
              current[pathArray[i]] = {};
            }
            current = current[pathArray[i]];
          }
          
          current[pathArray[pathArray.length - 1]] = value;
          onUpdate(updatedContent);
        }}
      />
    );
  }

  switch (block.type) {
    case 'headline':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Digite o título..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={block.content?.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Digite o subtítulo..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Nível do Título</Label>
            <Select
              value={block.content?.level?.toString() || '1'}
              onValueChange={(value) => onUpdate({ level: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      
    case 'text':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Texto</Label>
            <Textarea
              id="text"
              value={block.content?.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Digite o texto..."
              rows={6}
            />
          </div>
        </div>
      );
      
    case 'image':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={block.content?.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageAlt">Texto Alternativo</Label>
            <Input
              id="imageAlt"
              value={block.content?.imageAlt || ''}
              onChange={(e) => onUpdate({ imageAlt: e.target.value })}
              placeholder="Descrição da imagem para acessibilidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Legenda</Label>
            <Input
              id="caption"
              value={block.content?.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Legenda da imagem"
            />
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buttonText">Texto do Botão</Label>
            <Input
              id="buttonText"
              value={block.content?.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Clique aqui"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonUrl">URL de Destino</Label>
            <Input
              id="buttonUrl"
              value={block.content?.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Estilo do Botão</Label>
            <Select
              value={block.content?.variant || 'default'}
              onValueChange={(value) => onUpdate({ variant: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão</SelectItem>
                <SelectItem value="outline">Contorno</SelectItem>
                <SelectItem value="ghost">Fantasma</SelectItem>
                <SelectItem value="destructive">Destrutivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spacerHeight">Altura do Espaçador (px)</Label>
            <Input
              id="spacerHeight"
              type="number"
              value={block.content?.height || 50}
              onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
              placeholder="50"
            />
          </div>
        </div>
      );

    case 'benefits':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="benefitsTitle">Título dos Benefícios</Label>
            <Input
              id="benefitsTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Por que escolher nosso produto?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefitsItems">Lista de Benefícios (um por linha)</Label>
            <Textarea
              id="benefitsItems"
              value={block.content?.items?.join('\n') || ''}
              onChange={(e) => onUpdate({ items: e.target.value.split('\n').filter(item => item.trim()) })}
              placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3"
              rows={5}
            />
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testimonialsTitle">Título dos Depoimentos</Label>
            <Input
              id="testimonialsTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="O que nossos clientes dizem"
            />
          </div>
          <div className="p-4 border rounded-md bg-[#FAF9F7]">
            <p className="text-sm text-[#8F7A6A]">
              Os depoimentos são gerenciados no banco de dados. 
              Use o painel administrativo para adicionar ou editar depoimentos.
            </p>
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pricingTitle">Título do Preço</Label>
            <Input
              id="pricingTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Investimento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              value={block.content?.price || ''}
              onChange={(e) => onUpdate({ price: e.target.value })}
              placeholder="R$ 297,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Preço Original</Label>
            <Input
              id="originalPrice"
              value={block.content?.originalPrice || ''}
              onChange={(e) => onUpdate({ originalPrice: e.target.value })}
              placeholder="R$ 497,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelamento</Label>
            <Input
              id="installments"
              value={block.content?.installments || ''}
              onChange={(e) => onUpdate({ installments: e.target.value })}
              placeholder="12x de R$ 29,70"
            />
          </div>
        </div>
      );

    case 'guarantee':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guaranteeTitle">Título da Garantia</Label>
            <Input
              id="guaranteeTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Garantia de 30 dias"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guaranteeText">Texto da Garantia</Label>
            <Textarea
              id="guaranteeText"
              value={block.content?.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Descrição da garantia oferecida..."
              rows={4}
            />
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ctaTitle">Título da CTA</Label>
            <Input
              id="ctaTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Não perca esta oportunidade!"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaText">Texto do Botão</Label>
            <Input
              id="ctaText"
              value={block.content?.buttonText || ''}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              placeholder="Quero garantir minha vaga!"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaUrl">URL de Destino</Label>
            <Input
              id="ctaUrl"
              value={block.content?.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://checkout.exemplo.com"
            />
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL do Vídeo</Label>
            <Input
              id="videoUrl"
              value={block.content?.videoUrl || ''}
              onChange={(e) => onUpdate({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/embed/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Título do Vídeo</Label>
            <Input
              id="videoTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Título do vídeo"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoplay"
              checked={block.content?.autoplay || false}
              onCheckedChange={(checked) => onUpdate({ autoplay: checked })}
            />
            <Label htmlFor="autoplay">Reprodução automática</Label>
          </div>
        </div>
      );

    case 'two-column':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leftContent">Conteúdo da Coluna Esquerda</Label>
            <Textarea
              id="leftContent"
              value={block.content?.leftContent || ''}
              onChange={(e) => onUpdate({ leftContent: e.target.value })}
              placeholder="Conteúdo da coluna esquerda..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rightContent">Conteúdo da Coluna Direita</Label>
            <Textarea
              id="rightContent"
              value={block.content?.rightContent || ''}
              onChange={(e) => onUpdate({ rightContent: e.target.value })}
              placeholder="Conteúdo da coluna direita..."
              rows={4}
            />
          </div>
        </div>
      );

    case 'quiz-start-page':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quizTitle">Título do Quiz</Label>
            <Input
              id="quizTitle"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Descubra seu estilo pessoal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quizDescription">Descrição do Quiz</Label>
            <Textarea
              id="quizDescription"
              value={block.content?.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Responda às perguntas para descobrir..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startButtonText">Texto do Botão Iniciar</Label>
            <Input
              id="startButtonText"
              value={block.content?.buttonText || ''}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              placeholder="Começar Quiz"
            />
          </div>
        </div>
      );

    case 'options-grid':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gridColumns">Número de Colunas</Label>
            <Select
              value={block.content?.columns?.toString() || '2'}
              onValueChange={(value) => onUpdate({ columns: parseInt(value) })}
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
          <div className="space-y-2">
            <Label htmlFor="gridGap">Espaçamento entre itens</Label>
            <Select
              value={block.content?.gap || 'medium'}
              onValueChange={(value) => onUpdate({ gap: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o espaçamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Pequeno</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="p-4 border border-[#B89B7A]/20 rounded-md bg-[#FAF9F7]">
          <p className="text-[#8F7A6A]">
            Editor de propriedades não implementado para o tipo: <strong>{block.type}</strong>
          </p>
          <p className="text-sm text-[#8F7A6A] mt-2">
            Este tipo de bloco pode ser adicionado à página, mas suas propriedades 
            específicas precisam ser configuradas via código.
          </p>
        </div>
      );
  }
}
