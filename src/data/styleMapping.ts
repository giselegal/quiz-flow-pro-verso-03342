import type { StyleType, QuizOption } from "@/types/quiz";

// Mapeamento exato das opções A-H para os estilos
// Baseado no sistema original do CaktoQuiz
export const OPTION_TO_STYLE_MAPPING: Record<string, StyleType> = {
  A: "natural", // Opção A: Natural
  B: "classico", // Opção B: Clássico
  C: "contemporaneo", // Opção C: Contemporâneo
  D: "elegante", // Opção D: Elegante
  E: "romantico", // Opção E: Romântico
  F: "sensual", // Opção F: Sexy (mantendo 'sensual' no código)
  G: "dramatico", // Opção G: Dramático
  H: "criativo", // Opção H: Criativo
};

// Ordem padrão dos estilos para exibição
export const STYLE_DISPLAY_ORDER: StyleType[] = [
  "classico",
  "romantico",
  "dramatico",
  "natural",
  "criativo",
  "elegante",
  "sensual",
  "contemporaneo",
];

// Helper para criar opções de quiz com mapeamento automático
export const createQuizOption = (
  optionLetter: string,
  text: string,
  imageUrl?: string,
  weight: number = 1,
): QuizOption => {
  const style = OPTION_TO_STYLE_MAPPING[optionLetter.toUpperCase()];

  return {
    id: `option_${optionLetter.toLowerCase()}`,
    text,
    style,
    imageUrl,
    weight,
  };
};

// Helper para validar se todos os estilos têm pelo menos uma opção
export const validateStyleCoverage = (options: QuizOption[]): boolean => {
  const stylesInOptions = new Set(
    options.map((opt) => opt.style).filter(Boolean),
  );
  const allStyles = new Set(Object.values(OPTION_TO_STYLE_MAPPING));

  return stylesInOptions.size === allStyles.size;
};

// Helper para obter a letra da opção baseada no estilo
export const getOptionLetterByStyle = (style: StyleType): string | null => {
  for (const [letter, mappedStyle] of Object.entries(OPTION_TO_STYLE_MAPPING)) {
    if (mappedStyle === style) {
      return letter;
    }
  }
  return null;
};
