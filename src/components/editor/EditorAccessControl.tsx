import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, Users } from 'lucide-react';
import React from 'react';

interface EditorAccessControlProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'editor' | 'admin';
  requiredPlan?: 'free' | 'pro' | 'enterprise';
  feature?: string;
}

export const EditorAccessControl: React.FC<EditorAccessControlProps> = ({
  children,
  requiredRole = 'user',
  requiredPlan = 'free',
  feature = 'editor'
}) => {
  const { profile, hasPermission } = useAuth();

  // Verificar se o usuário está logado
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Você precisa estar logado para acessar o editor.
            </p>
            <Button asChild className="w-full">
              <a href="/auth">Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar permissões
  if (!hasPermission(`${feature}.use`)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-amber-500" />
            <CardTitle>Upgrade Necessário</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Este recurso requer um plano superior.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline">Seu plano: {profile.plan}</Badge>
                <Badge variant="default">Necessário: {requiredPlan}</Badge>
              </div>
            </div>
            <Button asChild className="w-full">
              <a href="/admin/billing">Fazer Upgrade</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente para mostrar informações do plano do usuário
export const UserPlanInfo: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return <Users className="h-4 w-4" />;
      case 'pro': return <Zap className="h-4 w-4" />;
      case 'enterprise': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'secondary';
      case 'pro': return 'default';
      case 'enterprise': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-md">
      {getPlanIcon(profile.plan)}
      <Badge variant={getPlanColor(profile.plan) as any}>
        {profile.plan.toUpperCase()}
      </Badge>
      <span className="text-sm text-muted-foreground">
        {profile.name || profile.email}
      </span>
    </div>
  );
};
