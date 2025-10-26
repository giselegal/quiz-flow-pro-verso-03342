/**
 * 📝 SCHEMA: INTRO LOGO HEADER
 * 
 * Bloco de cabeçalho compacto com logo para páginas de quiz
 */

import { templates } from '../base/builder';

export const introLogoHeaderSchema = templates
  .full('intro-logo-header', 'Cabeçalho com Logo')
  .description('Cabeçalho compacto com logo e marca')
  .category('intro')
  .icon('Image')
  .addField({
    key: 'logoUrl',
    label: 'URL do Logo',
    type: 'string',
    group: 'content',
    default: '/images/logo.png',
    placeholder: 'https://exemplo.com/logo.png',
    inputType: 'url',
  })
  .addField({
    key: 'logoAlt',
    label: 'Texto Alternativo',
    type: 'string',
    group: 'content',
    default: 'Logo',
    placeholder: 'Descrição do logo',
  })
  .addField({
    key: 'logoHeight',
    label: 'Altura do Logo',
    type: 'number',
    group: 'layout',
    default: 40,
    min: 20,
    max: 200,
  })
  .addField({
    key: 'backgroundColor',
    label: 'Cor de Fundo',
    type: 'color',
    group: 'style',
    default: 'transparent',
  })
  .addField({
    key: 'padding',
    label: 'Espaçamento Interno',
    type: 'number',
    group: 'layout',
    default: 16,
    min: 0,
    max: 100,
  })
  .version('1.0.0')
  .build();
