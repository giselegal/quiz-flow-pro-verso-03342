// Questões que pontuam para o cálculo do estilo (Steps 2-11)
export const SCORABLE_QUESTIONS: string[] = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
];

export const isScorableQuestion = (id: string | undefined | null): boolean => {
  if (!id) return false;
  return SCORABLE_QUESTIONS.includes(String(id));
};

// Facilita auditoria em runtime quando necessário
export const __debugScorableSet = () => ({ list: [...SCORABLE_QUESTIONS] });
