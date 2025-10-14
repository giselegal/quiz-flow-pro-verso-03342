/**
 * 🎨 FIELD PRESETS - Campos Reutilizáveis
 * 
 * Coleção de configurações de campos pré-definidas para garantir
 * consistência e reduzir duplicação de código.
 */

import { BlockFieldSchema } from './types';

/**
 * ============================================================================
 * PRESETS DE CONTEÚDO
 * ============================================================================
 */

export const titleField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'title',
  label: 'Título',
  type: 'string',
  group,
  placeholder: 'Digite o título',
  required: true,
});

export const subtitleField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'subtitle',
  label: 'Subtítulo',
  type: 'string',
  group,
  placeholder: 'Digite o subtítulo',
});

export const descriptionField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'description',
  label: 'Descrição',
  type: 'richtext',
  group,
  placeholder: 'Digite a descrição',
  rows: 4,
});

export const textField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'text',
  label: 'Texto',
  type: 'string',
  group,
  placeholder: 'Digite o texto',
});

export const headlineField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'headline',
  label: 'Headline',
  type: 'string',
  group,
  placeholder: 'Digite o headline principal',
  required: true,
});

export const labelField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'label',
  label: 'Label',
  type: 'string',
  group,
  placeholder: 'Digite o label',
});

/**
 * ============================================================================
 * PRESETS DE IMAGEM
 * ============================================================================
 */

export const imageUrlField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'imageUrl',
  label: 'URL da Imagem',
  type: 'string',
  group,
  placeholder: 'https://exemplo.com/imagem.jpg',
});

export const imageAltField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'imageAlt',
  label: 'Texto Alternativo',
  type: 'string',
  group,
  placeholder: 'Descrição da imagem',
  description: 'Texto para acessibilidade',
});

/**
 * ============================================================================
 * PRESETS DE ESTILO
 * ============================================================================
 */

export const backgroundColorField = (group = 'style'): BlockFieldSchema<string> => ({
  key: 'backgroundColor',
  label: 'Cor de Fundo',
  type: 'color',
  group,
  default: '#ffffff',
});

export const textColorField = (group = 'style'): BlockFieldSchema<string> => ({
  key: 'textColor',
  label: 'Cor do Texto',
  type: 'color',
  group,
  default: '#000000',
});

export const borderColorField = (group = 'style'): BlockFieldSchema<string> => ({
  key: 'borderColor',
  label: 'Cor da Borda',
  type: 'color',
  group,
  default: '#e5e7eb',
});

export const borderRadiusField = (group = 'style'): BlockFieldSchema<number> => ({
  key: 'borderRadius',
  label: 'Raio da Borda',
  type: 'number',
  group,
  min: 0,
  max: 50,
  step: 1,
  default: 8,
  description: 'Em pixels',
});

export const fontSizeField = (group = 'style'): BlockFieldSchema<number> => ({
  key: 'fontSize',
  label: 'Tamanho da Fonte',
  type: 'number',
  group,
  min: 8,
  max: 72,
  step: 1,
  default: 16,
  description: 'Em pixels',
});

export const fontWeightField = (group = 'style'): BlockFieldSchema<string> => ({
  key: 'fontWeight',
  label: 'Peso da Fonte',
  type: 'select',
  group,
  enumValues: ['normal', 'medium', 'semibold', 'bold'],
  default: 'normal',
});

/**
 * ============================================================================
 * PRESETS DE LAYOUT
 * ============================================================================
 */

export const alignmentField = (group = 'layout'): BlockFieldSchema<string> => ({
  key: 'alignment',
  label: 'Alinhamento',
  type: 'select',
  group,
  enumValues: ['left', 'center', 'right'],
  default: 'center',
});

export const paddingField = (group = 'layout'): BlockFieldSchema<number> => ({
  key: 'padding',
  label: 'Espaçamento Interno',
  type: 'number',
  group,
  min: 0,
  max: 100,
  step: 4,
  default: 16,
  description: 'Em pixels',
});

export const marginField = (group = 'layout'): BlockFieldSchema<number> => ({
  key: 'margin',
  label: 'Espaçamento Externo',
  type: 'number',
  group,
  min: 0,
  max: 100,
  step: 4,
  default: 0,
  description: 'Em pixels',
});

export const widthField = (group = 'layout'): BlockFieldSchema<string> => ({
  key: 'width',
  label: 'Largura',
  type: 'select',
  group,
  enumValues: ['full', 'auto', 'fit'],
  default: 'auto',
});

export const heightField = (group = 'layout'): BlockFieldSchema<number> => ({
  key: 'height',
  label: 'Altura',
  type: 'number',
  group,
  min: 0,
  max: 1000,
  step: 10,
  description: 'Em pixels (0 = auto)',
});

/**
 * ============================================================================
 * PRESETS DE COMPORTAMENTO
 * ============================================================================
 */

export const requiredField = (group = 'logic'): BlockFieldSchema<boolean> => ({
  key: 'required',
  label: 'Obrigatório',
  type: 'boolean',
  group,
  default: false,
});

export const disabledField = (group = 'logic'): BlockFieldSchema<boolean> => ({
  key: 'disabled',
  label: 'Desabilitado',
  type: 'boolean',
  group,
  default: false,
});

export const visibleField = (group = 'logic'): BlockFieldSchema<boolean> => ({
  key: 'visible',
  label: 'Visível',
  type: 'boolean',
  group,
  default: true,
});

/**
 * ============================================================================
 * PRESETS DE INTERAÇÃO
 * ============================================================================
 */

export const buttonTextField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'buttonText',
  label: 'Texto do Botão',
  type: 'string',
  group,
  placeholder: 'Clique aqui',
  default: 'Continuar',
});

export const buttonUrlField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'buttonUrl',
  label: 'URL do Botão',
  type: 'string',
  group,
  placeholder: 'https://exemplo.com',
});

export const placeholderField = (group = 'content'): BlockFieldSchema<string> => ({
  key: 'placeholder',
  label: 'Placeholder',
  type: 'string',
  group,
  placeholder: 'Digite aqui...',
});

/**
 * ============================================================================
 * PRESETS DE ANIMAÇÃO
 * ============================================================================
 */

export const animationField = (group = 'animation'): BlockFieldSchema<string> => ({
  key: 'animation',
  label: 'Animação',
  type: 'select',
  group,
  enumValues: ['none', 'fade', 'slide', 'scale', 'bounce'],
  default: 'none',
});

export const durationField = (group = 'animation'): BlockFieldSchema<number> => ({
  key: 'duration',
  label: 'Duração',
  type: 'number',
  group,
  min: 0,
  max: 5000,
  step: 100,
  default: 300,
  description: 'Em milissegundos',
});

/**
 * ============================================================================
 * FIELD GROUPS - Conjuntos de campos relacionados
 * ============================================================================
 */

/**
 * Campos de espaçamento completo
 */
export const spacingFields = (group = 'layout'): BlockFieldSchema[] => [
  paddingField(group),
  marginField(group),
];

/**
 * Campos de dimensões
 */
export const dimensionFields = (group = 'layout'): BlockFieldSchema[] => [
  widthField(group),
  heightField(group),
];

/**
 * Campos de cores principais
 */
export const colorFields = (group = 'style'): BlockFieldSchema[] => [
  backgroundColorField(group),
  textColorField(group),
  borderColorField(group),
];

/**
 * Campos de tipografia
 */
export const typographyFields = (group = 'style'): BlockFieldSchema[] => [
  fontSizeField(group),
  fontWeightField(group),
];

/**
 * Campos de imagem completos
 */
export const imageFields = (group = 'content'): BlockFieldSchema[] => [
  imageUrlField(group),
  imageAltField(group),
];

/**
 * Campos de botão completos
 */
export const buttonFields = (group = 'content'): BlockFieldSchema[] => [
  buttonTextField(group),
  buttonUrlField(group),
];
