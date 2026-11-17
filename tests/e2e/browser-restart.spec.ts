import { test, expect, chromium, firefox, webkit } from '@playwright/test';

test('recupera el borrador después de cerrar y abrir el navegador', async ({ browserName, baseURL }, testInfo) => {
  const browserType = { chromium, firefox, webkit }[browserName];
  const profile = testInfo.outputPath('perfil-aislado');
  const url = new URL('/plan/', baseURL!).toString();
  const first = await browserType.launchPersistentContext(profile, { headless: true });
  try {
    const page = first.pages()[0] ?? await first.newPage();
    await page.goto(url);
    await page.getByLabel('Nombre y apellido').fill('Nombre entre sesiones');
    await page.getByRole('button', { name: /Siguiente/ }).click();
    await page.getByRole('group', { name: /Querés estar acompañada/ }).getByLabel('Sí, me gustaría solicitarlo').check();
    await expect(page.locator('.save-status-label')).toHaveText(/Guardado en este dispositivo/);
  } finally {
    await first.close();
  }
  const second = await browserType.launchPersistentContext(profile, { headless: true });
  try {
    const page = second.pages()[0] ?? await second.newPage();
    await page.goto(url);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    await expect(page.getByRole('group', { name: /Querés estar acompañada/ }).getByLabel('Sí, me gustaría solicitarlo')).toBeChecked();
    await page.getByRole('button', { name: /Anterior/ }).click();
    await expect(page.getByLabel('Nombre y apellido')).toHaveValue('Nombre entre sesiones');
  } finally {
    await second.close();
  }
});
