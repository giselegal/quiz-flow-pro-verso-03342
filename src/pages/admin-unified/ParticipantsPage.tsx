/**
 * 👥 PARTICIPANTS PAGE - Gestão de Usuários e Sessões
 * Lista participantes e suas sessões do Supabase
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, Mail, Calendar, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Participant {
  id: string;
  name: string;
  email: string;
  created_at: string;
  session_id: string;
}

interface Session {
  id: string;
  status: string;
  score: number;
  started_at: string;
  completed_at: string | null;
  user_name: string | null;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Buscar usuários do quiz
      const { data: users, error: usersError } = await supabase
        .from('quiz_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (usersError) throw usersError;

      // Buscar sessões
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (sessionsError) throw sessionsError;

      setParticipants(users || []);
      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Participantes</h2>
        <p className="text-muted-foreground">
          Gerencie usuários e suas sessões de quiz
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessões</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Session ID</TableHead>
                <TableHead>Data Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    {participant.name || 'Anônimo'}
                  </TableCell>
                  <TableCell>
                    {participant.email || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {participant.session_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {new Date(participant.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sessões Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs">
                    {session.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </TableCell>
                  <TableCell>{session.user_name || '-'}</TableCell>
                  <TableCell>{session.score || 0}</TableCell>
                  <TableCell>
                    {new Date(session.started_at).toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
