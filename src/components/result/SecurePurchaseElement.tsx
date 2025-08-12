import { Shield, Lock } from 'lucide-react';

interface SecurePurchaseElementProps {
  className?: string;
}

const SecurePurchaseElement: React.FC<SecurePurchaseElementProps> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 mt-4 text-xs text-[#3a3a3a]/70 ${className}`}
    >
      <Shield className="w-3 h-3" />
      <span>Pagamento 100% seguro</span>
      <Lock className="w-3 h-3" />
      <span>Site protegido</span>
    </div>
  );
};

export default SecurePurchaseElement;
