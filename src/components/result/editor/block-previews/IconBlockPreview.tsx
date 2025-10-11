import { cn } from '@/lib/utils';
import { dynamicIconImport } from '@/utils/dynamicIconImport';

interface IconBlockPreviewProps {
  content: {
    icon?: string;
    size?: string;
    color?: string;
    title?: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    style?: any;
  };
}

const IconBlockPreview: React.FC<IconBlockPreviewProps> = ({ content }) => {
  const {
    icon = 'star',
    size = '32px',
    color = '#B89B7A',
    title = '',
    position = 'top',
    style = {},
  } = content;

  // Get the icon component as a React ElementType
  const IconComponent = dynamicIconImport(icon);

  const containerStyle = {
    ...style,
    display: 'flex',
    flexDirection:
      position === 'right'
        ? 'row-reverse'
        : position === 'bottom'
          ? 'column-reverse'
          : position === 'left'
            ? 'row'
            : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const sizeInPixels = parseInt(size) || 24;

  return (
    <div className="w-full" style={containerStyle as React.CSSProperties}>
      <div className="flex items-center justify-center">
        <IconComponent color={color} size={sizeInPixels} strokeWidth={1.5} />
      </div>

      {title && (
        <div
          className={cn('text-center', (position === 'left' || position === 'right') && 'flex-1')}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default IconBlockPreview;
