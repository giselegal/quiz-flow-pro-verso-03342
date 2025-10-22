import { templates } from '../base/builder';
import { headlineField, subtitleField, descriptionField, imageFields, buttonFields, titleField } from '../base/presets';

export const offerHeroSchema = templates
  .full('offer-hero', 'Hero de Oferta')
  .category('offer')
  .icon('Megaphone')
  // Compatibilidade com JSON v3
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Título da oferta' })
  .addField({ key: 'description', label: 'Descrição', type: 'richtext', group: 'content', placeholder: 'Descrição da oferta' })
  .addField({ key: 'urgencyMessage', label: 'Mensagem de Urgência', type: 'string', group: 'content', placeholder: 'Oferta por tempo limitado!' })
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

// Novo: Pricing Section (mapeado para content.pricing no componente)
export const pricingSchema = templates
  .full('pricing', 'Oferta • Pricing')
  .category('offer')
  .icon('DollarSign')
  // JSON v3 usa content.pricing (objeto aninhado)
  .addField({ key: 'pricing', label: 'Pricing (JSON v3)', type: 'object', group: 'content', description: 'Objeto de preços (original/sale/installments)' })
  // Conteúdo textual
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Oferta Especial' })
  .addField({ key: 'subtitle', label: 'Subtítulo', type: 'string', group: 'content', placeholder: 'Aproveite por tempo limitado' })
  // Preços (flatten: serão adaptados para content.pricing via onBlockPatch)
  .addField({ key: 'originalPrice', label: 'Preço Original', type: 'number', group: 'content', default: 97 })
  .addField({ key: 'salePrice', label: 'Preço Promocional', type: 'number', group: 'content', default: 39.9 })
  .addField({ key: 'currency', label: 'Moeda', type: 'string', group: 'content', default: 'R$' })
  .addField({ key: 'installmentsCount', label: 'Parcelas (qtd)', type: 'number', group: 'content', default: 2, min: 1, max: 24 })
  .addField({ key: 'installmentsValue', label: 'Parcelas (valor)', type: 'number', group: 'content', default: 19.95 })
  // Lista de features
  .addField({ key: 'features', label: 'Recursos Inclusos', type: 'options-list', group: 'content', default: [] })
  // CTA
  .addField({ key: 'ctaText', label: 'Texto do CTA', type: 'string', group: 'content', placeholder: 'Quero garantir minha vaga' })
  .addField({ key: 'ctaUrl', label: 'URL do CTA', type: 'string', group: 'content', placeholder: 'https://pagamento.com/checkout' })
  // Opções visuais comuns
  .addFields(...imageFields('content'))
  .addFields(...buttonFields('content'))
  .version('2.0.0')
  .build();
