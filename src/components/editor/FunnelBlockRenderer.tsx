
import React from 'react';
import { Block } from '@/types/editor';
import { FunnelIntroStep } from '@/components/funnel-blocks/steps/FunnelIntroStep';
import { NameCollectStep } from '@/components/funnel-blocks/steps/NameCollectStep';
import { QuizIntroStep } from '@/components/funnel-blocks/steps/QuizIntroStep';
import { CountdownTimerProps, ResultCardProps, OfferCardProps } from '@/types/blocks';

interface FunnelBlockRendererProps {
  block: Block;
  isEditable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

// Simple placeholder components for missing ones
const QuizTransitionStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Quiz Transition: {data.title || 'Transition'}</div>
);

const ProcessingStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Processing: {data.title || 'Processing...'}</div>
);

const ResultIntroStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Result Intro: {data.title || 'Your Result'}</div>
);

const ResultDetailsStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Result Details: {data.title || 'Details'}</div>
);

const ResultGuideStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Result Guide: {data.title || 'Guide'}</div>
);

const OfferTransitionStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Offer Transition: {data.title || 'Special Offer'}</div>
);

const OfferPageStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Offer Page: {data.title || 'Limited Time Offer'}</div>
);

const QuestionMultipleStep: React.FC<any> = ({ data }) => (
  <div className="p-4 border rounded">Question: {data.question || 'Sample Question'}</div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onComplete, showIcon, size, color }) => (
  <div className="p-4 border rounded">
    Countdown: {duration}s {showIcon && '⏰'}
  </div>
);

const ResultCard: React.FC<ResultCardProps> = ({ data, showButton, buttonText, onButtonClick, size }) => (
  <div className="p-4 border rounded">
    Result Card: {data?.title || 'Result'}
    {showButton && (
      <button onClick={onButtonClick} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
        {buttonText || 'View'}
      </button>
    )}
  </div>
);

const OfferCard: React.FC<OfferCardProps> = ({ data, showDiscount, onPurchase }) => (
  <div className="p-4 border rounded">
    Offer: {data?.title || 'Special Offer'}
    {showDiscount && <span className="ml-2 text-red-500">DISCOUNT!</span>}
    <button onClick={onPurchase} className="ml-2 px-2 py-1 bg-green-500 text-white rounded">
      Buy Now
    </button>
  </div>
);

export const FunnelBlockRenderer: React.FC<FunnelBlockRendererProps> = ({
  block,
  isEditable = false,
  onEdit,
  onDelete,
  stepNumber = 1,
  totalSteps = 21
}) => {
  const { type, content: data = {} } = block;

  // Common props for all step components
  const commonProps = {
    id: block.id,
    isEditable,
    onEdit,
    onDelete,
    stepNumber,
    totalSteps,
    data
  };

  switch (type) {
    case 'intro':
      return (
        <FunnelIntroStep
          {...commonProps}
          stepType="intro"
        />
      );

    case 'name-collect':
      return (
        <NameCollectStep
          {...commonProps}
          stepType="name-collect"
        />
      );

    case 'quiz-intro':
      return (
        <QuizIntroStep
          {...commonProps}
          stepType="quiz-intro"
        />
      );

    case 'question-multiple':
      return (
        <QuestionMultipleStep
          {...commonProps}
          stepType="question-multiple"
        />
      );

    case 'quiz-transition':
      return (
        <QuizTransitionStep
          {...commonProps}
          stepType="quiz-transition"
        />
      );

    case 'processing':
      return (
        <ProcessingStep
          {...commonProps}
          stepType="processing"
        />
      );

    case 'result-intro':
      return (
        <ResultIntroStep
          {...commonProps}
          stepType="result-intro"
        />
      );

    case 'result-details':
      return (
        <ResultDetailsStep
          {...commonProps}
          stepType="result-details"
        />
      );

    case 'result-guide':
      return (
        <ResultGuideStep
          {...commonProps}
          stepType="result-guide"
        />
      );

    case 'offer-transition':
      return (
        <OfferTransitionStep
          {...commonProps}
          stepType="offer-transition"
        />
      );

    case 'offer-page':
      return (
        <OfferPageStep
          {...commonProps}
          stepType="offer-page"
        />
      );

    // Special components
    case 'countdown':
      return (
        <CountdownTimer
          duration={data.duration || 60}
          onComplete={() => console.log('Countdown completed')}
          showIcon={data.showIcon || false}
          size={data.size || 'medium'}
          color={data.color || 'blue'}
        />
      );

    case 'result-card':
      return (
        <ResultCard
          data={data}
          showButton={data.showButton || false}
          buttonText={data.buttonText || 'View Result'}
          onButtonClick={() => console.log('Result card clicked')}
          size={data.size || 'medium'}
        />
      );

    case 'offer-card':
      return (
        <OfferCard
          data={data}
          showDiscount={data.showDiscount || false}
          onPurchase={() => console.log('Purchase clicked')}
        />
      );

    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded">
          <p className="text-gray-500">Unknown block type: {type}</p>
        </div>
      );
  }
};

export default FunnelBlockRenderer;
