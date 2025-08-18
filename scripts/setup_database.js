import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar banco SQLite
const dbPath = path.join(__dirname, '..', 'dev.db');
const db = new Database(dbPath);

console.log('🔧 Configurando banco de dados SQLite...');

// Habilitar WAL mode
db.pragma('journal_mode = WAL');

// Criar tabelas
const createTables = `
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Tabela de analytics UTM
CREATE TABLE IF NOT EXISTS utm_analytics (
  id TEXT PRIMARY KEY,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  participant_id TEXT,
  created_at TEXT
);

-- Tabela de participantes do quiz
CREATE TABLE IF NOT EXISTS quiz_participants (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  quiz_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TEXT
);

-- Tabela de funnels
CREATE TABLE IF NOT EXISTS funnels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id INTEGER,
  is_published INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  settings TEXT,
  created_at TEXT,
  updated_at TEXT
);

-- Tabela de páginas do funil
CREATE TABLE IF NOT EXISTS funnel_pages (
  id TEXT PRIMARY KEY,
  funnel_id TEXT NOT NULL,
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  title TEXT,
  blocks TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT,
  updated_at TEXT
);

-- Tabela de versões do funil
CREATE TABLE IF NOT EXISTS funnel_versions (
  id TEXT PRIMARY KEY,
  funnel_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  funnel_data TEXT NOT NULL,
  created_at TEXT,
  created_by INTEGER
);

-- Tabela de eventos de conversão
CREATE TABLE IF NOT EXISTS conversion_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_email TEXT,
  value REAL DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  event_data TEXT,
  created_at TEXT
);

-- Tabela de resultados do quiz
CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  quiz_id TEXT,
  responses TEXT NOT NULL,
  scores TEXT,
  predominant_style TEXT,
  created_at TEXT
);

-- Tabela de compras Hotmart
CREATE TABLE IF NOT EXISTS hotmart_purchases (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  buyer_email TEXT,
  buyer_name TEXT,
  product_id TEXT,
  product_name TEXT,
  amount REAL,
  currency TEXT DEFAULT 'BRL',
  status TEXT,
  event_type TEXT,
  purchase_date TEXT,
  created_at TEXT,
  updated_at TEXT
);
`;

// Executar criação das tabelas
try {
  db.exec(createTables);
  console.log('✅ Tabelas criadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao criar tabelas:', error);
  process.exit(1);
}

// Inserir dados de exemplo
const now = new Date().toISOString();

// Usuário de exemplo
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (username, password) 
  VALUES (?, ?)
`);
insertUser.run('admin', 'admin123');

// Participantes de exemplo
const insertParticipant = db.prepare(`
  INSERT OR IGNORE INTO quiz_participants (id, name, email, quiz_id, utm_source, utm_medium, utm_campaign, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const participants = [
  ['part_001', 'João Silva', 'joao@email.com', 'quiz_001', 'google', 'cpc', 'campanha_teste', now],
  [
    'part_002',
    'Maria Santos',
    'maria@email.com',
    'quiz_001',
    'facebook',
    'social',
    'promo_natal',
    now,
  ],
  [
    'part_003',
    'Pedro Costa',
    'pedro@email.com',
    'quiz_002',
    'instagram',
    'story',
    'black_friday',
    now,
  ],
];

participants.forEach(p => insertParticipant.run(...p));

// Resultados de quiz de exemplo
const insertQuizResult = db.prepare(`
  INSERT OR IGNORE INTO quiz_results (id, participant_id, quiz_id, responses, scores, predominant_style, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const quizResults = [
  [
    'result_001',
    'part_001',
    'quiz_001',
    JSON.stringify([
      { questionId: 'q1', selectedOption: 'option_a', score: 10 },
      { questionId: 'q2', selectedOption: 'option_b', score: 15 },
    ]),
    JSON.stringify({ total: 25, breakdown: { analytical: 15, creative: 10 } }),
    'analytical',
    now,
  ],
  [
    'result_002',
    'part_002',
    'quiz_001',
    JSON.stringify([
      { questionId: 'q1', selectedOption: 'option_c', score: 8 },
      { questionId: 'q2', selectedOption: 'option_a', score: 12 },
    ]),
    JSON.stringify({ total: 20, breakdown: { analytical: 8, creative: 12 } }),
    'creative',
    now,
  ],
];

quizResults.forEach(r => insertQuizResult.run(...r));

// Analytics UTM de exemplo
const insertUtm = db.prepare(`
  INSERT OR IGNORE INTO utm_analytics (id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, participant_id, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const utmData = [
  [
    'utm_001',
    'google',
    'cpc',
    'campanha_teste',
    'anuncio_a',
    'quiz personalidade',
    'part_001',
    now,
  ],
  [
    'utm_002',
    'facebook',
    'social',
    'promo_natal',
    'post_organico',
    'teste gratis',
    'part_002',
    now,
  ],
  [
    'utm_003',
    'instagram',
    'story',
    'black_friday',
    'story_1',
    'desconto especial',
    'part_003',
    now,
  ],
];

utmData.forEach(u => insertUtm.run(...u));

// Eventos de conversão de exemplo
const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO conversion_events (id, event_type, user_email, value, utm_source, utm_medium, utm_campaign, event_data, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const events = [
  [
    'event_001',
    'quiz_completed',
    'joao@email.com',
    0,
    'google',
    'cpc',
    'campanha_teste',
    JSON.stringify({ quiz_id: 'quiz_001', score: 25 }),
    now,
  ],
  [
    'event_002',
    'lead_captured',
    'maria@email.com',
    0,
    'facebook',
    'social',
    'promo_natal',
    JSON.stringify({ form_id: 'form_001' }),
    now,
  ],
  [
    'event_003',
    'purchase',
    'pedro@email.com',
    297.0,
    'instagram',
    'story',
    'black_friday',
    JSON.stringify({ product: 'curso_premium' }),
    now,
  ],
];

events.forEach(e => insertEvent.run(...e));

// Compras Hotmart de exemplo
const insertPurchase = db.prepare(`
  INSERT OR IGNORE INTO hotmart_purchases (id, transaction_id, buyer_email, buyer_name, product_id, product_name, amount, status, event_type, purchase_date, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const purchases = [
  [
    'purchase_001',
    'HOT123456789',
    'joao@email.com',
    'João Silva',
    'PROD001',
    'Curso Premium de Marketing',
    297.0,
    'approved',
    'PURCHASE_COMPLETE',
    now,
    now,
    now,
  ],
  [
    'purchase_002',
    'HOT987654321',
    'maria@email.com',
    'Maria Santos',
    'PROD002',
    'Mentoria Individual',
    497.0,
    'approved',
    'PURCHASE_COMPLETE',
    now,
    now,
    now,
  ],
];

purchases.forEach(p => insertPurchase.run(...p));

// Funnels de exemplo
const insertFunnel = db.prepare(`
  INSERT OR IGNORE INTO funnels (id, name, description, user_id, is_published, version, settings, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const funnels = [
  [
    'funnel_001',
    'Quiz de Personalidade',
    'Funil completo com quiz de personalidade para segmentação de leads',
    1,
    1,
    1,
    JSON.stringify({ tracking_enabled: true, utm_tracking: true }),
    now,
    now,
  ],
  [
    'funnel_002',
    'Captação Black Friday',
    'Funil de captação especial para promoção de Black Friday',
    1,
    1,
    2,
    JSON.stringify({ tracking_enabled: true, discount_code: 'BLACK50' }),
    now,
    now,
  ],
];

funnels.forEach(f => insertFunnel.run(...f));

console.log('✅ Dados de exemplo inseridos com sucesso!');

// Verificar se os dados foram inseridos
const counts = {
  users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
  participants: db.prepare('SELECT COUNT(*) as count FROM quiz_participants').get().count,
  results: db.prepare('SELECT COUNT(*) as count FROM quiz_results').get().count,
  utm: db.prepare('SELECT COUNT(*) as count FROM utm_analytics').get().count,
  events: db.prepare('SELECT COUNT(*) as count FROM conversion_events').get().count,
  purchases: db.prepare('SELECT COUNT(*) as count FROM hotmart_purchases').get().count,
  funnels: db.prepare('SELECT COUNT(*) as count FROM funnels').get().count,
};

console.log('\n📊 Resumo dos dados:');
console.log(`• Usuários: ${counts.users}`);
console.log(`• Participantes: ${counts.participants}`);
console.log(`• Resultados de Quiz: ${counts.results}`);
console.log(`• Analytics UTM: ${counts.utm}`);
console.log(`• Eventos de Conversão: ${counts.events}`);
console.log(`• Compras Hotmart: ${counts.purchases}`);
console.log(`• Funnels: ${counts.funnels}`);

db.close();
console.log('\n🎉 Banco de dados configurado e pronto para uso!');
