import React from 'react';
import { Block } from '@/types/editor';
// Step13Template component
import LeadFormBlock from '@/components/blocks/LeadFormBlock';

const Step13Template: React.FC = () => {

  return (
    <div className="step13-template">
      <LeadFormBlock
        title="Vamos Personalizar Sua Experiência"
        fields={['name', 'email']}
        buttonText="Continuar"
        onSubmit={() => {}}
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
export const ConnectedStep13Template = Step13Template;
export default Step13Template;
