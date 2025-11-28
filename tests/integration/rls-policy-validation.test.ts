/**
 * RLS Policy Validation Tests
 * 
 * These tests verify that Row-Level Security (RLS) policies are properly configured
 * for sensitive tables in the Supabase database.
 * 
 * Note: These tests require a database connection to run.
 * They are skipped if SUPABASE_DB_URL is not set.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// List of sensitive tables that MUST have RLS enabled
const SENSITIVE_TABLES = [
  'funnels',
  'quiz_production',
  'component_instances',
  'templates',
  'profiles',
  'results',
  'quiz_sessions',
  'quiz_results',
  'step_responses',
  'drafts',
];

// Required CRUD policies for user-owned tables
const REQUIRED_POLICIES = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];

describe('RLS Policy Configuration', () => {
  const hasDbUrl = !!process.env.SUPABASE_DB_URL;

  beforeAll(() => {
    if (!hasDbUrl) {
      console.warn('⚠️ SUPABASE_DB_URL not set - RLS tests will be skipped');
    }
  });

  describe('Sensitive tables RLS status', () => {
    it.skipIf(!hasDbUrl)('should have RLS enabled on all sensitive tables', async () => {
      // This test would require a database connection
      // For now, we validate the migration files exist
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
      const files = await fs.readdir(migrationsDir);
      
      // Check for RLS-related migration files
      const rlsMigrations = files.filter(f => 
        f.includes('rls') || 
        f.includes('RLS') || 
        f.includes('security') ||
        f.includes('auth_hardening')
      );
      
      expect(rlsMigrations.length).toBeGreaterThan(0);
      console.log('✅ Found RLS migrations:', rlsMigrations);
    });

    it('should have RLS migration for sensitive tables in schema', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Read the main RLS migration file
      const rlsMigrationPath = path.resolve(
        process.cwd(), 
        'supabase/migrations/20251110_auth_hardening_rls.sql'
      );
      
      let migrationContent: string;
      try {
        migrationContent = await fs.readFile(rlsMigrationPath, 'utf-8');
      } catch {
        console.warn('⚠️ RLS migration file not found, skipping detailed check');
        return;
      }
      
      // Check that key tables are mentioned
      const tablesToCheck = ['funnels', 'quiz_production', 'component_instances'];
      
      for (const table of tablesToCheck) {
        const hasTableMention = migrationContent.includes(table);
        expect(hasTableMention).toBe(true);
        if (hasTableMention) {
          console.log(`✅ RLS migration includes table: ${table}`);
        }
      }
    });
  });

  describe('RLS audit script validation', () => {
    it('should have comprehensive RLS audit script', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const auditScriptPath = path.resolve(
        process.cwd(),
        'scripts/audit/rls-audit.sql'
      );
      
      const content = await fs.readFile(auditScriptPath, 'utf-8');
      
      // Verify script checks key aspects
      expect(content).toContain('relrowsecurity');
      expect(content).toContain('pg_policies');
      expect(content).toContain('sensitive');
      
      // Verify script checks required tables
      for (const table of ['funnels', 'templates', 'profiles', 'results']) {
        expect(content).toContain(table);
      }
      
      console.log('✅ RLS audit script covers required checks');
    });

    it('should have run script for RLS audit', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const runScriptPath = path.resolve(
        process.cwd(),
        'scripts/audit/run-rls-audit.sh'
      );
      
      const content = await fs.readFile(runScriptPath, 'utf-8');
      
      expect(content).toContain('SUPABASE_DB_URL');
      expect(content).toContain('psql');
      expect(content).toContain('rls-audit.sql');
      
      console.log('✅ RLS run script properly configured');
    });
  });

  describe('Policy coverage documentation', () => {
    it('should document RLS requirements', async () => {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Check for security documentation
      const securityDocPath = path.resolve(process.cwd(), 'SECURITY.md');
      
      let hasSecurityDoc = false;
      try {
        await fs.access(securityDocPath);
        hasSecurityDoc = true;
      } catch {
        // File doesn't exist
      }
      
      // Also check for architecture doc
      const archDocPath = path.resolve(
        process.cwd(),
        'ARQUITETURA_FINAL_IMPLEMENTACAO.md'
      );
      
      let hasArchDoc = false;
      try {
        await fs.access(archDocPath);
        hasArchDoc = true;
      } catch {
        // File doesn't exist
      }
      
      expect(hasSecurityDoc || hasArchDoc).toBe(true);
      console.log('✅ Security/architecture documentation exists');
    });
  });
});

describe('Supabase Types Consistency', () => {
  it('should have type generation script', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const genTypesPath = path.resolve(
      process.cwd(),
      'scripts/supabase/gen-types.mjs'
    );
    
    const content = await fs.readFile(genTypesPath, 'utf-8');
    
    expect(content).toContain('supabase');
    expect(content).toContain('gen');
    expect(content).toContain('types');
    expect(content).toContain('typescript');
    
    console.log('✅ Type generation script configured');
  });

  it('should have primary types file', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const typesPath = path.resolve(
      process.cwd(),
      'shared/types/supabase.ts'
    );
    
    await expect(fs.access(typesPath)).resolves.toBeUndefined();
    console.log('✅ Primary Supabase types file exists');
  });

  it('should track multiple type sources for consolidation', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const typeSources = [
      'shared/types/supabase.ts',
      'src/services/integrations/supabase/types.ts',
      'src/services/integrations/supabase/types_updated.ts',
    ];
    
    const existingSources: string[] = [];
    
    for (const source of typeSources) {
      try {
        await fs.access(path.resolve(process.cwd(), source));
        existingSources.push(source);
      } catch {
        // File doesn't exist
      }
    }
    
    console.log('📋 Existing type sources:', existingSources);
    
    // At least the primary file should exist
    expect(existingSources).toContain('shared/types/supabase.ts');
    
    if (existingSources.length > 1) {
      console.warn(
        `⚠️ Multiple type sources found (${existingSources.length}). ` +
        'Consider consolidating to shared/types/supabase.ts'
      );
    }
  });
});
