'use client';

import { sourceById } from '@/data/sources';
import type { Answer, QuestionDefinition } from '@/types';

type Props = {
  question: QuestionDefinition;
  index: number;
  answer?: Answer;
  note: string;
  onAnswer: (answer: Answer | undefined) => void;
  onNote: (note: string) => void;
  onOmit: () => void;
};

export default function QuestionField({ question: q, index, answer, note, onAnswer, onNote, onOmit }: Props) {
  const descriptionId = `${q.id}-description`;
  const classificationId = `${q.id}-classification`;
  const warningId = `${q.id}-warning`;
  const describedBy = [descriptionId, classificationId, ...(q.warning ? [warningId] : [])].join(' ');
  return (
    <fieldset className="question" aria-describedby={describedBy}>
      <legend><span className="question-number">{String(index + 1).padStart(2, '0')}</span><span>{q.title}</span></legend>
      <p id={descriptionId}>{q.description}</p>
      <div id={classificationId} className="question-kind">
        {q.classification === 'derecho' ? 'DERECHO RECONOCIDO' : q.classification === 'información clínica' ? 'INFORMACIÓN CLÍNICA' : 'PREFERENCIA PERSONAL'}
        {q.references.map(id => {
          const source = sourceById[id];
          return source ? <a href={source.url} target="_blank" rel="noreferrer" key={id}> · {source.title} ↗</a> : null;
        })}
      </div>
      {q.warning && <p id={warningId} className="notice">{q.warning}</p>}
      {q.kind === 'text' ? (
        <div className="options">
          <label className="sr-only" htmlFor={`${q.id}-answer`}>{q.title}</label>
          <textarea id={`${q.id}-answer`} aria-describedby={describedBy} rows={4} maxLength={1000}
            value={answer?.kind === 'text' ? answer.value : ''}
            onChange={event => onAnswer(event.target.value ? { kind: 'text', value: event.target.value } : undefined)} />
        </div>
      ) : (
        <div className="options">{q.options.map(option => {
          const selected = answer?.kind === 'single' ? answer.value === option.id : answer?.kind === 'multiple' ? answer.value.includes(option.id) : false;
          return <label key={option.id} className={`option ${selected ? 'selected' : ''}`}>
            <input type={q.kind === 'multiple' ? 'checkbox' : 'radio'} name={q.id} value={option.id}
              checked={selected} aria-describedby={describedBy}
              onChange={() => {
                if (q.kind === 'multiple') {
                  const existing = answer?.kind === 'multiple' ? answer.value : [];
                  const values = selected ? existing.filter(v => v !== option.id) : option.exclusive ? [option.id]
                    : [...existing.filter(v => !q.options.find(o => o.id === v)?.exclusive), option.id];
                  onAnswer(values.length ? { kind: 'multiple', value: values } : undefined);
                } else {
                  onAnswer({ kind: 'single', value: option.id });
                }
              }} />
            <span>{option.label}</span>
          </label>;
        })}</div>
      )}
      {(answer || note.trim()) && <button type="button" className="small-link" onClick={onOmit}>Borrar respuesta y observación</button>}
      <details className="notes">
        <summary>Agregar una observación</summary>
        <label><span className="sr-only">Observación para {q.title}</span>
          <textarea aria-describedby={describedBy} maxLength={1000} rows={3} value={note}
            onChange={event => onNote(event.target.value)} placeholder="Escribí aquí lo que quieras agregar…" />
        </label>
      </details>
    </fieldset>
  );
}
