import { templates } from '../base/builder';
import { titleField, subtitleField, colorFields, typographyFields } from '../base/presets';

export const questionHeroSchema = templates
  .full('question-hero', 'Hero de Pergunta')
  .category('question')
  .icon('HelpCircle')
  .addFields(
    titleField('content'),
    subtitleField('content'),
  )
  .addField({
    key: 'questionNumber',
    label: 'Número da Questão',
    type: 'number',
    group: 'content',
    min: 1,
    max: 21,
  })
  .addField({
    key: 'totalQuestions',
    label: 'Total de Questões',
    type: 'number',
    group: 'content',
    min: 1,
    max: 30,
    default: 13,
  })
  .addField({
    key: 'showProgress',
    label: 'Mostrar Progresso',
    type: 'boolean',
    group: 'layout',
    default: true,
  })
  .addFields(...colorFields('style'))
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();

export const questionTitleSchema = templates
  .full('question-title', 'Título da Questão')
  .category('question')
  .icon('Type')
  .addField(titleField('content'))
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();
