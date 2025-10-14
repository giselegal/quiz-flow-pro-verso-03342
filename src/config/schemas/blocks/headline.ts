/**
 * 📝 SCHEMA: HEADLINE
 * 
 * Bloco de título/headline principal
 */

import { templates } from '../base/builder';
import { titleField, subtitleField, alignmentField, colorFields, typographyFields } from '../base/presets';

export const headlineSchema = templates
  .full('headline', 'Título Principal')
  .description('Bloco de título com subtítulo opcional')
  .category('content')
  .icon('Type')
  .addFields(
    titleField('content'),
    subtitleField('content')
  )
  .addFields(...colorFields('style'))
  .addFields(...typographyFields('style'))
  .addField(alignmentField('layout'))
  .version('2.0.0')
  .build();
