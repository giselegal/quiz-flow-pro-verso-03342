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
  paddingField, 
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
  // Inclui aliases usados no JSON v3 (large, xlarge)
  enumValues: ['sm', 'md', 'lg', 'large', 'xlarge'],
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
  // Grupo opcional para analytics
  .addGroup('analytics', 'Analytics', { order: 4, collapsible: true, defaultExpanded: false })
  // Grupo extra para experimentos A/B
  .addGroup('ab', 'Teste A/B', { order: 5, collapsible: true, defaultExpanded: false })
  .addFields(
    buttonTextField('content'),
    buttonUrlField('content'),
  )
  // Compatibilidade com JSON v3 (CTAButton usa label/href)
  .addFields(
    { key: 'label', label: 'Label (alias)', type: 'string', group: 'content', placeholder: 'Texto do botão' },
    { key: 'href', label: 'Href (alias)', type: 'string', group: 'content', placeholder: 'https://...' },
  )
  // Aliases adicionais usados em diversos templates (text/url)
  .addFields(
    { key: 'text', label: 'Texto (alias v3)', type: 'string', group: 'content', placeholder: 'Clique aqui' } as BlockFieldSchema<string>,
    { key: 'url', label: 'URL (alias v3)', type: 'string', group: 'content', placeholder: 'https://exemplo.com' } as BlockFieldSchema<string>,
  )
  // Compatibilidade extra com CTAButton do JSON v3 (props.*)
  .addFields(
    { key: 'icon', label: 'Ícone', type: 'string', group: 'content', placeholder: 'ShoppingCart | emoji' } as BlockFieldSchema<string>,
    { key: 'iconAnimation', label: 'Animação do ícone', type: 'string', group: 'style', placeholder: 'bounce-on-hover | pulse' } as BlockFieldSchema<string>,
    // Alias para v3 "style" (mantém variant intacto, mas permite salvar o campo vindo do template)
    { key: 'style', label: 'Estilo (v3 alias)', type: 'string', group: 'style', placeholder: 'primary | gradient' } as BlockFieldSchema<string>,
    // Cores em gradiente (v3: props.colors.from/to)
    { key: 'colorsFrom', label: 'Cores: de (from)', type: 'string', group: 'style', placeholder: 'primary' } as BlockFieldSchema<string>,
    { key: 'colorsTo', label: 'Cores: para (to)', type: 'string', group: 'style', placeholder: 'accent' } as BlockFieldSchema<string>,
    // Largura total no mobile (v3)
    { key: 'fullWidthMobile', label: 'Largura total (mobile)', type: 'boolean', group: 'layout', default: false } as BlockFieldSchema<boolean>,
    // Posição contextual no fluxo (v3)
    { key: 'position', label: 'Posição (contexto)', type: 'string', group: 'layout', placeholder: 'after-questions | after_offer | after_guarantee' } as BlockFieldSchema<string>,
    // Transição opcional (v3)
    { key: 'showTransition', label: 'Mostrar transição', type: 'boolean', group: 'content', default: false } as BlockFieldSchema<boolean>,
    { key: 'transitionTitle', label: 'Transição: título', type: 'string', group: 'content' } as BlockFieldSchema<string>,
    { key: 'transitionSubtitle', label: 'Transição: subtítulo', type: 'string', group: 'content' } as BlockFieldSchema<string>,
    { key: 'transitionBackground', label: 'Transição: background', type: 'string', group: 'style', placeholder: 'gradient primary/10 to accent/10' } as BlockFieldSchema<string>,
    { key: 'transitionBorder', label: 'Transição: borda', type: 'string', group: 'style', placeholder: 'primary/20' } as BlockFieldSchema<string>,
    // Analytics (v3)
    { key: 'analyticsEventName', label: 'Analytics: eventName', type: 'string', group: 'analytics', placeholder: 'cta_primary_click' } as BlockFieldSchema<string>,
    { key: 'analyticsCategory', label: 'Analytics: category', type: 'string', group: 'analytics', placeholder: 'conversion' } as BlockFieldSchema<string>,
    { key: 'analyticsLabel', label: 'Analytics: label', type: 'string', group: 'analytics', placeholder: 'after_offer' } as BlockFieldSchema<string>,
  )
  .addFields(
    variantField,
    sizeField,
    ...colorFields('style'),
    borderRadiusField('style'),
    paddingField('style'),
  )
  .addFields(
    alignmentField('logic'),
    fullWidthField,
  )
  // Campos de A/B testing (opt-in por bloco)
  .addFields(
    {
      key: 'abExperimentKey',
      label: 'Chave do Experimento',
      type: 'string',
      group: 'ab',
      placeholder: 'ex.: cta-copy',
      description: 'Identificador do experimento A/B. Deve corresponder a FUNNEL_CONFIG.abTests[].experimentKey.',
    } as BlockFieldSchema<string>,
    {
      key: 'abTextA',
      label: 'Texto Variante A',
      type: 'string',
      group: 'ab',
      placeholder: 'Cópia alternativa A',
      description: 'Texto exibido quando a variante A é atribuída.',
    } as BlockFieldSchema<string>,
    {
      key: 'abTextB',
      label: 'Texto Variante B',
      type: 'string',
      group: 'ab',
      placeholder: 'Cópia alternativa B',
      description: 'Texto exibido quando a variante B é atribuída.',
    } as BlockFieldSchema<string>,
  )
  .version('2.0.0')
  .build();
