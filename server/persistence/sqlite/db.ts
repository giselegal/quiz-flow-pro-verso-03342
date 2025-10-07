import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = process.env.SESSIONS_SQLITE_FILE || path.join(__dirname, 'sessions.db');

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

export const db = new Database(DB_FILE);

db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS runtime_sessions (
  session_id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  publish_id TEXT NOT NULL,
  current_stage_id TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  score REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed INTEGER NOT NULL
);`);

export function nowIso() { return new Date().toISOString(); }
