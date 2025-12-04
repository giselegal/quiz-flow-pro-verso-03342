/**
 * 📥 COMPONENTE: Importar Template JSON v4.0
 * 
 * Permite upload de arquivos JSON e importação direta no editor
 * Valida com Zod e carrega no quizStore
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileJson, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useQuizStore } from './ModernQuizEditor/store/quizStore';
import { QuizSchemaZ, getSchemaErrors, type QuizSchema } from '@/schemas/quiz-schema.zod';
import { useToast } from '@/hooks/use-toast';

interface ImportTemplateProps {
    onImportSuccess?: (quiz: QuizSchema) => void;
    onImportError?: (error: Error) => void;
    compact?: boolean;
}

export function ImportTemplateButton({ 
    onImportSuccess, 
    onImportError,
    compact = false 
}: ImportTemplateProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    // Acesso direto ao store
    const loadQuiz = useQuizStore((state) => state.loadQuiz);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsImporting(true);
        setStatus('idle');
        setMessage('');
        setValidationErrors([]);

        try {
            const file = files[0];
            const content = await file.text();
            
            let json: unknown;
            try {
                json = JSON.parse(content);
            } catch {
                throw new Error(`Arquivo "${file.name}" não é um JSON válido`);
            }

            // Validar com Zod
            const validationResult = QuizSchemaZ.safeParse(json);

            if (!validationResult.success) {
                const errors = getSchemaErrors(json);
                setValidationErrors(errors);
                
                // Se tem erros críticos, não importar
                if (errors.some(e => e.includes('obrigatório') || e.includes('required'))) {
                    throw new Error(`Arquivo não é um quiz v4.0 válido:\n${errors.slice(0, 3).join('\n')}`);
                }
                
                // Erros não críticos - avisar mas importar
                toast({
                    title: 'Quiz importado com avisos',
                    description: `${errors.length} campo(s) com problemas de validação.`,
                    variant: 'destructive',
                });
            }

            // Carregar no store
            const quizData = validationResult.success 
                ? validationResult.data 
                : json as QuizSchema;
            
            loadQuiz(quizData);

            setStatus('success');
            setMessage(`✅ "${quizData.metadata?.name || file.name}" importado com sucesso!`);

            toast({
                title: 'Quiz importado',
                description: `${quizData.steps?.length || 0} steps carregados.`,
            });

            if (onImportSuccess) {
                onImportSuccess(quizData);
            }

            // Reset status após 3 segundos
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
                setValidationErrors([]);
            }, 3000);

        } catch (error) {
            console.error('❌ Erro ao importar:', error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Erro desconhecido ao importar');

            toast({
                title: 'Erro ao importar',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
                variant: 'destructive',
            });

            if (onImportError && error instanceof Error) {
                onImportError(error);
            }
        } finally {
            setIsImporting(false);
            // Reset input para permitir reimportar mesmo arquivo
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Versão compacta para toolbar
    if (compact) {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="gap-2"
                >
                    <Upload className="h-4 w-4" />
                    {isImporting ? 'Importando...' : 'Importar'}
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </>
        );
    }

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Importar Quiz JSON</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                    Faça upload de um arquivo JSON v4.0 para carregar no editor.
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={isImporting}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        {isImporting ? 'Importando...' : 'Selecionar Arquivo JSON'}
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {status !== 'idle' && (
                    <div
                        className={`flex items-start gap-2 p-3 rounded-lg ${
                            status === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        {status === 'success' ? (
                            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="text-sm">
                            <p>{message}</p>
                            {validationErrors.length > 0 && status === 'error' && (
                                <ul className="mt-2 list-disc list-inside text-xs opacity-80">
                                    {validationErrors.slice(0, 5).map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                    {validationErrors.length > 5 && (
                                        <li>...e mais {validationErrors.length - 5} erro(s)</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-muted/50 border border-border rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium mb-1">Formato esperado:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>JSON v4.0 com version e schemaVersion</li>
                                <li>Deve conter: metadata, theme, settings, steps</li>
                                <li>Validação automática com schema Zod</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ImportTemplateButton;
