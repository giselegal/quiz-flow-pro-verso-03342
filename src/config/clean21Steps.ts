export interface Clean21Step {
  id: string;
  name: string;
  stepNumber: number;
  type: string;
  description: string;
}

export const CLEAN_21_STEPS: Clean21Step[] = [
  { id: "step-1", name: "Início", stepNumber: 1, type: "cover", description: "Página de apresentação inicial" },
  { id: "step-2", name: "Pergunta 1", stepNumber: 2, type: "question", description: "Primeira pergunta do quiz" },
  { id: "step-3", name: "Pergunta 2", stepNumber: 3, type: "question", description: "Segunda pergunta do quiz" },
  { id: "step-4", name: "Pergunta 3", stepNumber: 4, type: "question", description: "Terceira pergunta do quiz" },
  { id: "step-5", name: "Pergunta 4", stepNumber: 5, type: "question", description: "Quarta pergunta do quiz" },
  { id: "step-6", name: "Pergunta 5", stepNumber: 6, type: "question", description: "Quinta pergunta do quiz" },
  { id: "step-7", name: "Pergunta 6", stepNumber: 7, type: "question", description: "Sexta pergunta do quiz" },
  { id: "step-8", name: "Pergunta 7", stepNumber: 8, type: "question", description: "Sétima pergunta do quiz" },
  { id: "step-9", name: "Pergunta 8", stepNumber: 9, type: "question", description: "Oitava pergunta do quiz" },
  { id: "step-10", name: "Pergunta 9", stepNumber: 10, type: "question", description: "Nona pergunta do quiz" },
  { id: "step-11", name: "Pergunta 10", stepNumber: 11, type: "question", description: "Décima pergunta do quiz" },
  { id: "step-12", name: "Pergunta 11", stepNumber: 12, type: "question", description: "Décima primeira pergunta do quiz" },
  { id: "step-13", name: "Pergunta 12", stepNumber: 13, type: "question", description: "Décima segunda pergunta do quiz" },
  { id: "step-14", name: "Pergunta 13", stepNumber: 14, type: "question", description: "Décima terceira pergunta do quiz" },
  { id: "step-15", name: "Pergunta 14", stepNumber: 15, type: "question", description: "Décima quarta pergunta do quiz" },
  { id: "step-16", name: "Pergunta 15", stepNumber: 16, type: "question", description: "Décima quinta pergunta do quiz" },
  { id: "step-17", name: "Pergunta 16", stepNumber: 17, type: "question", description: "Décima sexta pergunta do quiz" },
  { id: "step-18", name: "Pergunta 17", stepNumber: 18, type: "question", description: "Décima sétima pergunta do quiz" },
  { id: "step-19", name: "Pergunta 18", stepNumber: 19, type: "question", description: "Décima oitava pergunta do quiz" },
  { id: "step-20", name: "Pergunta 19", stepNumber: 20, type: "question", description: "Décima nona pergunta do quiz" },
  { id: "step-21", name: "Resultado", stepNumber: 21, type: "result", description: "Página de resultado final" },
];