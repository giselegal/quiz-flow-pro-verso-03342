/**
 * 🚀 DEV SERVER - Template Persistence API
 * 
 * Servidor de desenvolvimento para persistir mudanças no canvas
 * 
 * Uso:
 *   npm run dev:api  (inicia o servidor na porta 3001)
 */

import express from 'express';
import cors from 'cors';
import { 
  handleSaveTemplate, 
  handleApplyChanges, 
  handleGetTemplate,
  handleListBackups,
  handleRestoreBackup 
} from '../src/api/templates';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

/**
 * 💾 Save complete template
 * POST /api/templates/save
 */
app.post('/api/templates/save', handleSaveTemplate);

/**
 * 🔄 Apply incremental changes
 * POST /api/templates/apply-changes
 */
app.post('/api/templates/apply-changes', handleApplyChanges);

/**
 * 📋 Get current template
 * GET /api/templates/current
 */
app.get('/api/templates/current', handleGetTemplate);

/**
 * 📜 List all backups
 * GET /api/templates/backups
 */
app.get('/api/templates/backups', handleListBackups);

/**
 * ♻️ Restore from backup
 * POST /api/templates/restore
 */
app.post('/api/templates/restore', handleRestoreBackup);

/**
 * ❤️ Health check
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Template Persistence API'
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Template Persistence API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  POST   http://localhost:${PORT}/api/templates/save`);
  console.log(`  POST   http://localhost:${PORT}/api/templates/apply-changes`);
  console.log(`  GET    http://localhost:${PORT}/api/templates/current`);
  console.log(`  GET    http://localhost:${PORT}/api/templates/backups`);
  console.log(`  POST   http://localhost:${PORT}/api/templates/restore`);
  console.log(`  GET    http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
