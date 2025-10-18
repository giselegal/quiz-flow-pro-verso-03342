import { templates } from '../base/builder';
import { textField, typographyFields } from '../base/presets';

export const textInlineSchema = templates
  .full('text-inline', 'Texto Inline')
  .category('content')
  .icon('Text')
  .addField(textField('content'))
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();
