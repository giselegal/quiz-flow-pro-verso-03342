
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Settings } from 'lucide-react';

// Importar componentes de funil
import { FunnelStepBlock } from '@/components/funnel-blocks/editor/FunnelStepBlock';
import type { FunnelStepType } from '@/types/funnel';

export interface BlockComponentProps {
  content: any;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const TextBlock: React.FC<BlockComponentProps> = ({ content, onUpdate, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Texto</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Textarea
        placeholder="Digite o texto aqui..."
        value={content.text || ''}
        onChange={(e) => onUpdate({ ...content, text: e.target.value })}
        rows={4}
      />
    </div>
  );
};

export const QuestionBlock: React.FC<BlockComponentProps> = ({ content, onUpdate, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Pergunta</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Input
        placeholder="Digite a pergunta..."
        value={content.question || ''}
        onChange={(e) => onUpdate({ ...content, question: e.target.value })}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Opções:</label>
        {(content.options || ['', '']).map((option: string, index: number) => (
          <Input
            key={index}
            placeholder={`Opção ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...(content.options || ['', ''])];
              newOptions[index] = e.target.value;
              onUpdate({ ...content, options: newOptions });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const ImageBlock: React.FC<BlockComponentProps> = ({ content, onUpdate, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Imagem</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Input
        placeholder="URL da imagem"
        value={content.imageUrl || ''}
        onChange={(e) => onUpdate({ ...content, imageUrl: e.target.value })}
      />
      <Input
        placeholder="Texto alternativo"
        value={content.alt || ''}
        onChange={(e) => onUpdate({ ...content, alt: e.target.value })}
      />
      {content.imageUrl && (
        <div className="mt-4">
          <img 
            src={content.imageUrl} 
            alt={content.alt || 'Preview'} 
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

// Wrapper para componentes de funil
export const FunnelStepBlockWrapper: React.FC<BlockComponentProps & { stepType: FunnelStepType; stepNumber: number }> = ({ 
  content, 
  onUpdate, 
  onDelete, 
  stepType, 
  stepNumber 
}) => {
  const block = {
    id: `step-${stepNumber}`,
    type: 'funnel-step',
    properties: {
      stepType,
      stepNumber,
      totalSteps: 21,
      ...content
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Etapa {stepNumber}: {stepType}</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <FunnelStepBlock
        block={block}
        onPropertyChange={(key, value) => {
          onUpdate({ ...content, [key]: value });
        }}
      />
    </div>
  );
};

// Componentes específicos para cada etapa do funil
export const FunnelIntroBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="intro" stepNumber={1} />
);

export const NameCollectBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="name-collect" stepNumber={2} />
);

export const QuizIntroBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="quiz-intro" stepNumber={3} />
);

export const QuestionMultipleBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="question-multiple" stepNumber={4} />
);

export const QuizTransitionBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="quiz-transition" stepNumber={15} />
);

export const ProcessingBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="processing" stepNumber={16} />
);

export const ResultIntroBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="result-intro" stepNumber={17} />
);

export const ResultDetailsBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="result-details" stepNumber={18} />
);

export const ResultGuideBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="result-guide" stepNumber={19} />
);

export const OfferTransitionBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="offer-transition" stepNumber={20} />
);

export const OfferPageBlock: React.FC<BlockComponentProps> = (props) => (
  <FunnelStepBlockWrapper {...props} stepType="offer-page" stepNumber={21} />
);

export const blockComponents = {
  text: TextBlock,
  question: QuestionBlock,
  image: ImageBlock,
  
  // Componentes de funil
  'funnel-intro': FunnelIntroBlock,
  'name-collect': NameCollectBlock,
  'quiz-intro': QuizIntroBlock,
  'question-multiple': QuestionMultipleBlock,
  'quiz-transition': QuizTransitionBlock,
  'processing': ProcessingBlock,
  'result-intro': ResultIntroBlock,
  'result-details': ResultDetailsBlock,
  'result-guide': ResultGuideBlock,
  'offer-transition': OfferTransitionBlock,
  'offer-page': OfferPageBlock,
};

// Exportar funções de utilidade
export const getBlocksByCategory = (category: string) => {
  return Object.keys(blockComponents).filter(key => {
    if (category === 'Funil') {
      return key.includes('funnel') || key.includes('collect') || key.includes('quiz') || 
             key.includes('question') || key.includes('processing') || key.includes('result') || 
             key.includes('offer');
    }
    return ['text', 'question', 'image'].includes(key);
  });
};

export const getPopularBlocks = () => {
  return ['funnel-intro', 'question-multiple', 'result-details', 'offer-page'];
};

export const searchBlocks = (query: string) => {
  return Object.keys(blockComponents).filter(key => 
    key.toLowerCase().includes(query.toLowerCase())
  );
};

export { blockComponents as BlockComponent };
export { BlockComponentProps };
