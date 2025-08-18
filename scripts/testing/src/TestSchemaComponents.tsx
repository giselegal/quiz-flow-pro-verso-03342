import React from 'react';
import QuizIntroBlock from '../components/blocks/quiz/QuizIntroBlock';
import { BlockData } from '../types/blocks';

/**
 * Teste básico dos componentes schema-driven corrigidos
 */

const testBlock: BlockData = {
  id: 'test-quiz-intro',
  type: 'quiz-intro',
  properties: {
    title: 'Descubra Seu Estilo Pessoal',
    subtitle: 'Um quiz personalizado para você',
    description: 'Teste de funcionalidade dos componentes corrigidos',
    buttonText: 'Começar Teste',
    backgroundColor: '#fffaf7',
    textColor: '#432818',
  },
};

const TestSchemaComponents: React.FC = () => {
  const handlePropertyChange = (key: string, value: any) => {
    console.log('Property changed:', key, value);
  };

  const handleQuizStart = (nome: string) => {
    console.log('Quiz started by:', nome);
  };

  return (
    <div>
      <h1>Teste dos Componentes Schema-Driven</h1>

      <div style={{ marginTop: '20px' }}>
        <h2>QuizIntroBlock</h2>
        <QuizIntroBlock
          block={testBlock}
          isSelected={false}
          isEditing={false}
          onClick={() => console.log('Block clicked')}
          onPropertyChange={handlePropertyChange}
          onStart={handleQuizStart}
        />
      </div>
    </div>
  );
};

export default TestSchemaComponents;
