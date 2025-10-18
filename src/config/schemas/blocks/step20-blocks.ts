import { templates } from '../base/builder';
import { titleField, subtitleField, descriptionField, imageFields } from '../base/presets';

export const step20ResultHeaderSchema = templates
  .full('step20-result-header', 'Cabeçalho de Resultado (Step 20)')
  .category('result')
  .icon('Award')
  .addField(titleField('content'))
  .addField(subtitleField('content'))
  .version('2.0.0')
  .build();

export const step20StyleRevealSchema = templates
  .full('step20-style-reveal', 'Revelação de Estilo (Step 20)')
  .category('result')
  .icon('Sparkles')
  .addField({ key: 'styleName', label: 'Nome do Estilo', type: 'string', group: 'content' })
  .addField(descriptionField('content'))
  .addFields(...imageFields('content'))
  .version('2.0.0')
  .build();
