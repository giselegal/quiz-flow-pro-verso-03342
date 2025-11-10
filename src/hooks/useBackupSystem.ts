/**
 * Hook para sistema de backup
 * Fase 5: Security & Production Hardening
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { appLogger } from '@/lib/utils/appLogger';

interface BackupJob {
  id: string;
  type: 'full' | 'incremental' | 'selective' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  tables: string[];
  user_id?: string;
  description?: string;
  size_bytes?: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

interface CreateBackupOptions {
  type?: 'full' | 'incremental' | 'selective';
  tables?: string[];
  description?: string;
  user_id?: string;
}

export const useBackupSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBackup = useCallback(async (options: CreateBackupOptions = {}): Promise<BackupJob> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('backup-system/create', {
        body: options,
      });

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create backup';
      setError(errorMessage);
      appLogger.error('Backup creation error:', { data: [err] });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listBackups = useCallback(async (userId?: string, limit = 50): Promise<BackupJob[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (limit) params.append('limit', limit.toString());

      const { data, error } = await supabase.functions.invoke(
        `backup-system/list?${params.toString()}`,
      );

      if (error) throw error;
      return data.backups;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list backups';
      setError(errorMessage);
      appLogger.error('List backups error:', { data: [err] });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBackupStatus = useCallback(async (backupId: string): Promise<BackupJob | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        `backup-system/status?backup_id=${backupId}`,
      );

      if (error) throw error;
      return data.backup;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get backup status';
      setError(errorMessage);
      appLogger.error('Backup status error:', { data: [err] });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreBackup = useCallback(async (
    backupId: string, 
    tables: string[] = [], 
    confirm = false,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('backup-system/restore', {
        body: {
          backup_id: backupId,
          tables,
          confirm,
        },
      });

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore backup';
      setError(errorMessage);
      appLogger.error('Backup restore error:', { data: [err] });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleBackup = useCallback(async (schedule: string, options: CreateBackupOptions) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('backup-system/schedule', {
        body: {
          schedule,
          ...options,
        },
      });

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule backup';
      setError(errorMessage);
      appLogger.error('Schedule backup error:', { data: [err] });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cleanupOldBackups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('backup-system/cleanup');

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cleanup backups';
      setError(errorMessage);
      appLogger.error('Cleanup backups error:', { data: [err] });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper para criar backup automático em situações críticas
  const createEmergencyBackup = useCallback(async (reason: string) => {
    return createBackup({
      type: 'full',
      description: `Emergency backup: ${reason}`,
    });
  }, [createBackup]);

  // Helper para aguardar completion de backup
  const waitForBackupCompletion = useCallback(async (
    backupId: string,
    pollInterval = 5000,
    timeout = 300000, // 5 minutos
  ): Promise<BackupJob> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const status = await getBackupStatus(backupId);
      
      if (!status) {
        throw new Error('Backup not found');
      }

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(status.error_message || 'Backup failed');
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Backup timeout');
  }, [getBackupStatus]);

  return {
    // State
    isLoading,
    error,

    // Actions
    createBackup,
    listBackups,
    getBackupStatus,
    restoreBackup,
    scheduleBackup,
    cleanupOldBackups,

    // Helpers
    createEmergencyBackup,
    waitForBackupCompletion,
  };
};