import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PropertyArrayEditor } from './components/PropertyArrayEditor';
import { PropertySelect } from './components/PropertySelect';
import { PropertyNumber } from './components/PropertyNumber';
import { PropertyCheckbox } from './components/PropertyCheckbox';
import { Trash2 } from 'lucide-react';

interface Props {
  block: any;
  onUpdate: (updates: Record<string, any>) => void;
  onDelete?: () => void;
}

/**
 * Painel especializado para editar questões do quiz com imagens e textos.
 * Suporta título, opções (com miniaturas + texto), layout, validação e visuais.
 */
export const QuizQuestionPropertiesPanel: React.FC<Props> = ({ block, onUpdate, onDelete }) => {
  const props = block?.properties || {};

  // Chaves compatíveis entre variantes (title vs question)
  const titleValue: string = props.title ?? props.question ?? '';

  const handleProp = useCallback(
    (key: string, value: any) => {
      // Atualiza título em ambas as chaves para compatibilidade
      if (key === 'title' || key === 'question') {
        onUpdate({ title: value, question: value });
      } else {
        onUpdate({ [key]: value });
      }
    },
    [onUpdate]
  );

  const currentOptions = useMemo(() => {
    // Normaliza origem: properties.options ou properties.items
    return Array.isArray(props.options) ? props.options : Array.isArray(props.items) ? props.items : [];
  }, [props.options, props.items]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho básico */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pergunta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-sm">Título da questão</Label>
            <Input
              value={titleValue}
              placeholder="Ex: Qual desses estilos você prefere?"
              onChange={e => handleProp('title', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Opções com miniaturas e texto */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Opções</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PropertyArrayEditor
            label="Lista de Opções"
            value={currentOptions}
            onChange={value => {
              // Sincroniza para 'options' (preferência) e mantém 'items' quando necessário
              onUpdate({ options: value, items: value });
            }}
            itemLabel="Opção"
            maxItems={12}
            required
            showImages
            showDescriptions
            layout="detailed"
          />
        </CardContent>
      </Card>

      {/* Layout e disposição */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Layout</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <PropertyNumber
            label="Número de colunas"
            value={props.columns ?? 2}
            onChange={v => handleProp('columns', v)}
            min={1}
            max={4}
            step={1}
          />
          <PropertyCheckbox
            label="Colunas responsivas"
            value={props.responsiveColumns ?? true}
            onChange={v => handleProp('responsiveColumns', v)}
          />
          <PropertySelect
            label="Modo de conteúdo"
            value={props.contentMode ?? 'text-and-image'}
            onChange={v => handleProp('contentMode', v)}
            options={['text-and-image', 'image-only', 'text-only']}
            required
          />
          <PropertySelect
            label="Posição da imagem"
            value={props.imagePosition ?? 'top'}
            onChange={v => handleProp('imagePosition', v)}
            options={['top', 'left', 'right', 'bottom']}
          />
          <PropertySelect
            label="Layout da opção"
            value={props.imageLayout ?? 'vertical'}
            onChange={v => handleProp('imageLayout', v)}
            options={['vertical', 'horizontal']}
          />
        </CardContent>
      </Card>

      {/* Validação e comportamento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Validação e comportamento</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <PropertyCheckbox
            label="Permitir múltiplas seleções"
            value={props.multipleSelection ?? false}
            onChange={v => handleProp('multipleSelection', v)}
          />
          <PropertyNumber
            label="Mínimo de seleções"
            value={props.minSelections ?? 1}
            onChange={v => handleProp('minSelections', v)}
            min={0}
            max={10}
            step={1}
          />
          <PropertyNumber
            label="Máximo de seleções"
            value={props.maxSelections ?? 1}
            onChange={v => handleProp('maxSelections', v)}
            min={1}
            max={10}
            step={1}
          />
          <PropertyNumber
            label="Seleções obrigatórias"
            value={props.requiredSelections ?? 1}
            onChange={v => handleProp('requiredSelections', v)}
            min={0}
            max={10}
            step={1}
          />
        </CardContent>
      </Card>

      {/* Visual */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Visual</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <PropertyNumber
            label="Espaçamento entre opções (px)"
            value={props.gridGap ?? 16}
            onChange={v => handleProp('gridGap', v)}
            min={0}
            max={48}
            step={2}
          />
          <PropertyNumber
            label="Borda (raio em px)"
            value={props.borderRadius ?? 8}
            onChange={v => handleProp('borderRadius', v)}
            min={0}
            max={32}
            step={1}
          />
        </CardContent>
      </Card>

      {onDelete && (
        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Excluir bloco
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionPropertiesPanel;
