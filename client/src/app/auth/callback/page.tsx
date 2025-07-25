// =============================================================================
// CALLBACK DE AUTENTICAÇÃO OAUTH - SUPABASE
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@shared/lib/supabase';

// =============================================================================
// COMPONENTE
// =============================================================================

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Verificar se há fragmentos de hash na URL para OAuth
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Verificar diferentes tipos de callback
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || error);
          return;
        }

        // Para OAuth redirect
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Configurar sessão com tokens OAuth
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setStatus('error');
            setMessage('Erro ao configurar sessão: ' + sessionError.message);
            return;
          }
        }

        // Para email confirmation
        if (type === 'signup') {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
          return;
        }

        // Para password reset
        if (type === 'recovery') {
          setStatus('success');
          setMessage('Redirecionando para redefinir senha...');
          setTimeout(() => {
            window.location.href = '/auth/reset-password';
          }, 2000);
          return;
        }

        // Verificar se há usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          setStatus('error');
          setMessage('Erro ao verificar usuário: ' + userError.message);
          return;
        }

        if (user) {
          setStatus('success');
          setMessage('Login realizado com sucesso! Redirecionando...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Nenhum usuário encontrado. Redirecionando para login...');
          setTimeout(() => {
            window.location.href = '/auth';
          }, 3000);
        }

      } catch (error) {
        console.error('Erro no callback de auth:', error);
        setStatus('error');
        setMessage('Erro inesperado durante a autenticação.');
      }
    };

    handleAuthCallback();
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Processando autenticação...
                </h2>
                <p className="text-gray-600">
                  Aguarde enquanto confirmamos seu login.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  Sucesso!
                </h2>
                <p className="text-gray-600">
                  {message}
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                  Erro na Autenticação
                </h2>
                <p className="text-gray-600 mb-4">
                  {message}
                </p>
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voltar para Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
