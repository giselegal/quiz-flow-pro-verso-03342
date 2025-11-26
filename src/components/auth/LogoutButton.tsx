import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/core/hooks/useEditorContext';
import { LogOut } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'ghost',
  size = 'default',
}) => {
  const { auth } = useEditorContext();
  const { signOut, isLoading } = auth;

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/auth';
    } catch (error) {
      appLogger.error('Logout error:', { data: [error] });
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={isLoading}>
      <LogOut className="h-4 w-4 mr-2" />
      Sair
    </Button>
  );
};
