/**
 * 🎯 PÁGINA DE GERENCIAMENTO DE FUNIS
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Plus, Edit, Eye, MoreHorizontal, Target, Users, TrendingUp } from 'lucide-react';

const FunnelsPage: React.FC = () => {
    const funnels = [
        {
            id: 1,
            name: 'Quiz de Estilo Pessoal',
            status: 'active',
            participants: 487,
            conversion: 72,
            created: '2024-01-15',
            lastModified: '2024-01-20'
        },
        {
            id: 2,
            name: 'Marketing Digital',
            status: 'active',
            participants: 324,
            conversion: 68,
            created: '2024-01-10',
            lastModified: '2024-01-18'
        },
        {
            id: 3,
            name: 'E-commerce Starter',
            status: 'draft',
            participants: 0,
            conversion: 0,
            created: '2024-01-22',
            lastModified: '2024-01-22'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header com botão de criar */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Seus Funis</h2>
                    <p className="text-gray-600">Gerencie e otimize seus funis de conversão</p>
                </div>
                <Link href="/editor">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Funil
                    </Button>
                </Link>
            </div>

            {/* Grid de funis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {funnels.map((funnel) => (
                    <Card key={funnel.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{funnel.name}</CardTitle>
                                <Badge variant={funnel.status === 'active' ? 'default' : 'secondary'}>
                                    {funnel.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <Users className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                    <p className="text-sm font-medium">{funnel.participants}</p>
                                    <p className="text-xs text-gray-500">Participantes</p>
                                </div>
                                <div>
                                    <Target className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                    <p className="text-sm font-medium">{funnel.conversion}%</p>
                                    <p className="text-xs text-gray-500">Conversão</p>
                                </div>
                                <div>
                                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                    <p className="text-sm font-medium">+12%</p>
                                    <p className="text-xs text-gray-500">Crescimento</p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Link href={`/editor/${funnel.id}`}>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                </Link>
                                <Link href={`/quiz/${funnel.id}`}>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Visualizar
                                    </Button>
                                </Link>
                            </div>

                            <div className="text-xs text-gray-500 pt-2 border-t">
                                Modificado em {new Date(funnel.lastModified).toLocaleDateString('pt-BR')}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FunnelsPage;