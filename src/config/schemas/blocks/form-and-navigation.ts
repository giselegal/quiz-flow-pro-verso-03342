import { templates } from '../base/builder';
import { placeholderField, buttonFields, titleField } from '../base/presets';
import { BlockFieldSchema } from '../base/types';

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

// Alinhar com JSON v3: type = "question-navigation"
export const questionNavigationSchema = templates
  .full('question-navigation', 'Navegação da Pergunta')
  .category('navigation')
  .icon('ArrowBigRightDash')
  // Conteúdo: rótulos visíveis
  .addField({ key: 'nextLabel', label: 'Texto do Próximo', type: 'string', group: 'content', default: 'Avançar' } as BlockFieldSchema<string>)
  .addField({ key: 'backLabel', label: 'Texto do Voltar', type: 'string', group: 'content', default: 'Voltar' } as BlockFieldSchema<string>)
  // Lógica: habilitação/visibilidade
  .addField({ key: 'enableWhenValid', label: 'Habilitar quando válido', type: 'boolean', group: 'logic', default: true } as BlockFieldSchema<boolean>)
  .addField({ key: 'showBack', label: 'Mostrar Voltar', type: 'boolean', group: 'logic', default: true } as BlockFieldSchema<boolean>)
  // Estilo: alinhamento e cores opcionais do botão
  .addField({ key: 'align', label: 'Alinhamento', type: 'select', group: 'layout', enumValues: ['left','center','right'], default: 'center' } as BlockFieldSchema<string>)
  .addField({ key: 'enabledColor', label: 'Cor (Habilitado)', type: 'color', group: 'style', default: '#deac6d' } as BlockFieldSchema<string>)
  .addField({ key: 'disabledColor', label: 'Cor (Desabilitado)', type: 'color', group: 'style', default: '#e6ddd4' } as BlockFieldSchema<string>)
  .addField({ key: 'disabledTextColor', label: 'Cor do Texto (Desabilitado)', type: 'color', group: 'style', default: '#8a7663' } as BlockFieldSchema<string>)
  // Avançado: textos específicos (compat com renderer atual)
  .addField({ key: 'buttonTextEnabled', label: 'Texto quando habilitado', type: 'string', group: 'content', placeholder: 'Ex.: Avançar' } as BlockFieldSchema<string>)
  .addField({ key: 'buttonTextDisabled', label: 'Texto quando desabilitado', type: 'string', group: 'content', placeholder: 'Ex.: Selecione 3 opções' } as BlockFieldSchema<string>)
  .version('2.0.0')
  .build();
