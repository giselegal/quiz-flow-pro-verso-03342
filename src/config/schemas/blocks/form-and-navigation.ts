import { templates } from '../base/builder';
import { placeholderField, buttonFields, titleField } from '../base/presets';

export const formInputSchema = templates
  .full('form-input', 'Campo de Formulário')
  .category('form')
  .icon('FormInput')
  .addField(titleField('content'))
  .addField(placeholderField('content'))
  .addFields(...buttonFields('content'))
  .version('2.0.0')
  .build();

export const quizNavigationSchema = templates
  .full('quiz-navigation', 'Navegação do Quiz')
  .category('navigation')
  .icon('ArrowRightLeft')
  .addField({ key: 'showBack', label: 'Mostrar Voltar', type: 'boolean', group: 'logic', default: true })
  .addField({ key: 'showNext', label: 'Mostrar Próximo', type: 'boolean', group: 'logic', default: true })
  .addField({ key: 'align', label: 'Alinhamento', type: 'select', group: 'layout', enumValues: ['left','center','right'], default: 'center' })
  .version('2.0.0')
  .build();
