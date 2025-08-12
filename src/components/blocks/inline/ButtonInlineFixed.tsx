// @ts-nocheck
import { Button } from '@/components/ui/button';

const ButtonInlineFixed = ({ block, isSelected, onClick }) => {
  const { text = 'Click me', variant = 'default' } = block?.properties || {};

  return (
    <div onClick={onClick}>
      <Button variant={variant} className={isSelected ? 'ring-2 ring-primary' : ''}>
        {text}
      </Button>
    </div>
  );
};

export default ButtonInlineFixed;
