import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { isQuestionAnswered } from '@/lib/answers';
import { composePlan } from '@/lib/compose';
import { emptyDraft } from '@/lib/schema';

describe('respuestas explícitas', () => {
  it('considera pendiente la ausencia y completa solo una opción válida', () => {
    for (const question of questions) {
      expect(isQuestionAnswered(question)).toBe(false);
      const none = question.options.find(option => option.id === 'sin-preferencia');
      expect(none).toBeDefined();
      const answer = question.kind === 'multiple' ? { kind: 'multiple' as const, value: ['sin-preferencia'] } : { kind: 'single' as const, value: 'sin-preferencia' };
      expect(isQuestionAnswered(question, answer)).toBe(true);
    }
  });
  it('no agrega solicitudes al documento si se responde sin preferencia', () => {
    const draft = emptyDraft();
    for (const question of questions) draft.answers[question.id] = question.kind === 'multiple' ? { kind: 'multiple', value: ['sin-preferencia'] } : { kind: 'single', value: 'sin-preferencia' };
    expect(composePlan(draft, questions).sections).toEqual([]);
  });
});
