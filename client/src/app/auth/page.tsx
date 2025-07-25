// =============================================================================
// PÁGINA DE AUTENTICAÇÃO - LOGIN E CADASTRO
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// =============================================================================
// TIPOS
// =============================================================================

type AuthMode = 'login' | 'signup' | 'reset';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const AuthPage: React.FC = () => {
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signInWithGithub, 
    resetPassword, 
    loading, 
    user 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');

  // =============================================================================
  // EFEITOS
  // =============================================================================

  useEffect(() => {
    if (user) {
      // Redirecionar usuário autenticado
      window.location.href = '/dashboard';
    }
  }, [user]);

  // =============================================================================
  // VALIDAÇÃO
  // =============================================================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password (apenas para login e signup)
    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
    }

    // Confirm password (apenas para signup)
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }

      // Full name
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Nome completo é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setErrors({ general: error.message });
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
        });
        if (error) {
          setErrors({ general: error.message });
        } else {
          setMessage('Conta criada! Verifique seu email para confirmar o cadastro.');
          setMode('login');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(formData.email);
        if (error) {
          setErrors({ general: error.message });
        } else {
          setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setMode('login');
        }
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = provider === 'google' 
        ? await signInWithGoogle() 
        : await signInWithGithub();
        
      if (error) {
        setErrors({ general: error.message });
      }
    } catch (error) {
      setErrors({ general: 'Erro ao fazer login com OAuth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
    setErrors({});
    setMessage('');
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Quest
          </h1>
          <p className="text-gray-600">
            Crie quizzes incríveis e engaje sua audiência
          </p>
        </div>

        {/* Título do Formulário */}
        <h2 className="mt-8 text-center text-2xl font-bold text-gray-900">
          {mode === 'login' && 'Entre na sua conta'}
          {mode === 'signup' && 'Crie sua conta'}
          {mode === 'reset' && 'Recuperar senha'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Mensagem de Sucesso */}
          {message && (
            <div className="mb-6 p-4 border border-green-300 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Erro Geral */}
          {errors.general && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Formulário */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Nome Completo (apenas signup) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Seu Nome Completo"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>
              </div>
            )}

            {/* Senha (não mostrar em reset) */}
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Senha"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            {/* Confirmar Senha (apenas signup) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Confirme sua senha"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            )}

            {/* Botão Submit */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    {mode === 'login' && 'Entrar'}
                    {mode === 'signup' && 'Criar Conta'}
                    {mode === 'reset' && 'Enviar Email'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* OAuth Buttons (apenas login e signup) */}
          {mode !== 'reset' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="ml-2">GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* Links de Navegação */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                <div>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Não tem uma conta? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Cadastre-se
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div>
                <span className="text-sm text-gray-600">Já tem uma conta? </span>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Faça login
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Voltar para o login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
