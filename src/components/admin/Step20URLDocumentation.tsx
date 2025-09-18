import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Globe, Settings } from 'lucide-react';

export const Step20URLDocumentation: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
                <CardHeader>
                    <CardTitle className="text-[#432818] flex items-center gap-2">
                        <Globe className="w-5 h-5" style={{ color: '#B89B7A' }} />
                        Configuração de URLs - Sistema NoCode
                    </CardTitle>
                    <p className="text-sm text-[#6B4F43]">
                        Entenda como funciona a diferenciação de URLs no sistema
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Estrutura de URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#432818] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Etapas Regulares (1-19)
                            </h3>
                            <div className="space-y-2">
                                <div className="p-3 rounded-lg border" style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}>
                                    <code className="text-sm">/step/1</code>
                                    <p className="text-xs text-[#6B4F43] mt-1">Primeira pergunta do quiz</p>
                                </div>
                                <div className="p-3 rounded-lg border" style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}>
                                    <code className="text-sm">/step/2</code>
                                    <p className="text-xs text-[#6B4F43] mt-1">Segunda pergunta do quiz</p>
                                </div>
                                <div className="p-3 rounded-lg border" style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}>
                                    <code className="text-sm">...</code>
                                    <p className="text-xs text-[#6B4F43] mt-1">Outras perguntas</p>
                                </div>
                                <div className="p-3 rounded-lg border" style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}>
                                    <code className="text-sm">/step/19</code>
                                    <p className="text-xs text-[#6B4F43] mt-1">Última pergunta do quiz</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Padrão: /step/:numero
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#432818] flex items-center gap-2">
                                <Settings className="w-5 h-5 text-[#B89B7A]" />
                                Página de Resultado (Etapa 20)
                            </h3>
                            <div className="space-y-2">
                                <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#FFF9F5', borderColor: '#B89B7A' }}>
                                    <code className="text-lg font-semibold text-[#B89B7A]">/step20</code>
                                    <p className="text-sm text-[#6B4F43] mt-2">
                                        Página especial de resultado com configurações personalizadas
                                    </p>
                                    <div className="mt-3 space-y-1">
                                        <p className="text-xs text-[#8F7A6A]">✅ Background personalizado</p>
                                        <p className="text-xs text-[#8F7A6A]">✅ Mensagem de resultado configurável</p>
                                        <p className="text-xs text-[#8F7A6A]">✅ CTA personalizado</p>
                                        <p className="text-xs text-[#8F7A6A]">✅ Compartilhamento social</p>
                                    </div>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                URL Especial: /step20
                            </Badge>
                        </div>
                    </div>

                    {/* Fluxo de Navegação */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#432818]">Fluxo de Navegação</h3>
                        <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                                <p className="text-xs mt-1">/step/1</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#8F7A6A]" />
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                                <p className="text-xs mt-1">/step/2</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#8F7A6A]" />
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">...</div>
                                <p className="text-xs mt-1">...</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#8F7A6A]" />
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">19</div>
                                <p className="text-xs mt-1">/step/19</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#B89B7A]" />
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-[#B89B7A] text-white flex items-center justify-center text-xs font-bold">20</div>
                                <p className="text-xs mt-1 font-semibold">/step20</p>
                            </div>
                        </div>
                    </div>

                    {/* Vantagens da Configuração */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#432818]">Vantagens da URL Dedicada (/step20)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', borderLeft: '4px solid #3B82F6' }}>
                                <h4 className="font-medium text-[#432818] mb-2">🎯 Configuração Específica</h4>
                                <p className="text-sm text-[#6B4F43]">
                                    Permite configurações exclusivas para a página de resultado, diferentes das etapas de pergunta.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4', borderLeft: '4px solid #10B981' }}>
                                <h4 className="font-medium text-[#432818] mb-2">📊 Analytics Diferenciado</h4>
                                <p className="text-sm text-[#6B4F43]">
                                    Facilita o tracking específico da página de resultado nos sistemas de análise.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFBEB', borderLeft: '4px solid #F59E0B' }}>
                                <h4 className="font-medium text-[#432818] mb-2">🔗 Link Direto</h4>
                                <p className="text-sm text-[#6B4F43]">
                                    Permite criar links diretos para a página de resultado em campanhas de marketing.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444' }}>
                                <h4 className="font-medium text-[#432818] mb-2">⚡ Performance</h4>
                                <p className="text-sm text-[#6B4F43]">
                                    Otimização específica para carregamento e experiência da página de resultado.
                                </p>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default Step20URLDocumentation;
