// Versão testável da página QuizEditorIntegrated para ambiente de testes Vitest.
import React, { useState, useEffect } from 'react';
import { useEditorPersistence } from '../../hooks/useEditorPersistence';
import { useSuperUnified } from '../../hooks/useSuperUnified';

const Card: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const CardHeader: React.FC<any> = ({ children }) => <div>{children}</div>;
const CardTitle: React.FC<any> = ({ children }) => <h2>{children}</h2>;
const CardDescription: React.FC<any> = ({ children }) => <p>{children}</p>;
const CardContent: React.FC<any> = ({ children }) => <div>{children}</div>;
const Button: React.FC<any> = ({ children, onClick, disabled, ...p }) => <button onClick={onClick} disabled={disabled} {...p}>{children}</button>;
const Badge: React.FC<any> = ({ children }) => <span>{children}</span>;
const Alert: React.FC<any> = ({ children }) => <div>{children}</div>;
const AlertDescription: React.FC<any> = ({ children }) => <div>{children}</div>;

interface QuizEditorIntegratedPageTestableProps {
    funnelId?: string;
}

const QuizEditorIntegratedPageTestable: React.FC<QuizEditorIntegratedPageTestableProps> = ({
    funnelId = 'quiz-estilo-21-steps',
}) => {
    const [state, setState] = useState({
        isLoaded: false,
        hasError: false,
        errorMessage: '',
        currentStep: 1,
        totalSteps: 21,
    });

    const { getStepBlocks } = useSuperUnified();
    const currentStepBlocks = getStepBlocks(state.currentStep);

    const {
        isSaving,
        lastSaved,
        error: persistenceError,
        saveNow,
        canUndo,
        canRedo,
        undo,
        redo,
        clearError
    } = useEditorPersistence(
        funnelId,
        state.currentStep,
        currentStepBlocks,
        {
            autoSave: true,
            debounceMs: 1000,
            enableHistory: true,
        }
    );

    useEffect(() => {
        // Simula carregamento inicial
        const loadQuizData = async () => {
            try {
                setState(prev => ({
                    ...prev,
                    isLoaded: true,
                }));
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    hasError: true,
                    errorMessage: error instanceof Error ? error.message : 'Erro ao carregar',
                }));
            }
        };
        loadQuizData();
    }, []);

    if (!state.isLoaded) {
        return (
            <div>
                <p>Carregando editor do quiz...</p>
            </div>
        );
    }

    if (state.hasError) {
        return (
            <div>
                <Alert>
                    <AlertDescription>
                        <span>Erro ao carregar editor: {state.errorMessage}</span>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>Editor de Quiz Integrado</h1>
                <Badge>Step {state.currentStep} de {state.totalSteps}</Badge>
                {isSaving && <Badge>Salvando...</Badge>}
                {lastSaved && <Badge>Salvo</Badge>}
            </div>

            {persistenceError && (
                <Alert>
                    <AlertDescription>
                        <span>Erro de persistência: {persistenceError.message}</span>
                        <Button onClick={clearError}>Fechar</Button>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Edição de Conteúdo</CardTitle>
                    <CardDescription>Step {state.currentStep}: Editar blocos do quiz</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        {currentStepBlocks && currentStepBlocks.length > 0 ? (
                            <p>{currentStepBlocks.length} blocos neste step</p>
                        ) : (
                            <p>Nenhum bloco carregado</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div>
                <Button onClick={saveNow} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Agora'}
                </Button>
                <Button onClick={undo} disabled={!canUndo}>Desfazer</Button>
                <Button onClick={redo} disabled={!canRedo}>Refazer</Button>
            </div>

            {lastSaved && (
                <div>
                    <p>Última modificação: {new Date(lastSaved).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default QuizEditorIntegratedPageTestable;
