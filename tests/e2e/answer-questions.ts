import { expect, type Page } from '@playwright/test';

/** Completa explícitamente las preguntas restantes mediante la interfaz para los casos que generan PDF. */
export async function answerRemainingQuestions(page: Page) {
  const progress = page.getByRole('progressbar', { name: 'Progreso del plan de parto' });
  while (Number(await progress.getAttribute('aria-valuenow')) > 2) await page.getByRole('button', { name: /Anterior/ }).click();
  if (Number(await progress.getAttribute('aria-valuenow')) === 1) await page.getByRole('button', { name: /Siguiente/ }).click();
  for (let step = 0; step < 5; step++) {
    for (const group of await page.locator('fieldset.question').all()) {
      if (await group.locator('input:checked').count() === 0) await group.getByLabel('No tengo una preferencia particular').check();
    }
    await page.getByRole('button', { name: /Siguiente/ }).click();
  }
  await expect(progress).toHaveAttribute('aria-valuenow', '7');
}
