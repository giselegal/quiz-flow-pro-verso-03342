/**
 * 🤝 useSupabasePresence - Colaboração Real-time com Supabase
 * 
 * Hook para presença de usuários usando Supabase Realtime channels.
 * Permite ver quem está editando o mesmo quiz em tempo real.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  color: string;
  currentStepId?: string;
  currentBlockId?: string;
  cursor?: { x: number; y: number };
  lastSeen: string;
  isActive: boolean;
}

interface UseSupabasePresenceOptions {
  quizId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
}

// Cores para usuários colaboradores
const COLLABORATOR_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
];

function getColorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return COLLABORATOR_COLORS[Math.abs(hash) % COLLABORATOR_COLORS.length];
}

export function useSupabasePresence({
  quizId,
  userId,
  userName,
  userEmail,
  userAvatar,
}: UseSupabasePresenceOptions) {
  const [collaborators, setCollaborators] = useState<PresenceUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentPresenceRef = useRef<Partial<PresenceUser>>({});

  // Atualizar presença do usuário atual
  const updatePresence = useCallback(async (updates: Partial<PresenceUser>) => {
    if (!channelRef.current) return;

    const newPresence = {
      ...currentPresenceRef.current,
      ...updates,
      id: userId,
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      color: getColorFromId(userId),
      lastSeen: new Date().toISOString(),
      isActive: true,
    };

    currentPresenceRef.current = newPresence;

    try {
      await channelRef.current.track(newPresence);
    } catch (err) {
      console.error('❌ Erro ao atualizar presença:', err);
    }
  }, [userId, userName, userEmail, userAvatar]);

  // Atualizar step/block sendo editado
  const setEditingLocation = useCallback((stepId?: string, blockId?: string) => {
    updatePresence({
      currentStepId: stepId,
      currentBlockId: blockId,
    });
  }, [updatePresence]);

  // Atualizar posição do cursor
  const setCursorPosition = useCallback((x: number, y: number) => {
    updatePresence({ cursor: { x, y } });
  }, [updatePresence]);

  // Conectar ao canal
  useEffect(() => {
    if (!quizId || !userId) return;

    const channelName = `editor-presence:${quizId}`;
    console.log('🤝 Conectando ao canal de presença:', channelName);

    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: userId },
      },
    });

    // Handler de sincronização
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<PresenceUser>();
      const users: PresenceUser[] = [];

      Object.entries(state).forEach(([key, presences]) => {
        if (key !== userId && presences.length > 0) {
          const presence = presences[0];
          users.push({
            id: presence.id || key,
            name: presence.name || 'Anônimo',
            email: presence.email,
            avatar: presence.avatar,
            color: presence.color || getColorFromId(key),
            currentStepId: presence.currentStepId,
            currentBlockId: presence.currentBlockId,
            cursor: presence.cursor,
            lastSeen: presence.lastSeen || new Date().toISOString(),
            isActive: presence.isActive ?? true,
          });
        }
      });

      setCollaborators(users);
      console.log('👥 Colaboradores online:', users.length);
    });

    // Handler de entrada
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      if (key !== userId) {
        console.log('✅ Usuário entrou:', newPresences[0]?.name || key);
      }
    });

    // Handler de saída
    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      if (key !== userId) {
        console.log('👋 Usuário saiu:', leftPresences[0]?.name || key);
      }
    });

    // Subscrever e enviar presença inicial
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        setError(null);
        console.log('✅ Conectado ao canal de presença');

        // Enviar presença inicial
        await channel.track({
          id: userId,
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          color: getColorFromId(userId),
          lastSeen: new Date().toISOString(),
          isActive: true,
        });
      } else if (status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        setError('Erro ao conectar ao canal de colaboração');
        console.error('❌ Erro no canal de presença');
      } else if (status === 'CLOSED') {
        setIsConnected(false);
        console.log('🔌 Canal de presença fechado');
      }
    });

    channelRef.current = channel;

    // Cleanup
    return () => {
      console.log('🔌 Desconectando do canal de presença');
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [quizId, userId, userName, userEmail, userAvatar]);

  // Marcar como inativo quando a aba perde foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      updatePresence({ isActive: !document.hidden });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updatePresence]);

  return {
    collaborators,
    isConnected,
    error,
    updatePresence,
    setEditingLocation,
    setCursorPosition,
  };
}
