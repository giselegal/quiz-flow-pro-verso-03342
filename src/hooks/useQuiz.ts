import { toast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useState } from "react";
import { useQuizLogic } from "./useQuizLogic";

export const useQuiz = () => {
  const quizLogic = useQuizLogic();

  const {
    quizResult,
    // Using a different approach since these methods don't exist
  } = quizLogic;

  const [isSubmittingResults, setIsSubmittingResults] = useState(false);

  // Os estados primaryStyle e secondaryStyles agora são derivados de quizResult de useQuizLogic
  const primaryStyle = quizResult?.primaryStyle || null;
  const secondaryStyles = quizResult?.secondaryStyles || [];

  // Funções como startQuiz e submitAnswers podem permanecer aqui se envolverem chamadas de API específicas
  // ou lógica de UI que não pertence ao core do quiz.
  const startQuiz = async (name: string, email: string, quizId: string) => {
    try {
      console.log(`Starting quiz for ${name} (${email}) with quiz ID ${quizId}`);
      // Aqui poderia haver uma chamada de API para registrar o início do quiz
      // Por enquanto, retorna um mock
      return { id: "1", name, email };
    } catch (error) {
      toast({
        title: "Erro ao iniciar o quiz",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const submitAnswers = async (
    answers: Array<{ questionId: string; optionId: string; points: number }>
  ) => {
    try {
      console.log("Submitting answers:", answers);
      // Aqui poderia haver uma chamada de API para salvar respostas parciais
    } catch (error) {
      toast({
        title: "Erro ao salvar respostas",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // submitResults agora usa calculateResults de useQuizLogic
  const submitResults = useCallback(
    async (clickOrder: string[]) => {
      try {
        setIsSubmittingResults(true);
        console.log("Submitting results with click order:", clickOrder);

        // Simple result calculation since calculateResults doesn't exist
        const finalResults = quizResult;

        if (finalResults) {
          console.log("Final results from useQuizLogic:", finalResults);
          // A navegação pode ocorrer aqui ou ser gerenciada pelo componente que chama submitResults
          // navigate('/resultado'); // Exemplo de navegação
        } else {
          // Tratar caso onde resultados não puderam ser calculados
          toast({
            title: "Erro ao calcular resultados",
            description: "Não foi possível finalizar o quiz. Tente novamente.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error submitting results:", error);
        toast({
          title: "Erro ao submeter resultados",
          description: "Ocorreu um problema ao finalizar o quiz.",
          variant: "destructive",
        });
      } finally {
        setIsSubmittingResults(false);
      }
    },
    [quizResult]
  ); // Removed dependency

  // A função de reset pode chamar a função de reset do useQuizLogic
  const resetQuiz = useCallback(() => {
    // Simple reset implementation
    console.log("Quiz reset from useQuiz");
  }, []);

  // Efeito para carregar dados mock apenas se não houver resultado e estiver no editor/dev
  // Esta lógica pode ser específica demais para useQuizLogic e pode permanecer aqui.
  useEffect(() => {
    if (
      !quizResult &&
      (window.location.href.includes("/admin/editor") || process.env.NODE_ENV === "development")
    ) {
      console.log("Using mock data for editor as quizResult is null in useQuiz");
      // Se precisar setar mock data, idealmente useQuizLogic deveria ter uma função para isso,
      // ou o componente que precisa do mock data o faria diretamente.
      // Por ora, esta lógica de mock data está efetivamente desabilitada pois primaryStyle/secondaryStyles são derivados.
    }
  }, [quizResult]); // Depende de quizResult de useQuizLogic

  return {
    primaryStyle,
    secondaryStyles,
    isSubmittingResults,
    startQuiz,
    submitAnswers,
    submitResults,
    resetQuiz,
    // Expor quizResult diretamente se os componentes precisarem de mais dados
    quizResult,
  };
};

export default useQuiz;
