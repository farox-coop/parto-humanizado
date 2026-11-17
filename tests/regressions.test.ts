import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { create } from 'fontkit';
import { questions } from '@/data/questions';
import { emptyDraft } from '@/lib/schema';
import { composePlan } from '@/lib/compose';
import { answerLabel, omitQuestion } from '@/lib/answers';
import { unsupportedCharacters } from '@/lib/pdf/fonts';
import type { QuestionDefinition } from '@/types';

const textQuestion: QuestionDefinition = {
  id: 'texto-prueba', step: 'entorno', order: 0, title: 'Mi preferencia', description: 'Una explicación',
  kind: 'text', options: [], classification: 'preferencia', references: [], optional: true, version: 1,
};

describe('omisiones y respuestas configurables', () => {
  it('omitir elimina la respuesta y su observación del estado y del documento', () => {
    const draft = emptyDraft();
    draft.answers.acompanante = { kind: 'single', value: 'si' };
    draft.notes.acompanante = 'No debe aparecer';
    const omitted = omitQuestion(draft, 'acompanante');
    expect(omitted.answers.acompanante).toBeUndefined();
    expect(omitted.notes.acompanante).toBeUndefined();
    expect(composePlan(omitted, questions).sections).toEqual([]);
    expect(draft.notes.acompanante).toBe('No debe aparecer');
  });
  it('muestra y compone respuestas de texto sin tratarlas como opciones', () => {
    const draft = emptyDraft();
    const answer = { kind: 'text' as const, value: 'Prefiero un ambiente tranquilo.' };
    draft.answers[textQuestion.id] = answer;
    expect(answerLabel(textQuestion, answer)).toBe(answer.value);
    expect(composePlan(draft, [textQuestion]).sections[0].paragraphs[0].text).toBe(answer.value);
  });
  it('cada opción de diálogo tiene un párrafo explícito en primera persona', () => {
    for (const question of questions) {
      const paragraph = question.options.find(option => option.id === 'conversar')?.pdf;
      expect(paragraph).toMatch(/^Me gustaría conversar con el equipo de salud sobre /);
      expect(paragraph).not.toMatch(/querés|te gustaría|sobre:/i);
    }
  });
});

describe('cobertura de la fuente local', () => {
  it.each(['Regular', 'Bold'])('conserva diacríticos y detecta caracteres no admitidos en Noto Sans %s', variant => {
    const font = create(readFileSync(`public/fonts/NotoSans-${variant}.ttf`));
    if (!('hasGlyphForCodePoint' in font)) throw new Error('La fuente debe ser TTF');
    expect(unsupportedCharacters('Ana Łucía Černý Żółć Ελληνικά Кириллица\n\t', font)).toEqual([]);
    expect(unsupportedCharacters('字字', font)).toEqual(['字']);
  });
});
