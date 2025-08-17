import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Quiz endpoints
app.get('/api/quizzes', (req, res) => {
  // Mock data - replace with actual database queries
  res.json([]);
});

app.post('/api/quizzes', (req, res) => {
  // Mock creation - replace with actual database operations
  res.json({ id: Date.now().toString(), ...req.body });
});

app.get('/api/quizzes/:id', (req, res) => {
  // Mock data - replace with actual database queries
  res.json({ id: req.params.id, title: 'Mock Quiz' });
});

// Generic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// SPA Fallback - CRÍTICO: deve ser o último middleware
// Qualquer rota que não seja API serve o index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log(`🔄 SPA Fallback: ${req.url} → index.html`);
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../dist')}`);
  console.log(`🔄 SPA fallback configured for client-side routing`);
});
