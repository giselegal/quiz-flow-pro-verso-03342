import { templates } from '../base/builder';
import { textField, typographyFields } from '../base/presets';
import { BlockFieldSchema } from '../base/types';

export const textInlineSchema = templates
  .full('text-inline', 'Texto Inline')
  .category('content')
  .icon('Text')
  .addGroup('logic', 'Lógica', { order: 4 })
  .addField(textField('content'))
  .addFields(...typographyFields('style'))
  .addField({
    key: 'enableInterpolation',
    label: 'Habilitar Interpolação',
    type: 'boolean',
    group: 'logic',
    default: false,
    description: 'Quando ativado, permite interpolar placeholders como {userName} usando o contexto do funil.',
  } as BlockFieldSchema<boolean>)
  .version('2.0.0')
  .build();
