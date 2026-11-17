import { describe, it, expect } from 'vitest';
import { emptyDraft, validateDraft, sourceSchema, questionSchema } from '../lib/schema';
import { composePlan, documentNote } from '../lib/compose';
import { questions, steps } from '../data/questions';
import { sourceById, sources } from '../data/sources';

describe('catálogo',()=>{
 it('tiene IDs únicos, cubre las etapas y enlaza fuentes existentes',()=>{expect(new Set(questions.map(q=>q.id)).size).toBe(questions.length);for(const step of steps)expect(questions.some(q=>q.step===step.id)).toBe(true);for(const source of sources)expect(sourceSchema.safeParse(source).success).toBe(true);for(const q of questions){expect(questionSchema.safeParse(q).success).toBe(true);for(const ref of q.references)expect(sourceById[ref]).toBeDefined();expect(new Set(q.options.map(o=>o.id)).size).toBe(q.options.length);}});
});
describe('composición del documento',()=>{
 it('incluye solicitudes seleccionadas y referencias, omite sin preferencia y no convierte preguntas omitidas',()=>{const draft=emptyDraft();draft.personal.name='Ejemplo de prueba';draft.answers.acompanante={kind:'single',value:'si'};draft.answers.cordon={kind:'single',value:'sin-preferencia'};draft.answers.analgesia={kind:'single',value:'conversar'};const plan=composePlan(draft,questions);const text=plan.sections.flatMap(s=>s.paragraphs.map(p=>p.text)).join(' ');expect(text).toContain('acompañada');expect(text).toContain('conversar');expect(text).not.toContain('pinzamiento');expect(plan.references.map(s=>s.id)).toContain('ley2g');expect(documentNote).toContain('derechos establecidos');});
 it('incluye selecciones múltiples y observaciones, sin duplicar la solicitud de acompañamiento',()=>{const draft=emptyDraft();draft.answers.musica={kind:'multiple',value:['musica','luz']};draft.answers.acompanante={kind:'single',value:'si'};draft.answers['acompanante-posparto']={kind:'single',value:'si'};draft.notes.musica='Un detalle de prueba';draft.observations='Observación general';const plan=composePlan(draft,questions);const text=plan.sections.flatMap(s=>s.paragraphs.map(p=>p.text)).join(' ');expect(text).toContain('música');expect(text).toContain('iluminación');expect(text).toContain('Un detalle de prueba');expect(text.match(/estar acompañada/g)).toHaveLength(1);expect(plan.observations).toBe('Observación general');});
});
describe('persistencia',()=>{
 it('acepta un borrador válido y rechaza datos corruptos o respuestas incompatibles',()=>{const draft=emptyDraft();expect(validateDraft(draft)).not.toBeNull();expect(validateDraft({...draft,step:20})).toBeNull();expect(validateDraft({...draft,answers:{cordon:{kind:'single',value:'inexistente'}}})).toBeNull();expect(validateDraft({...draft,answers:{musica:{kind:'multiple',value:['musica','sin-preferencia']}}})).toBeNull();});
 it('conserva para revisión un borrador con contenido de otra versión',()=>{const draft=emptyDraft();expect(validateDraft({...draft,contentVersion:0,answers:{antigua:{kind:'single',value:'anterior'}}})).not.toBeNull();});
});
