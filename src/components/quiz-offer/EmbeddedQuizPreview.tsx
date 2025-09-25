import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { QuizOption } from '@/types/quiz';

const SAMPLE_OPTIONS: QuizOption[] = [
  {
    id: 'sample-1',
    label: 'Elegante e Sofisticado',
    value: 'elegante',
    text: 'Elegante e Sofisticado',
    styleCategory: 'Elegante',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/elegante-6_u1ghdr.jpg',
  },
  {
    id: 'sample-2',
    label: 'Romântico e Delicado',
    value: 'romantico',
    text: 'Romântico e Delicado',
    styleCategory: 'Romântico',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/romantico-6_idqrum.jpg',
  },
  {
    id: 'sample-3',
    label: 'Moderno e Despojado',
    value: 'moderno',
    text: 'Moderno e Despojado',
    styleCategory: 'Moderno',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/moderno-6_x0vkzg.jpg',
  },
  {
    id: 'sample-4',
    label: 'Clássico Atemporal',
    value: 'classico',
    text: 'Clássico Atemporal',
    styleCategory: 'Clássico',
    imageUrl:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/classico-6_fpqeg9.jpg',
  },
];

export const EmbeddedQuizPreview = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="quiz-preview-embed max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#432818] mb-2">
          Qual estilo mais combina com você?
        </h2>
        <p className="text-[#8F7A6A]">Escolha a opção que mais representa seu gosto pessoal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {SAMPLE_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedOption === option.id
                ? 'ring-2 ring-[#B89B7A] bg-[#B89B7A]/5'
                : 'hover:shadow-lg hover:scale-[1.02]'
            }`}
            onClick={() => setSelectedOption(option.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {selectedOption === option.id && (
                  <div className="absolute top-2 right-2 bg-[#B89B7A] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#432818] text-center">
                  {option.text}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          className="bg-[#B89B7A] hover:bg-[#9D8569] text-white px-8 py-2 rounded-lg"
          disabled={!selectedOption}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};