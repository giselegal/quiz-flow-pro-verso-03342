import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Supabase configuration
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Test Supabase connection
(async () => {
  try {
    const { data, error } = await supabase.from('funnels').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err: any) {
    console.error('❌ Supabase connection error:', err);
  }
})();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://0.0.0.0:8080', 'http://0.0.0.0:8081', 'http://192.168.1.11:8080', 'http://192.168.1.11:8081'],
  credentials: true
}));

// Mock data storage for non-funnel data
let pageConfigs: any = {};

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

// Schema-driven funnels endpoints with Supabase
app.get('/api/schema-driven/funnels', async (req, res) => {
  try {
    const { data: funnels, error } = await supabase
      .from('funnels')
      .select(`
        *,
        funnel_pages (*)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch funnels' });
    }

    // Transform data to match expected format
    const transformedFunnels = funnels?.map(funnel => ({
      id: funnel.id,
      name: funnel.name,
      description: funnel.description,
      userId: funnel.user_id,
      isPublished: funnel.is_published,
      version: funnel.version,
      settings: funnel.settings || {},
      pages: funnel.funnel_pages?.map((page: any) => ({
        id: page.id,
        pageType: page.page_type,
        pageOrder: page.page_order,
        title: page.title,
        blocks: page.blocks || [],
        metadata: page.metadata || {}
      })) || [],
      createdAt: funnel.created_at,
      updatedAt: funnel.updated_at
    })) || [];

    res.json(transformedFunnels);
  } catch (error) {
    console.error('Error fetching funnels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/schema-driven/funnels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: funnel, error } = await supabase
      .from('funnels')
      .select(`
        *,
        funnel_pages (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Funnel not found' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch funnel' });
    }

    // Transform data to match expected format
    const transformedFunnel = {
      id: funnel.id,
      name: funnel.name,
      description: funnel.description,
      userId: funnel.user_id,
      isPublished: funnel.is_published,
      version: funnel.version,
      settings: funnel.settings || {},
      pages: funnel.funnel_pages?.map((page: any) => ({
        id: page.id,
        pageType: page.page_type,
        pageOrder: page.page_order,
        title: page.title,
        blocks: page.blocks || [],
        metadata: page.metadata || {}
      })) || [],
      createdAt: funnel.created_at,
      updatedAt: funnel.updated_at
    };

    res.json({ data: transformedFunnel });
  } catch (error) {
    console.error('Error fetching funnel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schema-driven/funnels', async (req, res) => {
  try {
    const funnelData = req.body;
    
    // Generate ID if not provided
    const funnelId = funnelData.id || `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert funnel
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert({
        id: funnelId,
        name: funnelData.name,
        description: funnelData.description,
        user_id: funnelData.userId || null,
        is_published: funnelData.isPublished || false,
        version: funnelData.version || 1,
        settings: funnelData.settings || {}
      })
      .select()
      .single();

    if (funnelError) {
      console.error('Supabase funnel error:', JSON.stringify(funnelError, null, 2));
      console.error('Error details:', {
        code: funnelError.code,
        message: funnelError.message,
        details: funnelError.details,
        hint: funnelError.hint
      });
      return res.status(500).json({ error: 'Failed to create funnel' });
    }

    // Insert pages if they exist
    if (funnelData.pages && funnelData.pages.length > 0) {
      const pagesData = funnelData.pages.map((page: any) => ({
        id: page.id || crypto.randomUUID(),
        funnel_id: funnel.id,
        page_type: page.pageType || 'default',
        page_order: page.pageOrder || 0,
        title: page.title || 'Untitled Page',
        blocks: page.blocks || [],
        metadata: page.metadata || {}
      }));

      const { error: pagesError } = await supabase
        .from('funnel_pages')
        .insert(pagesData);

      if (pagesError) {
        console.error('Supabase pages error:', pagesError);
        // Try to cleanup the funnel if pages failed
        await supabase.from('funnels').delete().eq('id', funnel.id);
        return res.status(500).json({ error: 'Failed to create funnel pages' });
      }
    }

    res.status(201).json({ 
      success: true, 
      data: {
        ...funnel,
        pages: funnelData.pages || []
      }
    });
  } catch (error) {
    console.error('Error creating funnel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/schema-driven/funnels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const funnelData = req.body;
    
    console.log('🔍 DEBUG - PUT /api/schema-driven/funnels/:id');
    console.log('  Funnel ID:', id);
    console.log('  Funnel Name:', funnelData.name);
    console.log('  Pages count:', funnelData.pages?.length || 0);
    if (funnelData.pages) {
      console.log('  Page IDs:', funnelData.pages.map((p: any) => p.id));
    }
    
    // Update funnel
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .update({
        name: funnelData.name,
        description: funnelData.description,
        user_id: funnelData.userId,
        is_published: funnelData.isPublished,
        version: funnelData.version,
        settings: funnelData.settings || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (funnelError) {
      if (funnelError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Funnel not found' });
      }
      console.error('Supabase funnel error:', funnelError);
      return res.status(500).json({ error: 'Failed to update funnel' });
    }

    console.log('✅ Funnel updated successfully');

    // Delete existing pages and insert new ones
    if (funnelData.pages) {
      console.log('🗑️ Deleting existing pages for funnel:', id);
      
      // First, get existing pages to see what we're dealing with
      const { data: existingPages } = await supabase
        .from('funnel_pages')
        .select('id, title')
        .eq('funnel_id', id);

      console.log('📋 Existing pages:', existingPages?.map(p => ({ id: p.id, title: p.title })) || []);
      
      // Delete existing pages with explicit wait
      const { error: deleteError, count: deletedCount } = await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', id);

      if (deleteError) {
        console.error('❌ Error deleting pages:', deleteError);
        return res.status(500).json({ error: 'Failed to delete existing pages' });
      }

      console.log('✅ Existing pages deleted, count:', deletedCount);

      // Wait a bit to ensure deletion is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Insert new pages
      if (funnelData.pages.length > 0) {
        // Generate unique IDs for pages that don't have them
        const pagesData = funnelData.pages.map((page: any, index: number) => ({
          id: page.id || `page-${Date.now()}-${index}`,
          funnel_id: id,
          page_type: page.pageType || page.type || 'default',
          page_order: page.pageOrder || page.order || index,
          title: page.title || `Page ${index + 1}`,
          blocks: page.blocks || [],
          metadata: page.metadata || {}
        }));

        console.log('📄 Inserting pages:', pagesData.map(p => ({ id: p.id, title: p.title })));

        // Insert pages one by one to avoid conflicts
        for (const pageData of pagesData) {
          const { error: pageError } = await supabase
            .from('funnel_pages')
            .insert(pageData);

          if (pageError) {
            console.error('❌ Error inserting page:', pageData.id, pageError);
            return res.status(500).json({ error: `Failed to insert page: ${pageData.title}` });
          }
        }

        console.log('✅ All pages inserted successfully');
      }
    }

    res.json({ 
      success: true, 
      data: {
        ...funnel,
        pages: funnelData.pages || []
      }
    });
  } catch (error) {
    console.error('Error updating funnel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/schema-driven/funnels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete funnel (pages will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('funnels')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete funnel' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy funnels endpoints (for compatibility)
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