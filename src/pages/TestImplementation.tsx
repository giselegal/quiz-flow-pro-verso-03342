/**
 * 🧪 TEST IMPLEMENTATION PAGE
 * Valida Fase 1 (Auth + CRUD) e Fase 2 (Registry)
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/SuperUnifiedProvider';
import { useUnifiedCRUD } from '@/contexts/data/UnifiedCRUDProvider';
import { 
  ENHANCED_BLOCK_REGISTRY, 
  AVAILABLE_COMPONENTS, 
  getRegistryStats,
  getEnhancedBlockComponent 
} from '@/components/editor/blocks/enhancedBlockRegistry';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestImplementation() {
  const { user, loading: authLoading, signIn, signup, signOut } = useAuth();
  const { 
    funnels, 
    loading: crudLoading, 
    createFunnel, 
    refreshFunnels,
    currentFunnel,
    loadFunnel 
  } = useUnifiedCRUD();
  
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testFunnelName, setTestFunnelName] = useState('Test Funnel');
  const [registryStats, setRegistryStats] = useState<any>(null);
  const [componentTest, setComponentTest] = useState<string>('button-inline');

  useEffect(() => {
    // Load registry stats
    setRegistryStats(getRegistryStats());
  }, []);

  const handleSignUp = async () => {
    try {
      const { error } = await signup(testEmail, testPassword);
      if (error) throw error;
      toast({ title: 'Signup successful!', description: 'Check your email for confirmation.' });
    } catch (error: any) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await signIn(testEmail, testPassword);
      if (error) throw error;
      toast({ title: 'Login successful!' });
    } catch (error: any) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Logout successful!' });
    } catch (error: any) {
      toast({ title: 'Logout failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateFunnel = async () => {
    try {
      const newFunnel = await createFunnel({
        name: testFunnelName,
        description: 'Test funnel created via Test Implementation page',
        type: 'quiz',
        status: 'draft'
      });
      toast({ 
        title: 'Funnel created!', 
        description: `ID: ${newFunnel.id}` 
      });
    } catch (error: any) {
      toast({ 
        title: 'Create failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  };

  const handleRefreshFunnels = async () => {
    try {
      await refreshFunnels();
      toast({ title: 'Funnels refreshed!' });
    } catch (error: any) {
      toast({ 
        title: 'Refresh failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  };

  const testComponent = () => {
    const component = getEnhancedBlockComponent(componentTest);
    if (component) {
      toast({ 
        title: 'Component found!', 
        description: `Type: ${componentTest}` 
      });
    } else {
      toast({ 
        title: 'Component not found', 
        description: componentTest, 
        variant: 'destructive' 
      });
    }
  };

  const StatusIcon = ({ condition }: { condition: boolean }) => (
    condition ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🧪 Test Implementation</h1>
        <p className="text-muted-foreground">Validação das Fases 1 e 2 do Plano de Recuperação</p>
      </div>

      {/* FASE 1: AUTH & CRUD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon condition={!authLoading && !!user} />
            FASE 1: SuperUnifiedProvider (Auth)
          </CardTitle>
          <CardDescription>Autenticação com Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Status:</p>
              <Badge variant={authLoading ? "outline" : user ? "default" : "secondary"}>
                {authLoading ? (
                  <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Loading</>
                ) : user ? (
                  'Authenticated'
                ) : (
                  'Not Authenticated'
                )}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">User ID:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {user?.id?.substring(0, 8) || 'N/A'}...
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Email:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {user?.email || 'N/A'}
              </code>
            </div>
          </div>

          <Separator />

          {!user ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Email" 
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="Password" 
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSignUp} variant="outline" className="flex-1">
                  Sign Up
                </Button>
                <Button onClick={handleSignIn} className="flex-1">
                  Sign In
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleSignOut} variant="destructive" className="w-full">
              Sign Out
            </Button>
          )}
        </CardContent>
      </Card>

      {/* FASE 1: CRUD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon condition={!!user && !crudLoading} />
            FASE 1: UnifiedCRUDProvider (Funnel CRUD)
          </CardTitle>
          <CardDescription>Operações de Create, Read, Update, Delete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Funnels Count:</p>
              <Badge variant="outline">{funnels.length}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Loading:</p>
              <Badge variant={crudLoading ? "outline" : "secondary"}>
                {crudLoading ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Current Funnel:</p>
              <Badge variant={currentFunnel ? "default" : "secondary"}>
                {currentFunnel ? 'Loaded' : 'None'}
              </Badge>
            </div>
          </div>

          <Separator />

          {user ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Funnel Name" 
                  value={testFunnelName}
                  onChange={(e) => setTestFunnelName(e.target.value)}
                />
                <Button onClick={handleCreateFunnel} disabled={crudLoading}>
                  Create Funnel
                </Button>
              </div>
              <Button 
                onClick={handleRefreshFunnels} 
                variant="outline" 
                className="w-full"
                disabled={crudLoading}
              >
                {crudLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Refresh Funnels
              </Button>

              {funnels.length > 0 && (
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Funnels:</p>
                  <div className="space-y-2">
                    {funnels.map((funnel: any) => (
                      <div key={funnel.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium text-sm">{funnel.name}</p>
                          <p className="text-xs text-muted-foreground">{funnel.id.substring(0, 8)}...</p>
                        </div>
                        <Badge variant="outline">{funnel.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Please sign in to test CRUD operations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FASE 2: REGISTRY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon condition={!!registryStats && registryStats.total > 0} />
            FASE 2: Enhanced Block Registry
          </CardTitle>
          <CardDescription>Componentes unificados e mapeados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registryStats && (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Total:</p>
                <Badge variant="default">{registryStats.total}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Unique:</p>
                <Badge variant="outline">{registryStats.unique}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Aliases:</p>
                <Badge variant="secondary">{registryStats.aliases}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Available:</p>
                <Badge variant="outline">{AVAILABLE_COMPONENTS.length}</Badge>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input 
                placeholder="Component type (e.g., button-inline)" 
                value={componentTest}
                onChange={(e) => setComponentTest(e.target.value)}
              />
              <Button onClick={testComponent}>
                Test Component
              </Button>
            </div>

            <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Available Components ({AVAILABLE_COMPONENTS.length}):</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_COMPONENTS.map((comp) => (
                  <div 
                    key={comp.type} 
                    className="flex items-center justify-between p-2 bg-muted rounded hover:bg-muted/80 cursor-pointer"
                    onClick={() => setComponentTest(comp.type)}
                  >
                    <div>
                      <p className="font-medium text-xs">{comp.label}</p>
                      <code className="text-[10px] text-muted-foreground">{comp.type}</code>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{comp.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>📊 Test Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">FASE 1: Auth & CRUD</span>
            <StatusIcon condition={!!user && funnels !== undefined} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">FASE 2: Registry</span>
            <StatusIcon condition={!!registryStats && registryStats.total > 0} />
          </div>
          <Separator className="my-4" />
          <div className="text-center">
            <Badge variant="default" className="text-lg px-4 py-2">
              {(!!user && funnels !== undefined && registryStats?.total > 0) ? 
                '✅ All Systems Operational' : 
                '⚠️ Some Systems Need Attention'
              }
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
