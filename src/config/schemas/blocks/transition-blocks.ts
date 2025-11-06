import { templates } from '../base/builder';
import { subtitleField, descriptionField, imageFields, typographyFields, colorFields, animationField, durationField, titleField } from '../base/presets';

export const transitionSubtitleSchema = templates
  .full('transition-subtitle', 'Subtítulo de Transição')
  .category('transition')
  .icon('Type')
  .addField(subtitleField('content'))
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();

export const transitionImageSchema = templates
  .animated('transition-image', 'Imagem de Transição')
  .category('transition')
  .icon('Image')
  .addFields(...imageFields('content'))
  .addField(animationField('animation'))
  .addField(durationField('animation'))
  .addFields(...colorFields('style'))
  .version('2.0.0')
  .build();

export const transitionDescriptionSchema = templates
  .full('transition-description', 'Descrição de Transição')
  .category('transition')
  .icon('AlignLeft')
  .addField(descriptionField('content'))
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();

export const transitionHeroSchema = templates
  .full('transition-hero', 'Hero de Transição')
  .category('transition')
  .icon('Image')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  // Compatibilidade com JSON v3
  .addField({ key: 'message', label: 'Mensagem', type: 'string', group: 'content', placeholder: 'Mensagem de transição' })
  .addFields(...imageFields('content'))
  // Comportamento opcional: avanço automático após delay (ms)
  .addField({ key: 'autoAdvanceDelay', label: 'Delay para avançar (ms)', type: 'number', group: 'logic', default: 0, min: 0, max: 30000 })
  .version('2.0.0')
  .build();

// ✅ SPRINT 2 Fase 3: Schemas de transição faltantes adicionados
export const transitionTitleSchema = templates
  .full('transition-title', 'Título de Transição')
  .category('transition')
  .icon('Heading')
  .addField(titleField('content'))
  .addFields(...typographyFields('style'))
  .addFields(...colorFields('style'))
  .version('2.0.0')
  .build();

export const transitionTextSchema = templates
  .full('transition-text', 'Texto de Transição')
  .category('transition')
  .icon('Type')
  .addField(descriptionField('content'))
  .addFields(...typographyFields('style'))
  .addFields(...colorFields('style'))
  .version('2.0.0')
  .build();

export const transitionLoaderSchema = templates
  .basic('transition-loader', 'Loading de Transição')
  .category('transition')
  .icon('Loader')
  .addField({ key: 'showLoader', label: 'Mostrar loader', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'loaderType', label: 'Tipo de loader', type: 'string', group: 'content', default: 'spinner' })
  .addField({ key: 'loaderText', label: 'Texto do loader', type: 'string', group: 'content', placeholder: 'Carregando...' })
  .addFields(...colorFields('style'))
  .version('2.0.0')
  .build();

export const transitionProgressSchema = templates
  .basic('transition-progress', 'Progresso de Transição')
  .category('transition')
  .icon('BarChart2')
  .addField({ key: 'showProgress', label: 'Mostrar progresso', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'progressValue', label: 'Valor do progresso', type: 'number', group: 'content', default: 0, min: 0, max: 100 })
  .addField({ key: 'progressText', label: 'Texto do progresso', type: 'string', group: 'content', placeholder: '{progress}%' })
  .addFields(...colorFields('style'))
  .version('2.0.0')
  .build();

export const transitionMessageSchema = templates
  .full('transition-message', 'Mensagem de Transição')
  .category('transition')
  .icon('MessageCircle')
  .addField({ key: 'message', label: 'Mensagem', type: 'string', group: 'content', placeholder: 'Mensagem de transição' })
  .addField({ key: 'messageType', label: 'Tipo de mensagem', type: 'string', group: 'content', default: 'info' })
  .addFields(...typographyFields('style'))
  .addFields(...colorFields('style'))
  .version('2.0.0')
  .build();
