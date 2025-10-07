import { TemplateAggregate } from './models';

// Interface do repositório (MVP)
export interface TemplateRepository {
    create(aggregate: TemplateAggregate): void;
    get(id: string): TemplateAggregate | undefined;
    getBySlug(slug: string): TemplateAggregate | undefined;
    save(aggregate: TemplateAggregate): void; // persiste draft ou published atualizados
    list(): TemplateAggregate[];
}

class InMemoryTemplateRepository implements TemplateRepository {
    private byId = new Map<string, TemplateAggregate>();
    private bySlug = new Map<string, string>(); // slug -> templateId (published slug principal)

    create(aggregate: TemplateAggregate): void {
        if (this.byId.has(aggregate.draft.id)) throw new Error('Template already exists');
        this.byId.set(aggregate.draft.id, aggregate);
        // slug sempre aponta para draft enquanto não publicado
        this.bySlug.set(aggregate.draft.meta.slug, aggregate.draft.id);
    }

    get(id: string): TemplateAggregate | undefined { return this.byId.get(id); }

    getBySlug(slug: string): TemplateAggregate | undefined {
        const id = this.bySlug.get(slug);
        if (!id) return undefined;
        return this.byId.get(id);
    }

    save(aggregate: TemplateAggregate): void {
        this.byId.set(aggregate.draft.id, aggregate);
        // Atualiza slug mapping (caso slug mude no draft)
        this.bySlug.set(aggregate.draft.meta.slug, aggregate.draft.id);
        if (aggregate.published) {
            // slug publicado deve resolver para o template também
            this.bySlug.set(aggregate.published.meta.slug, aggregate.draft.id);
        }
    }

    list(): TemplateAggregate[] { return Array.from(this.byId.values()); }
}

// Futuro: selecionar driver via env PERSIST_TEMPLATES=sqlite
export const templateRepo: TemplateRepository = new InMemoryTemplateRepository();

