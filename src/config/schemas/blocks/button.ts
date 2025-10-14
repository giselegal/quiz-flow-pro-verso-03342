/**
 * 🔘 SCHEMA: BUTTON
 * 
 * Bloco de botão/CTA
 */

import { templates } from '../base/builder';
import { 
  buttonTextField, 
  buttonUrlField, 
  colorFields, 
  borderRadiusField,
  alignmentField,
  paddingField 
} from '../base/presets';
import { BlockFieldSchema } from '../base/types';

// Variante de botão
const variantField: BlockFieldSchema<string> = {
  key: 'variant',
  label: 'Variante',
  type: 'select',
  group: 'style',
  enumValues: ['primary', 'secondary', 'outline', 'ghost'],
  default: 'primary',
  description: 'Estilo visual do botão',
};

// Tamanho do botão
const sizeField: BlockFieldSchema<string> = {
  key: 'size',
  label: 'Tamanho',
  type: 'select',
  group: 'style',
  enumValues: ['sm', 'md', 'lg'],
  default: 'md',
};

// Campo de largura total
const fullWidthField: BlockFieldSchema<boolean> = {
  key: 'fullWidth',
  label: 'Largura Total',
  type: 'boolean',
  group: 'layout',
  default: false,
  description: 'Ocupa toda a largura disponível',
};

export const buttonSchema = templates
  .interactive('button', 'Botão')
  .description('Botão clicável / Call-to-Action')
  .category('interactive')
  .icon('MousePointer')
  .addFields(
    buttonTextField('content'),
    buttonUrlField('content')
  )
  .addFields(
    variantField,
    sizeField,
    ...colorFields('style'),
    borderRadiusField('style'),
    paddingField('style')
  )
  .addFields(
    alignmentField('logic'),
    fullWidthField
  )
  .version('2.0.0')
  .build();
