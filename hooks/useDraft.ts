'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { emptyDraft, validateDraft } from '@/lib/schema';
import type { Draft } from '@/types';

export const DRAFT_STORAGE_KEY = 'parto-respetado-draft';
export type StorageStatus = 'idle' | 'saving' | 'saved' | 'failed' | 'invalid' | 'conflict';

export function useDraft(onExternalChange: () => void) {
  const [draft, dispatch] = useReducer((_: Draft, next: Draft) => next, undefined, emptyDraft);
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState<StorageStatus>('idle');
  const lastRead = useRef<string | null>(null);
  const baselineKnown = useRef(false);
  const readable = useRef(false);
  const unsavedChanges = useRef(false);
  const status = useRef<StorageStatus>('idle');

  const setStatus = useCallback((value: StorageStatus) => {
    status.current = value;
    setStorage(value);
  }, []);

  const restore = useCallback((raw: string | null) => {
    lastRead.current = raw;
    baselineKnown.current = true;
    unsavedChanges.current = false;
    if (raw === null) {
      dispatch(emptyDraft());
      setStatus('idle');
      return;
    }
    try {
      const parsed = validateDraft(JSON.parse(raw));
      if (parsed) {
        dispatch(parsed);
        setStatus('saved');
      } else {
        dispatch(emptyDraft());
        setStatus('invalid');
      }
    } catch {
      dispatch(emptyDraft());
      setStatus('invalid');
    }
  }, [setStatus]);

  // Read the current value, rather than event.newValue: several events can be queued.
  const synchronize = useCallback(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      readable.current = true;
      if (!baselineKnown.current) {
        // After a failed initial read, never replace either a previous draft or
        // unsaved work from this session without an explicit decision.
        if (raw !== null && unsavedChanges.current) {
          baselineKnown.current = true;
          lastRead.current = raw;
          setStatus('conflict');
          return true;
        }
        if (raw !== null) {
          restore(raw);
          onExternalChange();
          return false;
        }
        baselineKnown.current = true;
        lastRead.current = null;
      } else if (raw !== lastRead.current) {
        // A deletion must clear every tab, including any in-memory PDF.
        if (raw === null || !unsavedChanges.current) {
          restore(raw);
          onExternalChange();
          return false;
        }
        // Preserve both a different saved draft and this tab's unsaved work.
        lastRead.current = raw;
        setStatus('conflict');
        onExternalChange();
        return false;
      }
    } catch {
      readable.current = false;
      setStatus('failed');
    }
    return true;
  }, [restore, onExternalChange, setStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        readable.current = true;
        restore(raw);
      } catch {
        readable.current = false;
        setStatus('failed');
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [restore, setStatus]);

  useEffect(() => {
    if (!ready) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === DRAFT_STORAGE_KEY || event.key === null) synchronize();
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') synchronize();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', synchronize);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', synchronize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [ready, synchronize]);

  function replace(next: Draft) {
    // Protect against an edit arriving before the storage event for a remote deletion.
    if (!ready || !synchronize()) return false;
    dispatch(next);
    unsavedChanges.current = true;
    if (!readable.current || status.current === 'invalid' || status.current === 'conflict') return true;
    try {
      const raw = JSON.stringify(next);
      setStatus('saving');
      localStorage.setItem(DRAFT_STORAGE_KEY, raw);
      lastRead.current = raw;
      baselineKnown.current = true;
      unsavedChanges.current = false;
      setStatus('saved');
    } catch {
      setStatus('failed');
    }
    return true;
  }

  function clear() {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      lastRead.current = null;
      baselineKnown.current = true;
      readable.current = true;
      unsavedChanges.current = false;
      dispatch(emptyDraft());
      setStatus('idle');
      return true;
    } catch {
      setStatus('failed');
      return false;
    }
  }

  return { draft, ready, storage, replace, clear, synchronize };
}
