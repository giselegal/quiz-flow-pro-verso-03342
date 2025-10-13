// @ts-nocheck
// Simplified Quiz 21 Etapas Loader
import type { BlockData } from '../types/blocks';

export interface EditorConfig {
  blocks: BlockData[];
  theme: string;
}

export function loadQuiz21Etapas(): EditorConfig {
  return {
    blocks: [
      {
        id: 'quiz-start',
        type: 'text',
        content: {},
        order: 0,
        properties: {
          text: 'Quiz de 21 Etapas',
          size: 'h1',
        },
      },
    ],
    theme: 'default',
  };
}

export default loadQuiz21Etapas;
