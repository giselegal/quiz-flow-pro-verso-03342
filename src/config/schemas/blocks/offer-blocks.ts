import { templates } from '../base/builder';
import { headlineField, subtitleField, descriptionField, imageFields, buttonFields, titleField } from '../base/presets';

export const offerHeroSchema = templates
  .full('offer-hero', 'Hero de Oferta')
  .category('offer')
  .icon('Megaphone')
  .addField(headlineField('content'))
  .addField(subtitleField('content'))
  .addFields(...buttonFields('content'))
  .addFields(...imageFields('content'))
  .version('2.0.0')
  .build();

export const bonusSchema = templates
  .full('bonus', 'Bônus')
  .category('offer')
  .icon('Gift')
  .addField(titleField('content'))
  .addField(descriptionField('content'))
  .addField({
    key: 'bonusItems',
    label: 'Itens do Bônus',
    type: 'options-list',
    group: 'content',
    default: [],
  })
  .version('2.0.0')
  .build();

export const benefitsSchema = templates
  .full('benefits', 'Lista de Benefícios')
  .category('offer')
  .icon('List')
  .addField(titleField('content'))
  .addField({
    key: 'items',
    label: 'Benefícios',
    type: 'options-list',
    group: 'content',
    default: [],
  })
  .version('2.0.0')
  .build();

export const guaranteeSchema = templates
  .full('guarantee', 'Garantia')
  .category('offer')
  .icon('ShieldCheck')
  .addField(titleField('content'))
  .addField(descriptionField('content'))
  .addField({
    key: 'guaranteePeriod',
    label: 'Período (dias)',
    type: 'number',
    group: 'content',
    default: 30,
  })
  .version('2.0.0')
  .build();
