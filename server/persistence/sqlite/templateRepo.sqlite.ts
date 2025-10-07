import { ITemplateRepository } from '../../templates/repo.js';
import { TemplateDraft, createBaseTemplate } from '../../templates/models.js';
import { db, nowIso } from './db.js';
import { nanoid } from 'nanoid';

function cloneDeep<T>(obj: T): T { return structuredClone(obj); }

export class SqliteTemplateRepository implements ITemplateRepository {
    createFromBase(name: string, slug: string): TemplateDraft {
        const id = `tpl_${nanoid(8)}`;
        const tpl = createBaseTemplate(id, slug);
        tpl.name = name;
        const now = nowIso();
        tpl.createdAt = now; tpl.updatedAt = now;
        this.persist(tpl);
        return cloneDeep(tpl);
    }
    cloneTemplate(sourceId: string, name: string, slug: string): TemplateDraft {
        const src = this.get(sourceId);
        if (!src) throw new Error('SOURCE_NOT_FOUND');
        const id = `tpl_${nanoid(8)}`;
        const cloned: TemplateDraft = {
            ...cloneDeep(src),
            id,
            name,
            slug,
            status: 'draft',
            publishedSnapshot: undefined,
            createdAt: nowIso(),
            updatedAt: nowIso()
        };
        this.persist(cloned);
        return cloneDeep(cloned);
    }
    get(id: string): TemplateDraft | undefined {
        const row = db.prepare(`SELECT * FROM templates WHERE id = ?`).get(id) as any;
        if (!row) return undefined;
        const draft: TemplateDraft = JSON.parse(row.draft_json);
        draft.publishedSnapshot = row.published_snapshot_json ? JSON.parse(row.published_snapshot_json) : undefined;
        return draft;
    }
    save(template: TemplateDraft): void {
        template.updatedAt = nowIso();
        this.persist(template);
    }
    appendHistory(template: TemplateDraft, entry: { op: string; details?: any;[k: string]: any }): void {
        const histEntry = { id: `h_${template.history.length}`, timestamp: nowIso(), ...entry };
        template.history.push(histEntry);
    }
    list(): TemplateDraft[] {
        const rows = db.prepare(`SELECT * FROM templates`).all() as any[];
        return rows.map(r => {
            const draft: TemplateDraft = JSON.parse(r.draft_json);
            draft.publishedSnapshot = r.published_snapshot_json ? JSON.parse(r.published_snapshot_json) : undefined;
            return draft;
        });
    }
    private persist(tpl: TemplateDraft) {
        const draftJson = JSON.stringify(tpl);
        const publishedJson = tpl.publishedSnapshot ? JSON.stringify(tpl.publishedSnapshot) : null;
        db.prepare(`INSERT INTO templates (id, name, slug, status, draft_json, published_snapshot_json, created_at, updated_at)
      VALUES (@id,@name,@slug,@status,@draft,@published,@created,@updated)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, slug=excluded.slug, status=excluded.status, draft_json=excluded.draft_json, published_snapshot_json=excluded.published_snapshot_json, updated_at=excluded.updated_at`).run({
            id: tpl.id,
            name: tpl.name,
            slug: tpl.slug,
            status: tpl.status,
            draft: draftJson,
            published: publishedJson,
            created: tpl.createdAt,
            updated: tpl.updatedAt
        });
    }
}
