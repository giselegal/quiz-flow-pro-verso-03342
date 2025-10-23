#!/usr/bin/env node

/**
 * 📊 ANALISADOR DE SERVICES - FASE 2.2
 * 
 * Categoriza 174 services existentes nos 12 grupos canônicos
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const servicesDir = '/workspaces/quiz-flow-pro-verso-03342/src/services';

// 12 Categorias Canônicas
const categories = {
  Template: [
    /template/i, /step/i, /section/i, /block.*storage/i, /json.*template/i,
    /hybrid.*template/i, /custom.*template/i, /master.*json/i
  ],
  Data: [
    /data/i, /storage/i, /persistence/i, /crud/i, /repository/i,
    /funnel.*service/i, /quiz.*service/i, /participant/i, /result/i
  ],
  Cache: [
    /cache/i, /unified.*cache/i, /editor.*cache/i
  ],
  Analytics: [
    /analytics/i, /metrics/i, /tracking/i, /facebook.*metrics/i, /insights/i
  ],
  Storage: [
    /supabase/i, /database/i, /image.*storage/i, /file.*storage/i, /s3/i,
    /upload/i, /advanced.*storage/i, /optimized.*storage/i
  ],
  Auth: [
    /auth/i, /permission/i, /session/i, /multi.*tenant/i, /white.*label/i
  ],
  Config: [
    /config/i, /settings/i, /funnel.*config/i, /alignment/i
  ],
  Validation: [
    /validat/i, /alignment.*validat/i, /page.*structure/i, /schema/i
  ],
  History: [
    /history/i, /migration/i, /version/i, /undo/i, /redo/i
  ],
  Monitoring: [
    /monitor/i, /performance/i, /error/i, /log/i, /debug/i
  ],
  Notification: [
    /notification/i, /toast/i, /alert/i, /message/i
  ],
  Editor: [
    /editor/i, /bridge/i, /quiz.*editor/i, /unified.*editor/i, /collaboration/i
  ],
  AI: [
    /ai/i, /github.*models/i, /fashion.*image/i, /personalization.*engine/i,
    /funnel.*ai/i
  ],
  Integration: [
    /whatsapp/i, /marketplace/i, /enterprise.*integration/i, /api/i, /webhook/i
  ],
  Component: [
    /component/i, /registry/i, /library/i, /types.*registry/i
  ]
};

function categorizeService(filename) {
  const matches = [];
  
  for (const [category, patterns] of Object.entries(categories)) {
    for (const pattern of patterns) {
      if (pattern.test(filename)) {
        matches.push(category);
        break;
      }
    }
  }
  
  return matches.length > 0 ? matches : ['Uncategorized'];
}

function analyzeServices() {
  const files = readdirSync(servicesDir)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.endsWith('.spec.ts'))
    .map(filename => {
      const filePath = join(servicesDir, filename);
      const stats = statSync(filePath);
      const categories = categorizeService(filename);
      
      return {
        filename,
        size: stats.size,
        categories
      };
    });

  // Agrupar por categoria
  const grouped = {};
  
  files.forEach(file => {
    file.categories.forEach(cat => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(file);
    });
  });

  // Relatório
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     📊 ANÁLISE DE SERVICES - FASE 2.2                       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📁 Total de services encontrados: ${files.length}\n`);
  
  // Estatísticas por categoria
  const sortedCategories = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length);
  
  console.log('📊 DISTRIBUIÇÃO POR CATEGORIA:\n');
  
  sortedCategories.forEach(([category, services], index) => {
    const totalSize = services.reduce((sum, s) => sum + s.size, 0);
    const avgSize = (totalSize / services.length / 1024).toFixed(1);
    
    console.log(`${index + 1}. ${category.padEnd(20)} ${services.length.toString().padStart(3)} services  (avg: ${avgSize} KB)`);
    
    if (services.length <= 10) {
      services.forEach(s => {
        console.log(`   - ${s.filename}`);
      });
    } else {
      services.slice(0, 5).forEach(s => {
        console.log(`   - ${s.filename}`);
      });
      console.log(`   ... e mais ${services.length - 5} services`);
    }
    console.log();
  });

  // Services duplicados em múltiplas categorias
  const duplicated = files.filter(f => f.categories.length > 1);
  
  if (duplicated.length > 0) {
    console.log(`⚠️  SERVICES EM MÚLTIPLAS CATEGORIAS (${duplicated.length}):\n`);
    duplicated.slice(0, 10).forEach(file => {
      console.log(`   ${file.filename}`);
      console.log(`   → ${file.categories.join(', ')}\n`);
    });
  }

  // Recomendações para consolidação
  console.log('💡 RECOMENDAÇÕES DE CONSOLIDAÇÃO:\n');
  
  const recommendations = [
    { from: 'Template', to: 'TemplateService', count: grouped.Template?.length || 0 },
    { from: 'Data', to: 'DataService', count: grouped.Data?.length || 0 },
    { from: 'Cache', to: 'CacheService', count: grouped.Cache?.length || 0 },
    { from: 'Analytics', to: 'AnalyticsService', count: grouped.Analytics?.length || 0 },
    { from: 'Storage', to: 'StorageService', count: grouped.Storage?.length || 0 },
    { from: 'Auth', to: 'AuthService', count: grouped.Auth?.length || 0 },
    { from: 'Config', to: 'ConfigService', count: grouped.Config?.length || 0 },
    { from: 'Validation', to: 'ValidationService', count: grouped.Validation?.length || 0 },
    { from: 'History', to: 'HistoryService', count: grouped.History?.length || 0 },
    { from: 'Monitoring', to: 'MonitoringService', count: grouped.Monitoring?.length || 0 },
    { from: 'Notification', to: 'NotificationService', count: grouped.Notification?.length || 0 },
    { from: 'Editor', to: 'EditorService', count: grouped.Editor?.length || 0 },
  ];

  recommendations
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.to.padEnd(25)} ← Consolidar ${rec.count} services`);
    });

  console.log('\n✨ Concluído!\n');
  
  // Exportar JSON para processamento
  return {
    total: files.length,
    grouped,
    recommendations: recommendations.filter(r => r.count > 0)
  };
}

const result = analyzeServices();

// Salvar resultado para uso posterior
import { writeFileSync } from 'fs';
writeFileSync(
  '/workspaces/quiz-flow-pro-verso-03342/SERVICES_ANALYSIS.json',
  JSON.stringify(result, null, 2)
);

console.log('💾 Análise salva em: SERVICES_ANALYSIS.json');
