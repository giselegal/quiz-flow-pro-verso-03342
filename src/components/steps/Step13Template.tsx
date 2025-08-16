import React from 'react';
import { Block } from '@/types/editor';
import { useEditor } from '@/context/EditorContext';
import LeadFormBlock from '@/components/blocks/LeadFormBlock';

const Step13Template: React.FC = () => {
  const { quizState } = useEditor();
  
  const handleAnswerQuestion = (questionId: string, answer: any) => {
    if (quizState.answerStrategicQuestion) {
      quizState.answerStrategicQuestion(questionId, answer);
    }
  };

  return (
    <div className="step13-template">
      <LeadFormBlock
        id="step13-lead-form"
        properties={{
          title: "Vamos Personalizar Sua Experiência",
          fields: ['name', 'email'],
          submitText: "Continuar",
          backgroundColor: '#FFFFFF',
          borderColor: '#B89B7A',
          textColor: '#432818'
        }}
        onPropertyChange={() => {}}
      />
    </div>
  );
};

export const getStep13Template = (): Block[] => {
  return [
    {
      id: 'step13-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        progressValue: 65,
        showProgress: true,
      },
      content: {},
      order: 0,
    },
    {
      id: 'step13-lead-form',
      type: 'lead-form',
      properties: {
        title: "Vamos Personalizar Sua Experiência",
        fields: ['name', 'email'],
        submitText: "Continuar",
        backgroundColor: '#FFFFFF',
        borderColor: '#B89B7A',
        textColor: '#432818'
      },
      content: {},
      order: 1,
    }
  ];
};

// Export both the component and the template function
export { Step13Template };
export default Step13Template;
