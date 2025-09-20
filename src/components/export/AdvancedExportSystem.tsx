import { useState } from 'react';
import {
    X,
    Download,
    FileText,
    Code,
    Globe,
    Smartphone,
    Settings,
    RefreshCw,
    Upload,
    Share2,
    Zap,
    Database,
    Cloud,
    Package
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Switch } from '../ui/switch';

interface AdvancedExportSystemProps {
    onClose: () => void;
}

interface ExportFormat {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: 'web' | 'mobile' | 'document' | 'code' | 'integration';
    features: string[];
    optimizations: string[];
    platforms: string[];
    status: 'ready' | 'processing' | 'completed' | 'error';
    size?: string;
    lastExported?: string;
}

interface ExportPreset {
    id: string;
    name: string;
    description: string;
    formats: string[];
    autoOptimization: boolean;
    platforms: string[];
    schedule?: 'immediate' | 'daily' | 'weekly';
}

interface IntegrationPlatform {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    status: 'connected' | 'disconnected' | 'error';
    lastSync?: string;
    features: string[];
}

export function AdvancedExportSystem({ onClose }: AdvancedExportSystemProps) {
    const { trackEvent } = useAnalytics();
    const [activeTab, setActiveTab] = useState<'formats' | 'presets' | 'integrations' | 'history'>('formats');
    const [isExporting, setIsExporting] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
    const [autoOptimization, setAutoOptimization] = useState(true);

    const [exportFormats, setExportFormats] = useState<ExportFormat[]>([
        {
            id: 'react-component',
            name: 'React Component',
            description: 'Componente React otimizado com TypeScript',
            icon: <Code className="w-5 h-5 text-blue-600" />,
            category: 'code',
            features: ['TypeScript', 'Hooks', 'Styled Components', 'Props Interface'],
            optimizations: ['Tree Shaking', 'Lazy Loading', 'Memoization', 'Bundle Splitting'],
            platforms: ['Web', 'Next.js', 'Vite', 'Create React App'],
            status: 'ready'
        },
        {
            id: 'html-standalone',
            name: 'HTML Standalone',
            description: 'HTML completo com CSS e JS incorporados',
            icon: <Globe className="w-5 h-5 text-green-600" />,
            category: 'web',
            features: ['Responsivo', 'SEO Otimizado', 'Performance', 'Acessibilidade'],
            optimizations: ['Minificação', 'Compressão', 'Critical CSS', 'Image Optimization'],
            platforms: ['Qualquer Servidor', 'CDN', 'GitHub Pages', 'Netlify'],
            status: 'ready'
        },
        {
            id: 'pwa-app',
            name: 'Progressive Web App',
            description: 'PWA completa com Service Worker',
            icon: <Smartphone className="w-5 h-5 text-purple-600" />,
            category: 'mobile',
            features: ['Offline Support', 'Push Notifications', 'App Install', 'Background Sync'],
            optimizations: ['Service Worker', 'App Shell', 'Resource Caching', 'Data Sync'],
            platforms: ['Mobile Web', 'Desktop', 'App Stores'],
            status: 'ready'
        },
        {
            id: 'pdf-document',
            name: 'PDF Interactive',
            description: 'PDF com formulários interativos',
            icon: <FileText className="w-5 h-5 text-red-600" />,
            category: 'document',
            features: ['Formulários', 'Assinaturas', 'Campos Calculados', 'Validação'],
            optimizations: ['Compressão', 'Fontes Incorporadas', 'Otimização de Imagens'],
            platforms: ['Adobe Reader', 'Navegadores', 'Mobile', 'Impressão'],
            status: 'ready'
        },
        {
            id: 'amp-pages',
            name: 'AMP Pages',
            description: 'Páginas AMP para carregamento ultra-rápido',
            icon: <Zap className="w-5 h-5 text-yellow-600" />,
            category: 'web',
            features: ['AMP Valid', 'Instant Loading', 'SEO Boost', 'Mobile First'],
            optimizations: ['AMP Runtime', 'Lazy Loading', 'Preconnect', 'Resource Hints'],
            platforms: ['Google Search', 'Bing', 'Twitter', 'LinkedIn'],
            status: 'ready'
        },
        {
            id: 'wordpress-plugin',
            name: 'WordPress Plugin',
            description: 'Plugin WordPress com shortcodes',
            icon: <Package className="w-5 h-5 text-indigo-600" />,
            category: 'integration',
            features: ['Shortcodes', 'Gutenberg Blocks', 'Widget', 'Admin Panel'],
            optimizations: ['Asset Loading', 'Database Queries', 'Caching', 'Security'],
            platforms: ['WordPress.org', 'WordPress.com', 'WooCommerce'],
            status: 'ready'
        }
    ]);

    const [exportPresets] = useState<ExportPreset[]>([
        {
            id: 'full-stack',
            name: 'Full Stack Complete',
            description: 'Exportação completa para desenvolvimento e produção',
            formats: ['react-component', 'html-standalone', 'pwa-app'],
            autoOptimization: true,
            platforms: ['Web', 'Mobile', 'Desktop'],
            schedule: 'immediate'
        },
        {
            id: 'marketing-kit',
            name: 'Marketing Kit',
            description: 'Formatos otimizados para marketing digital',
            formats: ['amp-pages', 'html-standalone', 'pdf-document'],
            autoOptimization: true,
            platforms: ['Social Media', 'Email', 'Landing Pages'],
            schedule: 'immediate'
        },
        {
            id: 'cms-integration',
            name: 'CMS Integration',
            description: 'Integração com sistemas de gerenciamento',
            formats: ['wordpress-plugin', 'html-standalone'],
            autoOptimization: true,
            platforms: ['WordPress', 'Drupal', 'Joomla'],
            schedule: 'weekly'
        }
    ]);

    const [integrationPlatforms] = useState<IntegrationPlatform[]>([
        {
            id: 'github',
            name: 'GitHub Pages',
            description: 'Deploy automático para GitHub Pages',
            icon: <Code className="w-5 h-5 text-gray-800" />,
            status: 'connected',
            lastSync: '2 min atrás',
            features: ['Auto Deploy', 'Custom Domain', 'HTTPS', 'Analytics']
        },
        {
            id: 'netlify',
            name: 'Netlify',
            description: 'Hospedagem com CI/CD integrado',
            icon: <Cloud className="w-5 h-5 text-teal-600" />,
            status: 'connected',
            lastSync: '5 min atrás',
            features: ['Edge Functions', 'Form Handling', 'Analytics', 'CDN Global']
        },
        {
            id: 'vercel',
            name: 'Vercel',
            description: 'Plataforma para aplicações frontend',
            icon: <Globe className="w-5 h-5 text-black" />,
            status: 'disconnected',
            features: ['Serverless Functions', 'Edge Network', 'Analytics', 'Preview URLs']
        },
        {
            id: 'wordpress',
            name: 'WordPress.com',
            description: 'Publicação direta no WordPress',
            icon: <Package className="w-5 h-5 text-blue-600" />,
            status: 'connected',
            lastSync: '1 hora atrás',
            features: ['Auto Post', 'Media Library', 'SEO', 'Social Sharing']
        }
    ]);

    const [exportHistory, setExportHistory] = useState([
        {
            id: '1',
            name: 'Quiz Completo v2.1',
            formats: ['React Component', 'HTML'],
            createdAt: '2024-01-20 14:30',
            size: '2.4 MB',
            downloads: 127,
            status: 'completed'
        },
        {
            id: '2',
            name: 'Landing Page Otimizada',
            formats: ['AMP', 'PWA'],
            createdAt: '2024-01-19 09:15',
            size: '890 KB',
            downloads: 89,
            status: 'completed'
        }
    ]);

    const handleExport = async (formatIds: string[] = selectedFormats) => {
        if (formatIds.length === 0) return;

        setIsExporting(true);
        trackEvent('export_started', {
            formats: formatIds,
            autoOptimization,
            timestamp: Date.now()
        });

        try {
            // Simular processo de exportação
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Atualizar status dos formatos
            setExportFormats(prev => prev.map(format => ({
                ...format,
                status: formatIds.includes(format.id) ? 'completed' : format.status,
                lastExported: formatIds.includes(format.id) ? 'Agora' : format.lastExported,
                size: formatIds.includes(format.id) ? `${Math.random() * 5 + 1}MB`.substring(0, 4) : format.size
            })) as ExportFormat[]);

            // Adicionar ao histórico
            const newExport = {
                id: Date.now().toString(),
                name: `Export ${new Date().toLocaleString()}`,
                formats: formatIds.map(id => exportFormats.find(f => f.id === id)?.name || id),
                createdAt: new Date().toLocaleString(),
                size: `${Math.random() * 10 + 1}MB`.substring(0, 4),
                downloads: 0,
                status: 'completed'
            };

            setExportHistory(prev => [newExport, ...prev]);

            trackEvent('export_completed', {
                formats: formatIds,
                duration: 3000
            });

        } catch (error) {
            console.error('❌ Erro na exportação:', error);
        } finally {
            setIsExporting(false);
            setSelectedFormats([]);
        }
    };

    const handlePresetExport = async (preset: ExportPreset) => {
        await handleExport(preset.formats);
        trackEvent('preset_exported', { presetId: preset.id });
    };

    const toggleFormatSelection = (formatId: string) => {
        setSelectedFormats(prev =>
            prev.includes(formatId)
                ? prev.filter(id => id !== formatId)
                : [...prev, formatId]
        );
    };

    const getStatusBadge = (status: string) => {
        const configs = {
            ready: { color: 'bg-green-100 text-green-800', label: 'Pronto' },
            processing: { color: 'bg-yellow-100 text-yellow-800', label: 'Processando' },
            completed: { color: 'bg-blue-100 text-blue-800', label: 'Concluído' },
            error: { color: 'bg-red-100 text-red-800', label: 'Erro' },
            connected: { color: 'bg-green-100 text-green-800', label: 'Conectado' },
            disconnected: { color: 'bg-gray-100 text-gray-800', label: 'Desconectado' }
        };
        const config = configs[status as keyof typeof configs];
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            web: <Globe className="w-4 h-4" />,
            mobile: <Smartphone className="w-4 h-4" />,
            document: <FileText className="w-4 h-4" />,
            code: <Code className="w-4 h-4" />,
            integration: <Database className="w-4 h-4" />
        };
        return icons[category as keyof typeof icons];
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-7xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-lg">
                            <Download className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Advanced Export System</h2>
                            <p className="text-sm text-gray-600">Exportação multi-formato com otimizações inteligentes</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedFormats.length > 0 && (
                            <Button
                                onClick={() => handleExport()}
                                disabled={isExporting}
                                className="bg-gradient-to-r from-green-600 to-blue-600 text-white flex items-center gap-2"
                            >
                                {isExporting ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {isExporting ? 'Exportando...' : `Exportar ${selectedFormats.length}`}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Fechar
                        </Button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                    {exportFormats.length} formatos disponíveis
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cloud className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-700">
                                    {integrationPlatforms.filter(p => p.status === 'connected').length} integrações ativas
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">Auto-Otimização:</span>
                                <Switch
                                    checked={autoOptimization}
                                    onCheckedChange={setAutoOptimization}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex">
                        {[
                            { key: 'formats', label: 'Formatos', icon: Download, count: exportFormats.length },
                            { key: 'presets', label: 'Presets', icon: Package, count: exportPresets.length },
                            { key: 'integrations', label: 'Integrações', icon: Share2, count: integrationPlatforms.filter(p => p.status === 'connected').length },
                            { key: 'history', label: 'Histórico', icon: Database, count: exportHistory.length }
                        ].map(({ key, label, icon: Icon, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {count > 0 && (
                                    <Badge className="bg-blue-100 text-blue-800 text-xs ml-1">
                                        {count}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {activeTab === 'formats' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Formatos de Exportação</h3>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800">
                                        {selectedFormats.length} selecionados
                                    </Badge>
                                    {selectedFormats.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedFormats([])}
                                        >
                                            Limpar Seleção
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {exportFormats.map((format) => (
                                    <div
                                        key={format.id}
                                        className={`bg-white border rounded-xl p-6 shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedFormats.includes(format.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200'
                                            }`}
                                        onClick={() => toggleFormatSelection(format.id)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {format.icon}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{format.name}</h4>
                                                    <p className="text-sm text-gray-600">{format.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(format.category)}
                                                {getStatusBadge(format.status)}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-700 mb-2">Recursos:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {format.features.slice(0, 3).map((feature, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                                {format.features.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{format.features.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-700 mb-2">Otimizações:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {format.optimizations.slice(0, 2).map((opt, idx) => (
                                                    <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                                                        {opt}
                                                    </Badge>
                                                ))}
                                                {format.optimizations.length > 2 && (
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        +{format.optimizations.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Plataformas: {format.platforms.slice(0, 2).join(', ')}</span>
                                            {format.size && <span>Tamanho: {format.size}</span>}
                                            {format.lastExported && <span>Último: {format.lastExported}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'presets' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Presets de Exportação</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Criar Preset
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {exportPresets.map((preset) => (
                                    <div key={preset.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">{preset.name}</h4>
                                            <p className="text-sm text-gray-600">{preset.description}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-700 mb-2">
                                                Formatos ({preset.formats.length}):
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {preset.formats.map((formatId, idx) => {
                                                    const format = exportFormats.find(f => f.id === formatId);
                                                    return (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {format?.name || formatId}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-700 mb-2">Plataformas:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {preset.platforms.map((platform, idx) => (
                                                    <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                                                        {platform}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {preset.autoOptimization && (
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        Auto-Otimização
                                                    </Badge>
                                                )}
                                                {preset.schedule && preset.schedule !== 'immediate' && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {preset.schedule}
                                                    </Badge>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handlePresetExport(preset)}
                                                disabled={isExporting}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs"
                                            >
                                                Exportar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Integrações de Plataforma</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Adicionar Integração
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {integrationPlatforms.map((platform) => (
                                    <div key={platform.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {platform.icon}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                                                    <p className="text-sm text-gray-600">{platform.description}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(platform.status)}
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-700 mb-2">Recursos:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {platform.features.map((feature, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {platform.lastSync && (
                                                <span className="text-xs text-gray-500">
                                                    Última sincronização: {platform.lastSync}
                                                </span>
                                            )}

                                            <div className="flex items-center gap-2">
                                                {platform.status === 'connected' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs"
                                                    >
                                                        Sincronizar
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant={platform.status === 'connected' ? 'outline' : 'default'}
                                                    className="text-xs"
                                                >
                                                    {platform.status === 'connected' ? 'Configurar' : 'Conectar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Histórico de Exportações</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Atualizar
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {exportHistory.map((export_item) => (
                                    <div key={export_item.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{export_item.name}</h4>
                                                    {getStatusBadge(export_item.status)}
                                                </div>

                                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                                    <span>Formatos: {export_item.formats.join(', ')}</span>
                                                    <span>Criado: {export_item.createdAt}</span>
                                                    <span>Tamanho: {export_item.size}</span>
                                                    <span>Downloads: {export_item.downloads}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                >
                                                    <Upload className="w-3 h-3 mr-1" />
                                                    Reexportar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdvancedExportSystem;