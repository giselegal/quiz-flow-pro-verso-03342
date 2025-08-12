import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';

interface PricingBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const PricingBlockEditor: React.FC<PricingBlockEditorProps> = ({ block, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-price`}>Preço</Label>
        <Input
          id={`${block.id}-price`}
          value={block.content?.regularPrice || ''}
          onChange={e => onUpdate({ ...block.content, regularPrice: e.target.value })}
          className="mt-1"
          placeholder="R$ 99,90"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-sale-price`}>Preço Promocional</Label>
        <Input
          id={`${block.id}-sale-price`}
          value={block.content?.salePrice || ''}
          onChange={e => onUpdate({ ...block.content, salePrice: e.target.value })}
          className="mt-1"
          placeholder="R$ 49,90"
        />
      </div>

      <div>
        <Label htmlFor={`${block.id}-description`}>Descrição</Label>
        <Input
          id={`${block.id}-description`}
          value={block.content?.description || ''}
          onChange={e => onUpdate({ ...block.content, description: e.target.value })}
          className="mt-1"
          placeholder="Descrição do produto"
        />
      </div>
    </div>
  );
};

export default PricingBlockEditor;
