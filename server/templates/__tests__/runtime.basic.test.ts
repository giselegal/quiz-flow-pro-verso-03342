import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

// Helper to publish a fresh template each test
function setupPublishedTemplate() {
  const tpl = templateService.createBase('Teste', 'tpl-runtime-basic');
  // adicionar um weight para a primeira questão (stage_q1) e opção fictícia
  const draft = templateRepo.get(tpl.id)!;
  draft.logic.scoring.weights['stage_q1:optA'] = 10;
  templateRepo.save(draft);
  templateService.publish(draft.id);
  return templateRepo.get(draft.id)!;
}

// mock de componente de opções não é necessário para scoring (apenas weight chave)

describe('Runtime básico (linear)', () => {
  let published: any;
  beforeEach(() => {
    published = setupPublishedTemplate();
  });

  it('inicia sessão e retorna primeiro stage', () => {
    const start = templateService.startRuntime(published.slug);
    expect(start.sessionId).toBeDefined();
    expect(start.currentStageId).toBe('stage_intro');
  });

  it('responde primeiro stage (intro) e avança linearmente', () => {
    const start = templateService.startRuntime(published.slug);
    const ans1 = templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
    expect(ans1.nextStageId).toBe('stage_q1');
    expect(ans1.branched).toBe(false);
  });

  it('aplica scoring quando responde questão', () => {
    const start = templateService.startRuntime(published.slug);
    templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
    const ans2 = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optA']);
    expect(ans2.score).toBe(10);
  });

  it('complete retorna outcome padrão', () => {
    const start = templateService.startRuntime(published.slug);
    templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
    templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optA']);
    const done = templateService.completeRuntime(published.slug, start.sessionId);
    expect(done.outcome).toBeDefined();
    expect(done.outcome?.template).toContain('Resultado padrão');
  });
});
