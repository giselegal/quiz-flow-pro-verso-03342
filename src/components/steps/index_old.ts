// Keep existing imports and types...

interface StepDefinition {
  id: string;
  name: string;
  type: string;
  description: string;
  getTemplate: () => any[];
}

// Update the steps object to have proper index signature
const steps: { [key: number]: StepDefinition } = {
  1: {
    id: '1',
    name: 'Intro',
    type: 'intro',
    description: 'Página de introdução',
    getTemplate: () => [],
  },
  2: {
    id: '2',
    name: 'Step 2',
    type: 'question',
    description: 'Segunda pergunta',
    getTemplate: () => [],
  },
  3: {
    id: '3',
    name: 'Step 3',
    type: 'question',
    description: 'Terceira pergunta',
    getTemplate: () => [],
  },
  4: {
    id: '4',
    name: 'Step 4',
    type: 'question',
    description: 'Quarta pergunta',
    getTemplate: () => [],
  },
  5: {
    id: '5',
    name: 'Step 5',
    type: 'question',
    description: 'Quinta pergunta',
    getTemplate: () => [],
  },
  6: {
    id: '6',
    name: 'Step 6',
    type: 'question',
    description: 'Sexta pergunta',
    getTemplate: () => [],
  },
  7: {
    id: '7',
    name: 'Step 7',
    type: 'question',
    description: 'Sétima pergunta',
    getTemplate: () => [],
  },
  8: {
    id: '8',
    name: 'Step 8',
    type: 'question',
    description: 'Oitava pergunta',
    getTemplate: () => [],
  },
  9: {
    id: '9',
    name: 'Step 9',
    type: 'question',
    description: 'Nona pergunta',
    getTemplate: () => [],
  },
  10: {
    id: '10',
    name: 'Step 10',
    type: 'question',
    description: 'Décima pergunta',
    getTemplate: () => [],
  },
  11: {
    id: '11',
    name: 'Step 11',
    type: 'strategic',
    description: 'Primeira pergunta estratégica',
    getTemplate: () => [],
  },
  12: {
    id: '12',
    name: 'Step 12',
    type: 'strategic',
    description: 'Segunda pergunta estratégica',
    getTemplate: () => [],
  },
  13: {
    id: '13',
    name: 'Step 13',
    type: 'strategic',
    description: 'Terceira pergunta estratégica',
    getTemplate: () => [],
  },
  14: {
    id: '14',
    name: 'Step 14',
    type: 'strategic',
    description: 'Quarta pergunta estratégica',
    getTemplate: () => [],
  },
  15: {
    id: '15',
    name: 'Step 15',
    type: 'strategic',
    description: 'Quinta pergunta estratégica',
    getTemplate: () => [],
  },
  16: {
    id: '16',
    name: 'Step 16',
    type: 'strategic',
    description: 'Sexta pergunta estratégica',
    getTemplate: () => [],
  },
  17: {
    id: '17',
    name: 'Step 17',
    type: 'strategic',
    description: 'Sétima pergunta estratégica',
    getTemplate: () => [],
  },
  18: {
    id: '18',
    name: 'Step 18',
    type: 'loading',
    description: 'Página de carregamento',
    getTemplate: () => [],
  },
  19: {
    id: '19',
    name: 'Step 19',
    type: 'loading',
    description: 'Segunda página de carregamento',
    getTemplate: () => [],
  },
  20: {
    id: '20',
    name: 'Step 20',
    type: 'result',
    description: 'Página de resultado',
    getTemplate: () => [],
  },
  21: {
    id: '21',
    name: 'Step 21',
    type: 'sales',
    description: 'Página de vendas',
    getTemplate: () => [],
  },
};

// Fix the functions that access steps by index
export const getStepById = (stepId: number): StepDefinition | null => {
  return steps[stepId] || null;
};

export const getStepTemplate = (stepId: number) => {
  const step = steps[stepId];
  return step ? step.getTemplate() : [];
};

export const getAllSteps = () => {
  return Object.values(steps);
};

export const getStepsByType = (type: string) => {
  return Object.values(steps).filter(step => step.type === type);
};

export const getTotalSteps = () => {
  return Object.keys(steps).length;
};

export const isValidStepId = (stepId: number): boolean => {
  return stepId in steps;
};

export const getNextStepId = (currentStepId: number): number | null => {
  const nextId = currentStepId + 1;
  return isValidStepId(nextId) ? nextId : null;
};

export const getPreviousStepId = (currentStepId: number): number | null => {
  const prevId = currentStepId - 1;
  return isValidStepId(prevId) ? prevId : null;
};

export default steps;
