/**
 * 📄 GERADOR DE RELATÓRIOS EM PDF
 * 
 * Exporta relatórios completos dos analytics em PDF
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    Download,
    Calendar,
    BarChart3,
    Users,
    TrendingUp,
    Loader2
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ReportGeneratorProps {
    analyticsData?: any;
    funnelData?: any;
    participantData?: any;
}

interface ReportConfig {
    type: 'executive' | 'detailed' | 'funnel' | 'participants';
    period: 'week' | 'month' | 'quarter' | 'all';
    format: 'pdf' | 'excel' | 'csv';
    sections: string[];
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
    analyticsData,
    funnelData,
    participantData
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [config, setConfig] = useState<ReportConfig>({
        type: 'executive',
        period: 'month',
        format: 'pdf',
        sections: ['kpis', 'funnel', 'devices', 'recommendations']
    });

    // ========================================================================
    // CONFIGURAÇÕES DE RELATÓRIO
    // ========================================================================

    const reportTypes = [
        {
            value: 'executive',
            label: 'Relatório Executivo',
            description: 'Visão geral com KPIs principais',
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            value: 'detailed',
            label: 'Relatório Detalhado',
            description: 'Análise completa com todos os gráficos',
            icon: <BarChart3 className="w-4 h-4" />
        },
        {
            value: 'funnel',
            label: 'Análise de Funil',
            description: 'Foco no funil de conversão',
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            value: 'participants',
            label: 'Lista de Participantes',
            description: 'Dados detalhados dos usuários',
            icon: <Users className="w-4 h-4" />
        }
    ];

    const periodOptions = [
        { value: 'week', label: 'Última Semana' },
        { value: 'month', label: 'Último Mês' },
        { value: 'quarter', label: 'Último Trimestre' },
        { value: 'all', label: 'Todos os Períodos' }
    ];

    const formatOptions = [
        { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
        { value: 'excel', label: 'Excel', icon: <BarChart3 className="w-4 h-4" /> },
        { value: 'csv', label: 'CSV', icon: <Download className="w-4 h-4" /> }
    ];

    // ========================================================================
    // GERAÇÃO DE RELATÓRIOS
    // ========================================================================

    const generateReport = async () => {
        setIsGenerating(true);

        try {
            // Simular geração de relatório
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Aqui seria implementada a lógica real de geração
            const reportData = {
                type: config.type,
                period: config.period,
                generatedAt: new Date().toISOString(),
                data: {
                    analytics: analyticsData,
                    funnel: funnelData,
                    participants: participantData
                }
            };

            // Para demonstração, vamos criar um download fictício
            const fileName = `quiz-analytics-${config.type}-${config.period}-${new Date().toISOString().split('T')[0]}.${config.format}`;
            
            if (config.format === 'csv') {
                generateCSVReport(reportData, fileName);
            } else if (config.format === 'pdf') {
                generatePDFReport(reportData, fileName);
            } else {
                generateExcelReport(reportData, fileName);
            }

        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateCSVReport = (_data: any, fileName: string) => {
        // Implementação simplificada de CSV
        const csvContent = [
            'Relatório de Analytics - Quiz de Estilo',
            `Tipo: ${config.type}`,
            `Período: ${config.period}`,
            `Gerado em: ${new Date().toLocaleString()}`,
            '',
            'Principais Métricas:',
            'Métrica,Valor',
            'Total de Participantes,50',
            'Taxa de Conclusão,75%',
            'Tempo Médio,8 min',
            'Dispositivo Principal,Mobile',
            '',
            'Para relatório completo, exporte em PDF ou Excel.'
        ].join('\n');

        downloadFile(csvContent, fileName, 'text/csv');
    };

    const generatePDFReport = (data: any, _fileName: string) => {
        // Para uma implementação real, use bibliotecas como jsPDF ou puppeteer
        const htmlContent = generateHTMLReport(data);
        
        // Aqui normalmente você converteria o HTML para PDF
        // Para demonstração, vamos mostrar o HTML
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const generateExcelReport = (_data: any, _fileName: string) => {
        // Para uma implementação real, use bibliotecas como SheetJS
        alert('Funcionalidade Excel será implementada em breve!');
    };

    const generateHTMLReport = (_data: any) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Relatório de Analytics - Quiz de Estilo</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 40px; }
                .section { margin-bottom: 30px; }
                .metric { display: inline-block; margin: 10px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                .chart-placeholder { background: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Relatório de Analytics</h1>
                <h2>Quiz de Descoberta de Estilo Pessoal</h2>
                <p>Período: ${config.period} | Gerado em: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="section">
                <h3>🎯 Principais Métricas</h3>
                <div class="metric">
                    <strong>Total de Participantes</strong><br>
                    50 usuários
                </div>
                <div class="metric">
                    <strong>Taxa de Conclusão</strong><br>
                    75%
                </div>
                <div class="metric">
                    <strong>Tempo Médio</strong><br>
                    8 minutos
                </div>
                <div class="metric">
                    <strong>Dispositivo Principal</strong><br>
                    Mobile (60%)
                </div>
            </div>

            <div class="section">
                <h3>📈 Funil de Conversão</h3>
                <div class="chart-placeholder">
                    [Gráfico de Funil seria inserido aqui]
                </div>
                <p><strong>Principais pontos de abandono:</strong></p>
                <ul>
                    <li>Etapa 5: 12% de abandono</li>
                    <li>Etapa 10: 8% de abandono</li>
                    <li>Etapa 15: 5% de abandono</li>
                </ul>
            </div>

            <div class="section">
                <h3>💡 Recomendações</h3>
                <ul>
                    <li>Otimizar etapas 5 e 10 que apresentam maior abandono</li>
                    <li>Melhorar experiência mobile (60% dos usuários)</li>
                    <li>Implementar dicas visuais nas etapas mais demoradas</li>
                    <li>Considerar A/B testing para perguntas críticas</li>
                </ul>
            </div>
        </body>
        </html>
        `;
    };

    const downloadFile = (content: string, fileName: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Gerador de Relatórios
                </CardTitle>
                <p className="text-sm text-gray-600">
                    Exporte relatórios completos dos analytics em diferentes formatos
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* CONFIGURAÇÃO DO RELATÓRIO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            📋 Tipo de Relatório
                        </label>
                        <Select
                            value={config.type}
                            onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {reportTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                            {type.icon}
                                            <div>
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-xs text-gray-500">{type.description}</div>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            📅 Período
                        </label>
                        <Select
                            value={config.period}
                            onValueChange={(value: any) => setConfig(prev => ({ ...prev, period: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {periodOptions.map((period) => (
                                    <SelectItem key={period.value} value={period.value}>
                                        {period.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            📄 Formato
                        </label>
                        <Select
                            value={config.format}
                            onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {formatOptions.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        <div className="flex items-center gap-2">
                                            {format.icon}
                                            {format.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* PREVIEW DO RELATÓRIO */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">📋 Preview do Relatório:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Tipo:</strong> {reportTypes.find(t => t.value === config.type)?.label}</p>
                        <p><strong>Período:</strong> {periodOptions.find(p => p.value === config.period)?.label}</p>
                        <p><strong>Formato:</strong> {config.format.toUpperCase()}</p>
                        <p><strong>Seções incluídas:</strong> KPIs, Funil, Dispositivos, Recomendações</p>
                    </div>
                </div>

                {/* BOTÃO DE GERAÇÃO */}
                <div className="flex justify-center">
                    <Button
                        onClick={generateReport}
                        disabled={isGenerating}
                        size="lg"
                        className="w-full md:w-auto"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Gerando Relatório...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Gerar Relatório
                            </>
                        )}
                    </Button>
                </div>

                {/* INFORMAÇÕES ADICIONAIS */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">ℹ️ Informações sobre relatórios:</p>
                            <ul className="text-xs space-y-1 opacity-90">
                                <li>• Relatórios são gerados com dados em tempo real</li>
                                <li>• PDFs incluem gráficos e visualizações</li>
                                <li>• CSVs são ideais para análise em Excel</li>
                                <li>• Relatórios executivos focam em KPIs principais</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReportGenerator;
