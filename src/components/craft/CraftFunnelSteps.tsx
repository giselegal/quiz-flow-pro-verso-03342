
import React from 'react';
import { Element } from '@craftjs/core';
import { CraftContainer } from './blocks/CraftContainer';
import { CraftTextBlock } from './blocks/CraftTextBlock';
import { CraftHeadingBlock } from './blocks/CraftHeadingBlock';
import { CraftQuizStartBlock } from './blocks/CraftQuizStartBlock';

// Mapeamento das 21 etapas do funil para componentes Craft.js
export const FUNNEL_STEPS_CRAFT = [
  {
    id: 'step-1',
    title: 'Página de Introdução',
    description: 'Página inicial do funil',
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftHeadingBlock} text="Bem-vindo!" level={1} />
        <Element is={CraftTextBlock} text="Esta é a página de introdução do seu funil." />
      </Element>
    )
  },
  {
    id: 'step-2',
    title: 'Coleta de Nome',
    description: 'Formulário para coleta de nome',
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftHeadingBlock} text="Como podemos te chamar?" level={2} />
        <Element is={CraftTextBlock} text="Informe seu nome para personalizar a experiência." />
      </Element>
    )
  },
  {
    id: 'step-3',
    title: 'Introdução ao Quiz',
    description: 'Página de início do quiz',
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftQuizStartBlock} 
          title="Pronto para começar?" 
          subtitle="Vamos descobrir seu perfil"
          buttonText="Começar Quiz"
        />
      </Element>
    )
  },
  // Questões 1-10 (Etapas 4-13)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `step-${i + 4}`,
    title: `Questão ${i + 1}`,
    description: `Questão ${i + 1} do quiz`,
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftHeadingBlock} text={`Questão ${i + 1}`} level={2} />
        <Element is={CraftTextBlock} text={`Esta é a questão ${i + 1} do quiz.`} />
      </Element>
    )
  })),
  {
    id: 'step-14',
    title: 'Transição - Calculando',
    description: 'Página de transição com loading',
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftHeadingBlock} text="Calculando seu resultado..." level={2} />
        <Element is={CraftTextBlock} text="Aguarde enquanto processamos suas respostas." />
      </Element>
    )
  },
  // Questões Estratégicas 1-6 (Etapas 15-20)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `step-${i + 15}`,
    title: `Questão Estratégica ${i + 1}`,
    description: `Questão estratégica ${i + 1}`,
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftHeadingBlock} text={`Questão Estratégica ${i + 1}`} level={2} />
        <Element is={CraftTextBlock} text={`Esta é uma questão estratégica para refinar seu resultado.`} />
      </Element>
    )
  })),
  {
    id: 'step-21',
    title: 'Página de Oferta',
    description: 'Página final com oferta',
    component: (
      <Element canvas is={CraftContainer} className="min-h-screen p-8">
        <Element is={CraftHeadingBlock} text="Oferta Especial!" level={1} />
        <Element is={CraftTextBlock} text="Baseado no seu resultado, temos uma oferta especial para você." />
      </Element>
    )
  }
];

// Componente para navegar entre as etapas
interface CraftFunnelStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const CraftFunnelSteps: React.FC<CraftFunnelStepsProps> = ({
  currentStep,
  onStepChange
}) => {
  return (
    <div className="w-full h-full">
      {FUNNEL_STEPS_CRAFT[currentStep - 1]?.component}
    </div>
  );
};
