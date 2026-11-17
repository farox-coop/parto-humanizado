import { answerRemainingQuestions } from './answer-questions';
import { test, expect, type Download } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const key = 'parto-respetado-draft';
const continuity = 'Podés cerrar esta página y continuar más tarde desde el mismo navegador.';

async function pdfText(download: Download) {
  const task = pdfjs.getDocument({ data: new Uint8Array(await readFile((await download.path())!)), useSystemFonts: true });
  const document = await task.promise;
  let result = '';
  for (let number = 1; number <= document.numPages; number++) {
    const content = await (await document.getPage(number)).getTextContent();
    result += content.items.map(item => 'str' in item ? item.str : '').join(' ');
  }
  await task.destroy();
  return result;
}

test('guarda datos, respuestas y paso; permite cerrar y retomar en el mismo navegador', async ({ context, page }, testInfo) => {
  await page.goto('/plan/');
  await expect(page.getByRole('heading', { name: 'Tu plan de parto' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('progreso-desktop.png') });
  const progress = page.getByRole('progressbar', { name: 'Progreso del plan de parto' });
  const status = page.locator('.save-status-label');
  await expect(page.getByRole('heading', { name: 'Tu plan de parto' })).toBeVisible();
  await expect(page.getByText('Tu progreso queda en este dispositivo')).toBeVisible();
  const privacyDetails = page.locator('.local-storage-notice');
  await expect(privacyDetails).not.toHaveAttribute('open', '');
  await privacyDetails.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Tu progreso se guarda automáticamente en este navegador para que puedas continuar más tarde.', { exact: false })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(privacyDetails).not.toHaveAttribute('open', '');
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(status).toHaveText(/Todavía no hay cambios guardados/);
  await expect(page.getByText(continuity)).toHaveCount(0);
  await page.getByLabel('Nombre y apellido').fill('Nombre guardado');
  await expect(status).toHaveText(/Guardado en este dispositivo/);
  await expect(page.getByText(continuity)).toBeVisible();
  await page.getByRole('button', { name: /Siguiente/ }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '2');
  const question = page.getByRole('group', { name: /Querés estar acompañada/ });
  await question.getByLabel('Sí, me gustaría solicitarlo').check();
  await page.getByRole('button', { name: /Siguiente/ }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '3');
  await page.close();
  const resumed = await context.newPage();
  await resumed.goto('/plan/');
  await expect(resumed.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  await expect(resumed.locator('.save-status-label')).toHaveText(/Guardado en este dispositivo/);
  await resumed.getByRole('button', { name: /Anterior/ }).click();
  await expect(resumed.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  const resumedQuestion = resumed.getByRole('group', { name: /Querés estar acompañada/ });
  await expect(resumedQuestion.getByLabel('Sí, me gustaría solicitarlo')).toBeChecked();
  await resumedQuestion.getByLabel('Prefiero conversarlo con el equipo de salud').check();
  await expect(resumed.locator('.save-status-label')).toHaveText(/Guardado en este dispositivo/);
  await resumed.reload();
  await expect(resumed.getByRole('group', { name: /Querés estar acompañada/ }).getByLabel('Prefiero conversarlo con el equipo de salud')).toBeChecked();
  await resumed.getByRole('button', { name: /Anterior/ }).click();
  await expect(resumed.getByLabel('Nombre y apellido')).toHaveValue('Nombre guardado');
  await resumed.close();
});

test('previsualizar y descargar conserva el borrador; permite editar y obtener un PDF nuevo sin transmitir datos', async ({ page, baseURL }) => {
  const appOrigin = new URL(baseURL!).origin;
  const privateMarkers = ['MARCADOR_NOMBRE', 'MARCADOR_NOTA'];
  const leaks: string[] = [];
  page.on('request', request => {
    const url = request.url();
    if (/^https?:/.test(url) && new URL(url).origin !== appOrigin) leaks.push('origen externo');
    const value = `${decodeURIComponent(url)} ${request.postData() ?? ''} ${request.headers().referer ?? ''}`;
    if (privateMarkers.some(marker => value.includes(marker))) leaks.push('dato personal');
  });
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('MARCADOR_NOMBRE');
  await page.getByRole('button', { name: /Siguiente/ }).click();
  const question = page.getByRole('group', { name: /Querés estar acompañada/ });
  await question.getByLabel('Sí, me gustaría solicitarlo').check();
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await page.getByLabel('Observaciones personales').fill('MARCADOR_NOTA');
  await answerRemainingQuestions(page);
  const before = await page.evaluate(storageKey => localStorage.getItem(storageKey), key);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Ver PDF' }).click();
  const popup = await popupPromise;
  const opened = await Promise.any([
    popup.waitForURL(/^blob:/, { timeout: 15000 }).then(() => 'view' as const),
    popup.waitForEvent('download', { timeout: 15000 }).then(download => download),
  ]);
  if (opened !== 'view') expect(await pdfText(opened)).toContain('MARCADOR_NOMBRE');
  await popup.close();
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBe(before);
  const firstDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar mi plan' }).click();
  const first = await pdfText(await firstDownload);
  expect(first).toContain('Solicito estar acompañada');
  expect(first).toContain('MARCADOR_NOMBRE');
  expect(first).toContain('MARCADOR_NOTA');
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBe(before);
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '7');
  await page.getByRole('button', { name: 'Editar →' }).first().click();
  await page.getByRole('group', { name: /Querés estar acompañada/ }).getByLabel('No deseo acompañamiento').check();
  await page.getByRole('button', { name: /Revisión final/ }).click();
  const secondDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar mi plan' }).click();
  const second = await pdfText(await secondDownload);
  expect(second).toContain('No deseo estar acompañada');
  expect(second).not.toContain('Solicito estar acompañada');
  expect(second).toContain('MARCADOR_NOTA');
  expect(second).not.toBe(first);
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '7');
  await expect(page.locator('.document-preview')).toContainText('No deseo estar acompañada');
  await expect(page.getByLabel('Observaciones personales')).toHaveValue('MARCADOR_NOTA');
  expect(leaks).toEqual([]);
});

test('un fallo de escritura no muestra éxito y permite seguir durante la sesión', async ({ page }) => {
  await page.addInitScript(storageKey => {
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === storageKey) throw new DOMException('Bloqueado', 'QuotaExceededError');
      return originalSet.call(this, name, value);
    };
  }, key);
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Solo en memoria');
  await expect(page.locator('.save-status-label')).toHaveText(/No se pudo guardar el progreso/);
  await expect(page.getByText(continuity)).toHaveCount(0);
  await expect(page.getByText('Guardado en este dispositivo')).toHaveCount(0);
  await page.getByRole('button', { name: /Siguiente/ }).click();
  await page.getByRole('group', { name: /Querés estar acompañada/ }).getByLabel('Sí, me gustaría solicitarlo').check();
  await page.getByRole('button', { name: /Anterior/ }).click();
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('Solo en memoria');
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBeNull();
});

test('un fallo de lectura no sobrescribe un borrador y conserva el trabajo en memoria al recuperar acceso', async ({ page }) => {
  await page.addInitScript(storageKey => {
    const existing = { schemaVersion: 1, contentVersion: 1, personal: { name: 'Borrador anterior', dni: '', dueDate: '', institution: '', companion: '', date: '2026-11-17' }, answers: {}, notes: {}, observations: '', step: 0 };
    localStorage.setItem(storageKey, JSON.stringify(existing));
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    const state = window as unknown as { blockRead: boolean; writes: number };
    state.blockRead = true; state.writes = 0;
    Storage.prototype.getItem = function (name) {
      if (name === storageKey && state.blockRead) throw new DOMException('Bloqueado', 'SecurityError');
      return originalGet.call(this, name);
    };
    Storage.prototype.setItem = function (name, value) {
      if (name === storageKey) state.writes++;
      return originalSet.call(this, name, value);
    };
  }, key);
  await page.goto('/plan/');
  await expect(page.locator('.save-status-label')).toHaveText(/No se pudo guardar el progreso/);
  await page.getByLabel('Nombre y apellido').fill('Trabajo en memoria');
  expect(await page.evaluate(() => (window as unknown as { writes: number }).writes)).toBe(0);
  await page.evaluate(() => { (window as unknown as { blockRead: boolean }).blockRead = false; });
  await page.getByLabel('Hospital o clínica').fill('Hospital de prueba');
  await expect(page.getByRole('alert').filter({ hasText: 'Hay otro borrador guardado' })).toBeVisible();
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('Trabajo en memoria');
  expect(JSON.parse((await page.evaluate(storageKey => localStorage.getItem(storageKey), key))!).personal.name).toBe('Borrador anterior');
  expect(await page.evaluate(() => (window as unknown as { writes: number }).writes)).toBe(0);
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await answerRemainingQuestions(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar mi plan' }).click();
  expect(await pdfText(await download)).toContain('Trabajo en memoria');
  expect(JSON.parse((await page.evaluate(storageKey => localStorage.getItem(storageKey), key))!).personal.name).toBe('Borrador anterior');
});

test('cancela y confirma el borrado sin afectar datos ajenos', async ({ page }) => {
  await page.goto('/plan/');
  await page.evaluate(() => localStorage.setItem('dato-ajeno', 'conservar'));
  await page.getByLabel('Nombre y apellido').fill('Conservar hasta confirmar');
  await page.getByRole('button', { name: 'Borrar mis datos', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('Conservar hasta confirmar');
  await expect(page.locator('.save-status-label')).toHaveText(/Guardado en este dispositivo/);
  await page.getByRole('button', { name: 'Borrar mis datos', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, borrar mis datos' }).click();
  await expect(page.getByText('Tus datos y el progreso de este navegador se borraron.')).toBeVisible();
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('');
  await expect(page.locator('.save-status-label')).toHaveText(/Todavía no hay cambios guardados/);
  await expect(page.getByText(continuity)).toHaveCount(0);
  await page.waitForTimeout(500);
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('dato-ajeno'))).toBe('conservar');
});

test('un esquema incompatible permanece intacto y no indica guardado', async ({ page }) => {
  await page.addInitScript(storageKey => localStorage.setItem(storageKey, JSON.stringify({ schemaVersion: 999, personal: { name: 'Anterior' } })), key);
  await page.goto('/plan/');
  await expect(page.getByRole('alert').filter({ hasText: 'No pudimos recuperar el borrador' })).toBeVisible();
  await expect(page.locator('.save-status-label')).toHaveText(/No se pudo guardar el progreso/);
  const old = await page.evaluate(storageKey => localStorage.getItem(storageKey), key);
  await page.getByLabel('Nombre y apellido').fill('En memoria');
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBe(old);
  await expect(page.getByText(continuity)).toHaveCount(0);
});

test('móvil, teclado, diálogo, estado y movimiento reducido son accesibles', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = window.scrollTo.bind(window);
    window.scrollTo = ((first: number | ScrollToOptions, second?: number) => {
      if (typeof first === 'object') {
        (window as unknown as { lastScrollBehavior?: ScrollBehavior }).lastScrollBehavior = first.behavior;
        original(first);
      } else original(first, second ?? 0);
    }) as typeof window.scrollTo;
  });
  await page.goto('/plan/');
  const progress = page.getByRole('progressbar');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Paso 1 de 7');
  await page.screenshot({ path: testInfo.outputPath('progreso-mobile.png') });
  expect(await page.locator('.progress-track > span').evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(axe.violations.filter(issue => issue.impact === 'critical' || issue.impact === 'serious')).toEqual([]);
  await page.getByRole('button', { name: /Siguiente/ }).click();
  expect(await page.evaluate(() => (window as unknown as { lastScrollBehavior?: ScrollBehavior }).lastScrollBehavior)).toBe('auto');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Paso 2 de 7');
  const deleteButton = page.getByRole('button', { name: 'Borrar mis datos', exact: true });
  await deleteButton.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: '¿Borrar tus datos?' });
  await expect(dialog).toBeVisible();
  const cancel = dialog.getByRole('button', { name: 'Cancelar' });
  const confirm = dialog.getByRole('button', { name: 'Sí, borrar mis datos' });
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(confirm).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(deleteButton).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});


test('si falla el borrado se informa en el diálogo y se conservan los datos', async ({ page }) => {
  await page.addInitScript(storageKey => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (name) {
      if (name === storageKey) throw new DOMException('Bloqueado', 'SecurityError');
      return original.call(this, name);
    };
  }, key);
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Dato conservado');
  const saved = await page.evaluate(storageKey => localStorage.getItem(storageKey), key);
  await page.getByRole('button', { name: 'Borrar mis datos', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '¿Borrar tus datos?' });
  await dialog.getByRole('button', { name: 'Sí, borrar mis datos' }).click();
  await expect(dialog.getByRole('alert')).toHaveText('No pudimos borrar los datos de este navegador. Intentá nuevamente.');
  await expect(page.getByText('Tus datos y el progreso de este navegador se borraron.')).toHaveCount(0);
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBe(saved);
  await dialog.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('Dato conservado');
});
