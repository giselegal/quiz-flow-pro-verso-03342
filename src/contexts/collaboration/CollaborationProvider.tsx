/**
 * 👥 CollaborationProvider - Edição Colaborativa
 * 
 * Responsabilidades:
 * - Presença de usuários em tempo real
 * - Cursores e seleções de outros usuários
 * - Bloqueio de edição
 * - Notificações de mudanças
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CollaboratorPresence {
    userId: string;
    userName: string;
    userAvatar?: string;
    color: string;
    cursor?: {
        x: number;
        y: number;
    };
    selection?: {
        blockId: string;
        field?: string;
    };
    lastActivity: number;
    status: 'active' | 'idle' | 'away';
}

export interface EditLock {
    blockId: string;
    userId: string;
    userName: string;
    lockedAt: number;
    expiresAt?: number;
}

export interface CollaborationEvent {
    id: string;
    type: 'join' | 'leave' | 'edit' | 'cursor' | 'comment';
    userId: string;
    userName: string;
    data?: any;
    timestamp: number;
}

export interface CollaborationState {
    currentUserId: string | null;
    collaborators: Record<string, CollaboratorPresence>;
    editLocks: Record<string, EditLock>;
    events: CollaborationEvent[];
    isConnected: boolean;
    roomId: string | null;
}

export interface CollaborationContextValue {
    // State
    state: CollaborationState;

    // Connection
    connect: (roomId: string, userId: string, userName: string) => Promise<void>;
    disconnect: () => void;

    // Presence
    updatePresence: (updates: Partial<CollaboratorPresence>) => void;
    getCollaborators: () => CollaboratorPresence[];
    getCollaborator: (userId: string) => CollaboratorPresence | undefined;

    // Edit locks
    requestLock: (blockId: string) => Promise<boolean>;
    releaseLock: (blockId: string) => void;
    isLocked: (blockId: string) => boolean;
    getLock: (blockId: string) => EditLock | undefined;

    // Events
    broadcastEvent: (type: CollaborationEvent['type'], data?: any) => void;
    getRecentEvents: (count?: number) => CollaborationEvent[];

    // Utilities
    isUserActive: (userId: string) => boolean;
    getActiveCount: () => number;
}

interface CollaborationProviderProps {
    children: ReactNode;
    inactivityTimeout?: number; // ms to consider user idle
    lockTimeout?: number; // ms before lock expires
}

// ============================================================================
// CONTEXT
// ============================================================================

const CollaborationContext = createContext<CollaborationContextValue | undefined>(undefined);

// ============================================================================
// HELPER: COLOR GENERATOR
// ============================================================================

const USER_COLORS = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

function getUserColor(userId: string): string {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return USER_COLORS[hash % USER_COLORS.length];
}

// ============================================================================
// PROVIDER
// ============================================================================

export function CollaborationProvider({
    children,
    inactivityTimeout = 60000, // 1 minute
    lockTimeout = 300000, // 5 minutes
}: CollaborationProviderProps) {
    // State
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [collaborators, setCollaborators] = useState<Record<string, CollaboratorPresence>>({});
    const [editLocks, setEditLocks] = useState<Record<string, EditLock>>({});
    const [events, setEvents] = useState<CollaborationEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);

    // Cleanup inactive users and expired locks
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();

            // Update user status based on activity
            setCollaborators(prev => {
                const updated = { ...prev };
                let hasChanges = false;

                Object.keys(updated).forEach(userId => {
                    const collaborator = updated[userId];
                    const timeSinceActivity = now - collaborator.lastActivity;

                    let newStatus = collaborator.status;
                    if (timeSinceActivity > inactivityTimeout * 2) {
                        newStatus = 'away';
                    } else if (timeSinceActivity > inactivityTimeout) {
                        newStatus = 'idle';
                    } else {
                        newStatus = 'active';
                    }

                    if (newStatus !== collaborator.status) {
                        updated[userId] = { ...collaborator, status: newStatus };
                        hasChanges = true;
                    }
                });

                return hasChanges ? updated : prev;
            });

            // Remove expired locks
            setEditLocks(prev => {
                const updated = { ...prev };
                let hasChanges = false;

                Object.keys(updated).forEach(blockId => {
                    const lock = updated[blockId];
                    if (lock.expiresAt && now > lock.expiresAt) {
                        delete updated[blockId];
                        hasChanges = true;
                        appLogger.debug('Lock expired', 'CollaborationProvider', { blockId });
                    }
                });

                return hasChanges ? updated : prev;
            });

        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [inactivityTimeout]);

    // Connection
    const connect = useCallback(async (
        newRoomId: string,
        userId: string,
        userName: string
    ): Promise<void> => {
        try {
            setRoomId(newRoomId);
            setCurrentUserId(userId);
            setIsConnected(true);

            // Add self as collaborator
            const presence: CollaboratorPresence = {
                userId,
                userName,
                color: getUserColor(userId),
                lastActivity: Date.now(),
                status: 'active',
            };

            setCollaborators(prev => ({
                ...prev,
                [userId]: presence,
            }));

            // Broadcast join event
            broadcastEvent('join', { userName });

            appLogger.info('Connected to collaboration room', 'CollaborationProvider', {
                roomId: newRoomId,
                userId,
            });

        } catch (error) {
            appLogger.error('Failed to connect', 'CollaborationProvider', { error });
            throw error;
        }
    }, []);

    const disconnect = useCallback(() => {
        if (currentUserId && roomId) {
            // Broadcast leave event
            broadcastEvent('leave');

            // Remove self from collaborators
            setCollaborators(prev => {
                const updated = { ...prev };
                delete updated[currentUserId];
                return updated;
            });

            // Release all locks
            setEditLocks(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(blockId => {
                    if (updated[blockId].userId === currentUserId) {
                        delete updated[blockId];
                    }
                });
                return updated;
            });
        }

        setIsConnected(false);
        setRoomId(null);
        setCurrentUserId(null);

        appLogger.info('Disconnected from collaboration room', 'CollaborationProvider');
    }, [currentUserId, roomId]);

    // Presence
    const updatePresence = useCallback((updates: Partial<CollaboratorPresence>) => {
        if (!currentUserId) return;

        setCollaborators(prev => {
            const current = prev[currentUserId];
            if (!current) return prev;

            return {
                ...prev,
                [currentUserId]: {
                    ...current,
                    ...updates,
                    lastActivity: Date.now(),
                    status: 'active',
                },
            };
        });
    }, [currentUserId]);

    const getCollaborators = useCallback((): CollaboratorPresence[] => {
        return Object.values(collaborators).filter(c => c.userId !== currentUserId);
    }, [collaborators, currentUserId]);

    const getCollaborator = useCallback((userId: string): CollaboratorPresence | undefined => {
        return collaborators[userId];
    }, [collaborators]);

    // Edit locks
    const requestLock = useCallback(async (blockId: string): Promise<boolean> => {
        if (!currentUserId) return false;

        const existingLock = editLocks[blockId];

        // Check if already locked by another user
        if (existingLock && existingLock.userId !== currentUserId) {
            appLogger.warn('Block already locked', 'CollaborationProvider', {
                blockId,
                lockedBy: existingLock.userName,
            });
            return false;
        }

        // Grant lock
        const lock: EditLock = {
            blockId,
            userId: currentUserId,
            userName: collaborators[currentUserId]?.userName || 'Unknown',
            lockedAt: Date.now(),
            expiresAt: Date.now() + lockTimeout,
        };

        setEditLocks(prev => ({
            ...prev,
            [blockId]: lock,
        }));

        appLogger.debug('Lock granted', 'CollaborationProvider', { blockId });
        return true;
    }, [currentUserId, editLocks, collaborators, lockTimeout]);

    const releaseLock = useCallback((blockId: string) => {
        setEditLocks(prev => {
            const lock = prev[blockId];
            if (!lock || lock.userId !== currentUserId) return prev;

            const updated = { ...prev };
            delete updated[blockId];

            appLogger.debug('Lock released', 'CollaborationProvider', { blockId });
            return updated;
        });
    }, [currentUserId]);

    const isLocked = useCallback((blockId: string): boolean => {
        const lock = editLocks[blockId];
        if (!lock) return false;
        if (lock.userId === currentUserId) return false; // Own lock doesn't count
        if (lock.expiresAt && Date.now() > lock.expiresAt) return false;
        return true;
    }, [editLocks, currentUserId]);

    const getLock = useCallback((blockId: string): EditLock | undefined => {
        return editLocks[blockId];
    }, [editLocks]);

    // Events
    const broadcastEvent = useCallback((
        type: CollaborationEvent['type'],
        data?: any
    ) => {
        if (!currentUserId) return;

        const event: CollaborationEvent = {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            userId: currentUserId,
            userName: collaborators[currentUserId]?.userName || 'Unknown',
            data,
            timestamp: Date.now(),
        };

        setEvents(prev => {
            // Keep only last 50 events
            const newEvents = [event, ...prev].slice(0, 50);
            return newEvents;
        });

        appLogger.debug('Event broadcasted', 'CollaborationProvider', { type, data });
    }, [currentUserId, collaborators]);

    const getRecentEvents = useCallback((count = 10): CollaborationEvent[] => {
        return events.slice(0, count);
    }, [events]);

    // Utilities
    const isUserActive = useCallback((userId: string): boolean => {
        const collaborator = collaborators[userId];
        if (!collaborator) return false;
        return collaborator.status === 'active';
    }, [collaborators]);

    const getActiveCount = useCallback((): number => {
        return Object.values(collaborators).filter(c => c.status === 'active').length;
    }, [collaborators]);

    // Build state object
    const state: CollaborationState = useMemo(() => ({
        currentUserId,
        collaborators,
        editLocks,
        events,
        isConnected,
        roomId,
    }), [currentUserId, collaborators, editLocks, events, isConnected, roomId]);

    // Context value with memoization
    const contextValue = useMemo<CollaborationContextValue>(() => ({
        state,
        connect,
        disconnect,
        updatePresence,
        getCollaborators,
        getCollaborator,
        requestLock,
        releaseLock,
        isLocked,
        getLock,
        broadcastEvent,
        getRecentEvents,
        isUserActive,
        getActiveCount,
    }), [
        state,
        connect,
        disconnect,
        updatePresence,
        getCollaborators,
        getCollaborator,
        requestLock,
        releaseLock,
        isLocked,
        getLock,
        broadcastEvent,
        getRecentEvents,
        isUserActive,
        getActiveCount,
    ]);

    return (
        <CollaborationContext.Provider value={contextValue}>
            {children}
        </CollaborationContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useCollaboration(): CollaborationContextValue {
    const context = useContext(CollaborationContext);

    if (!context) {
        throw new Error('useCollaboration must be used within CollaborationProvider');
    }

    return context;
}

// Display name for debugging
CollaborationProvider.displayName = 'CollaborationProvider';
