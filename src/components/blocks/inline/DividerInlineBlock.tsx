// @ts-nocheck
import type { BlockComponentProps } from '@/types/blocks';
import { cn } from '@/lib/utils';
import { getMarginClass, MarginProps, defaultMargins } from '@/utils/marginUtils';

interface Props extends BlockComponentProps, MarginProps {
  style?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  marginY?: number;
  className?: string;
  [key: string]: any;
}

const DividerInlineBlock: React.FC<Props> = ({
  style = 'solid',
  thickness = 1,
  color = '#432818',
  marginY = 20,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full flex items-center justify-center',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      style={{ marginTop: `${marginY}px`, marginBottom: `${marginY}px` }}
      {...props}
    >
      <hr
        className="w-full"
        style={{
          borderStyle: style,
          borderWidth: `${thickness}px 0 0 0`,
          borderColor: color,
          margin: 0,
        }}
      />
    </div>
  );
};

export default DividerInlineBlock;
