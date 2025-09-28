/**
 * 🎯 SUPABASE MIGRATION SERVICE - EXECUTOR AVANÇADO
 * 
 * Serviço que cria um endpoint local para aplicar migrations
 * via interface web moderna
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import http from 'http';
import url from 'url';

const PORT = 3001;
const supabaseUrl = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// API ENDPOINTS
// ============================================================================

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  try {
    // Endpoint: Verificar status da migration
    if (pathname === '/api/migration-status' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('component_configurations')
        .select('id')
        .limit(1);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        migrationApplied: !error,
        error: error?.message || null,
        tableExists: !error
      }));
      return;
    }
    
    // Endpoint: Aplicar migration via SQL raw
    if (pathname === '/api/apply-migration' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const requestData = JSON.parse(body);
          const { sql } = requestData;
          
          // Tentar executar SQL
          const response = await fetch(\`\${supabaseUrl}/rest/v1/rpc/exec_sql\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${supabaseAnonKey}\`,
              'apikey': supabaseAnonKey
            },
            body: JSON.stringify({ sql })
          });
          
          if (response.ok) {
            const result = await response.json();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: result }));
          } else {
            const error = await response.text();
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error }));
          }
          
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }
    
    // Endpoint: Validar sistema
    if (pathname === '/api/validate-system' && req.method === 'GET') {
      const validation = await validateComponentConfigurations();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(validation));
      return;
    }
    
    // Endpoint: Servir interface web
    if (pathname === '/' || pathname === '/migration') {
      const htmlPath = join(process.cwd(), 'public', 'migration-executor.html');
      const html = readFileSync(htmlPath, 'utf8');
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    
    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
    
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

async function validateComponentConfigurations() {
  const results = {
    tableExists: false,
    canInsert: false,
    canSelect: false,
    canUpdate: false,
    canDelete: false,
    exampleDataInserted: false,
    errors: []
  };
  
  try {
    // Test 1: Table exists
    const { data: selectData, error: selectError } = await supabase
      .from('component_configurations')
      .select('id')
      .limit(1);
    
    if (!selectError) {
      results.tableExists = true;
      results.canSelect = true;
    } else {
      results.errors.push(\`Table check: \${selectError.message}\`);
      return results;
    }
    
    // Test 2: Insert
    const testData = {
      component_id: 'api-validation-test',
      funnel_id: null,
      properties: { test: true, timestamp: Date.now() },
      version: 1,
      metadata: { source: 'api-validation' },
      source: 'api'
    };
    
    const { error: insertError } = await supabase
      .from('component_configurations')
      .insert(testData);
    
    if (!insertError) {
      results.canInsert = true;
      
      // Test 3: Update
      const { error: updateError } = await supabase
        .from('component_configurations')
        .update({ properties: { ...testData.properties, updated: true } })
        .eq('component_id', testData.component_id);
      
      if (!updateError) {
        results.canUpdate = true;
      }
      
      // Test 4: Delete
      const { error: deleteError } = await supabase
        .from('component_configurations')
        .delete()
        .eq('component_id', testData.component_id);
      
      if (!deleteError) {
        results.canDelete = true;
      }
      
    } else {
      results.errors.push(\`Insert test: \${insertError.message}\`);
    }
    
    // Test 5: Insert example data
    const exampleConfigs = [
      {
        component_id: 'quiz-global-config',
        funnel_id: 'quiz-estilo-21-steps',
        properties: { primaryColor: '#B89B7A', secondaryColor: '#432818', fontFamily: 'Inter, sans-serif' },
        metadata: { source: 'migration', version: '1.0' },
        source: 'import'
      }
    ];
    
    for (const config of exampleConfigs) {
      const { error } = await supabase
        .from('component_configurations')
        .upsert(config, { onConflict: 'component_id,funnel_id' });
      
      if (!error) {
        results.exampleDataInserted = true;
      }
    }
    
  } catch (error) {
    results.errors.push(\`General error: \${error.message}\`);
  }
  
  return results;
}

// ============================================================================
// SERVER STARTUP
// ============================================================================

server.listen(PORT, () => {
  console.log('🌐 SUPABASE MIGRATION SERVICE INICIADO');
  console.log('='.repeat(50));
  console.log(\`🚀 Servidor rodando em: http://localhost:\${PORT}\`);
  console.log(\`📝 Interface de migration: http://localhost:\${PORT}/migration\`);
  console.log(\`🔗 API endpoints disponíveis:\`);
  console.log(\`   GET  /api/migration-status - Verificar status\`);
  console.log(\`   POST /api/apply-migration  - Aplicar migration\`);
  console.log(\`   GET  /api/validate-system  - Validar sistema\`);
  console.log('');
  console.log('💡 INSTRUÇÕES:');
  console.log('   1. Abra http://localhost:3001/migration no navegador');
  console.log('   2. Siga os passos na interface web');
  console.log('   3. A migration será aplicada automaticamente ou via instruções');
  console.log('');
  console.log('⏹️ Para parar: Ctrl+C');
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Parando servidor...');
  server.close(() => {
    console.log('✅ Servidor parado com sucesso');
    process.exit(0);
  });
});
