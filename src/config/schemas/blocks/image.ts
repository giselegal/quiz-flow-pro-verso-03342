/**
 * 🖼️ SCHEMA: IMAGE
 * 
 * Bloco de imagem com suporte a legenda
 */

import { templates } from '../base/builder';
import { 
  imageUrlField, 
  imageAltField, 
  alignmentField, 
  dimensionFields,
  borderRadiusField,
  labelField 
} from '../base/presets';

export const imageSchema = templates
  .full('image', 'Imagem')
  .description('Bloco de imagem com legenda opcional')
  .category('media')
  .icon('Image')
  .addFields(
    imageUrlField('content'),
    imageAltField('content'),
    labelField('content')
  )
  .addField(borderRadiusField('style'))
  .addFields(...dimensionFields('layout'))
  .addField(alignmentField('layout'))
  .version('2.0.0')
  .build();
