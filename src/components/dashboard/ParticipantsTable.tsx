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
    const [styleFilter, setStyleFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
    const [participantDetails, setParticipantDetails] = useState<StepResponse[]>([]);
    const [availableStyles, setAvailableStyles] = useState<string[]>([]);

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

            // Extrair estilos únicos para filtro
            const styles = [...new Set(participantsData
                .filter(p => p.final_result?.primaryStyle)
                .map(p => p.final_result!.primaryStyle)
            )];
            setAvailableStyles(styles);

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
    // FILTROS E BUSCA AVANÇADOS
    // ============================================================================

    const filterByDate = (participants: ParticipantResponse[], filter: string) => {
        if (filter === 'all') return participants;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return participants.filter(p => {
            const startDate = new Date(p.started_at);

            switch (filter) {
                case 'today':
                    return startDate >= today;
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return startDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return startDate >= monthAgo;
                default:
                    return true;
            }
        });
    };

    useEffect(() => {
        let filtered = participants;

        // Filtro por status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Filtro por estilo
        if (styleFilter !== 'all') {
            filtered = filtered.filter(p => p.final_result?.primaryStyle === styleFilter);
        }

        // Filtro por data
        filtered = filterByDate(filtered, dateFilter);

        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.final_result?.primaryStyle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredParticipants(filtered);
        setCurrentPage(1); // Reset para primeira página quando filtros mudam
    }, [participants, searchTerm, statusFilter, styleFilter, dateFilter]);

    // ============================================================================
    // PAGINAÇÃO
    // ============================================================================

    const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

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
                    {/* Filtros Avançados */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Busca */}
                        <div className="md:col-span-2">
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

                        {/* Filtro por Status */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">Todos os Status</option>
                                <option value="completed">Completos</option>
                                <option value="active">Em Andamento</option>
                                <option value="abandoned">Abandonados</option>
                            </select>
                        </div>

                        {/* Filtro por Data */}
                        <div>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">Todas as Datas</option>
                                <option value="today">Hoje</option>
                                <option value="week">Última Semana</option>
                                <option value="month">Último Mês</option>
                            </select>
                        </div>
                    </div>

                    {/* Segunda linha de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Filtro por Estilo */}
                        <div>
                            <select
                                value={styleFilter}
                                onChange={(e) => setStyleFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">Todos os Estilos</option>
                                {availableStyles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>

                        {/* Informações de Resultados */}
                        <div className="md:col-span-2 flex items-center text-sm text-gray-600">
                            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredParticipants.length)} de {filteredParticipants.length} participantes
                        </div>

                        {/* Itens por página */}
                        <div className="flex items-center justify-end gap-2 text-sm">
                            <span>Página {currentPage} de {totalPages}</span>
                        </div>
                    </div>

                    {/* Estatísticas Avançadas */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <div className="text-xl font-bold text-blue-800">{participants.length}</div>
                            <div className="text-sm text-blue-600">Total</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                            <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                            <div className="text-xl font-bold text-green-800">
                                {participants.filter(p => p.status === 'completed').length}
                            </div>
                            <div className="text-sm text-green-600">Completos</div>
                            <div className="text-xs text-green-500 mt-1">
                                {participants.length > 0 ? Math.round((participants.filter(p => p.status === 'completed').length / participants.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                            <div className="text-xl font-bold text-orange-800">
                                {participants.filter(p => p.status === 'active').length}
                            </div>
                            <div className="text-sm text-orange-600">Em Andamento</div>
                            <div className="text-xs text-orange-500 mt-1">
                                {participants.length > 0 ? Math.round((participants.filter(p => p.status === 'active').length / participants.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <User className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <div className="text-xl font-bold text-gray-800">
                                {participants.filter(p => p.status === 'abandoned').length}
                            </div>
                            <div className="text-sm text-gray-600">Abandonados</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {participants.length > 0 ? Math.round((participants.filter(p => p.status === 'abandoned').length / participants.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <Palette className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                            <div className="text-xl font-bold text-purple-800">
                                {availableStyles.length}
                            </div>
                            <div className="text-sm text-purple-600">Estilos</div>
                            <div className="text-xs text-purple-500 mt-1">Únicos</div>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                            <div className="text-xl font-bold text-indigo-800">
                                {participants.filter(p => p.time_spent).length > 0
                                    ? Math.round(participants.filter(p => p.time_spent).reduce((acc, p) => acc + (p.time_spent || 0), 0) / participants.filter(p => p.time_spent).length / 60)
                                    : 0}min
                            </div>
                            <div className="text-sm text-indigo-600">Tempo Médio</div>
                            <div className="text-xs text-indigo-500 mt-1">Por sessão</div>
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
                                {currentParticipants.map((participant) => (
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

                    {/* Controles de Paginação */}
                    {filteredParticipants.length > itemsPerPage && (
                        <div className="flex items-center justify-between px-6 py-4 border-t">
                            <div className="text-sm text-gray-500">
                                Total: {filteredParticipants.length} participantes
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>

                                {/* Números das páginas */}
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => goToPage(pageNum)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Próxima
                                </Button>
                            </div>
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
