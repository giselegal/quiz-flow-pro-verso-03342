// @ts-nocheck
import { QuizOption } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface QuestionOptionEditorProps {
  option: QuizOption;
  questionType: 'text' | 'image' | 'both' | 'normal' | 'strategic';
  onUpdate: (option: QuizOption) => void;
  onDelete: () => void;
  index: number;
}

const styleCategories = [
  { value: 'Natural', label: 'Natural' },
  { value: 'Clássico', label: 'Clássico' },
  { value: 'Contemporâneo', label: 'Contemporâneo' },
  { value: 'Elegante', label: 'Elegante' },
  { value: 'Romântico', label: 'Romântico' },
  { value: 'Sexy', label: 'Sexy' },
  { value: 'Dramático', label: 'Dramático' },
  { value: 'Criativo', label: 'Criativo' },
];

const QuestionOptionEditor: React.FC<QuestionOptionEditorProps> = ({
  option,
  questionType,
  onUpdate,
  onDelete,
  index,
}) => {
  const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const letter = index < letterOptions.length ? letterOptions[index] : `#${index + 1}`;

  const handleChange = (field: keyof QuizOption, value: any) => {
    onUpdate({
      ...option,
      [field]: value,
    });
  };

  return (
    <Card className="shadow-sm border-[#B89B7A]/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#B89B7A] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            {letter}
          </div>

          <div className="grid gap-4 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor={`option-text-${option.id}`}>Texto da opção</Label>
                <Input
                  id={`option-text-${option.id}`}
                  value={option.text}
                  onChange={e => handleChange('text', e.target.value)}
                  placeholder="Digite o texto da opção"
                />
              </div>

              <div>
                <Label htmlFor={`option-category-${option.id}`}>Categoria de Estilo</Label>
                <Select
                  value={option.styleCategory}
                  onValueChange={(value: any) => handleChange('styleCategory', value)}
                >
                  <SelectTrigger id={`option-category-${option.id}`}>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleCategories.filter(category => category.value && category.value !== '').map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(questionType === 'image' || questionType === 'both') && (
              <div>
                <Label htmlFor={`option-image-${option.id}`}>URL da imagem</Label>
                <div className="flex gap-2">
                  <Input
                    id={`option-image-${option.id}`}
                    value={option.imageUrl || ''}
                    onChange={e => handleChange('imageUrl', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
                {option.imageUrl && (
                  <div className="mt-2 max-w-[100px] max-h-[100px] overflow-hidden rounded border">
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="w-full h-auto object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/100x100?text=Erro';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label htmlFor={`option-points-${option.id}`} className="mb-0">
                  Pontos:
                </Label>
                <Select
                  value={String(option.points)}
                  onValueChange={value => handleChange('points', parseInt(value))}
                >
                  <SelectTrigger id={`option-points-${option.id}`} className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" variant="ghost" onClick={onDelete} style={{ color: '#432818' }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionOptionEditor;
