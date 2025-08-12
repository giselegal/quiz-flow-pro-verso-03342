import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { QuizOption } from '../quiz/QuizOption';
import { QuizOption as QuizOptionType } from '@/types/quiz';

const SAMPLE_OPTIONS: QuizOptionType[] = [
  {
    id: 'sample-1',
    text: 'Elegante e Sofisticado',
    styleCategory: 'Elegante',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/elegante-6_u1ghdr.jpg',
  },
  {
    id: 'sample-2',
    text: 'Contemporâneo e Moderno',
    styleCategory: 'Contemporâneo',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/contemporaneo-6_riqfun.jpg',
  },
  {
    id: 'sample-3',
    text: 'Romântico e Delicado',
    styleCategory: 'Romântico',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095492/style-quiz/romantico-6_nkahb3.jpg',
  },
  {
    id: 'sample-4',
    text: 'Sexy e Empoderado',
    styleCategory: 'Sexy',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095492/style-quiz/sexy-6_xvvf64.jpg',
  },
];

interface EmbeddedQuizPreviewProps {
  onStartQuiz: () => void;
}

export const EmbeddedQuizPreview: React.FC<EmbeddedQuizPreviewProps> = ({ onStartQuiz }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  return (
    <Card className="shadow-md border border-[#EAE4DA] bg-[#F9F7F4] overflow-hidden">
      <CardContent className="p-4">
        <h3 className="text-xl font-playfair text-[#432818] text-center mb-4">
          Qual estilo combina mais com você?
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {SAMPLE_OPTIONS.map(option => (
            <div key={option.id} className="aspect-[3/4]">
              <QuizOption
                option={option}
                isSelected={selectedOption === option.id}
                onSelect={handleOptionSelect}
                type="both"
                questionId="sample"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={onStartQuiz}
          className="w-full mt-3 bg-[#B89B7A] hover:bg-[#A68A6A] text-white"
        >
          Descobrir Meu Estilo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="text-xs text-center text-[#432818]/70 mt-3">
          Este é apenas um exemplo. O quiz completo tem vários passos para identificar seu estilo
          com precisão.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmbeddedQuizPreview;
