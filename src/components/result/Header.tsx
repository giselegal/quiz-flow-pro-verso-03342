
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  // Get user name from metadata or email
  const getUserDisplayName = (user: User | null): string => {
    if (!user) return 'Usuário';
    
    // Try to get name from user metadata
    const metadata = user.user_metadata || {};
    if (metadata.full_name) return metadata.full_name;
    if (metadata.name) return metadata.name;
    
    // Fallback to email
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuário';
  };

  const displayName = getUserDisplayName(user);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Página de Resultado
          </h1>
          <p className="text-gray-600">
            Personalize sua página de resultados
          </p>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {displayName}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
