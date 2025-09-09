/**
 * 📋 TABELA DE RESPOSTAS DOS PARTICIPANTES
 * 
 * Componente para visualizar detalhadamente as respostas de cada participante
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Search,
    Download,
    Eye,
    User,
    Clock,
    Target,
    Palette,
    RefreshCw
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ParticipantResponse {
    id: string;
    user_name?: string;
    session_id: string;
    started_at: string;
    completed_at?: string | null;
    current_step: number;
    total_steps: number;
    completion_percentage: number;
    final_result?: {
        primaryStyle: string;
        category: string;
        totalScore: number;
    };
    device_info?: {
        type: string;
        user_agent?: string;
    };
    time_spent?: number;
    status: string;
}

interface StepResponse {
    step_number: number;
    question_id: string;
    option_id: string;
    answer_text?: string;
    timestamp: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ParticipantsTable: React.FC = () => {
    const [participants, setParticipants] = useState<ParticipantResponse[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<ParticipantResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'active' | 'abandoned'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
    const [participantDetails, setParticipantDetails] = useState<StepResponse[]>([]);

    // ============================================================================
    // CARREGAMENTO DE DADOS
    // ============================================================================

    const loadParticipants = async () => {
        try {
            setIsLoading(true);
            
            // Buscar sessões do quiz
            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('*')
                .order('started_at', { ascending: false });

            if (sessionsError) {
                console.error('Erro ao carregar sessões:', sessionsError);
                return;
            }

            // Buscar resultados para cada sessão
            const { data: results } = await supabase
                .from('quiz_results')
                .select('*');

            // Combinar dados
            const participantsData: ParticipantResponse[] = (sessions || []).map(session => {
                const result = results?.find(r => r.session_id === session.id);
                
                return {
                    id: session.id,
                    user_name: session.quiz_user_id || 'Anônimo',
                    session_id: session.id,
                    started_at: session.started_at,
                    completed_at: session.completed_at,
                    current_step: session.current_step || 0,
                    total_steps: session.total_steps || 21,
                    completion_percentage: Math.round(((session.current_step || 0) / (session.total_steps || 21)) * 100),
                    final_result: result ? {
                        primaryStyle: result.result_type || 'Não definido',
                        category: result.result_type || 'Não definido',
                        totalScore: result.result_data ? (result.result_data as any).totalScore || 0 : 0,
                    } : undefined,
                    device_info: {
                        type: 'Desktop', // Mock por enquanto
                    },
                    time_spent: session.completed_at && session.started_at 
                        ? Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 1000)
                        : undefined,
                    status: session.completed_at ? 'completed' : (session.current_step || 0) > 1 ? 'active' : 'abandoned'
                };
            });

            setParticipants(participantsData);
            setFilteredParticipants(participantsData);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadParticipantDetails = async (sessionId: string) => {
        try {
            // Buscar respostas detalhadas da sessão
            const { data: responses } = await supabase
                .from('quiz_step_responses')
                .select('*')
                .eq('session_id', sessionId)
                .order('step_number', { ascending: true });

            if (responses) {
                const detailsData: StepResponse[] = responses.map(response => ({
                    step_number: response.step_number,
                    question_id: response.question_id,
                    option_id: response.answer_text || response.question_id,
                    answer_text: response.answer_text || 'Sem texto',
                    timestamp: response.responded_at,
                }));

                setParticipantDetails(detailsData);
                setSelectedParticipant(sessionId);
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
        }
    };

    // ============================================================================
    // FILTROS E BUSCA
    // ============================================================================

    useEffect(() => {
        let filtered = participants;

        // Filtro por status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.final_result?.primaryStyle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredParticipants(filtered);
    }, [participants, searchTerm, statusFilter]);

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    useEffect(() => {
        loadParticipants();
    }, []);

    // Auto-refresh a cada 30 segundos
    useEffect(() => {
        const interval = setInterval(loadParticipants, 30000);
        return () => clearInterval(interval);
    }, []);

    // ============================================================================
    // UTILITÁRIOS
    // ============================================================================

    const getStatusBadge = (status: string) => {
        const variants = {
            completed: { variant: 'default', color: 'bg-green-100 text-green-800', label: 'Completo' },
            active: { variant: 'default', color: 'bg-blue-100 text-blue-800', label: 'Em Andamento' },
            abandoned: { variant: 'default', color: 'bg-gray-100 text-gray-800', label: 'Abandonado' },
        };

        const config = variants[status as keyof typeof variants] || variants.abandoned;
        
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '-';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Nome', 'Sessão', 'Início', 'Conclusão', 'Etapa Atual', '% Completo', 'Estilo Final', 'Tempo Gasto', 'Status'].join(','),
            ...filteredParticipants.map(p => [
                p.user_name || '',
                p.session_id,
                formatDate(p.started_at),
                p.completed_at ? formatDate(p.completed_at) : '',
                p.current_step,
                p.completion_percentage,
                p.final_result?.primaryStyle || '',
                formatDuration(p.time_spent),
                p.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `participantes_quiz_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div className="space-y-6">
            {/* Header e Controles */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl text-[#432818]">
                                Respostas dos Participantes
                            </CardTitle>
                            <p className="text-[#8F7A6A] mt-2">
                                Visualize e analise todas as respostas dos participantes do quiz
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={loadParticipants}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Atualizar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={exportToCSV}
                                disabled={filteredParticipants.length === 0}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent>
                    {/* Filtros */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nome, sessão ou estilo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="completed">Completos</option>
                            <option value="active">Em Andamento</option>
                            <option value="abandoned">Abandonados</option>
                        </select>
                    </div>

                    {/* Estatísticas Rápidas */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                            <div className="font-semibold">{participants.length}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                            <div className="font-semibold">{participants.filter(p => p.status === 'completed').length}</div>
                            <div className="text-sm text-gray-600">Completos</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                            <div className="font-semibold">{participants.filter(p => p.status === 'active').length}</div>
                            <div className="text-sm text-gray-600">Em Andamento</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Palette className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                            <div className="font-semibold">
                                {new Set(participants.filter(p => p.final_result).map(p => p.final_result!.primaryStyle)).size}
                            </div>
                            <div className="text-sm text-gray-600">Estilos</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela Principal */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="ml-2">Carregando participantes...</span>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participante</TableHead>
                                    <TableHead>Início</TableHead>
                                    <TableHead>Progresso</TableHead>
                                    <TableHead>Tempo</TableHead>
                                    <TableHead>Estilo Final</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredParticipants.map((participant) => (
                                    <TableRow key={participant.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {participant.user_name || 'Usuário Anônimo'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {participant.session_id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{formatDate(participant.started_at).split(' ')[0]}</div>
                                                <div className="text-gray-500">
                                                    {formatDate(participant.started_at).split(' ')[1]}
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {participant.current_step}/{participant.total_steps}
                                                </div>
                                                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                                    <div 
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${participant.completion_percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {participant.completion_percentage}%
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            {formatDuration(participant.time_spent)}
                                        </TableCell>
                                        
                                        <TableCell>
                                            {participant.final_result ? (
                                                <Badge variant="outline">
                                                    {participant.final_result.primaryStyle}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        
                                        <TableCell>
                                            {getStatusBadge(participant.status)}
                                        </TableCell>
                                        
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => loadParticipantDetails(participant.session_id)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {!isLoading && filteredParticipants.length === 0 && (
                        <div className="text-center py-12">
                            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Nenhum participante encontrado</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Detalhes do Participante */}
            {selectedParticipant && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Detalhes das Respostas</CardTitle>
                            <Button 
                                variant="ghost" 
                                onClick={() => setSelectedParticipant(null)}
                            >
                                ✕
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {participantDetails.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Etapa</TableHead>
                                        <TableHead>Pergunta</TableHead>
                                        <TableHead>Resposta</TableHead>
                                        <TableHead>Horário</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {participantDetails.map((detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{detail.step_number}</TableCell>
                                            <TableCell>{detail.question_id}</TableCell>
                                            <TableCell>{detail.answer_text}</TableCell>
                                            <TableCell>{formatDate(detail.timestamp)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                Não há respostas detalhadas disponíveis para este participante.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ParticipantsTable;
