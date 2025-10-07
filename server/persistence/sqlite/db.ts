import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Singleton de conexão para persistência SQLite (templates e possivelmente outros)
// Usa arquivo dedicado templates.db para isolar de sessões.

const DB_FILE = path.resolve(process.cwd(), 'server/persistence/sqlite/templates.db');

// Garante diretório existente
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

export const sqlite = new Database(DB_FILE);

// Pragmas básicos (ajustes simples; podem ser revisitados)
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Criação de tabela templates (MVP)
sqlite.exec(`CREATE TABLE IF NOT EXISTS templates (
	id TEXT PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	draft_json TEXT NOT NULL,
	published_json TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);`);

