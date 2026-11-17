import type { SourceReference } from '@/types';
const law = 'https://www.argentina.gob.ar/normativa/nacional/98805/texto';
const decree = 'https://www.argentina.gob.ar/normativa/nacional/decreto-2035-2015-252755/texto';
export const sources: SourceReference[] = [
  { id: 'ley2a', title: 'Ley 25.929, art. 2 inc. a', url: law, article: 'art. 2 inc. a', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley2b', title: 'Ley 25.929, art. 2 inc. b', url: law, article: 'art. 2 inc. b', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley2d', title: 'Ley 25.929, art. 2 inc. d y e', url: law, article: 'art. 2 inc. d y e', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley2g', title: 'Ley 25.929, art. 2 inc. g', url: law, article: 'art. 2 inc. g', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley2h', title: 'Ley 25.929, art. 2 inc. h', url: law, article: 'art. 2 inc. h', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley2i', title: 'Ley 25.929, art. 2 inc. i y j', url: law, article: 'art. 2 inc. i y j', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley3', title: 'Ley 25.929, art. 3', url: law, article: 'art. 3', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'ley4', title: 'Ley 25.929, art. 4', url: law, article: 'art. 4', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'decreto2a', title: 'Decreto 2035/2015, anexo I, art. 2 inc. a', url: decree, article: 'anexo I, art. 2 inc. a', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'decreto2d', title: 'Decreto 2035/2015, anexo I, art. 2 inc. d', url: decree, article: 'anexo I, art. 2 inc. d', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'decreto2g', title: 'Decreto 2035/2015, anexo I, art. 2 inc. g', url: decree, article: 'anexo I, art. 2 inc. g', consulted: '2026-11-17', status: 'verificado en fuente' },
  { id: 'decreto2h', title: 'Decreto 2035/2015, anexo I, art. 2 inc. h', url: decree, article: 'anexo I, art. 2 inc. h', consulted: '2026-11-17', status: 'verificado en fuente' },
];
export const sourceById = Object.fromEntries(sources.map(s => [s.id, s]));
