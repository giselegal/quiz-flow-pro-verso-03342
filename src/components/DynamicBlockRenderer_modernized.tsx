// @ts-nocheck
import { safeGetBlockProperties, logBlockDebug, isValidBlock } from '@/utils/blockUtils';

interface QuestionBlockProps {
  question: string;
  allowMultiple: boolean;
  maxSelections: number;
  showImages: boolean;
  options: Array<{
    id: string;
    text: string;
    styleCategory: string;
    points: number;
    keywords: string[];
    imageUrl?: string; // Add optional imageUrl property
  }>;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  maxSecondaryStyles: number;
  height?: string | number;
  questionId?: string;
  autoAdvance?: boolean;
}

const DynamicBlockRenderer: React.FC<{ block: any }> = ({ block }) => {
  // Validate block first
  if (!isValidBlock(block)) {
    console.warn('⚠️ Invalid block received:', block);
    return <div style={{ borderColor: '#E5DDD5' }}>Block inválido</div>;
  }

  logBlockDebug('DynamicBlockRenderer', block);
  const properties = safeGetBlockProperties(block);

  const renderQuestionBlock = (questionProps: QuestionBlockProps) => {
    const {
      question,
      options = [],
      allowMultiple = false,
      maxSelections = 1,
      showImages = false,
      height = 'auto',
      questionId = block.id,
      autoAdvance = false,
      title,
      subtitle,
      description,
      backgroundColor,
      textColor,
      borderRadius,
      padding,
      margin,
      fontSize,
      fontWeight,
      maxSecondaryStyles,
    } = questionProps;

    return (
      <div className="question-block p-6 bg-white rounded-lg shadow-sm border" style={{ height }}>
        <h3 className="text-xl font-medium mb-4">{question}</h3>
        <div className="space-y-3">
          {options.map(option => (
            <div
              key={option.id}
              style={{ backgroundColor: '#FAF9F7' }}
              onClick={() => {
                if (autoAdvance) {
                  console.log(
                    `Auto-advancing from question ${questionId} with option ${option.id}`
                  );
                }
              }}
            >
              {showImages && option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-16 h-16 object-cover rounded mb-2"
                />
              )}
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle different block types
  switch (block.type) {
    case 'question':
    case 'quiz-question':
      return renderQuestionBlock(properties as QuestionBlockProps);

    case 'text':
      return (
        <div className="text-block p-4">
          <p>{properties.text || 'Texto não definido'}</p>
        </div>
      );

    case 'image':
      return (
        <div className="image-block">
          {properties.imageUrl ? (
            <img
              src={properties.imageUrl}
              alt={properties.alt || 'Imagem'}
              className="max-w-full h-auto rounded"
            />
          ) : (
            <div style={{ backgroundColor: '#E5DDD5' }}>
              <span style={{ color: '#8B7355' }}>Imagem não definida</span>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div style={{ borderColor: '#E5DDD5' }}>
          <p style={{ color: '#6B4F43' }}>Tipo de bloco desconhecido: {block.type}</p>
        </div>
      );
  }
};

export default DynamicBlockRenderer;
