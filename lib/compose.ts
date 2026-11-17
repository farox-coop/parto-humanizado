import { steps } from '@/data/questions';
import { sourceById } from '@/data/sources';
import type { Draft, PlanDocument, QuestionDefinition } from '@/types';
export const documentNote = 'Sobre este documento: Este plan de parto fue elaborado a partir de una plantilla orientativa y refleja las preferencias de quien lo suscribe. Su contenido podrá ser revisado y adaptado mediante el diálogo con el equipo de salud, respetando los derechos establecidos por la legislación vigente y las necesidades clínicas que pudieran presentarse.';
export function composePlan(draft: Draft, catalog: QuestionDefinition[]): PlanDocument {
 const seen = new Set<string>(); const used = new Set<string>();
 const sections = steps.map(step => ({ title: step.title, paragraphs: catalog.filter(q=>q.step===step.id).sort((a,b)=>a.order-b.order).flatMap(q=> {
  const answer=draft.answers[q.id]; if(q.id==='acompanante-posparto' && answer?.kind==='single' && answer.value==='si' && draft.answers.acompanante?.kind==='single' && draft.answers.acompanante.value==='si' && !draft.notes[q.id]?.trim()) return []; const opts=answer?.kind==='single'?[answer.value]:answer?.kind==='multiple'?answer.value:[];
  const texts=opts.map(id=>q.options.find(o=>o.id===id)?.pdf).filter((x):x is string=>Boolean(x));
  if(answer?.kind==='text' && answer.value.trim()) texts.push(answer.value.trim());
  if(draft.notes[q.id]?.trim()) texts.push(`Observación sobre ${q.title.replace(/^¿|\?$/g,'').toLocaleLowerCase('es-AR')}: ${draft.notes[q.id].trim()}`);
  return texts.filter(text=>{if(seen.has(text))return false;seen.add(text);return true;}).map(text=>{const refs=q.references.filter(id=>Boolean(sourceById[id]));refs.forEach(id=>used.add(id));return {text,references:refs};});
 }) })).filter(s=>s.paragraphs.length);
 return {personal:draft.personal,sections,observations:draft.observations.trim(),references:[...used].map(id=>sourceById[id])};
}
