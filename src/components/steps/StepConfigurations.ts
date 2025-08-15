/**
 * 🚀 CONFIGURAÇÕES DINÂMICAS DOS STEPS (21→1)
 * Substitui 21 Step*Template.tsx por configurações JSON
 */

export interface StepConfiguration {
  stepNumber: number;
  stepId: string;
  title: string;
  subtitle: string;
  type: 'intro' | 'question' | 'capture' | 'result';
  category: 'personal' | 'lifestyle' | 'health' | 'goals' | 'final';
  
  // UI Configuration
  layout: 'centered' | 'split' | 'form';
  showProgress: boolean;
  showNavigation: boolean;
  
  // Content
  questionText?: string;
  options?: Array<{
    id: string;
    text: string;
    value: number | string;
    icon?: string;
  }>;
  
  // Form fields for capture steps
  fields?: Array<{
    type: 'text' | 'email' | 'phone' | 'select';
    name: string;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
  }>;
  
  // Styling
  theme: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    backgroundImage?: string;
  };
  
  // Logic
  validation?: Record<string, any>;
  nextStep?: (answers: Record<string, any>) => number;
}

export const STEP_CONFIGURATIONS: Record<string, StepConfiguration> = {
  'step-01': {
    stepNumber: 1,
    stepId: 'step-01',
    title: 'Bem-vindo ao Quiz!',
    subtitle: 'Descubra seu perfil personalizado',
    type: 'intro',
    category: 'personal',
    layout: 'centered',
    showProgress: true,
    showNavigation: true,
    theme: {
      backgroundColor: '#E8D5C4',
      textColor: '#432818',
      accentColor: '#B89B7A'
    }
  },
  
  'step-02': {
    stepNumber: 2,
    stepId: 'step-02',
    title: 'Qual é a sua faixa etária?',
    subtitle: 'Esta informação nos ajuda a personalizar suas recomendações',
    type: 'question',
    category: 'personal',
    layout: 'centered',
    showProgress: true,
    showNavigation: true,
    options: [
      { id: 'age-18-25', text: '18-25 anos', value: 1 },
      { id: 'age-26-35', text: '26-35 anos', value: 2 },
      { id: 'age-36-45', text: '36-45 anos', value: 3 },
      { id: 'age-46-plus', text: '46+ anos', value: 4 }
    ],
    theme: {
      backgroundColor: '#F5F2EE',
      textColor: '#432818',
      accentColor: '#B89B7A'
    }
  },

  'step-03': {
    stepNumber: 3,
    stepId: 'step-03',
    title: 'Como você se identifica?',
    subtitle: 'Queremos conhecer você melhor',
    type: 'question',
    category: 'personal',
    layout: 'centered',
    showProgress: true,
    showNavigation: true,
    options: [
      { id: 'gender-f', text: 'Feminino', value: 'F' },
      { id: 'gender-m', text: 'Masculino', value: 'M' },
      { id: 'gender-nb', text: 'Não-binário', value: 'NB' },
      { id: 'gender-pref-not', text: 'Prefiro não dizer', value: 'X' }
    ],
    theme: {
      backgroundColor: '#F5F2EE',
      textColor: '#432818',
      accentColor: '#B89B7A'
    }
  },

  // ... Continue for all 21 steps
  'step-21': {
    stepNumber: 21,
    stepId: 'step-21',
    title: 'Resultado Final',
    subtitle: 'Descubra seu perfil personalizado!',
    type: 'result',
    category: 'final',
    layout: 'split',
    showProgress: false,
    showNavigation: false,
    theme: {
      backgroundColor: 'linear-gradient(135deg, #B89B7A, #E8D5C4)',
      textColor: '#432818',
      accentColor: '#B89B7A'
    }
  }
};

// Helper functions
export const getStepConfiguration = (stepId: string): StepConfiguration | null => {
  return STEP_CONFIGURATIONS[stepId] || null;
};

export const calculateProgress = (currentStep: number, totalSteps: number = 21): number => {
  return Math.round((currentStep / totalSteps) * 100);
};

export const getNextStepId = (currentStepId: string, answers?: Record<string, any>): string | null => {
  const config = getStepConfiguration(currentStepId);
  if (!config) return null;
  
  // Custom logic for next step
  if (config.nextStep && answers) {
    const nextStepNumber = config.nextStep(answers);
    return `step-${String(nextStepNumber).padStart(2, '0')}`;
  }
  
  // Default sequential logic
  const nextNumber = config.stepNumber + 1;
  return nextNumber <= 21 ? `step-${String(nextNumber).padStart(2, '0')}` : null;
};

export const getAllStepIds = (): string[] => {
  return Object.keys(STEP_CONFIGURATIONS).sort();
};

export default STEP_CONFIGURATIONS;