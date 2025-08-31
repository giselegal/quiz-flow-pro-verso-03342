import { cn } from '@/lib/utils';

interface HeaderComponentProps {
  data: {
    title?: string;
    subtitle?: string;
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ data, style, isSelected }) => {
  return (
    <div
      className={cn('p-4 text-center', isSelected && 'outline-dashed outline-1 outline-[#B89B7A]')}
      style={{
        backgroundColor: style?.backgroundColor || 'transparent',
        color: style?.textColor || 'inherit',
      }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{data.title || 'Título Principal'}</h1>
      {data.subtitle && <p className="text-sm md:text-base opacity-75">{data.subtitle}</p>}
    </div>
  );
};

export default HeaderComponent;
