/**
 * AuthPage - Página de Autenticação (limpa)
 *
 * Implementa login e signup com Supabase Auth
 * - Login com email/senha
 * - Criação de conta
 * - Redirecionamento pós-auth
 * - Validação de formulário
 * - Feedback de erros
 */

import React, { useState, FormEvent } from 'react';
import { useAuthStorage } from '@/contexts/consolidated/AuthStorageProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Loader2, LogIn, UserPlus, Mail, Lock, Sparkles } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [, setLocation] = useLocation();
    const { login, signUp } = useAuthStorage();

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();

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
                appLogger.info('Tentando criar nova conta', { email });
                await signUp(email, password, {
                    created_via: 'quiz_flow_pro',
                    onboarding_completed: false,
                });
                toast.success('Conta criada! Verifique seu email para confirmar.', { duration: 5000 });
                setLocation('/admin');
            } else {
                appLogger.info('Tentando fazer login', { email });
                await login(email, password);
                toast.success('Login realizado com sucesso!');
                setLocation('/admin');
            }
        } catch (error: any) {
            let errorMessage = 'Erro na autenticação';
            if (error?.message?.includes('Invalid login credentials')) errorMessage = 'Email ou senha incorretos';
            else if (error?.message?.includes('Email not confirmed')) errorMessage = 'Confirme seu email antes de fazer login';
            else if (error?.message?.includes('User already registered')) errorMessage = 'Este email já está cadastrado. Faça login.';
            else if (error?.message) errorMessage = error.message;
            toast.error(errorMessage, { duration: 5000 });
            appLogger.error('Erro de autenticação', { error, mode, email });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neon-space p-4 relative">
            <div className="absolute inset-0 bg-hero-soft" />
            <div className="w-full max-w-md relative z-10">
                <div className="bg-gradient-to-tr from-[#0f1724]/70 to-[#020617]/90 rounded-2xl shadow-soft p-8 border-translucent backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-blue-pink shadow-neon mb-4">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 font-title">QuizFlowPro</h1>
                        <p className="text-sm text-slate-300">
                            {mode === 'login' ? 'Entre na sua conta para continuar' : 'Crie sua conta e comece a criar quizzes'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-200 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="pl-10 bg-[#0a0f1f] text-white border-white/20 focus:border-neon-blue focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-200 block">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                    className="pl-10 bg-[#0a0f1f] text-white border-white/20 focus:border-neon-magenta focus:ring-0"
                                />
                            </div>
                            {mode === 'signup' && (
                                <p className="text-xs text-slate-400">Mínimo de 6 caracteres</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full btn-neon text-white font-medium py-6 transition-all duration-300" disabled={loading}>
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

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-transparent px-2 text-slate-300">
                                {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={loading}
                        className="w-full text-center text-sm text-slate-200 hover:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta, fazer login'}
                    </button>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs text-center text-slate-400">
                            Ao continuar, você concorda com nossos{' '}
                            <a href="/termos" className="underline hover:text-white">Termos de Serviço</a>{' '}
                            e{' '}
                            <a href="/privacidade" className="underline hover:text-white">Política de Privacidade</a>
                        </p>
                    </div>
                </div>

                {import.meta.env.DEV && (
                    <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-lg">
                        <p className="text-xs text-slate-200 font-mono">
                            <strong>DEV MODE:</strong> Use qualquer email/senha para teste
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
