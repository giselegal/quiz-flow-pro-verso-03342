// Simple snippet manager with localStorage persistence
export interface BlockSnippet {
  id: string;
  name: string;
  createdAt: number;
  blocks: any[]; // raw block objects
}

const STORAGE_KEY = 'quiz_editor_block_snippets_v1';

function loadAll(): BlockSnippet[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveAll(list: BlockSnippet[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export const snippetsManager = {
  list(): BlockSnippet[] { return loadAll(); },
  create(name: string, blocks: any[]): BlockSnippet {
    const all = loadAll();
    const snippet: BlockSnippet = { id: `snip-${Date.now()}`, name, createdAt: Date.now(), blocks: JSON.parse(JSON.stringify(blocks)) };
    all.push(snippet);
    saveAll(all);
    return snippet;
  },
  update(id: string, patch: Partial<Pick<BlockSnippet, 'name' | 'blocks'>>): BlockSnippet | null {
    const all = loadAll();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    saveAll(all);
    return all[idx];
  },
  remove(id: string) {
    const all = loadAll().filter(s => s.id !== id);
    saveAll(all);
  }
};
