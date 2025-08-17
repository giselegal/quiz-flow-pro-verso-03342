import { Shield } from 'lucide-react';

export const SecurePurchaseElement = () => (
  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#8F7A6A]">
    <Shield className="w-4 h-4" />
    <span>Compra 100% segura e protegida</span>
  </div>
);

interface BuyButtonProps {
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
}

export const BuyButton: React.FC<BuyButtonProps> = ({
  onClick,
  className = '',
  style,
  onMouseEnter,
  onMouseLeave,
  children,
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    style={style}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </button>
);
