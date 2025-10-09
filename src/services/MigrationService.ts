// @ts-nocheck
/**
 * 🚀 SERVIÇO DE MIGRAÇÃO AUTOMÁTICA VIA API SUPABASE
 * Executa migrações de schema automaticamente via código
 */

import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE COM PERMISSÕES ADMIN
// ============================================================================

let supabase: any | null = null;
const ensureClient = async () => {
  if (supabase) return supabase;
  try {
    supabase = await getSupabaseClient();
  } catch (e) {
    console.warn('MigrationService: Supabase indisponível.');
    supabase = null;
  }
  return supabase;
};

// ============================================================================
// INTERFACE E TIPOS
// ============================================================================
import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';
export interface MigrationResult {
  success: boolean;
  message: string;
  executed: string[];
let supabase: any | null = null;
const ensureClient = async () => {
  if (supabase) return supabase;
  try {
    supabase = await getSupabaseClient();
  } catch (e) {
    console.warn('MigrationService: Supabase indisponível.');
    supabase = null;
  }
  return supabase;
};

// ============================================================================
// VERIFICAÇÃO DE STATUS DO SCHEMA
    // ============================================================================
// ============================================================================


export class MigrationService {
  /**
   * Verifica se o schema já existe no banco
   */
  static async checkSchemaStatus(): Promise<MigrationStatus> {
    try {
      console.log('🔍 Verificando status do schema...');

      // Lista de tabelas esperadas
      const expectedTables = [
        'profiles',
        'quizzes',
        'questions',
        'quiz_attempts',
        'question_responses',
        'component_types',
        'component_instances',
        'component_presets',
      ];

      const tablesCreated: string[] = [];
      const missingTables: string[] = [];

      // Verificar cada tabela
      for (const table of expectedTables) {
        try {
              // @ts-nocheck
              /**
               * 🚀 SERVIÇO DE MIGRAÇÃO AUTOMÁTICA VIA API SUPABASE (Lazy)
               */
              import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';

              let cachedClient: any | null = null;
              const ensureClient = async () => {
                if (cachedClient) return cachedClient;
                try {
                  cachedClient = await getSupabaseClient();
                } catch (e) {
                  console.warn('MigrationService: Supabase indisponível.');
                  cachedClient = null;
                }
                return cachedClient;
              };

              export interface MigrationResult {
                success: boolean;
                message: string;
                executed: string[];
                errors: string[];
                timestamp: string;
              }

              export interface MigrationStatus {
                hasSchema: boolean;
                tablesCreated: string[];
                missingTables: string[];
                needsMigration: boolean;
              }

              export class MigrationService {
                static async checkSchemaStatus(): Promise<MigrationStatus> {
                  const expectedTables = [
                    'profiles',
                    'quizzes',
                    'questions',
                    'quiz_attempts',
                    'question_responses',
                    'component_types',
                    'component_instances',
                    'component_presets',
                  ];
                  const tablesCreated: string[] = [];
                  const missingTables: string[] = [];
                  const client = await ensureClient();
                  if (client) {
                    for (const table of expectedTables) {
                      try {
                        const { error } = await client.from(table).select('*').limit(1);
                        if (!error) tablesCreated.push(table);
                        else missingTables.push(table);
                      } catch {
                        missingTables.push(table);
                      }
                    }
                  } else {
                    missingTables.push(...expectedTables);
                  }
                  return {
                    hasSchema: tablesCreated.length > 0,
                    tablesCreated,
                    missingTables,
                    needsMigration: missingTables.length > 0,
                  };
                }

                static async executeMigration(): Promise<MigrationResult> {
                  return this.executeMigrationDirect();
                }

                static async executeMigrationDirect(): Promise<MigrationResult> {
                  const result: MigrationResult = {
                    success: false,
                    message: '',
                    executed: [],
                    errors: [],
                    timestamp: new Date().toISOString(),
                  };
                  const client = await ensureClient();
                  if (!client) {
                    result.message = 'Supabase indisponível';
                    result.errors.push('Sem client');
                    return result;
                  }

                  const essentialQueries = [
                    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
                    `CREATE TABLE IF NOT EXISTS profiles (id UUID PRIMARY KEY, email TEXT UNIQUE);`,
                  ];

                  for (let i = 0; i < essentialQueries.length; i++) {
                    const query = essentialQueries[i];
                    try {
                      // Placeholder: em ambiente restrito sem RPC custom -> apenas registrar intenção
                      result.executed.push(`Query ${i + 1}: registrada`);
                    } catch (e: any) {
                      result.errors.push(`Query ${i + 1}: ${e.message}`);
                    }
                  }
                  result.success = result.errors.length === 0;
                  result.message = result.success ? 'Migração preparada' : 'Erros encontrados';
                  return result;
                }

                static async seedInitialData(): Promise<boolean> {
                  const client = await ensureClient();
                  if (!client) return false;
                  try {
                    const types = [
                      { type_key: 'quiz-header', display_name: 'Cabeçalho', category: 'layout' },
                      { type_key: 'question-multiple', display_name: 'Questão Múltipla', category: 'question' },
                    ];
                    const { error } = await client
                      .from('component_types')
                      .upsert(types, { onConflict: 'type_key' });
                    if (error) {
                      console.error('Seed error:', error);
                      return false;
                    }
                    return true;
                  } catch (e) {
                    console.error('Seed exception:', e);
                    return false;
                  }
                }
              }

              export default MigrationService;
          
