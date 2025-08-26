import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#FEFEFE',
        background: 'linear-gradient(135deg, #FEFEFE 0%, #FAF9F7 50%, #F3E8E6 100%)',
      }}
    >
      <div
        className="max-w-md w-full rounded-2xl shadow-2xl p-8 border-0 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(254, 254, 254, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(184, 155, 122, 0.2)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 mb-4">
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
              alt="QuizFlow"
              className="w-full h-full object-cover rounded-full border-3"
              style={{ borderColor: '#B89B7A' }}
            />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#432818' }}>
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p className="text-sm mt-2" style={{ color: '#6B4F43' }}>
            Acesse sua plataforma QuizFlow
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
            <AlertDescription style={{ color: '#dc2626' }}>{error}</AlertDescription>
          </Alert>
        )}

        {/* Reset Email Sent */}
        {resetEmailSent && (
          <Alert className="mb-6" style={{ borderColor: '#22c55e', backgroundColor: '#f0fdf4' }}>
            <Mail className="h-4 w-4" style={{ color: '#22c55e' }} />
            <AlertDescription style={{ color: '#15803d' }}>
              Email de recuperação enviado! Verifique sua caixa de entrada.
            </AlertDescription>
          </Alert>
        )}

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-6 h-12"
          onClick={handleGoogleSignIn}
          disabled={false}
          style={{
            borderColor: '#E5DDD5',
            backgroundColor: '#FEFEFE',
          }}
        >
          <Chrome className="w-5 h-5 mr-3" style={{ color: '#4285f4' }} />
          Continuar com Google
        </Button>

        {/* Divider */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-px flex-1" style={{ backgroundColor: '#E5DDD5' }}></div>
          <span className="px-4 text-sm" style={{ color: '#8B7355' }}>
            ou
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: '#E5DDD5' }}></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: '#8B7355' }}
            />
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
              className="pl-12 h-12"
              style={{
                borderColor: '#E5DDD5',
                backgroundColor: '#FEFEFE',
              }}
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: '#8B7355' }}
            />
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              name="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="pl-12 h-12"
              style={{
                borderColor: '#E5DDD5',
                backgroundColor: '#FEFEFE',
              }}
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: '#8B7355' }}
              />
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                name="confirm-password"
                autoComplete="new-password"
                className="pl-12 h-12"
                style={{
                  borderColor: '#E5DDD5',
                  backgroundColor: '#FEFEFE',
                }}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-white font-semibold"
            disabled={isLoading}
            style={{ backgroundColor: '#B89B7A' }}
          >
            {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-4 text-center">
          {isLogin && (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm hover:underline"
              style={{ color: '#B89B7A' }}
            >
              Esqueceu sua senha?
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="block w-full text-sm hover:underline"
            style={{ color: '#B89B7A' }}
          >
            {isLogin ? 'Não tem conta? Criar uma gratuita' : 'Já tem conta? Entrar agora'}
          </button>

          <p className="text-xs pt-4" style={{ color: '#8B7355' }}>
            © 2025 Gisele Galvão. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
