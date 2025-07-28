
import React from 'react';
import { Block } from '@/types/editor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Eye } from 'lucide-react';
import { CORRECT_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

interface QuizQuestionBlockConfigurableProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  isPreview?: boolean;
}

const QuizQuestionBlockConfigurable: React.FC<QuizQuestionBlockConfigurableProps> = ({
  block,
  isSelected,
  onSelect,
  onEdit,
  isPreview = false
}) => {
  const questionData = block.content?.questionData || CORRECT_QUIZ_QUESTIONS[0];
  const showImages = block.content?.showImages ?? true;
  const allowMultiple = block.content?.allowMultiple ?? false;
  const maxSelections = block.content?.maxSelections ?? 1;

  const handleOptionSelect = (optionId: string) => {
    if (isPreview) return;
    console.log('Option selected:', optionId);
  };

  if (isPreview) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#432818]">
          {questionData.question}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {questionData.options.map((option) => (
            <button
              key={option.id}
              className="group relative p-4 rounded-lg border-2 border-[#B89B7A]/30 hover:border-[#B89B7A] transition-all duration-200 bg-white hover:bg-[#FAF9F7]"
              onClick={() => handleOptionSelect(option.id)}
            >
              {showImages && option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-sm text-[#432818] font-medium text-center">
                {option.text}
              </p>
              {option.styleCategory && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#B89B7A] text-white text-xs rounded">
                  {option.styleCategory}
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-[#8F7A6A]">
          {allowMultiple ? `Selecione até ${maxSelections} opções` : 'Selecione uma opção'}
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : 'hover:bg-[#FAF9F7]'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-[#432818]">Questão Configurável</h3>
          <p className="text-sm text-[#8F7A6A] mt-1">
            {questionData.question}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#8F7A6A]">
          <span>Tipo: {allowMultiple ? 'Múltipla escolha' : 'Única escolha'}</span>
          {allowMultiple && <span>• Máx: {maxSelections}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8F7A6A]">
          <span>Opções: {questionData.options.length}</span>
          <span>• Imagens: {showImages ? 'Sim' : 'Não'}</span>
        </div>
      </div>
    </Card>
  );
};

export default QuizQuestionBlockConfigurable;
