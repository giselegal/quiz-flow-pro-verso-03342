import { cn } from '@/lib/utils';

interface TextComponentProps {
  data: {
    text?: string;
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
  isHeadline?: boolean;
}

const TextComponent: React.FC<TextComponentProps> = ({
  data,
  style,
  isSelected,
  isHeadline = false,
}) => {
  return (
    <div
      className={cn('p-4', isSelected && 'outline-dashed outline-1 outline-[#B89B7A]')}
      style={{
        backgroundColor: style?.backgroundColor || 'transparent',
        color: style?.textColor || 'inherit',
      }}
    >
      {isHeadline ? (
        <h2 className="text-xl md:text-2xl font-medium mb-1">{data.text || 'Título da Seção'}</h2>
      ) : (
        <p className="text-base leading-relaxed">{data.text || 'Texto do parágrafo'}</p>
      )}
    </div>
  );
};

export default TextComponent;
