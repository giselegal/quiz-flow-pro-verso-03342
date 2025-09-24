/**
 * Edge Function: Backup System
 * Sistema automatizado de backup de dados críticos
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BackupJob {
  id: string;
  type: 'full' | 'incremental' | 'selective';
  status: 'pending' | 'running' | 'completed' | 'failed';
  tables: string[];
  user_id?: string;
  started_at?: string;
  completed_at?: string;
  size_bytes?: number;
  error_message?: string;
}

// Tabelas críticas que sempre devem ser incluídas no backup
const criticalTables = [
  'profiles',
  'funnels', 
  'funnel_pages',
  'component_instances',
  'quiz_sessions',
  'quiz_results',
  'security_audit_logs'
];

// Tabelas opcionais (métricas, logs temporários)
const optionalTables = [
  'real_time_metrics',
  'system_health_metrics', 
  'user_behavior_patterns',
  'ai_optimization_recommendations'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'create':
        return await handleCreateBackup(req, supabase);
      
      case 'restore':
        return await handleRestoreBackup(req, supabase);
      
      case 'list':
        return await handleListBackups(req, supabase);
      
      case 'status':
        return await handleBackupStatus(req, supabase);
      
      case 'schedule':
        return await handleScheduleBackup(req, supabase);
      
      case 'cleanup':
        return await handleCleanupOldBackups(supabase);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('Backup System Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleCreateBackup(req: Request, supabase: any) {
  const { 
    type = 'full', 
    tables = [],
    user_id,
    description 
  } = await req.json();

  try {
    const backupId = crypto.randomUUID();
    const tablesToBackup = type === 'full' 
      ? [...criticalTables, ...optionalTables]
      : tables.length > 0 
      ? tables 
      : criticalTables;

    // Criar registro do backup
    const { error: insertError } = await supabase
      .from('backup_jobs')
      .insert({
        id: backupId,
        type,
        status: 'pending',
        tables: tablesToBackup,
        user_id,
        description,
        created_at: new Date().toISOString()
      });

    if (insertError) throw insertError;

    // Iniciar processo de backup
    const backupData = {};
    let totalSize = 0;

    // Atualizar status para 'running'
    await supabase
      .from('backup_jobs')
      .update({ 
        status: 'running', 
        started_at: new Date().toISOString() 
      })
      .eq('id', backupId);

    // Fazer backup de cada tabela
    for (const table of tablesToBackup) {
      try {
        console.log(`Backing up table: ${table}`);
        
        let query = supabase.from(table).select('*');
        
        // Para backups incrementais, apenas dados recentes
        if (type === 'incremental') {
          const lastBackupTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          if (table === 'security_audit_logs' || 
              table === 'system_health_metrics' || 
              table === 'real_time_metrics') {
            query = query.gte('created_at', lastBackupTime);
          }
        }

        // Filtrar por usuário se especificado
        if (user_id && ['funnels', 'funnel_pages', 'profiles'].includes(table)) {
          query = query.eq('user_id', user_id);
        }

        const { data, error } = await query;
        
        if (error) {
          console.warn(`Failed to backup table ${table}:`, error);
          continue;
        }

        backupData[table] = data;
        totalSize += JSON.stringify(data).length;

      } catch (tableError) {
        console.warn(`Error backing up table ${table}:`, tableError);
      }
    }

    // Salvar dados do backup (em produção, salvaria em storage)
    const backupJson = JSON.stringify(backupData, null, 2);
    
    // Atualizar registro com sucesso
    const { error: updateError } = await supabase
      .from('backup_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        size_bytes: totalSize,
        backup_data: backupData // Em produção, seria uma URL do storage
      })
      .eq('id', backupId);

    if (updateError) {
      console.error('Failed to update backup job:', updateError);
    }

    // Log do backup
    await supabase.rpc('log_security_event', {
      p_event_type: 'backup_created',
      p_event_data: {
        backup_id: backupId,
        type,
        tables_count: tablesToBackup.length,
        size_bytes: totalSize,
        user_id
      },
      p_severity: 'low'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        backup_id: backupId,
        type,
        tables: tablesToBackup,
        size_bytes: totalSize,
        message: 'Backup created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Backup creation failed:', error);
    
    // Atualizar status para falha se o ID foi criado
    try {
      await supabase
        .from('backup_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', backupId);
    } catch (updateError) {
      console.error('Failed to update backup job status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        error: 'Backup creation failed',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleRestoreBackup(req: Request, supabase: any) {
  const { backup_id, tables = [], confirm = false } = await req.json();

  try {
    // Obter dados do backup
    const { data: backup, error: selectError } = await supabase
      .from('backup_jobs')
      .select('*')
      .eq('id', backup_id)
      .eq('status', 'completed')
      .single();

    if (selectError || !backup) {
      return new Response(
        JSON.stringify({ error: 'Backup not found or incomplete' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!confirm) {
      return new Response(
        JSON.stringify({
          warning: 'This operation will overwrite existing data',
          backup_info: {
            id: backup.id,
            type: backup.type,
            created_at: backup.created_at,
            tables: backup.tables,
            size_bytes: backup.size_bytes
          },
          message: 'Set confirm=true to proceed with restore'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log da restauração
    await supabase.rpc('log_security_event', {
      p_event_type: 'backup_restore_started',
      p_event_data: {
        backup_id,
        restore_tables: tables.length > 0 ? tables : backup.tables
      },
      p_severity: 'high'
    });

    const restoredTables = [];
    const tablesToRestore = tables.length > 0 ? tables : backup.tables;

    // ATENÇÃO: Em produção, seria necessário mais validação e estratégia de rollback
    for (const table of tablesToRestore) {
      if (backup.backup_data && backup.backup_data[table]) {
        try {
          // Limpar tabela existente (CUIDADO!)
          await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          // Inserir dados do backup
          const { error: insertError } = await supabase
            .from(table)
            .insert(backup.backup_data[table]);

          if (insertError) {
            console.error(`Failed to restore table ${table}:`, insertError);
          } else {
            restoredTables.push(table);
          }
        } catch (tableError) {
          console.error(`Error restoring table ${table}:`, tableError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        backup_id,
        restored_tables: restoredTables,
        message: `Restored ${restoredTables.length} tables from backup`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Backup restore failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Backup restore failed',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleListBackups(req: Request, supabase: any) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  try {
    let query = supabase
      .from('backup_jobs')
      .select('id, type, status, tables, user_id, created_at, completed_at, size_bytes, description')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ backups: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to list backups:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleBackupStatus(req: Request, supabase: any) {
  const url = new URL(req.url);
  const backupId = url.searchParams.get('backup_id');

  try {
    const { data, error } = await supabase
      .from('backup_jobs')
      .select('*')
      .eq('id', backupId)
      .single();
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ backup: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to get backup status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleScheduleBackup(req: Request, supabase: any) {
  const { schedule, type, tables, user_id } = await req.json();

  // Em produção, integraria com um sistema de scheduling (cron, etc)
  return new Response(
    JSON.stringify({ 
      message: 'Backup scheduling not implemented yet',
      received_schedule: schedule,
      type,
      tables
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleCleanupOldBackups(supabase: any) {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dias

    const { error } = await supabase
      .from('backup_jobs')
      .delete()
      .lt('created_at', cutoffDate)
      .neq('type', 'critical'); // Manter backups críticos

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Old backups cleaned up successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Backup cleanup failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}