/**
 * 📤 COMPONENTE: Exportar Quiz para JSON v4.0
 * 
 * Exporta o quiz atual diretamente do store para formato JSON v4.0
 * Gera arquivo .json para download com validação Zod
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson, CheckCircle, XCircle } from 'lucide-react';
import { useQuizStore } from './ModernQuizEditor/store/quizStore';
import { QuizSchemaZ, getSchemaErrors } from '@/schemas/quiz-schema.zod';
import { useToast } from '@/hooks/use-toast';

interface ExportTemplateButtonProps {
    buttonText?: string;
    variant?: 'default' | 'outline' | 'ghost';
    className?: string;
}

export function ExportTemplateButton({
    buttonText = 'Exportar JSON',
    variant = 'outline',
    className = '',
}: ExportTemplateButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { toast } = useToast();

    // Acesso direto ao store - sem bridges deprecados
    const quiz = useQuizStore((state) => state.quiz);

    const handleExport = async () => {
        if (!quiz) {
            toast({
                title: 'Nenhum quiz carregado',
                description: 'Carregue um quiz antes de exportar.',
                variant: 'destructive',
            });
            return;
        }

        setIsExporting(true);
        setStatus('idle');
        setMessage('');

        try {
            // Validar com Zod antes de exportar
            const validationResult = QuizSchemaZ.safeParse(quiz);
            
            if (!validationResult.success) {
                const errors = getSchemaErrors(quiz);
                console.warn('⚠️ Quiz tem erros de validação:', errors);
                
                // Exportar mesmo com erros, mas avisar usuário
                toast({
                    title: 'Atenção: Quiz com erros',
                    description: `Exportando com ${errors.length} erro(s) de validação.`,
                    variant: 'destructive',
                });
            }

            // Preparar JSON para exportação
            const exportData = {
                ...quiz,
                exportedAt: new Date().toISOString(),
                exportSource: 'lovable-editor-v4',
            };

            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Gerar nome do arquivo baseado no quiz
            const fileName = `${quiz.metadata?.id || 'quiz'}-v${quiz.version || '4.0.0'}.json`;

            // Criar link de download
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setStatus('success');
            setMessage(`✅ "${fileName}" exportado com sucesso!`);

            toast({
                title: 'Quiz exportado',
                description: `Arquivo ${fileName} baixado.`,
            });

            // Reset status após 3 segundos
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);

        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Erro desconhecido ao exportar');

            toast({
                title: 'Erro ao exportar',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
                variant: 'destructive',
            });

            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 5000);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                variant={variant}
                onClick={handleExport}
                disabled={isExporting || !quiz}
                className={`gap-2 ${className}`}
            >
                {isExporting ? (
                    <>
                        <FileJson className="h-4 w-4 animate-pulse" />
                        Exportando...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        {buttonText}
                    </>
                )}
            </Button>

            {status !== 'idle' && (
                <div
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                        status === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                    {status === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <XCircle className="h-4 w-4" />
                    )}
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
}

export default ExportTemplateButton;
