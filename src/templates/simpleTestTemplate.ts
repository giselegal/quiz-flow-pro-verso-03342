/**
 * 🧪 TEMPLATE DE TESTE SIMPLES
 * 
 * Template básico para testar o carregamento
 */

export const simpleTestTemplate = {
  id: 'simpleTestTemplate',
  name: 'Template de Teste Simples',
  description: 'Template básico para debug',
  category: 'test',
  stepCount: 2,
  
  config: {
    globalConfig: {
      theme: {
        primaryColor: "#0066CC",
        secondaryColor: "#FF6B35"
      }
    }
  },
  
  steps: [
    {
      stepNumber: 1,
      type: 'intro',
      title: 'Bem-vindo',
      subtitle: 'Este é um teste',
      blocks: [
        {
          id: 'intro-block-1',
          type: 'text',
          content: {
            text: 'Olá! Este é um template de teste.'
          }
        }
      ]
    },
    {
      stepNumber: 2,
      type: 'question',
      title: 'Pergunta de Teste',
      blocks: [
        {
          id: 'question-block-1',
          type: 'text',
          content: {
            text: 'Esta é uma pergunta de teste?'
          }
        }
      ]
    }
  ]
};

export default simpleTestTemplate;
