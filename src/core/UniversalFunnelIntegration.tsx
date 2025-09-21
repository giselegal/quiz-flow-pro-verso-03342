/**
 * 🔌 UNIVERSAL FUNNEL INTEGRATION
 * 
 * Integração do editor universal com o sistema existente
 * Permite editar qualquer funil de forma transparente
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UniversalFunnelEditor, UniversalFunnel } from './UniversalFunnelEditor';
import { FunnelAdapterFactory } from './FunnelAdapters';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface UniversalFunnelIntegrationProps {
    funnelId: string;
    funnelType?: string;
    onSave?: (data: any) => Promise<void>;
    onCancel?: () => void;
    onPreview?: (funnel: UniversalFunnel) => void;
    readOnly?: boolean;
}

interface LoadingState {
    isLoading: boolean;
    error?: string;
    success?: string;
}

export const UniversalFunnelIntegration: React.FC<UniversalFunnelIntegrationProps> = ({
    funnelId,
    funnelType,
    onSave,
    onCancel,
    onPreview,
    readOnly = false
}) => {
    const [universalFunnel, setUniversalFunnel] = useState<UniversalFunnel | null>(null);
    const [originalData, setOriginalData] = useState<any>(null);
    const [detectedType, setDetectedType] = useState<string>('');
    const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: true });

    // Carregar funil existente
    useEffect(() => {
        loadFunnel();
    }, [funnelId]);

    const loadFunnel = async () => {
        setLoadingState({ isLoading: true });

        try {
            // 1. Carregar dados do funil do backend/localStorage/IndexedDB
            const funnelData = await loadFunnelData(funnelId);

            if (!funnelData) {
                throw new Error('Funil não encontrado');
            }

            // 2. Detectar tipo automaticamente se não fornecido
            const type = funnelType || FunnelAdapterFactory.detectType(funnelData);
            setDetectedType(type);

            // 3. Converter para formato universal
            const universal = FunnelAdapterFactory.toUniversal(funnelData, type);

            setOriginalData(funnelData);
            setUniversalFunnel(universal);
            setLoadingState({ isLoading: false, success: `Funil carregado (tipo: ${type})` });

        } catch (error) {
            console.error('Erro ao carregar funil:', error);
            setLoadingState({
                isLoading: false,
                error: `Erro ao carregar funil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    };

    // Salvar funil
    const handleSave = useCallback(async (universal: UniversalFunnel) => {
        if (!onSave) return;

        setLoadingState({ isLoading: true });

        try {
            // 1. Converter de volta para formato original
            const originalFormat = FunnelAdapterFactory.fromUniversal(universal);

            // 2. Salvar usando callback fornecido
            await onSave(originalFormat);

            // 3. Atualizar dados originais
            setOriginalData(originalFormat);
            setLoadingState({
                isLoading: false,
                success: 'Funil salvo com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao salvar funil:', error);
            setLoadingState({
                isLoading: false,
                error: `Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
        }
    }, [onSave]);

    // Preview do funil
    const handlePreview = useCallback((universal: UniversalFunnel) => {
        if (onPreview) {
            onPreview(universal);
        } else {
            // Preview padrão - abrir em nova janela
            const previewUrl = generatePreviewUrl(universal);
            window.open(previewUrl, '_blank');
        }
    }, [onPreview]);

    // Export do funil
    const handleExport = useCallback((universal: UniversalFunnel) => {
        const exportData = {
            universal,
            original: FunnelAdapterFactory.fromUniversal(universal),
            metadata: {
                exportedAt: new Date().toISOString(),
                exportedBy: 'UniversalFunnelEditor',
                originalType: detectedType
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${universal.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [detectedType]);

    if (loadingState.isLoading) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Carregando funil...</p>
                </div>
            </div>
        );
    }

    if (loadingState.error) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {loadingState.error}
                        </AlertDescription>
                    </Alert>
                    <div className="mt-4 flex gap-2">
                        <Button onClick={loadFunnel}>
                            Tentar Novamente
                        </Button>
                        {onCancel && (
                            <Button variant="outline" onClick={onCancel}>
                                Voltar
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!universalFunnel) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Nenhum funil carregado</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 relative">
            {/* Status Messages */}
            {loadingState.success && (
                <div className="absolute top-4 right-4 z-50">
                    <Alert className="border-green-200 bg-green-50 max-w-md">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {loadingState.success}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Universal Editor */}
            <UniversalFunnelEditor
                funnel={universalFunnel}
                onFunnelChange={setUniversalFunnel}
                onSave={handleSave}
                onPreview={handlePreview}
                onExport={handleExport}
                readOnly={readOnly}
            />

            {/* Cancel Button */}
            {onCancel && (
                <div className="absolute bottom-6 left-6">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="bg-white"
                    >
                        Voltar
                    </Button>
                </div>
            )}
        </div>
    );
};

// ===============================
// 🎯 FUNNEL DATA LOADER
// ===============================

async function loadFunnelData(funnelId: string): Promise<any> {
    // Tentar múltiplas fontes de dados

    try {
        // 1. Tentar localStorage primeiro
        const localData = localStorage.getItem(`funnel_${funnelId}`);
        if (localData) {
            return JSON.parse(localData);
        }
    } catch (error) {
        console.warn('Erro ao carregar do localStorage:', error);
    }

    try {
        // 2. Tentar IndexedDB
        const indexedData = await loadFromIndexedDB(funnelId);
        if (indexedData) {
            return indexedData;
        }
    } catch (error) {
        console.warn('Erro ao carregar do IndexedDB:', error);
    }

    try {
        // 3. Tentar Supabase
        const supabaseData = await loadFromSupabase(funnelId);
        if (supabaseData) {
            return supabaseData;
        }
    } catch (error) {
        console.warn('Erro ao carregar do Supabase:', error);
    }

    // 4. Funil de exemplo se nada for encontrado
    if (funnelId === 'quiz21StepsComplete') {
        return generateExampleQuiz21();
    }

    throw new Error('Funil não encontrado em nenhuma fonte de dados');
}

async function loadFromIndexedDB(funnelId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FunnelDatabase', 1);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['funnels'], 'readonly');
            const store = transaction.objectStore('funnels');
            const getRequest = store.get(funnelId);

            getRequest.onsuccess = () => {
                resolve(getRequest.result?.data);
            };

            getRequest.onerror = () => reject(getRequest.error);
        };
    });
}

async function loadFromSupabase(funnelId: string): Promise<any> {
    // Implementação específica do Supabase
    // Este é um exemplo - ajustar conforme sua implementação
    try {
        const response = await fetch(`/api/funnels/${funnelId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn('Supabase não disponível:', error);
    }
    return null;
}

function generateExampleQuiz21(): any {
    return {
        id: 'quiz21StepsComplete',
        nome: 'Quiz 21 Steps Complete - Exemplo',
        steps: [
            {
                id: 1,
                titulo: 'Bem-vindo ao Quiz!',
                pergunta: 'Qual é seu principal objetivo?',
                opcoes: [
                    { texto: 'Crescer profissionalmente', valor: 'carreira', proximoStep: 2 },
                    { texto: 'Melhorar relacionamentos', valor: 'relacionamento', proximoStep: 3 },
                    { texto: 'Ter mais saúde', valor: 'saude', proximoStep: 4 }
                ]
            },
            {
                id: 2,
                titulo: 'Carreira Profissional',
                pergunta: 'Em que área você trabalha?',
                opcoes: [
                    { texto: 'Tecnologia', valor: 'tech', proximoStep: 5 },
                    { texto: 'Marketing', valor: 'marketing', proximoStep: 6 },
                    { texto: 'Vendas', valor: 'sales', proximoStep: 7 }
                ]
            },
            // Adicionar mais steps conforme necessário...
        ],
        configuracoes: {
            tema: 'modern',
            cores: {
                primary: '#3B82F6',
                secondary: '#1E40AF'
            }
        }
    };
}

function generatePreviewUrl(universal: UniversalFunnel): string {
    // Gerar URL de preview baseada no tipo
    const baseUrl = window.location.origin;

    switch (universal.type) {
        case 'quiz':
            return `${baseUrl}/preview/quiz/${universal.id}`;
        case 'lead-magnet':
            return `${baseUrl}/preview/lead-magnet/${universal.id}`;
        case 'personal-branding':
            return `${baseUrl}/preview/personal-branding/${universal.id}`;
        default:
            return `${baseUrl}/preview/universal/${universal.id}`;
    }
}

// ===============================
// 🎯 QUICK ACCESS COMPONENT
// ===============================

interface QuickEditButtonProps {
    funnelId: string;
    funnelType?: string;
    className?: string;
    children?: React.ReactNode;
}

export const QuickEditButton: React.FC<QuickEditButtonProps> = ({
    funnelId,
    funnelType,
    className = '',
    children = 'Editar Funil'
}) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    if (isEditorOpen) {
        return (
            <UniversalFunnelIntegration
                funnelId={funnelId}
                funnelType={funnelType}
                onCancel={() => setIsEditorOpen(false)}
                onSave={async (data) => {
                    // Salvar dados aqui
                    console.log('Salvando funil:', data);
                    setIsEditorOpen(false);
                }}
            />
        );
    }

    return (
        <Button
            onClick={() => setIsEditorOpen(true)}
            className={className}
        >
            {children}
        </Button>
    );
};

export default UniversalFunnelIntegration;