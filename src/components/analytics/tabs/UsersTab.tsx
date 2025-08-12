// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  User,
  Download,
  Clock,
  CheckCircle,
  Play,
  Eye,
  Mail,
  ShoppingCart,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UsersTabProps {
  analyticsData: any;
  loading: boolean;
}

export const UsersTab: React.FC<UsersTabProps> = ({ analyticsData, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<any>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);

  // Prepare users list from analytics data
  const prepareUsersList = useMemo(() => {
    if (!analyticsData?.events) return [];

    const uniqueUsers = new Map();

    analyticsData.events.forEach((event: any) => {
      const userId = event.sessionId || event.userEmail || 'unknown';

      if (!uniqueUsers.has(userId)) {
        uniqueUsers.set(userId, {
          id: userId,
          name: event.userName || 'Anônimo',
          email: event.userEmail || event.email || 'N/A',
          startTime: null,
          lastActivity: null,
          completed: false,
          totalQuestions: 0,
        });
      }

      const user = uniqueUsers.get(userId);

      // Update user data based on events
      if (event.timestamp) {
        const timestamp = new Date(event.timestamp);

        if (!user.startTime || timestamp < user.startTime) {
          user.startTime = timestamp;
        }

        if (!user.lastActivity || timestamp > user.lastActivity) {
          user.lastActivity = timestamp;
        }
      }

      if (event.type === 'quiz_complete') {
        user.completed = true;
        user.completeTime = new Date(event.timestamp);
      }

      if (event.type === 'quiz_answer') {
        user.totalQuestions++;
      }
    });

    // Convert map to array and filter by search term
    return Array.from(uniqueUsers.values())
      .filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by most recent activity first
        if (!a.lastActivity) return 1;
        if (!b.lastActivity) return -1;
        return b.lastActivity.getTime() - a.lastActivity.getTime();
      });
  }, [analyticsData, searchTerm]);

  // Handle user details view
  const handleViewUserDetails = (userId: string) => {
    setSelectedUser(userId);

    if (!analyticsData?.events) {
      setUserEvents([]);
      return;
    }

    // Get all events for the selected user
    const events = analyticsData.events.filter((event: any) => {
      return event.sessionId === userId || event.userEmail === userId;
    });

    setUserEvents(events);
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get icon for event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'quiz_start':
        return <Play className="h-4 w-4 text-[#B89B7A]" />;
      case 'quiz_complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'quiz_answer':
        return <Clock style={{ color: '#B89B7A' }} />;
      case 'result_view':
        return <Eye className="h-4 w-4 text-indigo-500" />;
      case 'lead_generated':
        return <Mail className="h-4 w-4 text-yellow-500" />;
      case 'sale':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      default:
        return <User style={{ color: '#8B7355' }} />;
    }
  };

  const users = prepareUsersList;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários do Quiz</CardTitle>
              <CardDescription className="mt-1">
                Informações detalhadas sobre cada usuário que iniciou o quiz
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                className="w-[250px]"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Última atividade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Perguntas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.startTime)}</TableCell>
                      <TableCell>{formatDate(user.lastActivity)}</TableCell>
                      <TableCell>
                        {user.completed ? (
                          <Badge className="bg-green-500 text-white">Concluído</Badge>
                        ) : (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            Em progresso
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{user.totalQuestions}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUserDetails(user.id)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Usuário</DialogTitle>
                              <DialogDescription>
                                Histórico completo de atividades do usuário:{' '}
                                {selectedUserData?.name}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p style={{ color: '#8B7355' }}>Nome</p>
                                <p className="text-base">{selectedUserData?.name}</p>
                              </div>
                              <div>
                                <p style={{ color: '#8B7355' }}>Email</p>
                                <p className="text-base">{selectedUserData?.email}</p>
                              </div>
                              <div>
                                <p style={{ color: '#8B7355' }}>Início</p>
                                <p className="text-base">
                                  {formatDate(selectedUserData?.startTime)}
                                </p>
                              </div>
                              <div>
                                <p style={{ color: '#8B7355' }}>Conclusão</p>
                                <p className="text-base">
                                  {formatDate(selectedUserData?.completeTime)}
                                </p>
                              </div>
                              <div>
                                <p style={{ color: '#8B7355' }}>Perguntas Respondidas</p>
                                <p className="text-base">{selectedUserData?.totalQuestions}</p>
                              </div>
                              <div>
                                <p style={{ color: '#8B7355' }}>Status</p>
                                <p className="text-base">
                                  {selectedUserData?.completed ? (
                                    <Badge className="bg-green-500 text-white">Concluído</Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="border-yellow-500 text-yellow-500"
                                    >
                                      Em progresso
                                    </Badge>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h4 style={{ color: '#8B7355' }}>Histórico de Eventos</h4>
                              <ScrollArea className="h-[300px]">
                                <div className="space-y-4">
                                  {userEvents.map((event, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-3 pb-3 border-b border-gray-100"
                                    >
                                      <div className="flex-shrink-0 pt-1">
                                        {getEventIcon(event.type)}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">
                                          {event.type === 'quiz_answer' ? (
                                            <>Respondeu à questão {event.questionIndex + 1}</>
                                          ) : event.type === 'quiz_start' ? (
                                            <>Iniciou o quiz</>
                                          ) : event.type === 'quiz_complete' ? (
                                            <>Completou o quiz</>
                                          ) : event.type === 'result_view' ? (
                                            <>Visualizou o resultado: {event.resultType}</>
                                          ) : event.type === 'lead_generated' ? (
                                            <>Lead gerado: {event.email}</>
                                          ) : event.type === 'sale' ? (
                                            <>Realizou uma compra no valor de R$ {event.value}</>
                                          ) : (
                                            <>Evento: {event.type}</>
                                          )}
                                        </p>
                                        <p style={{ color: '#8B7355' }}>
                                          {new Date(event.timestamp).toLocaleString()}
                                        </p>
                                        {event.type === 'quiz_answer' && (
                                          <div style={{ color: '#6B4F43' }}>
                                            <p>
                                              Opções selecionadas:{' '}
                                              {event.selectedOptions?.join(', ') || 'N/A'}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {userEvents.length === 0 && (
                                    <p style={{ color: '#8B7355' }}>
                                      Nenhum evento encontrado para este usuário.
                                    </p>
                                  )}
                                </div>
                              </ScrollArea>
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Export functionality kept the same as original
                                  console.log('Exporting data for user:', selectedUserData?.name);
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Exportar Dados do Usuário
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {searchTerm
                        ? 'Nenhum usuário encontrado para esta busca.'
                        : 'Nenhum usuário encontrado.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
