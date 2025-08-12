// @ts-nocheck
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface HeadingProperties {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const HeadingBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    text = 'Título',
    level = 'h2',
    color = '#1a1a1a',
    fontSize,
    fontWeight = 'bold',
    textAlign = 'center',
    margin = 'md',
    fontFamily = 'sans',
  } = (properties || {}) as HeadingProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getDefaultFontSize = () => {
    const sizeMap = {
      h1: 'text-4xl md:text-5xl',
      h2: 'text-3xl md:text-4xl',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
      h5: 'text-lg md:text-xl',
      h6: 'text-base md:text-lg',
    };
    return sizeMap[level] || sizeMap.h2;
  };

  const getWeightClass = () => {
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    return weightMap[fontWeight] || weightMap.bold;
  };

  const getAlignClass = () => {
    const alignMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };
    return alignMap[textAlign] || alignMap.center;
  };

  const getMarginClass = () => {
    const marginMap = {
      none: '',
      sm: 'm-2',
      md: 'm-4',
      lg: 'm-6',
    };
    return marginMap[margin] || marginMap.md;
  };

  const getFontFamilyClass = () => {
    const fontMap = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
    };
    return fontMap[fontFamily] || fontMap.sans;
  };

  const HeadingTag = level as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={cn(
        'heading-block w-full transition-all duration-200 outline-none',
        fontSize ? '' : getDefaultFontSize(),
        getWeightClass(),
        getAlignClass(),
        getMarginClass(),
        getFontFamilyClass(),
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50 rounded-md'
      )}
      style={{
        color,
        fontSize: fontSize || undefined,
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onBlur={e => handlePropertyUpdate('text', e.target.textContent || '')}
      onClick={onClick}
    >
      {text}
    </HeadingTag>
  );
};

export default HeadingBlock;
