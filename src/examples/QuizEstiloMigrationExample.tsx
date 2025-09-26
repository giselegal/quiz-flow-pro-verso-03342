/**
 * 🔥 EXEMPLO PRÁTICO: Migration Service para Quiz-Estilo
 * 
 * Demonstra como usar o Migration Service para otimizar
 * automaticamente todas as imagens do quiz de estilo
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { migrateQuizEstiloImages, getImageCacheStats } from '@/services/ImageMigrationService';

interface MigrationStats {
    totalImages: number;
    migrated: number;
    failed: number;
    spaceSaved: number;
    compressionRatio: number;
}

const QuizEstiloMigrationExample: React.FC = () => {
    const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
    const [stats, setStats] = useState<MigrationStats | null>(null);
    const [details, setDetails] = useState<any[]>([]);
    const [cacheStats, setCacheStats] = useState<any>(null);

    // Executar migração do quiz-estilo
    const runMigration = async () => {
        setMigrationStatus('running');

        try {
            console.log('🚀 Iniciando migração do Quiz-Estilo...');

            const result = await migrateQuizEstiloImages();

            setStats(result.stats);
            setDetails(result.details);
            setMigrationStatus('complete');

            console.log('✅ Migração concluída!', result.stats);

            // Buscar estatísticas do cache
            await loadCacheStats();

        } catch (error) {
            console.error('❌ Erro na migração:', error);
            setMigrationStatus('error');
        }
    };

    // Carregar estatísticas do cache
    const loadCacheStats = async () => {
        try {
            const cacheData = await getImageCacheStats();
            setCacheStats(cacheData);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    // Formatar bytes para formato legível
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#432818] mb-2">
                    🔥 Migration Service - Quiz Estilo
                </h1>
                <p className="text-[#6B4F43]">
                    Migração automática das imagens do quiz para sistema IndexedDB otimizado
                </p>
            </div>

            {/* Controle Principal */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🚀 Controle de Migração
                        {migrationStatus === 'running' && (
                            <Badge variant="outline" className="animate-pulse">
                                Executando...
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertDescription>
                            Esta migração irá baixar e otimizar automaticamente todas as imagens do
                            template <strong>quiz-estilo-21-steps</strong> (logo, intro e 8 estilos),
                            convertendo para WebP e armazenando no IndexedDB para carregamento offline.
                        </AlertDescription>
                    </Alert>

                    <div className="flex gap-4">
                        <Button
                            onClick={runMigration}
                            disabled={migrationStatus === 'running'}
                            className="flex-1 bg-[#B89B7A] hover:bg-[#A68A6D] text-white"
                        >
                            {migrationStatus === 'running'
                                ? '⏳ Migrando Imagens...'
                                : '🔥 Migrar Quiz-Estilo'
                            }
                        </Button>

                        <Button
                            onClick={loadCacheStats}
                            variant="outline"
                            className="flex-1"
                        >
                            📊 Atualizar Estatísticas
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Resultados da Migração */}
            {stats && migrationStatus === 'complete' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            ✅ Migração Concluída
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Sucesso
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#432818]">
                                    {stats.totalImages}
                                </div>
                                <div className="text-sm text-gray-600">Total de Imagens</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.migrated}
                                </div>
                                <div className="text-sm text-gray-600">Migradas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.failed}
                                </div>
                                <div className="text-sm text-gray-600">Falhas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.compressionRatio.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Compressão</div>
                            </div>
                        </div>

                        {stats.spaceSaved > 0 && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-green-700">
                                        💾 Espaço Economizado: {formatBytes(stats.spaceSaved)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Detalhes das Imagens */}
            {details.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>📋 Detalhes da Migração</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {details.map((detail, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border ${detail.success
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {detail.stepId}
                                        </Badge>
                                        <div className={`w-2 h-2 rounded-full ${detail.success ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                        <span className={`text-sm ${detail.success ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            {detail.success ? '✅ Sucesso' : '❌ Falha'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        {detail.imageUrl}
                                    </div>
                                    {detail.error && (
                                        <div className="text-xs text-red-600 mt-1">
                                            Erro: {detail.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Estatísticas do Cache */}
            {cacheStats && (
                <Card>
                    <CardHeader>
                        <CardTitle>💾 Estatísticas do Cache IndexedDB</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-[#432818]">
                                    {cacheStats.count || 0}
                                </div>
                                <div className="text-sm text-gray-600">Imagens em Cache</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">
                                    {formatBytes(cacheStats.totalSize || 0)}
                                </div>
                                <div className="text-sm text-gray-600">Espaço Usado</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-purple-600">
                                    {((cacheStats.totalSize || 0) / (50 * 1024 * 1024) * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">% do Limite</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Estado de Erro */}
            {migrationStatus === 'error' && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription>
                        ❌ Erro durante a migração. Verifique o console para mais detalhes.
                    </AlertDescription>
                </Alert>
            )}

            {/* Código de Exemplo */}
            <Card>
                <CardHeader>
                    <CardTitle>💻 Como Usar o Migration Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700">
                            {`// Import da função
import { migrateQuizEstiloImages } from '@/services/ImageMigrationService';

// Executar migração
const result = await migrateQuizEstiloImages();

console.log(\`Migradas: \${result.stats.migrated}/\${result.stats.totalImages}\`);
console.log(\`Economia: \${(result.stats.spaceSaved / 1024).toFixed(1)}KB\`);
console.log(\`Compressão: \${result.stats.compressionRatio}%\`);`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizEstiloMigrationExample;