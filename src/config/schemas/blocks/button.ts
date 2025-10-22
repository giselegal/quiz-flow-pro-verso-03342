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
  // Adiciona grupo de layout (necessário para campos com group: 'layout')
  .addGroup('layout', 'Layout', { order: 3 })
  // Grupo extra para experimentos A/B
  .addGroup('ab', 'Teste A/B', { order: 5, collapsible: true, defaultExpanded: false })
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
  // Campos de A/B testing (opt-in por bloco)
  .addFields(
    {
      key: 'abExperimentKey',
      label: 'Chave do Experimento',
      type: 'string',
      group: 'ab',
      placeholder: 'ex.: cta-copy',
      description: 'Identificador do experimento A/B. Deve corresponder a FUNNEL_CONFIG.abTests[].experimentKey.'
    } as BlockFieldSchema<string>,
    {
      key: 'abTextA',
      label: 'Texto Variante A',
      type: 'string',
      group: 'ab',
      placeholder: 'Cópia alternativa A',
      description: 'Texto exibido quando a variante A é atribuída.'
    } as BlockFieldSchema<string>,
    {
      key: 'abTextB',
      label: 'Texto Variante B',
      type: 'string',
      group: 'ab',
      placeholder: 'Cópia alternativa B',
      description: 'Texto exibido quando a variante B é atribuída.'
    } as BlockFieldSchema<string>
  )
  .version('2.0.0')
  .build();
