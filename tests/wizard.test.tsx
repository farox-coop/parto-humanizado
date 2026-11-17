// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import QuestionField from '@/components/wizard/QuestionField';
import { useDraft, DRAFT_STORAGE_KEY } from '@/hooks/useDraft';
import { usePlanPdf } from '@/hooks/usePlanPdf';
import { emptyDraft } from '@/lib/schema';
import { composePlan } from '@/lib/compose';
import { questions } from '@/data/questions';
import type { Answer, QuestionDefinition } from '@/types';

const { createPdf } = vi.hoisted(() => ({ createPdf: vi.fn() }));
vi.mock('@/lib/pdf/Document', () => ({ createPdf }));
const makeUrl = vi.fn(() => 'blob:test');
const revokeUrl = vi.fn();

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.spyOn(window, 'open').mockReturnValue(null);
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: makeUrl });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeUrl });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

describe('generación cancelable del PDF', () => {
  it('abre una pestaña al iniciar y la dirige al PDF al terminar', async () => {
    const pending = deferred<Blob>();
    createPdf.mockReturnValueOnce(pending.promise);
    const tab = { opener: window, closed: false, close: vi.fn(), location: { href: '' } };
    vi.mocked(window.open).mockReturnValueOnce(tab as unknown as Window);
    const { result } = renderHook(() => usePlanPdf());
    let work!: Promise<void>;
    act(() => { work = result.current.generate(composePlan(emptyDraft(), questions), false, () => true); });
    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(tab.opener).toBeNull();
    await act(async () => { pending.resolve(new Blob(['pdf'])); await work; });
    expect(tab.location.href).toBe('blob:test');
    expect(result.current.showPdf).toBe(false);
    expect(tab.close).not.toHaveBeenCalled();
  });
  it('ofrece un enlace si el navegador bloquea la pestaña', async () => {
    createPdf.mockResolvedValueOnce(new Blob(['pdf']));
    const { result } = renderHook(() => usePlanPdf());
    await act(async () => { await result.current.generate(composePlan(emptyDraft(), questions), false, () => true); });
    expect(result.current.showPdf).toBe(true);
    expect(result.current.pdfUrl).toBe('blob:test');
  });

  it.each(['borrar o editar', 'desmontar'])('descarta el resultado pendiente al %s', async reason => {
    const pending = deferred<Blob>();
    createPdf.mockReturnValueOnce(pending.promise);
    const { result, unmount } = renderHook(() => usePlanPdf());
    let work!: Promise<void>;
    act(() => { work = result.current.generate(composePlan(emptyDraft(), questions), true, () => true); });
    await waitFor(() => expect(createPdf).toHaveBeenCalledOnce());
    if (reason === 'desmontar') unmount();
    else act(() => result.current.invalidate());
    await act(async () => { pending.resolve(new Blob(['pdf'])); await work; });
    expect(makeUrl).not.toHaveBeenCalled();
    if (reason !== 'desmontar') {
      expect(result.current.busy).toBe(false);
      expect(result.current.downloaded).toBe(false);
      expect(result.current.pdfUrl).toBe('');
    }
  });
  it('una operación anterior no reemplaza la vista ni el estado de una generación nueva', async () => {
    const first = deferred<Blob>(); const second = deferred<Blob>();
    createPdf.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const { result } = renderHook(() => usePlanPdf());
    let a!: Promise<void>; let b!: Promise<void>;
    act(() => { a = result.current.generate(composePlan(emptyDraft(), questions), false, () => true); });
    await waitFor(() => expect(createPdf).toHaveBeenCalledTimes(1));
    act(() => { result.current.invalidate(); b = result.current.generate(composePlan(emptyDraft(), questions), false, () => true); });
    await waitFor(() => expect(createPdf).toHaveBeenCalledTimes(2));
    await act(async () => { first.resolve(new Blob(['old'])); await a; });
    expect(result.current.busy).toBe(true);
    expect(makeUrl).not.toHaveBeenCalled();
    await act(async () => { second.resolve(new Blob(['new'])); await b; });
    expect(makeUrl).toHaveBeenCalledTimes(1);
    expect(result.current.showPdf).toBe(true);
    act(() => result.current.invalidate());
    expect(revokeUrl).toHaveBeenCalledWith('blob:test');
  });
});

describe('borrado entre pestañas', () => {
  it.each([true, false])('no restaura un borrador eliminado, con evento recibido: %s', async withEvent => {
    const draft = emptyDraft(); draft.personal.name = 'Nombre anterior';
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    const onExternalChange = vi.fn();
    const { result } = renderHook(() => useDraft(onExternalChange));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.draft.personal.name).toBe('Nombre anterior');
    act(() => {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      if (withEvent) window.dispatchEvent(new StorageEvent('storage', { key: DRAFT_STORAGE_KEY, newValue: null }));
      else expect(result.current.replace({ ...draft, observations: 'Edición obsoleta' })).toBe(false);
    });
    expect(result.current.draft.personal.name).toBe('');
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
    expect(onExternalChange).toHaveBeenCalledOnce();
  });
});

const textQuestion: QuestionDefinition = {
  id: 'texto-prueba', step: 'entorno', order: 0, title: '¿Qué preferencia querés compartir?',
  description: 'Explicación asociada al campo.', warning: 'Condición importante.', kind: 'text',
  options: [], classification: 'preferencia', references: [], optional: true, version: 1,
};
function TextQuestion() {
  const [answer, setAnswer] = useState<Answer>();
  const [note, setNote] = useState('');
  return <QuestionField question={textQuestion} index={0} answer={answer} note={note}
    onAnswer={setAnswer} onNote={setNote} onOmit={() => { setAnswer(undefined); setNote(''); }} />;
}

describe('campo de pregunta accesible', () => {
  it('permite responder, editar y omitir texto y observaciones', () => {
    render(<TextQuestion />);
    const field = screen.getByLabelText(textQuestion.title);
    expect(field).toHaveAccessibleDescription(/Explicación asociada.*Condición importante/);
    fireEvent.change(field, { target: { value: 'Mi preferencia' } });
    expect(field).toHaveValue('Mi preferencia');
    fireEvent.change(field, { target: { value: 'Mi preferencia editada' } });
    fireEvent.change(screen.getByLabelText(`Observación para ${textQuestion.title}`), { target: { value: 'Mi nota' } });
    fireEvent.click(screen.getByRole('button', { name: 'Borrar respuesta y observación' }));
    expect(field).toHaveValue('');
    expect(screen.getByLabelText(`Observación para ${textQuestion.title}`)).toHaveValue('');
  });
  it('asocia explicación, clasificación y condiciones a los grupos y sus opciones', () => {
    const question = { ...questions[0], warning: 'Una condición visible.' };
    render(<QuestionField question={question} index={0} note="" onAnswer={vi.fn()} onNote={vi.fn()} onOmit={vi.fn()} />);
    expect(screen.getByRole('group', { name: /Querés estar acompañada/ })).toHaveAccessibleDescription(/La ley reconoce.*DERECHO RECONOCIDO.*Una condición visible/);
    expect(screen.getByLabelText('Sí, me gustaría solicitarlo')).toHaveAccessibleDescription(/La ley reconoce.*Una condición visible/);
  });
});

describe('persistencia y estado de guardado', () => {
  it('recupera respuestas, datos y paso al volver a montar el asistente', async () => {
    const first = renderHook(() => useDraft(vi.fn()));
    await waitFor(() => expect(first.result.current.ready).toBe(true));
    expect(first.result.current.storage).toBe('idle');
    const draft = { ...first.result.current.draft, step: 3, personal: { ...first.result.current.draft.personal, name: 'Nombre de prueba' }, answers: { cordon: { kind: 'single' as const, value: 'si' } } };
    act(() => expect(first.result.current.replace(draft)).toBe(true));
    expect(first.result.current.storage).toBe('saved');
    first.unmount();
    const second = renderHook(() => useDraft(vi.fn()));
    await waitFor(() => expect(second.result.current.ready).toBe(true));
    expect(second.result.current.storage).toBe('saved');
    expect(second.result.current.draft).toEqual(draft);
  });

  it('permite continuar si falla la escritura y confirma el guardado solo cuando se recupera', async () => {
    const originalSet = Storage.prototype.setItem;
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === DRAFT_STORAGE_KEY) throw new DOMException('Bloqueado', 'QuotaExceededError');
      return originalSet.call(this, key, value);
    });
    const { result } = renderHook(() => useDraft(vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));
    act(() => result.current.replace({ ...result.current.draft, personal: { ...result.current.draft.personal, name: 'En memoria' } }));
    expect(result.current.storage).toBe('failed');
    act(() => result.current.replace({ ...result.current.draft, step: 2 }));
    expect(result.current.draft.personal.name).toBe('En memoria');
    expect(result.current.draft.step).toBe(2);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
    setSpy.mockRestore();
    act(() => result.current.replace({ ...result.current.draft, observations: 'Guardado luego' }));
    expect(result.current.storage).toBe('saved');
    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!).personal.name).toBe('En memoria');
    act(() => expect(result.current.clear()).toBe(true));
    expect(result.current.storage).toBe('idle');
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('no sobrescribe un borrador previo si falla la lectura y luego recupera acceso', async () => {
    const previous = emptyDraft(); previous.personal.name = 'Anterior';
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(previous));
    let blocked = true;
    const originalGet = Storage.prototype.getItem;
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
      if (blocked && key === DRAFT_STORAGE_KEY) throw new DOMException('Bloqueado', 'SecurityError');
      return originalGet.call(this, key);
    });
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useDraft(vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.storage).toBe('failed');
    act(() => result.current.replace({ ...result.current.draft, personal: { ...result.current.draft.personal, name: 'Sesión actual' } }));
    expect(setSpy).not.toHaveBeenCalled();
    expect(result.current.draft.personal.name).toBe('Sesión actual');
    blocked = false;
    act(() => result.current.synchronize());
    expect(result.current.storage).toBe('conflict');
    act(() => result.current.replace({ ...result.current.draft, observations: 'Cambio adicional' }));
    expect(result.current.draft.personal.name).toBe('Sesión actual');
    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!).personal.name).toBe('Anterior');
    expect(setSpy).not.toHaveBeenCalled();
    getSpy.mockRestore(); setSpy.mockRestore();
  });

  it('si falla el borrado, conserva el borrador e informa el fallo', async () => {
    const draft = emptyDraft(); draft.personal.name = 'No borrar';
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    const { result } = renderHook(() => useDraft(vi.fn()));
    await waitFor(() => expect(result.current.ready).toBe(true));
    const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new DOMException('Bloqueado', 'SecurityError'); });
    act(() => expect(result.current.clear()).toBe(false));
    expect(result.current.storage).toBe('failed');
    expect(result.current.draft.personal.name).toBe('No borrar');
    expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!).personal.name).toBe('No borrar');
    remove.mockRestore();
  });
});
