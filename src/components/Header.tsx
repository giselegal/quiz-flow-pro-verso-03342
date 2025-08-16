import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StyleResult } from '@/types/quiz';
import React, { useEffect, useState } from 'react';

interface HeaderProps {
  primaryStyle?: StyleResult;
  logoHeight?: number;
  logoWidth?: number | string;
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
  logoWidth = 'auto',
  userName,
  isScrolled: _isScrolled,
  className = '',
}) => {
  const { user } = useAuth();
  const [fetchedName, setFetchedName] = useState<string | null>(null);

  // Try to fetch profile name directly from Supabase as a fallback when
  // the Auth context doesn't include a friendly name.
  useEffect(() => {
    let mounted = true;

    const tryFetchProfile = async () => {
      try {
        const id = (user as any)?.id;
        if (!id) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', id)
          .maybeSingle();
        if (!error && data && mounted) {
          setFetchedName((data as any).name || null);
        }
      } catch (err) {
        // ignore
      }
    };

    if (
      !userName &&
      user &&
      !((user as any)?.userName || (user as any)?.user_metadata?.full_name)
    ) {
      tryFetchProfile();
    }

    return () => {
      mounted = false;
    };
  }, [user, userName]);

  const displayName =
    userName ||
    fetchedName ||
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
            style={{
              height: `${logoHeight}px`,
              width: typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth,
              maxWidth: '100%',
            }}
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

export default Header;
