// Step07Template.ts
import { EditorBlock } from '@/types/editor';

export const getStep07Template = (): EditorBlock[] => {
  return [
    {
      id: `step-07-intro-${Date.now()}`,
      type: 'text',
      order: 1,
      content: {
        text: 'Agora vamos descobrir mais sobre suas preferências de estilo...'
      }
    },
    {
      id: `step-07-question-${Date.now()}`,
      type: 'text',
      order: 2,
      content: {
        text: 'Pergunta da Etapa 7'
      }
    },
    {
      id: `step-07-options-${Date.now()}`,
      type: 'quiz-question-inline',
      order: 3,
      content: {
        title: 'Qual é sua preferência?',
        options: [
          { id: 'opt1', text: 'Opção 1' },
          { id: 'opt2', text: 'Opção 2' },
          { id: 'opt3', text: 'Opção 3' }
        ]
      }
    }
  ];
};