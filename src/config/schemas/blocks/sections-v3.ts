import { templates } from '../base/builder';

/**
 * Schemas mínimos para tipos de seção do JSON v3.
 * Esses componentes complexos usam props no template v3; aqui registramos
 * schemas básicos para permitir edição mínima e satisfazer cobertura.
 */

export const heroSectionSchema = templates
  .full('HeroSection', 'Seção • Hero (v3)')
  .category('v3-sections')
  .icon('Sparkles')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Título da seção' })
  .version('1.0.0')
  .build();

export const styleProfileSectionSchema = templates
  .full('StyleProfileSection', 'Seção • Perfil de Estilo (v3)')
  .category('v3-sections')
  .icon('Palette')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Perfil de Estilo' })
  .version('1.0.0')
  .build();

export const resultCalculationSectionSchema = templates
  .full('ResultCalculationSection', 'Seção • Cálculo de Resultado (v3)')
  .category('v3-sections')
  .icon('Calculator')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Processamento de Resultados' })
  .version('1.0.0')
  .build();

export const methodStepsSectionSchema = templates
  .full('MethodStepsSection', 'Seção • Método Passo a Passo (v3)')
  .category('v3-sections')
  .icon('List')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'O Método 5 Passos' })
  .version('1.0.0')
  .build();

export const bonusSectionSchema = templates
  .full('BonusSection', 'Seção • Bônus (v3)')
  .category('v3-sections')
  .icon('Gift')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'Bônus Exclusivos' })
  .version('1.0.0')
  .build();

export const socialProofSectionSchema = templates
  .full('SocialProofSection', 'Seção • Prova Social (v3)')
  .category('v3-sections')
  .icon('Users')
  .addField({ key: 'sectionTitle', label: 'Título da Seção', type: 'string', group: 'content', placeholder: 'Transformações Reais' })
  .version('1.0.0')
  .build();

export const offerSectionSchema = templates
  .full('OfferSection', 'Seção • Oferta (v3)')
  .category('v3-sections')
  .icon('Megaphone')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Oferta Principal' })
  .version('1.0.0')
  .build();

export const guaranteeSectionSchema = templates
  .full('GuaranteeSection', 'Seção • Garantia (v3)')
  .category('v3-sections')
  .icon('ShieldCheck')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', placeholder: 'Garantia' })
  .version('1.0.0')
  .build();

export const transformationSectionSchema = templates
  .full('TransformationSection', 'Seção • Transformação (v3)')
  .category('v3-sections')
  .icon('Sparkles')
  .addField({ key: 'mainTitle', label: 'Título Principal', type: 'string', group: 'content', placeholder: 'Transforme Sua Imagem' })
  .version('1.0.0')
  .build();
