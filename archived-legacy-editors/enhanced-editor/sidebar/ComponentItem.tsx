import { Block } from '@/types/editor';
import { LucideIcon } from 'lucide-react';

interface ComponentItemProps {
  type: Block['type'];
  label: string;
  icon: LucideIcon;
  description: string;
  onSelect: (type: Block['type']) => void;
}

export function ComponentItem({
  type,
  label,
  icon: Icon,
  description,
  onSelect,
}: ComponentItemProps) {
  return (
    <div
      className="border border-[#B89B7A]/20 rounded-md bg-white hover:bg-[#FAF9F7] transition-colors cursor-pointer overflow-hidden"
      onClick={() => onSelect(type)}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-[#8F7A6A]" />
          <span className="font-medium text-[#432818]">{label}</span>
        </div>
        <p className="text-xs text-[#8F7A6A]">{description}</p>
      </div>
    </div>
  );
}
