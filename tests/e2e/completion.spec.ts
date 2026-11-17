import { test, expect } from '@playwright/test';
import { answerRemainingQuestions } from './answer-questions';

test('permite avanzar, muestra secciones pendientes y exige respuestas explícitas para el PDF', async ({ page }) => {
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Nombre de prueba');
  await page.getByRole('button', { name: /Siguiente/ }).click();
  const first = page.getByRole('group', { name: /Querés estar acompañada/ });
  await expect(first.locator('input:checked')).toHaveCount(0);
  const sidebar = page.locator('.wizard-aside');
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ })).toContainText('Pendiente');
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ }).locator('.aside-step-marker')).toHaveClass(/step-pending/);
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ }).locator('.aside-step-marker')).toHaveText('02');
  for (const group of await page.locator('fieldset.question').all()) {
    await group.getByLabel('No tengo una preferencia particular').check();
  }
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ })).toContainText('Completa');
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ }).locator('.aside-step-marker')).toHaveClass(/step-complete/);
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ }).locator('.aside-step-marker')).toHaveText('02');
  await page.getByRole('button', { name: /Siguiente/ }).click();
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await expect(page.getByText(/preguntas pendientes/).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Descargar mi plan' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Ver PDF' })).toBeDisabled();
  await page.getByRole('button', { name: 'Ir a la primera sección pendiente →' }).click();
  await expect(page.getByRole('heading', { name: 'Trabajo de parto.' })).toBeFocused();
  await page.getByRole('button', { name: /Acompañamiento y entorno/ }).click();
  await first.getByRole('button', { name: 'Borrar respuesta y observación' }).click();
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ })).toContainText('Pendiente');
  await page.reload();
  await expect(sidebar.getByRole('button', { name: /Acompañamiento y entorno/ })).toContainText('Pendiente');
  await expect(page.getByRole('group', { name: /Querés estar acompañada/ }).locator('input:checked')).toHaveCount(0);
});


test('informa juntos los datos generales y las preguntas pendientes', async ({ page }) => {
  await page.goto('/plan/');
  await page.getByRole('button', { name: /Revisión final/ }).click();
  const notice = page.locator('#pdf-requirements');
  await expect(notice).toContainText('tu nombre y apellido');
  await expect(notice).toContainText('preguntas pendientes');
  await expect(notice).not.toContainText('Este documento es una plantilla personalizable');
  await expect(page.locator('.document-guidance')).toContainText('Este documento es una plantilla personalizable');
  await expect(notice.getByRole('button', { name: 'Ir a datos generales →' })).toBeVisible();
  await expect(notice.getByRole('button', { name: 'Ir a la primera sección pendiente →' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Descargar mi plan' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Ver PDF' })).toBeDisabled();
  await notice.getByRole('button', { name: 'Ir a datos generales →' }).click();
  await page.getByLabel('Nombre y apellido').fill('Nombre de prueba');
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await expect(notice).toContainText('preguntas pendientes');
  await expect(notice).not.toContainText('completá tu nombre y apellido');
  await expect(page.getByRole('button', { name: 'Ver PDF' })).toBeDisabled();
});


test('habilita ambos botones al completar el plan y los vuelve a inhabilitar si falta una respuesta', async ({ page }) => {
  await page.goto('/plan/');
  await page.getByLabel('Nombre y apellido').fill('Nombre de prueba');
  await answerRemainingQuestions(page);
  const download = page.getByRole('button', { name: 'Descargar mi plan' });
  const preview = page.getByRole('button', { name: 'Ver PDF' });
  await expect(download).toBeEnabled();
  await expect(preview).toBeEnabled();
  await expect(page.getByText('Tu plan de parto está listo.')).toHaveCount(0);
  const textPreview = page.locator('.preview-disclosure');
  await expect(textPreview).not.toHaveAttribute('open', '');
  await textPreview.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(textPreview.locator('.document-preview')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(textPreview).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Editar →' }).first().click();
  await page.getByRole('group', { name: /Querés estar acompañada/ }).getByRole('button', { name: 'Borrar respuesta y observación' }).click();
  await page.getByRole('button', { name: /Revisión final/ }).click();
  await expect(download).toBeDisabled();
  await expect(preview).toBeDisabled();
  await expect(page.locator('.ready-notice-pending strong')).toHaveText('Quedan preguntas por responder.');
});
