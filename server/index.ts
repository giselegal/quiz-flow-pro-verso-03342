import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS headers and Security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Content Security Policy - Mais permissiva para desenvolvimento e Replit
  res.header('Content-Security-Policy', [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://replit.com https://*.replit.dev https://*.kirk.replit.dev https://lovable.dev data: blob:",
    "style-src 'self' 'unsafe-inline' data: https:",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss: ws:",
    "frame-src 'self' https:",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "object-src 'none'"
  ].join('; '));
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes placeholder
app.get('/api/funnels', (req, res) => {
  res.json({ funnels: [] });
});

app.post('/api/funnels', (req, res) => {
  res.json({ success: true, message: 'Funnel saved (placeholder)' });
});

// Serve static files - múltiplos caminhos para compatibilidade
const staticPaths = [
  path.join(__dirname, '../dist/public'),
  path.join(__dirname, '../public'),
  path.join(__dirname, '../')
];

staticPaths.forEach(staticPath => {
  app.use(express.static(staticPath));
});

// SPA fallback - serve index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api/')) {
    const indexPaths = [
      path.join(__dirname, '../dist/public/index.html'),
      path.join(__dirname, '../public/index.html'),
      path.join(__dirname, '../index.html')
    ];
    
    for (const indexPath of indexPaths) {
      try {
        console.log(`Tentando servir index.html de: ${indexPath}`);
        res.sendFile(indexPath);
        return;
      } catch (error) {
        console.log(`Arquivo não encontrado: ${indexPath}`);
        continue;
      }
    }
    
    res.status(404).send('Index.html não encontrado');
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving files from multiple paths`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;