import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts';
import { StyleResult } from '@/types/quiz';

interface HeaderProps {
  primaryStyle?: StyleResult;
  logoHeight?: number;
  logo?: string;
  logoAlt?: string;
  userName?: string;
  isScrolled?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  primaryStyle: _primaryStyle,
  logoHeight = 50,
  logo,
  logoAlt = 'Logo',
  userName,
  isScrolled: _isScrolled,
  className = '',
}) => {
  const { user } = useAuth();
  const displayName =
    userName ||
    (user as any)?.userName ||
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.email ||
    'Visitante';

  return (
    <Card className={`bg-white shadow-sm p-6 mb-4 md:mb-6 border-0 ${className}`}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex justify-center w-full">
          <img
            src={logo}
            alt={logoAlt}
            className="h-auto mx-auto"
            style={{ height: `${logoHeight}px`, maxWidth: '100%' }}
          />
        </div>

        <h1 className="text-xl md:text-2xl font-playfair text-[#432818] leading-relaxed">
          Parabéns, <span className="font-bold">{displayName}</span>!
          <br className="sm:hidden" />
          <span className="text-xl md:text-2xl text-[#aa6b5d]"> Seu Estilo Predominante é:</span>
        </h1>
      </div>
    </Card>
  );
};
