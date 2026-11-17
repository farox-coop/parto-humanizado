import { Font } from '@react-pdf/renderer';
import type { PlanDocument } from '@/types';

export const PDF_FONT_FAMILY = 'Noto Sans';
Font.register({
  family: PDF_FONT_FAMILY,
  fonts: [
    { src: '/fonts/NotoSans-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/NotoSans-Bold.ttf', fontWeight: 700 },
  ],
});

// Never substitute unsupported characters silently in a personal document.
export function unsupportedCharacters(text: string, font: { hasGlyphForCodePoint: (codePoint: number) => boolean }) {
  return [...new Set([...text].filter(character => !/[\r\n\t]/.test(character)
    && !font.hasGlyphForCodePoint(character.codePointAt(0)!)))];
}

export async function assertPdfFontCoverage(plan: PlanDocument) {
  await Promise.all([400, 700].map(fontWeight => Font.load({ fontFamily: PDF_FONT_FAMILY, fontWeight })));
  const text = [
    ...Object.values(plan.personal), plan.observations,
    ...plan.sections.flatMap(section => [section.title, ...section.paragraphs.map(paragraph => paragraph.text)]),
  ].join('\n');
  const fonts = [400, 700].map(fontWeight => Font.getFont({ fontFamily: PDF_FONT_FAMILY, fontWeight }).data);
  if (fonts.some(font => !font)) throw new Error('No se pudo cargar la fuente del PDF.');
  const missing = [...new Set(fonts.flatMap(font => unsupportedCharacters(text, font!)))];
  if (missing.length) {
    const codes = missing.slice(0, 8).map(character => `U+${character.codePointAt(0)!.toString(16).toUpperCase()}`).join(', ');
    const error = new Error(`El PDF no puede representar algunos caracteres (${codes}). No se generó el archivo para evitar alterar tu información. Tus respuestas se conservan para que puedas revisarlas.`);
    error.name = 'FontCoverageError';
    throw error;
  }
}
