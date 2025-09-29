import React from 'react';
import { quizEditingService } from '@/domain/quiz/QuizEditingService';

interface QuizCanvasErrorBoundaryProps {
    currentStep: number;
    children: React.ReactNode;
}

interface QuizCanvasErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    info: React.ErrorInfo | null;
    lastStepId: string | null;
}

/**
 * Error boundary granular para o Canvas do Quiz.
 * Se um erro ocorre na renderização dos blocks de um step, não derruba o editor inteiro.
 * Oferece ações de recuperação: tentar novamente, resetar overrides do step, limpar estado local.
 */
export class QuizCanvasErrorBoundary extends React.Component<QuizCanvasErrorBoundaryProps, QuizCanvasErrorBoundaryState> {
    state: QuizCanvasErrorBoundaryState = {
        hasError: false,
        error: null,
        info: null,
        lastStepId: null
    };

    static getDerivedStateFromError(error: Error): Partial<QuizCanvasErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        const stepId = `step-${this.props.currentStep}`;
        // eslint-disable-next-line no-console
        console.error('[QuizCanvasErrorBoundary] Erro ao renderizar step', stepId, error, info);
        this.setState({ info, lastStepId: stepId });
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null, info: null });
    };

    private handleResetOverrides = () => {
        const stepId = this.state.lastStepId || `step-${this.props.currentStep}`;
        try {
            quizEditingService.resetStep(stepId);
            this.setState({ hasError: false, error: null, info: null });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[QuizCanvasErrorBoundary] Falha ao resetar overrides do step', stepId, err);
        }
    };

    private handleHardReload = () => {
        // Estratégia simples: força recálculo do serviço regenerando overrides atuais
        try {
            quizEditingService.save(); // garante persistência antes
            // Força pequena mudança inocente para disparar recompute: updateStep sem alterar valor efetivo
            // (apenas se necessário; aqui podemos apenas reinvocar getState para garantir subscribe)
            this.setState({ hasError: false, error: null, info: null });
        } catch {/* ignore */ }
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            const stepId = this.state.lastStepId || `step-${this.props.currentStep}`;
            return (
                <div className="flex-1 h-full p-6 bg-red-950/30 text-red-200 flex flex-col gap-4 border border-red-800 rounded-md">
                    <div>
                        <h2 className="text-lg font-semibold">Falha ao renderizar Step {stepId}</h2>
                        <p className="text-sm opacity-80">Um erro ocorreu ao montar os blocks deste step. Você pode tentar novamente ou resetar os overrides deste step.</p>
                    </div>
                    {this.state.error && (
                        <pre className="text-xs bg-red-900/40 p-3 rounded max-h-40 overflow-auto whitespace-pre-wrap border border-red-800/50">
                            {this.state.error.message}\n\n{this.state.info?.componentStack}
                        </pre>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <button onClick={this.handleRetry} className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium">Tentar novamente</button>
                        <button onClick={this.handleResetOverrides} className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium">Resetar overrides do step</button>
                        <button onClick={this.handleHardReload} className="px-3 py-1.5 rounded bg-slate-600 hover:bg-slate-500 text-white font-medium">Forçar recálculo</button>
                    </div>
                    <div className="text-xs opacity-70 mt-auto">QuizCanvasErrorBoundary ativo — o restante do editor permanece funcional.</div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default QuizCanvasErrorBoundary;
