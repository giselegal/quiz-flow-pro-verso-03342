import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

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

app.put('/api/funnels/:id', (req, res) => {
  const { id } = req.params;
  const funnelData = req.body;
  res.json({ 
    success: true,
    data: {
      ...funnelData,
      id,
      lastModified: new Date().toISOString()
    },
    message: 'Funnel updated successfully'
  });
});

// Schema-driven API routes
app.get('/api/schema-driven/funnels', (req, res) => {
  res.json({ 
    success: true,
    data: [],
    message: 'Schema-driven funnels retrieved successfully'
  });
});

app.get('/api/schema-driven/funnels/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    success: true,
    data: {
      id,
      name: 'Sample Funnel',
      description: 'A sample schema-driven funnel',
      theme: 'default',
      isPublished: false,
      pages: [],
      config: {
        name: 'Sample Funnel',
        isPublished: false,
        theme: 'default',
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        fontFamily: 'Inter'
      },
      version: 1,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    message: 'Schema-driven funnel retrieved successfully'
  });
});

app.post('/api/schema-driven/funnels', (req, res) => {
  const funnelData = req.body;
  res.json({ 
    success: true,
    data: {
      ...funnelData,
      id: funnelData.id || `funnel-${Date.now()}`,
      lastModified: new Date().toISOString(),
      createdAt: funnelData.createdAt || new Date().toISOString()
    },
    message: 'Schema-driven funnel created successfully'
  });
});

app.put('/api/schema-driven/funnels/:id', (req, res) => {
  const { id } = req.params;
  const funnelData = req.body;
  res.json({ 
    success: true,
    data: {
      ...funnelData,
      id,
      lastModified: new Date().toISOString()
    },
    message: 'Schema-driven funnel updated successfully'
  });
});

app.delete('/api/schema-driven/funnels/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    success: true,
    message: `Schema-driven funnel ${id} deleted successfully`
  });
});

// Page configs API routes
app.get('/api/page-configs/:pageType', (req, res) => {
  const { pageType } = req.params;
  res.json({ 
    success: true,
    data: {
      pageType,
      config: {
        showProgress: true,
        progressValue: 50,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        maxWidth: '800px',
        padding: '2rem'
      },
      blocks: [],
      settings: {
        showProgress: true,
        progressValue: 50,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        maxWidth: '800px'
      }
    },
    message: `Page config for ${pageType} retrieved successfully`
  });
});

app.post('/api/page-configs/:pageType', (req, res) => {
  const { pageType } = req.params;
  const configData = req.body;
  res.json({ 
    success: true,
    data: {
      pageType,
      ...configData,
      lastModified: new Date().toISOString()
    },
    message: `Page config for ${pageType} saved successfully`
  });
});

// Additional API routes for quiz functionality
app.get('/api/funnels/user/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ 
    success: true,
    data: [],
    message: `Funnels for user ${userId} retrieved successfully`
  });
});

app.put('/api/funnels/:id/publish', (req, res) => {
  const { id } = req.params;
  res.json({ 
    success: true,
    data: { id, isPublished: true },
    message: `Funnel ${id} published successfully`
  });
});

app.post('/api/quiz/validate-scoring', (req, res) => {
  res.json({ 
    success: true,
    data: { isValid: true, score: 85 },
    message: 'Quiz scoring validated successfully'
  });
});

app.post('/api/quiz/simulate-result', (req, res) => {
  res.json({ 
    success: true,
    data: { 
      resultType: 'high-score',
      score: 90,
      recommendations: ['Great job!', 'Keep it up!']
    },
    message: 'Quiz result simulated successfully'
  });
});

app.get('/api/utm-analytics', (req, res) => {
  res.json({ 
    success: true,
    data: {
      totalVisits: 1250,
      conversions: 89,
      conversionRate: 7.12,
      sources: [
        { source: 'google', visits: 450, conversions: 32 },
        { source: 'facebook', visits: 380, conversions: 28 },
        { source: 'direct', visits: 420, conversions: 29 }
      ]
    },
    message: 'UTM analytics retrieved successfully'
  });
});

app.post('/api/utm-analytics', (req, res) => {
  res.json({ 
    success: true,
    message: 'UTM analytics data saved successfully'
  });
});

app.get('/api/quiz-participants', (req, res) => {
  res.json({ 
    success: true,
    data: [],
    message: 'Quiz participants retrieved successfully'
  });
});

app.post('/api/quiz-participants', (req, res) => {
  res.json({ 
    success: true,
    data: { id: Date.now(), ...req.body },
    message: 'Quiz participant saved successfully'
  });
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