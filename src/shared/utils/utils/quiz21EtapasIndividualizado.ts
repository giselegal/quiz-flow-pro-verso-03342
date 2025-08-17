// @ts-nocheck
import type { BlockData } from '../types/blocks';

/**
 * Template de 21 Etapas com Componentes INDIVIDUALIZADOS
 * Cada elemento é um componente independente e modular
 * Facilita edição granular e personalização
 */
export function loadQuiz21EtapasIndividualizado(): BlockData[] {
  const blocks: BlockData[] = [
    // === ETAPA 1: INTRODUÇÃO COM COMPONENTES INDIVIDUAIS ===
    {
      id: 'etapa-1-titulo',
      type: 'title-standalone',
      content: {},
      order: 0,
      properties: {
        text: 'Descubra Seu Estilo Pessoal',
        size: 'h1',
        color: '#1a1a1a',
        alignment: 'center',
      },
    },

    {
      id: 'etapa-1-subtitulo',
      type: 'subtitle-standalone',
      content: {},
      order: 1,
      properties: {
        text: 'Um quiz completo para descobrir o estilo que combina com você',
        color: '#666666',
      },
    },

    {
      id: 'etapa-1-descricao',
      type: 'text-paragraph',
      content: {},
      order: 2,
      properties: {
        content: 'Responda perguntas e receba um guia personalizado baseado no seu perfil único',
        size: 'base',
        color: '#374151',
      },
    },
  ];

  return blocks;
}
