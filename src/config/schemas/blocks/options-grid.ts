/**
 * 🎯 SCHEMA: OPTIONS-GRID
 * 
 * Bloco de grid de opções para quiz
 */

import { createSchema } from '../base/builder';
import { titleField, descriptionField } from '../base/presets';
import { BlockFieldSchema } from '../base/types';

// Campo customizado para options-list
const optionsField: BlockFieldSchema = {
  key: 'options',
  label: 'Opções',
  type: 'options-list',
  group: 'content',
  required: true,
  description: 'Lista de opções do quiz. Cada opção pode ter texto, imagem, pontos e categoria.',
  default: [],
  // Define explicitamente o schema dos itens para o editor avançado de arrays
  itemSchema: {
    fields: [
      { key: 'text', label: 'Texto', type: 'text' },
      { key: 'imageUrl', label: 'Imagem (URL)', type: 'text' },
      { key: 'points', label: 'Pontos', type: 'number' },
      { key: 'category', label: 'Categoria', type: 'text' },
    ]
  }
};

// Campo de seleções requeridas
const requiredSelectionsField: BlockFieldSchema<number> = {
  key: 'requiredSelections',
  label: 'Seleções Obrigatórias',
  type: 'number',
  group: 'logic',
  min: 0,
  max: 10,
  default: 1,
  description: 'Número mínimo de opções que devem ser selecionadas',
};

// Campo de seleções múltiplas (alinhado ao componente)
const multipleSelectionField: BlockFieldSchema<boolean> = {
  key: 'multipleSelection',
  label: 'Seleção Múltipla',
  type: 'boolean',
  group: 'logic',
  default: false,
  description: 'Permite selecionar múltiplas opções',
};

// Campo de colunas do grid
const gridColumnsField: BlockFieldSchema<number> = {
  key: 'columns',
  label: 'Colunas do Grid',
  type: 'range',
  group: 'layout',
  min: 1,
  max: 4,
  step: 1,
  default: 2,
  description: 'Número de colunas no layout de grid',
};

// Campo de espaçamento entre itens (alinhado ao componente)
const gridGapField: BlockFieldSchema<number> = {
  key: 'gridGap',
  label: 'Espaçamento',
  type: 'range',
  group: 'layout',
  min: 0,
  max: 50,
  step: 4,
  default: 16,
  description: 'Espaçamento entre as opções em pixels',
};

// Campos de imagem/visual
const showImagesField: BlockFieldSchema<boolean> = {
  key: 'showImages',
  label: 'Mostrar imagens',
  type: 'boolean',
  group: 'content',
  default: true,
  description: 'Exibir imagens nas opções (se disponíveis)'
};

const imageSizeField: BlockFieldSchema<string> = {
  key: 'imageSize',
  label: 'Tamanho da imagem',
  type: 'enum',
  group: 'layout',
  enumValues: ['small', 'medium', 'large', 'custom'],
  default: 'medium',
  description: 'Tamanho padrão das imagens'
};

const imageWidthField: BlockFieldSchema<number> = {
  key: 'imageWidth',
  label: 'Largura (custom)',
  type: 'range',
  group: 'layout',
  min: 16,
  max: 1024,
  step: 4,
  description: 'Largura da imagem quando imageSize = custom',
  when: (values) => values.imageSize === 'custom'
};

const imageHeightField: BlockFieldSchema<number> = {
  key: 'imageHeight',
  label: 'Altura (custom)',
  type: 'range',
  group: 'layout',
  min: 16,
  max: 1024,
  step: 4,
  description: 'Altura da imagem quando imageSize = custom',
  when: (values) => values.imageSize === 'custom'
};

// Slider rápido para tamanho da imagem (quando não estiver em modo custom)
const imageMaxSizeField: BlockFieldSchema<number> = {
  key: 'imageMaxSize',
  label: 'Tamanho da Imagem (px)',
  type: 'range',
  group: 'layout',
  min: 40,
  max: 480,
  step: 8,
  default: 96,
  description: 'Ajuste rápido do tamanho visual das imagens',
  when: (values) => values.showImages !== false && values.imageSize !== 'custom'
};

const imagePositionField: BlockFieldSchema<string> = {
  key: 'imagePosition',
  label: 'Posição da imagem',
  type: 'enum',
  group: 'layout',
  enumValues: ['top', 'left', 'right', 'bottom'],
  default: 'top',
  description: 'Posicionamento da imagem em relação ao texto'
};

const imageLayoutField: BlockFieldSchema<string> = {
  key: 'imageLayout',
  label: 'Layout da imagem',
  type: 'enum',
  group: 'layout',
  enumValues: ['vertical', 'horizontal'],
  default: 'vertical',
  description: 'Organização do cartão (vertical/horizontal)'
};

// Campos de validação/seleção adicionais
const maxSelectionsField: BlockFieldSchema<number> = {
  key: 'maxSelections',
  label: 'Seleções Máximas',
  type: 'number',
  group: 'logic',
  min: 1,
  max: 12,
  default: 1,
  description: 'Número máximo de opções que podem ser selecionadas'
};

const allowDeselectionField: BlockFieldSchema<boolean> = {
  key: 'allowDeselection',
  label: 'Permitir desselecionar',
  type: 'boolean',
  group: 'logic',
  default: true,
  description: 'Permitir remover uma opção já selecionada'
};

export const optionsGridSchema = createSchema('options-grid', 'Grid de Opções')
  .description('Grid de opções com imagens para quiz interativo')
  .category('quiz')
  .icon('Grid')
  .addGroup('content', 'Conteúdo', { order: 1 })
  .addGroup('logic', 'Lógica', { order: 2 })
  .addGroup('layout', 'Layout', { order: 3 })
  .addFields(
    titleField('content'),
    descriptionField('content'),
    optionsField,
    showImagesField,
    // Compatibilidade com JSON v3 (campos no content)
    { key: 'minSelections', label: 'Mínimo de Seleções', type: 'number', group: 'content', min: 0, max: 12, default: 1 },
    { key: 'autoAdvance', label: 'Avanço Automático', type: 'boolean', group: 'content', default: false },
    { key: 'autoAdvanceDelay', label: 'Delay do Avanço (ms)', type: 'number', group: 'content', min: 0, max: 60000, default: 0 },
    { key: 'validationMessage', label: 'Mensagem de Validação', type: 'string', group: 'content', placeholder: 'Selecione N opções para continuar' }
  )
  .addFields(
    requiredSelectionsField,
    maxSelectionsField,
    multipleSelectionField,
    allowDeselectionField
  )
  .addFields(
    gridColumnsField,
    gridGapField,
    imageSizeField,
    imageMaxSizeField,
    imageWidthField,
    imageHeightField,
    imagePositionField,
    imageLayoutField
  )
  .version('2.2.0')
  .build();
