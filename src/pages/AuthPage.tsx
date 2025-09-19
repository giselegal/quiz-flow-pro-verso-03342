import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import QuizFlowLogo from '@/components/ui/QuizFlowLogo';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Chrome, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation } from 'wouter';

const AuthPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { login, signup } = useAuth();
  // Note: Password reset will be implemented later with proper Supabase setup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setLocation('/admin');
      } else {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem');
          return;
        }

        await signup(email, password);
        setError('');
        // Show success message for email verification
        setError('Conta criada com sucesso! Verifique seu email se necessário.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement password reset with Supabase
      setResetEmailSent(true);
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google OAuth with Supabase
    setError('Login com Google será implementado em breve');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-light via-brand-background to-brand-primary/10">
      <div className="max-w-md w-full rounded-2xl shadow-lg p-8 backdrop-blur-lg border border-white/20 bg-white/95">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <QuizFlowLogo size="lg" variant="full" theme="light" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p className="text-sm text-brand-text-secondary">
            Acesse sua plataforma QuizFlow Pro
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-400 bg-red-50/80 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Reset Email Sent */}
        {resetEmailSent && (
          <Alert className="mb-6 border-green-400 bg-green-50/80 backdrop-blur-sm">
            <Mail className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Email de recuperação enviado! Verifique sua caixa de entrada.
            </AlertDescription>
          </Alert>
        )}

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-6 h-12 border-gray-200 hover:bg-brand-light/50 transition-all duration-200"
          onClick={handleGoogleSignIn}
          disabled={false}
        >
          <Chrome className="w-5 h-5 mr-3 text-brand-primary" />
          <span className="text-brand-text">Continuar com Google</span>
        </Button>

        {/* Divider */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="px-4 text-sm text-brand-text-secondary">ou</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              name="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              className="pl-12 h-12 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              name="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="pl-12 h-12 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                name="confirm-password"
                autoComplete="new-password"
                className="pl-12 h-12 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-white font-semibold bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Carregando...</span>
              </div>
            ) : (
              isLogin ? 'Entrar' : 'Criar conta'
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-4 text-center">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full text-sm font-medium text-brand-accent hover:text-brand-primary transition-colors duration-200"
          >
            Esqueceu sua senha?
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm font-medium text-brand-accent hover:text-brand-primary transition-colors duration-200"
          >
            {isLogin ? 'Não tem uma conta? Crie uma' : 'Já tem uma conta? Faça login'}
          </button>

          <p className="text-xs pt-4 text-brand-text-secondary">
            © 2025 QuizFlow Pro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
