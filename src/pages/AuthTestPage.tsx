/**
 * 🧪 AUTH TEST PAGE - Página Minimalista de Teste de Autenticação
 * 
 * Usa Supabase diretamente SEM providers para isolar problemas de autenticação.
 * Features:
 * - Login/Signup com email/senha
 * - Logout
 * - Estado visual em tempo real
 * - Logs de debug na tela
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warn';
  message: string;
  data?: unknown;
}

export default function AuthTestPage() {
  // Estado de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logs visuais
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Helper para adicionar logs
  const addLog = useCallback((type: LogEntry['type'], message: string, data?: unknown) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString().split('T')[1].split('.')[0],
      type,
      message,
      data,
    };
    setLogs(prev => [entry, ...prev].slice(0, 50));
    
    // Console também
    const consoleMethod = type === 'error' ? console.error : type === 'warn' ? console.warn : console.log;
    consoleMethod(`[AuthTest] ${message}`, data || '');
  }, []);

  // Verificar sessão inicial
  useEffect(() => {
    addLog('info', '🚀 Inicializando página de teste...');
    
    // 1. Configurar listener PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog('info', `📡 Auth Event: ${event}`, { hasSession: !!session, userId: session?.user?.id });
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2. Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        addLog('error', '❌ Erro ao buscar sessão', error.message);
        setError(error.message);
      } else {
        addLog('success', '✅ Sessão verificada', { hasSession: !!session, userId: session?.user?.id });
        setSession(session);
        setUser(session?.user ?? null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      addLog('info', '🔌 Listener desconectado');
    };
  }, [addLog]);

  // Login
  const handleLogin = async () => {
    if (!email || !password) {
      addLog('warn', '⚠️ Email e senha são obrigatórios');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    addLog('info', '🔐 Tentando login...', { email });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addLog('error', '❌ Erro no login', error.message);
        setError(error.message);
      } else {
        addLog('success', '✅ Login bem-sucedido!', { userId: data.user?.id, email: data.user?.email });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      addLog('error', '💥 Exceção no login', message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Signup
  const handleSignup = async () => {
    if (!email || !password) {
      addLog('warn', '⚠️ Email e senha são obrigatórios');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    addLog('info', '📝 Tentando signup...', { email });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        addLog('error', '❌ Erro no signup', error.message);
        setError(error.message);
      } else {
        addLog('success', '✅ Signup bem-sucedido!', { 
          userId: data.user?.id, 
          email: data.user?.email,
          confirmationSent: data.user?.confirmation_sent_at ? 'Sim' : 'Não (auto-confirm ativo)'
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      addLog('error', '💥 Exceção no signup', message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    addLog('info', '🚪 Tentando logout...');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        addLog('error', '❌ Erro no logout', error.message);
        setError(error.message);
      } else {
        addLog('success', '✅ Logout bem-sucedido!');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      addLog('error', '💥 Exceção no logout', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar sessão manualmente
  const checkSession = async () => {
    addLog('info', '🔍 Verificando sessão...');
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      addLog('error', '❌ Erro ao verificar sessão', error.message);
    } else {
      addLog('info', '📋 Sessão atual', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        email: session?.user?.email,
        expiresAt: session?.expires_at 
      });
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">🧪 Auth Test Page</h1>
          <p className="text-muted-foreground mt-2">
            Teste de autenticação usando Supabase diretamente (sem providers)
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isLoading ? 'secondary' : user ? 'default' : 'destructive'}>
                {isLoading ? '⏳ Carregando...' : user ? '✅ Autenticado' : '❌ Não autenticado'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono truncate">
                {user?.email || 'Nenhum'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Session ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono truncate text-muted-foreground">
                {session?.access_token?.slice(0, 20) || 'Nenhuma'}...
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive font-medium">❌ Erro: {error}</p>
          </div>
        )}

        {/* Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Login/Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle>🔐 Login / Signup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleLogin} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? '...' : 'Login'}
                </Button>
                <Button onClick={handleSignup} variant="outline" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? '...' : 'Signup'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleLogout} variant="destructive" className="w-full" disabled={!user || isSubmitting}>
                🚪 Logout
              </Button>
              <Button onClick={checkSession} variant="secondary" className="w-full">
                🔍 Verificar Sessão
              </Button>
              <Button onClick={() => setLogs([])} variant="ghost" className="w-full">
                🗑️ Limpar Logs
              </Button>
              <Button onClick={() => window.location.href = '/auth'} variant="link" className="w-full">
                ← Voltar para /auth
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logs Console */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 Console de Logs ({logs.length})</span>
              <Badge variant="outline">{logs.length} entradas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-zinc-950 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-zinc-500">Nenhum log ainda...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`mb-1 ${getLogColor(log.type)}`}>
                    <span className="text-zinc-500">[{log.timestamp}]</span>{' '}
                    {log.message}
                    {log.data !== undefined && (
                      <span className="text-zinc-400 ml-2">
                        {typeof log.data === 'string' ? log.data : JSON.stringify(log.data)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-48">
{JSON.stringify({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado',
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Configurado' : '❌ Não configurado',
  user: user ? { id: user.id, email: user.email } : null,
  session: session ? { 
    accessToken: session.access_token?.slice(0, 20) + '...',
    expiresAt: session.expires_at,
    tokenType: session.token_type
  } : null,
  origin: window.location.origin,
}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
