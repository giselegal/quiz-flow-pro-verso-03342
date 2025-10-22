import { templates } from '../base/builder';
import {
  titleField,
  subtitleField,
  descriptionField,
  imageFields,
  buttonFields,
  backgroundColorField,
  textColorField,
  paddingField,
  alignmentField,
} from '../base/presets';

/**
 * Schemas mínimos para tipos de seção do JSON v3.
 * Esses componentes complexos usam props no template v3; aqui registramos
 * schemas básicos para permitir edição mínima e satisfazer cobertura.
 */

export const heroSectionSchema = templates
  .full('HeroSection', 'Seção • Hero (v3)')
  .category('v3-sections')
  .icon('Sparkles')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .addField(descriptionField('content'))
  .addFields(...imageFields('content'))
  .addFields(...buttonFields('content'))
  .addField(alignmentField('layout'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const styleProfileSectionSchema = templates
  .full('StyleProfileSection', 'Seção • Perfil de Estilo (v3)')
  .category('v3-sections')
  .icon('Palette')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .addField(descriptionField('content'))
  .addFields(...imageFields('content'))
  .addField(alignmentField('layout'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const resultCalculationSectionSchema = templates
  .full('ResultCalculationSection', 'Seção • Cálculo de Resultado (v3)')
  .category('v3-sections')
  .icon('Calculator')
  .addField(titleField('content'))
  .addField(descriptionField('content'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const methodStepsSectionSchema = templates
  .full('MethodStepsSection', 'Seção • Método Passo a Passo (v3)')
  .category('v3-sections')
  .icon('List')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'O Método 5 Passos' })
  .addField({ key: 'items', label: 'Passos', type: 'options-list', group: 'content', default: [] })
  .addField(alignmentField('layout'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const bonusSectionSchema = templates
  .full('BonusSection', 'Seção • Bônus (v3)')
  .category('v3-sections')
  .icon('Gift')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'Bônus Exclusivos' })
  .addField({ key: 'bonusItems', label: 'Itens de Bônus', type: 'options-list', group: 'content', default: [] })
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const socialProofSectionSchema = templates
  .full('SocialProofSection', 'Seção • Prova Social (v3)')
  .category('v3-sections')
  .icon('Users')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'Transformações Reais' })
  .addField({ key: 'items', label: 'Depoimentos/Provas', type: 'options-list', group: 'content', default: [] })
  .addFields(...imageFields('content'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const offerSectionSchema = templates
  .full('OfferSection', 'Seção • Oferta (v3)')
  .category('v3-sections')
  .icon('Megaphone')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .addField({ key: 'urgencyMessage', label: 'Mensagem de Urgência', type: 'string', group: 'content', placeholder: 'Oferta por tempo limitado!' })
  .addFields(...imageFields('content'))
  .addField({ key: 'ctaText', label: 'Texto do CTA', type: 'string', group: 'content', placeholder: 'Garantir minha vaga' })
  .addField({ key: 'ctaUrl', label: 'URL do CTA', type: 'string', group: 'content', placeholder: 'https://checkout...' })
  .addField(paddingField('layout'))
  .addField(alignmentField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const guaranteeSectionSchema = templates
  .full('GuaranteeSection', 'Seção • Garantia (v3)')
  .category('v3-sections')
  .icon('ShieldCheck')
  .addField(titleField('content'))
  .addField(descriptionField('content'))
  .addField({ key: 'guaranteePeriod', label: 'Período (dias)', type: 'number', group: 'content', default: 7 })
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();

export const transformationSectionSchema = templates
  .full('TransformationSection', 'Seção • Transformação (v3)')
  .category('v3-sections')
  .icon('Sparkles')
  .addField({ key: 'mainTitle', label: 'Título Principal', type: 'string', group: 'content', placeholder: 'Transforme Sua Imagem' })
  .addField(subtitleField('content'))
  .addField(descriptionField('content'))
  .addFields(...imageFields('content'))
  .addField(paddingField('layout'))
  .addField(backgroundColorField('style'))
  .addField(textColorField('style'))
  .version('1.0.0')
  .build();
