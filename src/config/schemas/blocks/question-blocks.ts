import { templates } from '../base/builder';
import { titleField, subtitleField, colorFields, typographyFields, textField, fontSizeField, fontWeightField, alignmentField } from '../base/presets';

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

// NOVOS SCHEMAS PARA BLOCOS ATÔMICOS DE PERGUNTA (v3)
export const questionTextSchema = templates
  .full('question-text', 'Pergunta • Texto')
  .category('question')
  .icon('Type')
  .addField(textField('content'))
  .addField(fontSizeField('style'))
  .addField(fontWeightField('style'))
  .addField(alignmentField('layout'))
  .version('2.0.0')
  .build();

export const questionNumberSchema = templates
  .full('question-number', 'Pergunta • Número')
  .category('question')
  .icon('Hash')
  .addField({ key: 'questionNumber', label: 'Número da Pergunta', type: 'number', group: 'content', min: 1, max: 30, default: 1 })
  .addField({ key: 'totalQuestions', label: 'Total de Perguntas', type: 'number', group: 'content', min: 1, max: 50, default: 21 })
  .addField({ key: 'showPrefix', label: 'Mostrar Prefixo “Pergunta”', type: 'boolean', group: 'content', default: true })
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();

export const questionProgressSchema = templates
  .full('question-progress', 'Pergunta • Progresso')
  .category('question')
  .icon('Activity')
  .addField({ key: 'current', label: 'Atual', type: 'number', group: 'content', min: 1, default: 1 })
  .addField({ key: 'total', label: 'Total', type: 'number', group: 'content', min: 1, default: 21 })
  .addField({ key: 'showPercentage', label: 'Mostrar Percentual', type: 'boolean', group: 'content', default: true })
  .addFields(...colorFields('style'))
  .addField({ key: 'height', label: 'Altura (px)', type: 'number', group: 'style', min: 2, max: 16, default: 10 })
  .version('2.0.0')
  .build();

export const questionInstructionsSchema = templates
  .full('question-instructions', 'Pergunta • Instruções')
  .category('question')
  .icon('AlignLeft')
  .addField({ key: 'text', label: 'Texto', type: 'string', group: 'content', placeholder: 'Selecione N opções' })
  .addFields(...typographyFields('style'))
  .version('2.0.0')
  .build();

// Navegação da pergunta já definida em form-and-navigation.ts (evitar duplicidade)
