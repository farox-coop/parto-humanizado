// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import WizardProgress from '@/components/wizard/WizardProgress';

afterEach(cleanup);
describe('progreso y comunicación del almacenamiento', () => {
  it('expone paso y estado real al avanzar y retroceder', () => {
    const view = render(<WizardProgress step={0} storage="idle" />);
    const bar = screen.getByRole('progressbar', { name: 'Progreso del plan de parto' });
    expect(bar).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByRole('status')).toHaveTextContent('Todavía no hay cambios guardados');
    expect(screen.queryByText(/Podés cerrar esta página/)).not.toBeInTheDocument();
    view.rerender(<WizardProgress step={2} storage="saving" />);
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(screen.getByRole('status')).toHaveTextContent('Guardando…');
    view.rerender(<WizardProgress step={5} storage="saved" />);
    expect(bar).toHaveAttribute('aria-valuenow', '6');
    expect(screen.getByRole('status')).toHaveTextContent('Guardado en este dispositivo');
    expect(screen.getByText(/Podés cerrar esta página/)).toBeInTheDocument();
    view.rerender(<WizardProgress step={1} storage="failed" />);
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByRole('status')).toHaveTextContent('No se pudo guardar el progreso');
    expect(screen.queryByText(/Podés cerrar esta página/)).not.toBeInTheDocument();
  });
  it.each(['invalid', 'conflict'] as const)('nunca confirma guardado cuando el estado es %s', storage => {
    render(<WizardProgress step={0} storage={storage} />);
    expect(screen.getByRole('status')).toHaveTextContent('No se pudo guardar el progreso');
    expect(screen.queryByText(/Podés cerrar esta página/)).not.toBeInTheDocument();
  });
});
