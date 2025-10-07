import { describe, it, expect } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

function publishBase(slug: string) {
    const tpl = templateService.createBase('Base', slug);
    templateService.publish(tpl.id); // assume ok
    return templateRepo.get(tpl.id)!;
}

describe('Runtime - cenários de erro', () => {
    it('startRuntime lança NOT_FOUND para slug não publicado', () => {
        expect(() => templateService.startRuntime('slug-inexistente')).toThrowError('NOT_FOUND');
    });

    it('answerRuntime lança NOT_FOUND se slug não existe', () => {
        expect(() => templateService.answerRuntime('x-slug', 'sess_fake', 'stage_intro', [])).toThrowError('NOT_FOUND');
    });

    it('answerRuntime lança SESSION_NOT_FOUND para sessão inválida', () => {
        const pub = publishBase('slug-errors-1');
        expect(() => templateService.answerRuntime(pub.slug, 'sess_invalida', 'stage_intro', [])).toThrowError('SESSION_NOT_FOUND');
    });

    it('completeRuntime lança SESSION_NOT_FOUND para sessão inexistente', () => {
        const pub = publishBase('slug-errors-2');
        expect(() => templateService.completeRuntime(pub.slug, 'sess_fake')).toThrowError('SESSION_NOT_FOUND');
    });

    it('answerRuntime lança ALREADY_COMPLETED ao responder depois de complete', () => {
        const pub = publishBase('slug-errors-3');
        const start = templateService.startRuntime(pub.slug);
        templateService.completeRuntime(pub.slug, start.sessionId);
        expect(() => templateService.answerRuntime(pub.slug, start.sessionId, 'stage_intro', [])).toThrowError('ALREADY_COMPLETED');
    });

    it('completeRuntime lança ALREADY_COMPLETED na segunda chamada', () => {
        const pub = publishBase('slug-errors-4');
        const start = templateService.startRuntime(pub.slug);
        templateService.completeRuntime(pub.slug, start.sessionId);
        expect(() => templateService.completeRuntime(pub.slug, start.sessionId)).toThrowError('ALREADY_COMPLETED');
    });

    it('não permite usar sessão de outro template (SESSION_NOT_FOUND)', () => {
        const pub1 = publishBase('slug-errors-a');
        const pub2 = publishBase('slug-errors-b');
        const s1 = templateService.startRuntime(pub1.slug);
        // tentar responder usando slug do segundo template com session do primeiro
        expect(() => templateService.answerRuntime(pub2.slug, s1.sessionId, 'stage_intro', [])).toThrowError('SESSION_NOT_FOUND');
    });
});
