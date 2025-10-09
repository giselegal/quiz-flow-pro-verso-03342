import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Crown, Lock, Users, Zap } from 'lucide-react';
import React from 'react';

interface EditorAccessControlProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'editor' | 'admin';
  requiredPlan?: 'free' | 'pro' | 'enterprise';
  feature?: string;
}

export const EditorAccessControl: React.FC<EditorAccessControlProps> = ({
  children,
  requiredRole: _requiredRole = 'user',
  requiredPlan = 'free',
  feature = 'editor',
}) => {
  const { profile, hasPermission } = useAuth();

  // 🚧 Modo desenvolvimento: permitir acesso anônimo quando abrindo via ?template=
  // Útil para testes rápidos do editor sem exigir login localmente.
  let allowAnonymousDev = false;
  try {
    const isDev = (import.meta as any).env?.DEV || process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    const sp = new URLSearchParams(window.location.search);
    const hasTemplateParam = !!sp.get('template');
    const explicitAnon = sp.get('allowAnonymous') === '1' || sp.get('anon') === '1';
    allowAnonymousDev = !!(isDev && (hasTemplateParam || explicitAnon));
  } catch { /* ignore */ }

  if (!profile && allowAnonymousDev) {
    return (
      <>
        {/* Aviso discreto de modo dev sem login */}
        <div className="px-3 py-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded mb-2">
          Modo desenvolvedor: acesso ao editor sem login habilitado para teste rápido.
        </div>
        {children}
      </>
    );
  }

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
            {/* Dica: em dev, pode permitir anônimo via query */}
            <p className="text-[11px] text-muted-foreground/80">
              Dica: em ambiente local, acesse com <code>?template=quiz21StepsComplete</code> para testes rápidos.
            </p>
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
              <p className="text-muted-foreground">Este recurso requer um plano superior.</p>
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
      case 'free':
        return <Users className="h-4 w-4" />;
      case 'pro':
        return <Zap className="h-4 w-4" />;
      case 'enterprise':
        return <Crown className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'secondary';
      case 'pro':
        return 'default';
      case 'enterprise':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-md">
      {getPlanIcon(profile.plan)}
      <Badge variant={getPlanColor(profile.plan) as any}>{profile.plan.toUpperCase()}</Badge>
      <span className="text-sm text-muted-foreground">{profile.name || profile.email}</span>
    </div>
  );
};
