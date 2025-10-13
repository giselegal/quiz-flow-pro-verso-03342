/**
 * 📥 COMPONENTE: Importar Template JSON v3.0
 * 
 * Permite fazer upload de arquivos JSON v3.0 e importá-los para o editor
 * Converte automaticamente sections → blocks
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileJson, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import type { JSONv3Template } from '@/adapters/BlocksToJSONv3Adapter';

interface ImportTemplateProps {
    onImportSuccess?: (draftId: string) => void;
    onImportError?: (error: Error) => void;
}

export function ImportTemplateButton({ onImportSuccess, onImportError }: ImportTemplateProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsImporting(true);
        setStatus('idle');
        setMessage('');

        try {
            const templates: Record<string, JSONv3Template> = {};

            // Ler todos os arquivos
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const content = await file.text();
                const json = JSON.parse(content) as JSONv3Template;

                if (!json.templateVersion || json.templateVersion !== '3.0') {
                    throw new Error(`Arquivo ${file.name} não é um template JSON v3.0 válido`);
                }

                templates[json.metadata.id] = json;
            }

            console.log(`📥 Importando ${Object.keys(templates).length} template(s)...`);

            // Importar para o editor
            const funnel = await quizEditorBridge.importAllJSONv3Templates(
                templates,
                `Imported from ${files.length} file(s)`
            );

            setStatus('success');
            setMessage(`✅ ${Object.keys(templates).length} template(s) importado(s) com sucesso!`);

            if (onImportSuccess) {
                onImportSuccess(funnel.id);
            }

            // Redirecionar para editor após 2 segundos
            setTimeout(() => {
                window.location.href = `/editor?funnel=${funnel.id}`;
            }, 2000);

        } catch (error) {
            console.error('❌ Erro ao importar templates:', error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Erro desconhecido ao importar');

            if (onImportError && error instanceof Error) {
                onImportError(error);
            }
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Importar Template JSON v3.0</h3>
                </div>

                <p className="text-sm text-gray-600">
                    Faça upload de um ou mais arquivos JSON v3.0 para importar templates existentes para o editor.
                </p>

                <div className="flex flex-col gap-3">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={isImporting}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {isImporting ? 'Importando...' : 'Selecionar Arquivo(s) JSON'}
                        </Button>
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        accept=".json"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {status !== 'idle' && (
                    <div
                        className={`flex items-start gap-2 p-3 rounded-lg ${status === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                    >
                        {status === 'success' ? (
                            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm">{message}</p>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Formato esperado:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Arquivo .json com templateVersion: "3.0"</li>
                                <li>Deve conter: metadata, sections, navigation</li>
                                <li>Múltiplos arquivos serão mesclados em um funil</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ImportTemplateButton;
