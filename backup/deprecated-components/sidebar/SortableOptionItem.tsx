import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { OptionItem } from './Sidebar';

interface SortableOptionItemProps {
  option: OptionItem;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onUpdate: (updates: Partial<OptionItem>) => void;
  onRemove: () => void;
}

const SortableOptionItem: React.FC<SortableOptionItemProps> = ({
  option,
  index,
  isExpanded,
  onToggleExpanded,
  onUpdate,
  onRemove
}) => {
  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="flex items-center gap-2"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          Option {index + 1}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-sm font-medium">Text</label>
            <Input
              value={option.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Option text"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={option.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              placeholder="Image URL"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableOptionItem;