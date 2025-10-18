import { templates } from '../base/builder';
import { titleField, subtitleField, descriptionField, imageFields, buttonFields, placeholderField } from '../base/presets';

export const introLogoSchema = templates
  .full('intro-logo', 'Intro • Logo')
  .category('intro')
  .icon('Image')
  .addFields(...imageFields('content'))
  .version('2.0.0')
  .build();

export const introTitleSchema = templates
  .full('intro-title', 'Intro • Título')
  .category('intro')
  .icon('Type')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .version('2.0.0')
  .build();

export const introImageSchema = templates
  .full('intro-image', 'Intro • Imagem')
  .category('intro')
  .icon('Image')
  .addFields(...imageFields('content'))
  .version('2.0.0')
  .build();

export const introDescriptionSchema = templates
  .full('intro-description', 'Intro • Descrição')
  .category('intro')
  .icon('AlignLeft')
  .addField(descriptionField('content'))
  .version('2.0.0')
  .build();

export const introFormSchema = templates
  .full('intro-form', 'Intro • Formulário')
  .category('intro')
  .icon('FormInput')
  .addField(placeholderField('content'))
  .addFields(...buttonFields('content'))
  .version('2.0.0')
  .build();
