import React from 'react';

// --- Interfaces Necessárias (Assumindo que viriam de '../types/quiz' e '../types/blocks') ---
// Interface simplificada para BlockData (representa um componente de UI)
export interface BlockData {
  type: string;
  properties: Record<string, any>;
  id?: string; // Opcional, pode ser gerado dinamicamente
  order?: number; // Opcional, pode ser inferido pela ordem no array
}

const TOTAL_QUIZ_QUESTIONS = 21; // Número total de questões no quiz completo

/**
 * Template de blocos para a Etapa 12 do quiz (Apenas Transição).
 * Esta etapa contém o texto introdutório para as questões estratégicas.
 */
export const getStep12Template = (): BlockData[] => {
  const questionNumberInFullQuiz = 12; // Esta é a 12ª etapa do quiz completo

  const blocks: BlockData[] = [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: (questionNumberInFullQuiz / TOTAL_QUIZ_QUESTIONS) * 100,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'Enquanto calculamos o seu resultado...'.toUpperCase(),
        level: 'h2',
        fontSize: 'text-2xl',
        fontWeight: 'font-semibold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 8
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
        fontSize: 'text-base',
        textAlign: 'text-left',
        color: '#1A1818]/80',
        marginBottom: 8
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: 'A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.',
        fontSize: 'text-base',
        textAlign: 'text-left',
        color: '#1A1818]/80',
        marginBottom: 16
      }
    },
    {
      type: 'text-inline', // Usando text-inline para o bloco itálico com fundo
      properties: {
        content: 'Responda com sinceridade. Isso é só entre você e a sua nova versão.',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#432818',
        fontStyle: 'italic',
        backgroundColor: '#B89B7A]/10',
        padding: 'p-6',
        borderRadius: 'rounded-lg',
        marginBottom: 24
      }
    },
    {
      type: 'button-inline',
      properties: {
        text: 'Continuar',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        // Este botão não depende de seleção, pois não há opções nesta etapa.
        // Ele estará sempre habilitado para avançar a transição.
        disabled: false,
        requiresValidSelection: false
      }
    }
  ];
  return blocks;
};

export default getStep12Template;
