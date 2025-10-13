/**
 * 📤 COMPONENTE: Exportar Funil para JSON v3.0
 * 
 * Permite exportar funil editado de volta para formato JSON v3.0
 * Gera arquivo .json para download
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson, CheckCircle, XCircle } from 'lucide-react';
import { quizEditorBridge } from '@/services/QuizEditorBridge';

interface ExportTemplateButtonProps {
    funnelId: string;
    buttonText?: string;
    variant?: 'default' | 'outline' | 'ghost';
}

export function ExportTemplateButton({
    funnelId,
    buttonText = 'Exportar para JSON v3.0',
    variant = 'outline'
}: ExportTemplateButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleExport = async () => {
        setIsExporting(true);
        setStatus('idle');
        setMessage('');

        try {
            console.log('📤 Exportando funil:', funnelId);

            // Exportar via QuizEditorBridge
            const templates = await quizEditorBridge.exportToJSONv3(funnelId);

            const stepCount = Object.keys(templates).length;
            console.log(`✅ ${stepCount} steps exportados`);

            // Criar arquivos para download
            for (const [stepId, template] of Object.entries(templates)) {
                const json = JSON.stringify(template, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                // Criar link de download
                const a = document.createElement('a');
                a.href = url;
                a.download = `${stepId}-v3.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Delay pequeno entre downloads
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            setStatus('success');
            setMessage(`✅ ${stepCount} arquivo(s) exportado(s) com sucesso!`);

            // Reset status após 3 segundos
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);

        } catch (error) {
            console.error('❌ Erro ao exportar:', error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Erro desconhecido ao exportar');

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
                disabled={isExporting}
                className="gap-2"
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
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${status === 'success'
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
