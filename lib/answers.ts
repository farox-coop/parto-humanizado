import type { Answer, Draft, QuestionDefinition } from '@/types';

export function omitQuestion(draft: Draft, id: string): Draft {
  const answers = { ...draft.answers };
  const notes = { ...draft.notes };
  delete answers[id];
  delete notes[id];
  return { ...draft, answers, notes };
}

export function answerLabel(question: QuestionDefinition, answer?: Answer): string {
  if (!answer) return 'Sin respuesta';
  switch (answer.kind) {
    case 'text': return answer.value;
    case 'single': return question.options.find(option => option.id === answer.value)?.label ?? 'Respuesta pendiente de revisión';
    case 'multiple': return answer.value.map(id => question.options.find(option => option.id === id)?.label ?? 'Respuesta pendiente de revisión').join(', ');
  }
}

/** Una respuesta cuenta solo si corresponde a una opción vigente o contiene texto. */
export function isQuestionAnswered(question: QuestionDefinition, answer?: Answer): boolean {
  if (!answer || answer.kind !== question.kind) return false;
  if (answer.kind === 'text') return answer.value.trim().length > 0;
  if (answer.kind === 'single') return question.options.some(option => option.id === answer.value);
  return answer.value.length > 0 && new Set(answer.value).size === answer.value.length
    && answer.value.every(value => question.options.some(option => option.id === value))
    && !(answer.value.length > 1 && answer.value.some(value => question.options.find(option => option.id === value)?.exclusive));
}
