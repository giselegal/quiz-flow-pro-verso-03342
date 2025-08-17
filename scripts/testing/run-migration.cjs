#!/usr/bin/env node

/**
 * Script para executar a migração do Supabase programaticamente
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://txqljpitotmcxntprxiu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cWxqcGl0b3RtY3hudHByeGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjI3MzQsImV4cCI6MjA2NTQzODczNH0.rHGZV47KUnSJ0fDNXbL-OjuB50BsuzT2IeO_LL-P8ok';

async function runMigration() {
  console.log('🚀 Executando migração do Supabase...');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Primeiro, vamos criar as tabelas básicas uma por uma
  const tables = [
    {
      name: 'funnels',
      sql: `
        CREATE TABLE IF NOT EXISTS funnels (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          user_id TEXT,
          is_published BOOLEAN DEFAULT FALSE,
          version INTEGER DEFAULT 1,
          settings JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    },
    {
      name: 'funnel_pages',
      sql: `
        CREATE TABLE IF NOT EXISTS funnel_pages (
          id TEXT PRIMARY KEY,
          funnel_id TEXT NOT NULL,
          page_type TEXT NOT NULL,
          page_order INTEGER NOT NULL,
          title TEXT,
          blocks JSONB NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    },
  ];

  for (const table of tables) {
    console.log(`📝 Criando tabela ${table.name}...`);

    const { data, error } = await supabase.rpc('exec_sql', {
      sql: table.sql,
    });

    if (error) {
      console.error(`❌ Erro ao criar tabela ${table.name}:`, error);
    } else {
      console.log(`✅ Tabela ${table.name} criada com sucesso`);
    }
  }

  console.log('🎉 Migração concluída!');
}

runMigration().catch(console.error);
