/**
 * ❓ QUESTION BLOCK SCHEMAS
 * Schemas para blocos de perguntas, opções e inputs
 */

import type { BlockSchemaRecord } from './types';
import { COMMON_FIELDS } from './types';

export const questionSchemas: BlockSchemaRecord = {
  'question-title-inline': {
    label: 'Título da Pergunta',
    fields: [
      { key: 'text', label: 'Texto', type: 'textarea', required: true },
      { key: 'questionNumber', label: 'Número da Pergunta', type: 'number' },
      { key: 'showNumber', label: 'Mostrar Número', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.alignment },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'select', options: [
        { label: 'Pequeno', value: 'sm' },
        { label: 'Médio', value: 'md' },
        { label: 'Grande', value: 'lg' },
        { label: 'Extra Grande', value: 'xl' },
      ], defaultValue: 'lg' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'options-grid-inline': {
    label: 'Grid de Opções',
    fields: [
      { key: 'options', label: 'Opções (JSON)', type: 'json', required: true, defaultValue: [] },
      { key: 'columns', label: 'Colunas', type: 'number', defaultValue: 2 },
      { key: 'gap', label: 'Espaçamento', type: 'number', defaultValue: 16 },
      { key: 'multiSelect', label: 'Seleção Múltipla', type: 'boolean', defaultValue: false },
      { key: 'maxSelections', label: 'Máximo de Seleções', type: 'number', defaultValue: 1 },
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', defaultValue: true },
      { key: 'showLabels', label: 'Mostrar Labels', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'option-card-inline': {
    label: 'Card de Opção',
    fields: [
      { key: 'id', label: 'ID', type: 'text', required: true },
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'imageUrl', label: 'URL da Imagem', type: 'text' },
      { key: 'value', label: 'Valor', type: 'text' },
      { key: 'selected', label: 'Selecionado', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: 'Desabilitado', type: 'boolean', defaultValue: false },
      { ...COMMON_FIELDS.scale },
    ],
  },

  'input-field-inline': {
    label: 'Campo de Input',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'type', label: 'Tipo', type: 'select', options: [
        { label: 'Texto', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Telefone', value: 'tel' },
        { label: 'Número', value: 'number' },
      ], defaultValue: 'text' },
      { key: 'required', label: 'Obrigatório', type: 'boolean', defaultValue: false },
      { key: 'maxLength', label: 'Máximo de Caracteres', type: 'number' },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'name-input-inline': {
    label: 'Input de Nome',
    fields: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Qual seu nome?' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Digite seu nome...' },
      { key: 'required', label: 'Obrigatório', type: 'boolean', defaultValue: true },
      { key: 'minLength', label: 'Mínimo de Caracteres', type: 'number', defaultValue: 2 },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },

  'email-capture-inline': {
    label: 'Captura de Email',
    fields: [
      { key: 'title', label: 'Título', type: 'text', defaultValue: 'Receba seu resultado' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'seu@email.com' },
      { key: 'buttonText', label: 'Texto do Botão', type: 'text', defaultValue: 'Continuar' },
      { key: 'required', label: 'Obrigatório', type: 'boolean', defaultValue: true },
      { key: 'showPrivacyNote', label: 'Mostrar Nota de Privacidade', type: 'boolean', defaultValue: true },
      { ...COMMON_FIELDS.marginTop },
      { ...COMMON_FIELDS.marginBottom },
    ],
  },
};
