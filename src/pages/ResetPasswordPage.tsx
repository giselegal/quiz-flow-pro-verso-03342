/**
 * ResetPasswordPage - Página de Redefinição de Senha
 *
 * Acessada via link enviado por email após "Esqueci minha senha"
 * - Valida token de reset
 * - Permite definir nova senha
 * - Feedback de força de senha
 */

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Loader2, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { appLogger } from '@/lib/utils/appLogger';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [, setLocation] = useLocation();

    const passwordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
        if (password.length < 6) return 'weak';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
        return 'medium';
    };

    const strength = passwordStrength(newPassword);
    const strengthColors = {
        weak: 'bg-red-500',
        medium: 'bg-yellow-500',
        strong: 'bg-green-500',
    };
    const strengthLabels = {
        weak: 'Fraca',
        medium: 'Média',
        strong: 'Forte',
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();

        if (loading) return;

        if (!newPassword || !confirmPassword) {
            toast.error('Preencha todos os campos');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        setLoading(true);
        try {
            appLogger.info('🔑 Redefinindo senha...');

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            toast.success('Senha redefinida com sucesso!', { duration: 5000 });
            appLogger.info('✅ Senha redefinida com sucesso');

            // Redirecionar para admin após 2s
            setTimeout(() => {
                setLocation('/admin');
            }, 2000);
        } catch (error: any) {
            const errorMessage = error?.message || 'Erro ao redefinir senha';
            toast.error(errorMessage, { duration: 5000 });
            appLogger.error('❌ Erro ao redefinir senha:', error);
        } finally {
            setLoading(false);
        }
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
                        <h1 className="text-3xl font-bold text-white mb-2 font-title">Redefinir Senha</h1>
                        <p className="text-sm text-slate-300">
                            Escolha uma nova senha segura para sua conta
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-medium text-slate-200 block">
                                Nova Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                    className="pl-10 pr-12 bg-[#0a0f1f] text-white border-white/20 focus:border-neon-magenta focus:ring-0"
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white text-xs"
                                >
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                            {newPassword && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
                                                style={{
                                                    width:
                                                        strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-300">{strengthLabels[strength]}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200 block">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                    className="pl-10 bg-[#0a0f1f] text-white border-white/20 focus:border-neon-blue focus:ring-0"
                                />
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-400">As senhas não coincidem</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-neon text-white font-medium py-6 transition-all duration-300"
                            disabled={loading || newPassword !== confirmPassword}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Redefinindo...
                                </>
                            ) : (
                                <>
                                    <Lock className="h-5 w-5 mr-2" />
                                    Redefinir Senha
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <button
                            type="button"
                            onClick={() => setLocation('/auth')}
                            className="text-sm text-slate-300 hover:text-white transition-colors"
                        >
                            Voltar para login
                        </button>
                    </div>
                </div>

                {import.meta.env.DEV && (
                    <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-lg">
                        <p className="text-xs text-slate-200 font-mono">
                            <strong>DEV MODE:</strong> Página de reset de senha
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
