import type { StorageStatus } from '@/hooks/useDraft';

type Props = { step: number; storage: StorageStatus };

export default function WizardProgress({ step, storage }: Props) {
  const current = step + 1;
  const failed = storage === 'failed' || storage === 'invalid' || storage === 'conflict';
  const label = storage === 'saved' ? 'Guardado en este dispositivo'
    : storage === 'saving' ? 'Guardando…'
      : failed ? 'No se pudo guardar el progreso'
        : 'Todavía no hay cambios guardados';
  const detail = storage === 'saved'
    ? 'Podés cerrar esta página y continuar más tarde desde el mismo navegador.'
    : storage === 'saving' ? 'Estamos guardando tus cambios en este navegador.'
      : storage === 'invalid' ? 'El borrador guardado no pudo recuperarse. Podés seguir durante esta sesión.'
        : storage === 'conflict' ? 'Hay otro borrador guardado. Tus cambios de esta sesión no se están guardando.'
          : storage === 'failed' ? 'Podés seguir durante esta sesión, pero tus cambios podrían perderse al cerrar o recargar.'
            : 'Al empezar, intentaremos guardar tus cambios en este navegador.';

  return <div className="wizard-progress">
    <div className="progress-track" role="progressbar" aria-label="Progreso del plan de parto"
      aria-valuemin={1} aria-valuemax={7} aria-valuenow={current} aria-valuetext={`Paso ${current} de 7`}>
      <span style={{ width: `${current / 7 * 100}%` }} />
    </div>
    <div className={`save-status${failed ? ' save-status-error' : ''}`}>
      <div role="status" aria-live="polite" aria-atomic="true" className="save-status-label">
        <span aria-hidden="true">{storage === 'saved' ? '✓' : failed ? '!' : storage === 'saving' ? '◌' : '○'}</span>
        {label}
      </div>
      <p>{detail}</p>
    </div>
  </div>;
}
