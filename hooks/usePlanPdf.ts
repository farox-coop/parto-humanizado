'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlanDocument } from '@/types';

export function usePlanPdf() {
  const [busy, setBusy] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState('');
  const operation = useRef(0);
  const cache = useRef<{ plan: PlanDocument; url: string } | null>(null);
  const pendingTab = useRef<Window | null>(null);

  const dispose = useCallback(() => {
    operation.current += 1;
    pendingTab.current?.close();
    pendingTab.current = null;
    if (cache.current) URL.revokeObjectURL(cache.current.url);
    cache.current = null;
  }, []);

  const invalidate = useCallback(() => {
    dispose();
    setBusy(false);
    setPdfUrl('');
    setShowPdf(false);
    setDownloaded(false);
    setError('');
  }, [dispose]);

  useEffect(() => dispose, [dispose]);

  async function generate(plan: PlanDocument, download: boolean, isCurrent: () => boolean) {
    const ticket = ++operation.current;
    let tab: Window | null = null;
    if (!download) {
      try {
        tab = window.open('', '_blank');
        if (tab) { tab.opener = null; pendingTab.current = tab; }
      } catch { tab = null; }
    }
    const current = () => ticket === operation.current && isCurrent();
    setBusy(true);
    setError('');
    try {
      let url = cache.current?.plan === plan ? cache.current.url : '';
      if (!url) {
        const { createPdf } = await import('@/lib/pdf/Document');
        if (!current()) return;
        const blob = await createPdf(plan);
        if (!current()) return;
        if (cache.current) URL.revokeObjectURL(cache.current.url);
        url = URL.createObjectURL(blob);
        cache.current = { plan, url };
        setPdfUrl(url);
      }
      if (!current()) return;
      if (download) {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'plan-de-parto.pdf';
        link.click();
        setDownloaded(true);
      } else if (tab && !tab.closed) {
        tab.location.href = url;
        if (pendingTab.current === tab) pendingTab.current = null;
      } else {
        setShowPdf(true);
      }
    } catch (cause) {
      if (!current()) return;
      setError(cause instanceof Error && cause.name === 'FontCoverageError'
        ? cause.message
        : 'No pudimos generar el PDF. Probá nuevamente. Tus respuestas siguen disponibles.');
    } finally {
      if (pendingTab.current === tab && tab) { tab.close(); pendingTab.current = null; }
      if (ticket === operation.current) setBusy(false);
    }
  }

  return { busy, pdfUrl, showPdf, downloaded, error, invalidate, generate };
}
