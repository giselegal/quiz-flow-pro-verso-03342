import React, { useState } from 'react';
import QuizQuestionBlock from '@/components/blocks/quiz/QuizQuestionBlock';
import { CORRECT_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

interface QuizStep {
  id: string;
  question: string;
  options: Array<{ id: string; text: string; value: string; imageUrl?: string }>;
  allowMultiple?: boolean;
  showImages?: boolean;
  maxSelections?: number;
}

// QUESTÕES ESTRATÉGICAS PARA ETAPAS 12-21 (após as 10 questões principais)
const STRATEGIC_QUESTIONS: QuizStep[] = [
  // ETAPA 12: Estilo mais atrativo
  {
    id: 'step-12',
    question: 'Etapa 12: O que é mais atrativo para você na moda?',
    options: [
      { id: '1', text: 'Estilo personalizado e único', value: '1' },
      { id: '2', text: 'Facilidade nas combinações', value: '2' },
      { id: '3', text: 'Investimentos duráveis e versáteis', value: '3' },
      { id: '4', text: 'Looks criativos e impactantes', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 13: Desafio principal  
  {
    id: 'step-13',
    question: 'Etapa 13: Qual é seu maior desafio com o guarda-roupa?',
    options: [
      { id: '1', text: 'Não sei combinar as peças que tenho', value: '1' },
      { id: '2', text: 'Compro coisas que não uso', value: '2' },
      { id: '3', text: 'Sempre me sinto inadequada', value: '3' },
      { id: '4', text: 'Não sei qual é meu estilo', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 14: Situação ideal
  {
    id: 'step-14',
    question: 'Etapa 14: Como seria sua situação ideal?',
    options: [
      { id: '1', text: 'Guarda-roupa enxuto e funcional', value: '1' },
      { id: '2', text: 'Estilo definido e auténtico', value: '2' },
      { id: '3', text: 'Confiança para qualquer ocasião', value: '3' },
      { id: '4', text: 'Facilidade nas escolhas diárias', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 15: Orçamento para mudança
  {
    id: 'step-15',
    question: 'Etapa 15: Quanto investiria para transformar seu estilo?',
    options: [
      { id: '1', text: 'Até R$ 200 por mês', value: '1' },
      { id: '2', text: 'R$ 200 - R$ 500 por mês', value: '2' },
      { id: '3', text: 'R$ 500 - R$ 1.000 por mês', value: '3' },
      { id: '4', text: 'Acima de R$ 1.000 por mês', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 16: Motivação
  {
    id: 'step-16',
    question: 'Etapa 16: O que mais te motiva a mudar seu estilo?',
    options: [
      { id: '1', text: 'Aumentar a autoestima', value: '1' },
      { id: '2', text: 'Impressionar melhor profissionalmente', value: '2' },
      { id: '3', text: 'Me sentir mais atrativa', value: '3' },
      { id: '4', text: 'Expressar minha personalidade', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 17: Urgência
  {
    id: 'step-17',
    question: 'Etapa 17: Quão urgente é essa transformação para você?',
    options: [
      { id: '1', text: 'Muito urgente, preciso mudar agora', value: '1' },
      { id: '2', text: 'Urgente, nos próximos 3 meses', value: '2' },
      { id: '3', text: 'Moderado, até 6 meses', value: '3' },
      { id: '4', text: 'Sem pressa, quando der certo', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 18: Experiência anterior
  {
    id: 'step-18',
    question: 'Etapa 18: Já tentou mudanças no estilo antes?',
    options: [
      { id: '1', text: 'Sim, mas não deu muito certo', value: '1' },
      { id: '2', text: 'Sim, com alguns sucessos', value: '2' },
      { id: '3', text: 'Muito pouco, quase nada', value: '3' },
      { id: '4', text: 'Não, seria a primeira vez', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 19: Maior obstáculo
  {
    id: 'step-19',
    question: 'Etapa 19: Qual seria seu maior obstáculo?',
    options: [
      { id: '1', text: 'Falta de conhecimento sobre moda', value: '1' },
      { id: '2', text: 'Orçamento limitado', value: '2' },
      { id: '3', text: 'Falta de tempo para pesquisar', value: '3' },
      { id: '4', text: 'Medo de errar e desperdiçar dinheiro', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 20: Resultado esperado
  {
    id: 'step-20',
    question: 'Etapa 20: Qual resultado você mais espera?',
    options: [
      { id: '1', text: 'Um guia prático e personalizado', value: '1' },
      { id: '2', text: 'Dicas de combinações certeiras', value: '2' },
      { id: '3', text: 'Lista de compras inteligente', value: '3' },
      { id: '4', text: 'Confiança para criar looks únicos', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  },
  // ETAPA 21: Interesse em consultoria
  {
    id: 'step-21',
    question: 'Etapa 21: Teria interesse em uma consultoria personalizada?',
    options: [
      { id: '1', text: 'Sim, quero saber mais sobre consultoria', value: '1' },
      { id: '2', text: 'Talvez, dependendo do formato', value: '2' },
      { id: '3', text: 'Prefiro primeiro o resultado do quiz', value: '3' },
      { id: '4', text: 'Não, só quero o resultado gratuito', value: '4' }
    ],
    allowMultiple: false,
    showImages: false,
    maxSelections: 1
  }
];

// CONVERTER QUESTÕES ORIGINAIS PARA FORMATO DO EDITOR 
const MAIN_QUIZ_STEPS: QuizStep[] = CORRECT_QUIZ_QUESTIONS.map((q, index) => ({
  id: `step-${index + 1}`,
  question: `Etapa ${index + 1}: ${q.title}`,
  options: q.options.map(opt => ({
    id: opt.id,
    text: opt.text,
    value: opt.id,
    imageUrl: ('imageUrl' in opt) ? opt.imageUrl : undefined
  })),
  allowMultiple: q.multiSelect > 1,
  showImages: q.type === 'both' || q.type === 'image',
  maxSelections: q.multiSelect
}));

// COMBINAR AS 10 QUESTÕES PRINCIPAIS + 11 QUESTÕES ESTRATÉGICAS = 21 ETAPAS
const QUIZ_STEPS: QuizStep[] = [
  ...MAIN_QUIZ_STEPS, // Etapas 1-10: Questões originais com imagens
  ...STRATEGIC_QUESTIONS // Etapas 11-21: Questões estratégicas
];

const QuizEditorSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});

  const handleNext = () => {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Quiz finalizado
      console.log('Quiz finalizado! Respostas:', responses);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepResponse = (stepId: string, answers: string[]) => {
    setResponses(prev => ({
      ...prev,
      [stepId]: answers
    }));
  };

  const currentStepData = QUIZ_STEPS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz de Estilo Pessoal - 21 Etapas
          </h1>
          <p className="text-gray-600">
            Teste das {QUIZ_STEPS.length} etapas com questões originais atualizadas
          </p>
        </div>

        {/* Componente de Questão */}
        <QuizQuestionBlock
          id={currentStepData.id}
          question={currentStepData.question}
          options={currentStepData.options}
          allowMultiple={currentStepData.allowMultiple}
          showImages={currentStepData.showImages}
          maxSelections={currentStepData.maxSelections}
          onAnswer={(answers: string[]) => handleStepResponse(currentStepData.id, answers)}
          onBack={currentStep > 0 ? handleBack : undefined}
          progressPercent={progressPercent}
          logoUrl="/api/placeholder/96/96"
          showBackButton={currentStep > 0}
        />
        
        {/* Debug Info */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Estado do Quiz:</h3>
          <p><strong>Etapa atual:</strong> {currentStep + 1} de {QUIZ_STEPS.length}</p>
          <p><strong>Progresso:</strong> {progressPercent}%</p>
          <p><strong>Tipo de questão:</strong> {currentStep < 10 ? 'Principal (com imagens)' : 'Estratégica'}</p>
          <p><strong>Respostas:</strong></p>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
            {JSON.stringify(responses, null, 2)}
          </pre>
        </div>

        {/* Navegação manual para teste */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded">
            {currentStep + 1} / {QUIZ_STEPS.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentStep === QUIZ_STEPS.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditorSteps;
