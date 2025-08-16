// Teste dos componentes Step 1 - Verificação de integração
// src/test/step01-components-test.tsx

import { IntroBlock } from '@/components/steps/step01/IntroBlock';
import { IntroPropertiesPanel } from '@/components/steps/step01/IntroPropertiesPanel';

// Mock data para teste
const mockBlock = {
  id: 'test-intro-block',
  type: 'step01-intro',
  properties: {
    title: 'Bem-vindo ao Quiz de Estilo Pessoal',
    descriptionTop: 'Descubra seu estilo único',
    descriptionBottom:
      'Responda às perguntas a seguir para descobrir qual estilo combina mais com você.',
    imageIntro:
      'https://res.cloudinary.com/dg3fsapzu/image/upload/v1723251877/intro-illustration.png',
    inputLabel: 'Seu Nome',
    inputPlaceholder: 'Digite seu nome aqui',
    showImage: true,
    showInput: true,
    scale: 100,
    alignment: 'center' as const,
    backgroundColor: 'transparent',
    textColor: '#000000',
  },
};

const mockOnUpdate = (blockId: string, updates: any) => {
  console.log('Update block:', blockId, updates);
};

// Componente de teste
export const Step01ComponentsTest = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">IntroBlock Component</h2>
        <div className="border rounded-lg p-4">
          <IntroBlock
            block={{
              id: mockBlock.id,
              type: mockBlock.type,
              properties: mockBlock.properties,
              content: {},
              order: 0,
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">IntroPropertiesPanel Component</h2>
        <div className="border rounded-lg p-4 w-80">
          <IntroPropertiesPanel selectedBlock={mockBlock} onUpdate={mockOnUpdate} />
        </div>
      </div>
    </div>
  );
};

export default Step01ComponentsTest;
