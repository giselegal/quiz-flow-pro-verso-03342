import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// Interface simplificada para etapas
export interface QuizStep {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  type:
    | "intro"
    | "name-input"
    | "question"
    | "transition"
    | "strategic"
    | "result"
    | "offer"
    | "custom";
  description: string;
  multiSelect?: number;
}

// Interface para o contexto
interface StepsContextType {
  steps: QuizStep[];
  selectedStepId: string | null;
  setSelectedStepId: (id: string) => void;
  addStep: () => void;
  updateStep: (stepId: string, updates: Partial<QuizStep>) => void;
  deleteStep: (stepId: string) => void;
  duplicateStep: (stepId: string) => void;
  reorderStep: (draggedId: string, targetId: string) => void;
  populateStep: (stepId: string) => void;
  getStepById: (stepId: string) => QuizStep | undefined;
}

// Criar o contexto
const StepsContext = createContext<StepsContextType | undefined>(undefined);

// As 21 etapas iniciais do quiz
const initialQuiz21Steps: QuizStep[] = [
  {
    id: "etapa-1",
    name: "Introdução",
    order: 1,
    blocksCount: 0,
    isActive: true,
    type: "intro",
    description: "Apresentação do Quiz de Estilo",
  },
  {
    id: "etapa-2",
    name: "Coleta de Nome",
    order: 2,
    blocksCount: 0,
    isActive: false,
    type: "name-input",
    description: "Captura do nome do participante",
  },
  {
    id: "etapa-3",
    name: "Q1: Tipo de Roupa",
    order: 3,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
    multiSelect: 3,
  },
  {
    id: "etapa-4",
    name: "Q2: Personalidade",
    order: 4,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "RESUMA A SUA PERSONALIDADE:",
    multiSelect: 3,
  },
  {
    id: "etapa-5",
    name: "Q3: Visual",
    order: 5,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
    multiSelect: 3,
  },
  {
    id: "etapa-6",
    name: "Q4: Detalhes",
    order: 6,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAIS DETALHES VOCÊ GOSTA?",
    multiSelect: 3,
  },
  {
    id: "etapa-7",
    name: "Q5: Estampas",
    order: 7,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
    multiSelect: 3,
  },
  {
    id: "etapa-8",
    name: "Q6: Casacos",
    order: 8,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAL CASACO É SEU FAVORITO?",
    multiSelect: 3,
  },
  {
    id: "etapa-9",
    name: "Q7: Calças",
    order: 9,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAL SUA CALÇA FAVORITA?",
    multiSelect: 3,
  },
  {
    id: "etapa-10",
    name: "Q8: Sapatos",
    order: 10,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
    multiSelect: 3,
  },
  {
    id: "etapa-11",
    name: "Q9: Acessórios",
    order: 11,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
    multiSelect: 3,
  },
  {
    id: "etapa-12",
    name: "Q10: Tecidos",
    order: 12,
    blocksCount: 0,
    isActive: false,
    type: "question",
    description: "O QUE MAIS VALORIZAS NOS ACESSÓRIOS?",
    multiSelect: 3,
  },
  {
    id: "etapa-13",
    name: "Transição",
    order: 13,
    blocksCount: 0,
    isActive: false,
    type: "transition",
    description: "Análise dos resultados parciais",
  },
  {
    id: "etapa-14",
    name: "S1: Dificuldades",
    order: 14,
    blocksCount: 0,
    isActive: false,
    type: "strategic",
    description: "Principal dificuldade com roupas",
  },
  {
    id: "etapa-15",
    name: "S2: Problemas",
    order: 15,
    blocksCount: 0,
    isActive: false,
    type: "strategic",
    description: "Problemas frequentes de estilo",
  },
  {
    id: "etapa-16",
    name: "S3: Frequência",
    order: 16,
    blocksCount: 0,
    isActive: false,
    type: "strategic",
    description: '"Com que roupa eu vou?" - frequência',
  },
  {
    id: "etapa-17",
    name: "S4: Guia de Estilo",
    order: 17,
    blocksCount: 0,
    isActive: false,
    type: "strategic",
    description: "O que valoriza em um guia",
  },
  {
    id: "etapa-18",
    name: "S5: Investimento",
    order: 18,
    blocksCount: 0,
    isActive: false,
    type: "strategic",
    description: "Quanto investiria em consultoria",
  },
  {
    id: "etapa-19",
    name: "S6: Ajuda Imediata",
    order: 19,
    blocksCount: 0,
    isActive: false,
    type: "strategic",
    description: "O que mais precisa de ajuda",
  },
  {
    id: "etapa-20",
    name: "Resultado",
    order: 20,
    blocksCount: 0,
    isActive: false,
    type: "result",
    description: "Página de resultado personalizada",
  },
  {
    id: "etapa-21",
    name: "Oferta",
    order: 21,
    blocksCount: 0,
    isActive: false,
    type: "offer",
    description: "Apresentação da oferta final",
  },
];

// Provider Component
export const StepsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Recuperar estado salvo ou usar o padrão
  const getSavedSteps = () => {
    try {
      const savedSteps = localStorage.getItem("quiz-steps");
      return savedSteps ? JSON.parse(savedSteps) : initialQuiz21Steps;
    } catch (error) {
      console.error("Erro ao carregar etapas do localStorage:", error);
      return initialQuiz21Steps;
    }
  };

  const [steps, setSteps] = useState<QuizStep[]>(getSavedSteps);
  const [selectedStepId, setSelectedStepId] = useState<string | null>("etapa-1");

  // Salvar etapas no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("quiz-steps", JSON.stringify(steps));
  }, [steps]);

  // Adicionar nova etapa
  const addStep = useCallback(() => {
    const newStep: QuizStep = {
      id: `etapa-${Date.now()}`,
      name: `Etapa ${steps.length + 1}`,
      order: steps.length + 1,
      blocksCount: 0,
      isActive: false,
      type: "custom",
      description: `Etapa personalizada ${steps.length + 1}`,
    };
    setSteps(prev => [...prev, newStep]);
  }, [steps.length]);

  // Atualizar etapa
  const updateStep = useCallback((stepId: string, updates: Partial<QuizStep>) => {
    setSteps(prev => prev.map(step => (step.id === stepId ? { ...step, ...updates } : step)));
  }, []);

  // Excluir etapa
  const deleteStep = useCallback(
    (stepId: string) => {
      if (steps.length <= 1) {
        alert("Não é possível excluir a última etapa");
        return;
      }

      setSteps(prev => prev.filter(step => step.id !== stepId));

      if (selectedStepId === stepId) {
        // Selecionar a etapa anterior ou a primeira se não houver anterior
        const currentIndex = steps.findIndex(step => step.id === stepId);
        const newSelectedIndex = Math.max(0, currentIndex - 1);
        setSelectedStepId(steps[newSelectedIndex].id);
      }
    },
    [steps, selectedStepId]
  );

  // Duplicar etapa
  const duplicateStep = useCallback(
    (stepId: string) => {
      const stepToDuplicate = steps.find(step => step.id === stepId);
      if (stepToDuplicate) {
        const newStep: QuizStep = {
          ...stepToDuplicate,
          id: `etapa-${Date.now()}`,
          name: `${stepToDuplicate.name} (cópia)`,
          isActive: false,
          blocksCount: 0, // Blocos seriam duplicados em outra etapa do processo
        };
        setSteps(prev => [...prev, newStep]);
      }
    },
    [steps]
  );

  // Reordenar etapas
  const reorderStep = useCallback(
    (draggedId: string, targetId: string) => {
      const draggedIndex = steps.findIndex(step => step.id === draggedId);
      const targetIndex = steps.findIndex(step => step.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newSteps = [...steps];
      const [draggedStep] = newSteps.splice(draggedIndex, 1);
      newSteps.splice(targetIndex, 0, draggedStep);

      // Atualizar ordem de todas as etapas
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index + 1,
      }));

      setSteps(updatedSteps);
    },
    [steps]
  );

  // Popular etapa com blocos padrão (implementação simplificada)
  const populateStep = useCallback((stepId: string) => {
    console.log(`Populando etapa ${stepId} com blocos padrão`);

    // Aqui você poderia ter uma lógica para pegar os blocos do template
    // e depois atualizaria a contagem de blocos da etapa

    setSteps(prev =>
      prev.map(step =>
        step.id === stepId
          ? { ...step, blocksCount: step.blocksCount + 3 } // Suponha que adicionamos 3 blocos
          : step
      )
    );
  }, []);

  // Obter etapa por ID
  const getStepById = useCallback(
    (stepId: string) => {
      return steps.find(step => step.id === stepId);
    },
    [steps]
  );

  return (
    <StepsContext.Provider
      value={{
        steps,
        selectedStepId,
        setSelectedStepId,
        addStep,
        updateStep,
        deleteStep,
        duplicateStep,
        reorderStep,
        populateStep,
        getStepById,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

// Hook para usar o contexto
export const useSteps = () => {
  const context = useContext(StepsContext);
  if (context === undefined) {
    throw new Error("useSteps must be used within a StepsProvider");
  }
  return context;
};
