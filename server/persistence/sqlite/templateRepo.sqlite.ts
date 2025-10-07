import { TemplateAggregate, TemplatePublishedSnapshot, TemplateDraft } from '../../templates/models';
import { TemplateRepository } from '../../templates/repo';
import { sqlite } from './db';

function serialize(agg: TemplateAggregate) {
	return JSON.stringify(agg.draft);
}
function serializePublished(pub?: TemplatePublishedSnapshot) {
	return pub ? JSON.stringify(pub) : null;
}
function deserializeDraft(json: string): TemplateDraft {
	return JSON.parse(json);
}

export class SqliteTemplateRepository implements TemplateRepository {
	private insertStmt = sqlite.prepare(`INSERT INTO templates (id, slug, draft_json, published_json, created_at, updated_at)
		VALUES (@id, @slug, @draft_json, @published_json, @created_at, @updated_at)`);
	private updateStmt = sqlite.prepare(`UPDATE templates SET slug=@slug, draft_json=@draft_json, published_json=@published_json, updated_at=@updated_at WHERE id=@id`);
	private selectById = sqlite.prepare(`SELECT * FROM templates WHERE id=?`);
	private selectBySlug = sqlite.prepare(`SELECT * FROM templates WHERE slug=?`);
	private selectAll = sqlite.prepare(`SELECT * FROM templates`);

	create(aggregate: TemplateAggregate): void {
		const now = new Date().toISOString();
		this.insertStmt.run({
			id: aggregate.draft.id,
			slug: aggregate.draft.meta.slug,
			draft_json: serialize(aggregate),
			published_json: serializePublished(aggregate.published),
			created_at: aggregate.draft.createdAt || now,
			updated_at: now
		});
	}
	get(id: string): TemplateAggregate | undefined {
		const row = this.selectById.get(id) as any;
		if (!row) return undefined;
		return this.rowToAggregate(row);
	}
	getBySlug(slug: string): TemplateAggregate | undefined {
		const row = this.selectBySlug.get(slug) as any;
		if (!row) return undefined;
		return this.rowToAggregate(row);
	}
	save(aggregate: TemplateAggregate): void {
		const now = new Date().toISOString();
		this.updateStmt.run({
			id: aggregate.draft.id,
			slug: aggregate.draft.meta.slug,
			draft_json: JSON.stringify(aggregate.draft),
			published_json: serializePublished(aggregate.published),
			updated_at: now
		});
	}
	list(): TemplateAggregate[] {
		return this.selectAll.all().map(r => this.rowToAggregate(r as any));
	}
	private rowToAggregate(row: any): TemplateAggregate {
		const draft = deserializeDraft(row.draft_json);
		const aggregate: TemplateAggregate = { draft };
		if (row.published_json) {
			aggregate.published = JSON.parse(row.published_json);
		}
		return aggregate;
	}
}

