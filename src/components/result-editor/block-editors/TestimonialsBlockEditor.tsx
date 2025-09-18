import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';

interface TestimonialsBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const TestimonialsBlockEditor: React.FC<TestimonialsBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="O que estão dizendo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonialsImage">URL da Imagem de Depoimentos</Label>
        <Input
          id="testimonialsImage"
          value={content.testimonialsImage || ''}
          onChange={e => onUpdate({ testimonialsImage: e.target.value })}
          placeholder="https://exemplo.com/depoimentos.jpg"
        />
        {content.testimonialsImage && (
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <img
              src={content.testimonialsImage}
              alt="Depoimentos"
              className="h-20 object-contain mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsBlockEditor;
