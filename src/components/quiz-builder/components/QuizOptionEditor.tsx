// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Image, Plus } from 'lucide-react';

interface QuizOptionEditorProps {
  option: {
    text: string;
    imageUrl?: string;
    styleCategory?: string;
  };
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  showImage?: boolean;
}

const QuizOptionEditor: React.FC<QuizOptionEditorProps> = ({
  option,
  index,
  onUpdate,
  onRemove,
  showImage = false,
}) => {
  return (
    <div className="space-y-4 p-4 border border-[#B89B7A]/20 rounded-lg hover:border-[#B89B7A]/40 transition-colors">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-[#432818]">Opção {index + 1}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          style={{ color: '#432818' }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`option-text-${index}`} className="text-[#432818]">
            Texto
          </Label>
          <Input
            id={`option-text-${index}`}
            value={option.text}
            onChange={e => onUpdate(index, 'text', e.target.value)}
            placeholder="Digite o texto da opção"
            className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]"
          />
        </div>

        {showImage && (
          <div className="space-y-2">
            <Label htmlFor={`option-image-${index}`} className="text-[#432818]">
              Imagem
            </Label>
            <div className="flex gap-2">
              <Input
                id={`option-image-${index}`}
                value={option.imageUrl || ''}
                onChange={e => onUpdate(index, 'imageUrl', e.target.value)}
                placeholder="URL da imagem"
                className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 border-[#B89B7A]/30 hover:bg-[#B89B7A]/10"
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`option-category-${index}`} className="text-[#432818]">
            Categoria de Estilo
          </Label>
          <Input
            id={`option-category-${index}`}
            value={option.styleCategory || ''}
            onChange={e => onUpdate(index, 'styleCategory', e.target.value)}
            placeholder="Categoria de estilo"
            className="border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizOptionEditor;
