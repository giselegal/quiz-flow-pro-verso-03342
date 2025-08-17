// @ts-nocheck
import React, { useState } from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface StageQuestionComponentProps {
  data?: QuizComponentData['data'];
  style?: QuizComponentData['style'];
  isSelected?: boolean;
  onClick?: () => void;
  onUpdate?: (updates: any) => void;
}

const StageQuestionComponent: React.FC<StageQuestionComponentProps> = ({
  data = {},
  style = {},
  isSelected = false,
  onClick,
  onUpdate,
}) => {
  const [newOption, setNewOption] = useState('');

  const {
    question = 'Digite sua pergunta aqui...',
    options = ['Opção 1', 'Opção 2'],
    multiSelect = 0,
    autoAdvance = false,
    required = true,
  } = data;

  const handleAddOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...(data.options || []), newOption.trim()];
      onUpdate?.({ ...data, options: updatedOptions });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = (data.options || []).filter((_, i) => i !== index);
    onUpdate?.({ ...data, options: updatedOptions });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(data.options || [])];
    updatedOptions[index] = value;
    onUpdate?.({ ...data, options: updatedOptions });
  };

  const questionStyle = {
    backgroundColor: data.backgroundColorQuestion || '#FFFAF0',
    color: data.textColorQuestion || '#432818',
    ...style,
  };

  return (
    <Card
      className={`w-full min-h-[300px] p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[#B89B7A]' : ''
      }`}
      style={questionStyle}
      onClick={onClick}
    >
      <div className="space-y-6">
        {/* Question Header */}
        <div className="text-center">
          <h2
            className="text-xl md:text-2xl font-medium mb-4"
            style={{ color: data.textColorQuestion || '#432818' }}
          >
            {question || data.question || 'Digite sua pergunta aqui...'}
          </h2>

          {(multiSelect || data.multiSelect || 0) > 0 && (
            <p className="text-sm opacity-75">
              Selecione até {multiSelect || data.multiSelect} opções
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {(options || data.options || []).map((option: string, index: number) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg border-2 border-[#B89B7A]/20 hover:border-[#B89B7A]/40 transition-colors cursor-pointer"
              style={{
                borderColor: data.accentColor ? `${data.accentColor}40` : '#B89B7A40',
              }}
            >
              {(multiSelect || data.multiSelect || 0) > 0 ? (
                <input
                  type="checkbox"
                  className="mr-3"
                  style={{ accentColor: data.accentColor || '#B89B7A' }}
                />
              ) : (
                <input
                  type="radio"
                  name="quiz-option"
                  className="mr-3"
                  style={{ accentColor: data.accentColor || '#B89B7A' }}
                />
              )}

              <span className="flex-1 text-left">{option}</span>

              {isSelected && onUpdate && (
                <div className="flex items-center space-x-2 ml-2">
                  <Input
                    value={option}
                    onChange={e => handleOptionChange(index, e.target.value)}
                    className="w-32 h-8 text-xs"
                    onClick={e => e.stopPropagation()}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveOption(index);
                    }}
                    style={{ color: '#432818' }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Option (when selected) */}
        {isSelected && onUpdate && (
          <div className="flex items-center space-x-2">
            <Input
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              placeholder="Nova opção..."
              className="flex-1"
              onClick={e => e.stopPropagation()}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleAddOption();
                }
              }}
            />
            <Button
              size="sm"
              onClick={e => {
                e.stopPropagation();
                handleAddOption();
              }}
              className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center pt-4">
          <Button
            className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8"
            style={{
              backgroundColor: data.accentColor || '#B89B7A',
              color: data.buttonTextColor || 'white',
            }}
          >
            {autoAdvance || data.autoAdvance ? 'Próxima →' : 'Continuar →'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StageQuestionComponent;
