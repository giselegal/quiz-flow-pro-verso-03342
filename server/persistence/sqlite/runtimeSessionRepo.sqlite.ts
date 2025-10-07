import { IRuntimeSessionRepository, RuntimeSession } from '../../templates/repo.js';
import { db, nowIso } from './db.js';
import { nanoid } from 'nanoid';
import { TemplateDraft } from '../../templates/models.js';

export class SqliteRuntimeSessionRepository implements IRuntimeSessionRepository {
    create(template: TemplateDraft): RuntimeSession {
        if (!template.publishedSnapshot) throw new Error('NOT_PUBLISHED');
        const firstStage = template.publishedSnapshot.stages.find((s: any) => s.enabled !== false) || template.publishedSnapshot.stages[0];
        const sessionId = `sess_${nanoid(10)}`;
        const now = nowIso();
        const sess: RuntimeSession = {
            sessionId,
            templateId: template.id,
            publishId: template.publishedSnapshot.publishedAt,
            currentStageId: firstStage.id,
            answers: {},
            score: 0,
            createdAt: now,
            updatedAt: now,
            completed: false
        };
        db.prepare(`INSERT INTO runtime_sessions (session_id, template_id, publish_id, current_stage_id, answers_json, score, created_at, updated_at, completed)
      VALUES (@sessionId, @templateId, @publishId, @currentStageId, @answersJson, @score, @createdAt, @updatedAt, @completed)`).run({
            sessionId: sess.sessionId,
            templateId: sess.templateId,
            publishId: sess.publishId,
            currentStageId: sess.currentStageId,
            answersJson: JSON.stringify(sess.answers),
            score: sess.score,
            createdAt: sess.createdAt,
            updatedAt: sess.updatedAt,
            completed: sess.completed ? 1 : 0
        });
        return { ...sess };
    }
    get(sessionId: string): RuntimeSession | undefined {
        const row = db.prepare(`SELECT * FROM runtime_sessions WHERE session_id = ?`).get(sessionId) as any;
        if (!row) return undefined;
        return {
            sessionId: row.session_id,
            templateId: row.template_id,
            publishId: row.publish_id,
            currentStageId: row.current_stage_id,
            answers: JSON.parse(row.answers_json || '{}'),
            score: row.score,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            completed: !!row.completed
        };
    }
    save(s: RuntimeSession): void {
        const updatedAt = nowIso();
        db.prepare(`UPDATE runtime_sessions SET current_stage_id=@currentStageId, answers_json=@answersJson, score=@score, updated_at=@updatedAt, completed=@completed WHERE session_id=@sessionId`).run({
            sessionId: s.sessionId,
            currentStageId: s.currentStageId,
            answersJson: JSON.stringify(s.answers),
            score: s.score,
            updatedAt,
            completed: s.completed ? 1 : 0
        });
        s.updatedAt = updatedAt;
    }
}
