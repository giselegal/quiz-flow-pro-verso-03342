/**
 * AuthPage - Página de Autenticação
 * 
 * Implementa login e signup com Supabase Auth
 * - Login com email/senha
 * - Criação de conta
 * - Redirecionamento pós-auth
 * - Validação de formulário
 * - Feedback de erros
 * 
 * BLOQUEADOR #6: Sistema de autenticação completo
 */

import { useState, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, LogIn, UserPlus, Mail, Lock, Sparkles } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const navigate = useNavigate();

    /**
     * Handler de autenticação (login ou signup)
     */
    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();

        // Validações básicas
        if (!email || !password) {
            toast.error('Preencha todos os campos');
            return;
        }

        if (password.length < 6) {
            toast.error('Senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'signup') {
                // ========================================================================
                // SIGNUP: Criar nova conta
                // ========================================================================

                appLogger.info('Tentando criar nova conta', { email });

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/admin`,
                        data: {
                            created_via: 'quiz_quest_pro',
                            onboarding_completed: false
                        }
                    }
                });

                if (error) {
                    appLogger.error('Erro no signup', { error });
                    throw error;
                }

                appLogger.info('Conta criada com sucesso', {
                    userId: data.user?.id,
                    email: data.user?.email
                });

                toast.success('Conta criada! Verifique seu email para confirmar.', {
                    duration: 5000
                });

                // Se confirmação automática estiver habilitada, redirecionar
                if (data.session) {
                    appLogger.info('Confirmação automática ativa, redirecionando', {
                        userId: data.user?.id
                    });
                    navigate('/admin');
                }

            } else {
                // ========================================================================
                // LOGIN: Autenticar usuário existente
                // ========================================================================

                appLogger.info('Tentando fazer login', { email });

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    appLogger.error('Erro no login', { error });
                    throw error;
                }

                appLogger.info('Login realizado com sucesso', {
                    userId: data.user?.id,
                    email: data.user?.email
                });

                toast.success('Login realizado com sucesso!');
                navigate('/admin');
            }

        } catch (error: any) {
            // Tratamento de erros específicos
            let errorMessage = 'Erro na autenticação';

            if (error.message?.includes('Invalid login credentials')) {
                errorMessage = 'Email ou senha incorretos';
            } else if (error.message?.includes('Email not confirmed')) {
                errorMessage = 'Confirme seu email antes de fazer login';
            } else if (error.message?.includes('User already registered')) {
                errorMessage = 'Este email já está cadastrado. Faça login.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, { duration: 5000 });
            appLogger.error('Erro de autenticação', {
                error,
                mode,
                email
            });

        } finally {
            setLoading(false);
        }
    };

    /**
     * Alterna entre modo login e signup
     */
    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        // Limpar campos ao trocar de modo
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F5F0] via-[#E8DED0] to-[#D8C4A8] p-4">
            <div className="w-full max-w-md">
                {/* Card de Autenticação */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#B89B7A]/20">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#432818] to-[#6B4F43] mb-4">
                            <Sparkles className="h-8 w-8 text-[#F8F5F0]" />
                        </div>

                        <h1 className="text-3xl font-bold text-[#432818] mb-2">
                            Quiz Quest Pro
                        </h1>

                        <p className="text-sm text-[#6B4F43]">
                            {mode === 'login'
                                ? 'Entre na sua conta para continuar'
                                : 'Crie sua conta e comece a criar quizzes'
                            }
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleAuth} className="space-y-5">

                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-[#432818] block">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B4F43]/60" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="pl-10 border-[#B89B7A]/40 focus:border-[#432818] focus:ring-[#432818]"
                                />
                            </div>
                        </div>

                        {/* Campo Senha */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-[#432818] block">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B4F43]/60" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                    className="pl-10 border-[#B89B7A]/40 focus:border-[#432818] focus:ring-[#432818]"
                                />
                            </div>
                            {mode === 'signup' && (
                                <p className="text-xs text-[#6B4F43]/70">
                                    Mínimo de 6 caracteres
                                </p>
                            )}
                        </div>

                        {/* Botão de Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#432818] to-[#6B4F43] hover:from-[#6B4F43] hover:to-[#432818] text-white font-medium py-6 transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? (
                                        <>
                                            <LogIn className="h-5 w-5 mr-2" />
                                            Entrar
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-5 w-5 mr-2" />
                                            Criar Conta
                                        </>
                                    )}
                                </>
                            )}
                        </Button>

                    </form>

                    {/* Divisor */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#B89B7A]/30"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-[#6B4F43]">
                                {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                            </span>
                        </div>
                    </div>

                    {/* Toggle Mode */}
                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={loading}
                        className="w-full text-center text-sm text-[#432818] hover:text-[#6B4F43] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === 'login'
                            ? 'Criar nova conta'
                            : 'Já tenho conta, fazer login'
                        }
                    </button>

                    {/* Footer Info */}
                    <div className="mt-6 pt-6 border-t border-[#B89B7A]/20">
                        <p className="text-xs text-center text-[#6B4F43]/70">
                            Ao continuar, você concorda com nossos{' '}
                            <a href="/termos" className="underline hover:text-[#432818]">
                                Termos de Serviço
                            </a>{' '}
                            e{' '}
                            <a href="/privacidade" className="underline hover:text-[#432818]">
                                Política de Privacidade
                            </a>
                        </p>
                    </div>

                </div>

                {/* Demo Credentials (apenas em dev) */}
                {import.meta.env.DEV && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-mono">
                            <strong>DEV MODE:</strong> Use qualquer email/senha para teste
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
