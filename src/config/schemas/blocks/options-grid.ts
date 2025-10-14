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

// Campo de seleções múltiplas
const multipleSelectField: BlockFieldSchema<boolean> = {
  key: 'multipleSelect',
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
  type: 'number',
  group: 'layout',
  min: 1,
  max: 4,
  default: 2,
  description: 'Número de colunas no layout de grid',
};

// Campo de espaçamento entre itens
const gapField: BlockFieldSchema<number> = {
  key: 'gap',
  label: 'Espaçamento',
  type: 'number',
  group: 'layout',
  min: 0,
  max: 50,
  step: 4,
  default: 16,
  description: 'Espaçamento entre as opções em pixels',
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
    optionsField
  )
  .addFields(
    requiredSelectionsField,
    multipleSelectField
  )
  .addFields(
    gridColumnsField,
    gapField
  )
  .version('2.0.0')
  .build();
