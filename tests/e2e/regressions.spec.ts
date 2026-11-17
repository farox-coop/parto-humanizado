import { answerRemainingQuestions } from './answer-questions';
import { test, expect, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function readPdf(download: Download) {
  const file = await download.path();
  const loading = pdfjs.getDocument({ data: new Uint8Array(await readFile(file!)), useSystemFonts: true });
  const document = await loading.promise;
  const pages = [];
  for (let page = 1; page <= document.numPages; page++) {
    const content = await (await document.getPage(page)).getTextContent();
    pages.push(content.items.map(item => 'str' in item ? item.str : '').join(' '));
  }
  await loading.destroy();
  return pages.join('\n');
}

async function enterReview(page: Page, name = 'Nombre de prueba') {
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill(name);
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await answerRemainingQuestions(page);
}

async function downloadPlan(page: Page) {
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar mi plan' }).click();
  return download;
}

test('borrar durante la generación cancela la descarga anterior', async ({ page }) => {
  await enterReview(page, 'Nombre que debe borrarse');
  let release!: () => void;
  let fontRequested!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const requested = new Promise<void>(resolve => { fontRequested = resolve; });
  await page.route('**/fonts/NotoSans-Regular.ttf', async route => {
    fontRequested();
    await held;
    await route.continue();
  });
  await page.getByRole('button', { name: 'Descargar mi plan' }).click();
  await requested;
  await page.getByRole('button', { name: 'Borrar mis datos', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, borrar mis datos' }).click();
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('');
  const fontResponse = page.waitForResponse(response => response.url().endsWith('/fonts/NotoSans-Regular.ttf'));
  const lateDownload = page.waitForEvent('download', { timeout: 2000 }).then(() => true, () => false);
  release();
  await (await fontResponse).finished();
  expect(await lateDownload).toBe(false);
  expect(await page.evaluate(() => localStorage.getItem('parto-respetado-draft'))).toBeNull();
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await expect(page.getByRole('button', { name: 'Descargar mi plan' })).toBeDisabled();
  await expect(page.locator('.document-preview')).not.toContainText('Nombre que debe borrarse');
});

test('el borrado limpia otra pestaña y no restaura el borrador anterior', async ({ context, page }) => {
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Nombre anterior');
  const other = await context.newPage();
  await other.goto('/plan/');
  await expect(other.getByLabel('Nombre y apellido')).toHaveValue('Nombre anterior');
  await page.getByRole('button', { name: 'Borrar mis datos', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, borrar mis datos' }).click();
  await expect(other.getByLabel('Nombre y apellido')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('parto-respetado-draft'))).toBeNull();
  await other.getByLabel('Hospital o clínica').fill('Establecimiento nuevo');
  await expect(page.getByLabel('Hospital o clínica')).toHaveValue('Establecimiento nuevo');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('parto-respetado-draft')!));
  expect(saved.personal.name).toBe('');
  await other.close();
});

test('omitir quita también observaciones y el diálogo usa primera persona', async ({ page }) => {
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Nombre de prueba');
  await page.getByRole('button', { name: /Siguiente/ }).click();
  const question = page.getByRole('group', { name: /Querés estar acompañada/ });
  await question.getByLabel('Sí, me gustaría solicitarlo').check();
  await question.getByText('Agregar una observación').click();
  await question.getByRole('textbox').fill('NOTA-OMITIDA');
  await question.getByRole('button', { name: 'Borrar respuesta y observación' }).click();
  await expect(question.getByRole('textbox')).toHaveValue('');
  await page.getByRole('button', { name: /Nacimiento/ }).click();
  await page.getByRole('group', { name: /pinzamiento tardío/ }).getByLabel('Prefiero conversarlo con el equipo de salud').check();
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await expect(page.locator('.document-preview')).not.toContainText('NOTA-OMITIDA');
  await answerRemainingQuestions(page);
  const text = await readPdf(await downloadPlan(page));
  expect(text).not.toContain('NOTA-OMITIDA');
  expect(text).toContain('Me gustaría conversar con el equipo de salud sobre el momento del pinzamiento');
  expect(text).not.toContain('querés');
});

test('el PDF conserva nombres y observaciones con diacríticos', async ({ page }, testInfo) => {
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Ana Łucía');
  await page.getByLabel('Nombre de tu acompañante').fill('Černý');
  await page.getByLabel('Hospital o clínica').fill('Clínica Żółć');
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await page.getByLabel('Observaciones personales').fill('Prefiero conversar: Ελληνικά Кириллица.');
  await answerRemainingQuestions(page);
  const download = await downloadPlan(page);
  await download.saveAs(testInfo.outputPath('plan-unicode.pdf'));
  const text = await readPdf(download);
  for (const value of ['Ana Łucía', 'Černý', 'Clínica Żółć', 'Ελληνικά Кириллица']) expect(text).toContain(value);
});

test('un carácter sin cobertura informa el problema y permite corregir sin perder datos', async ({ page }) => {
  await enterReview(page, 'Nombre conservado');
  await page.getByLabel('Observaciones personales').fill('字');
  await page.getByRole('button', { name: 'Descargar mi plan' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'El PDF no puede representar' })).toContainText('U+5B57');
  await expect(page.getByRole('alert').filter({ hasText: 'El PDF no puede representar' })).toContainText('No se generó el archivo');
  await expect(page.getByLabel('Observaciones personales')).toHaveValue('字');
  await expect(page.locator('.document-preview')).toContainText('Nombre conservado');
  await page.getByLabel('Observaciones personales').fill('Texto corregido');
  expect(await readPdf(await downloadPlan(page))).toContain('Texto corregido');
});

test('las preguntas exponen su explicación a tecnologías asistivas', async ({ page }) => {
  await page.goto('/plan/');
  await page.getByRole('button', { name: /Siguiente/ }).click();
  const question = page.getByRole('group', { name: /Querés estar acompañada/ });
  await expect(question).toHaveAccessibleDescription(/La ley reconoce el acompañamiento.*DERECHO RECONOCIDO/);
  await expect(question.getByLabel('Sí, me gustaría solicitarlo')).toHaveAccessibleDescription(/La ley reconoce/);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.filter(issue => issue.impact === 'critical' || issue.impact === 'serious')).toEqual([]);
});
