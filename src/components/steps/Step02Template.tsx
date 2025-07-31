// src/components/steps/Step02Template.tsx

// Esta função retorna o template (estrutura de blocos) para a Etapa 02 do quiz.
// Certifique-se de que esta função está exportada para ser utilizada em outros arquivos.
export function getStep02Template() {
  return [
    // Exemplo de um bloco de texto para a questão 1
    {
      id: "question-2-title",
      type: "QuizQuestionBlock",
      content: {
        question: "Qual o seu tipo de roupa favorita?",
        options: [
          { value: "casual", label: "Casual e confortável" },
          { value: "elegante", label: "Elegante e sofisticada" },
          { value: "esportiva", label: "Esportiva e funcional" },
          { value: "criativa", label: "Criativa e original" },
        ],
      },
      styles: {
        // Estilos Tailwind CSS para o bloco da questão
        container: "p-4 bg-white rounded-lg shadow-md",
        questionText: "text-lg font-semibold mb-4 text-gray-800",
        optionButton: "w-full text-left p-3 mb-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-200",
        selectedOptionButton: "bg-blue-500 text-white hover:bg-blue-600",
      },
      config: {
        // Configurações adicionais para o bloco
        allowMultiple: false, // Permite apenas uma seleção
        minSelections: 1,     // Requer pelo menos uma seleção
      },
    },
    // Você pode adicionar mais blocos aqui se a etapa 2 tiver mais conteúdo
  ];
}