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
  .addFields(...imageFields('content'))
  .version('2.0.0')
  .build();
