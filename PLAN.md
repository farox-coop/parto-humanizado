# Plan de Parto Respetado — MVP

Plan aprobado en la conversación: aplicación estática Next.js/TypeScript/Tailwind, derechos con fuentes verificables, asistente de siete pasos, persistencia local, vista previa accesible y PDF A4 generado en el navegador. Sin cuentas, base de datos, envío de datos ni integraciones externas. La publicación pública requiere revisión profesional jurídica y clínica.

## Etapas y criterios de aceptación

1. T01–T03: base estática, contratos validados y PDF local multipágina.
2. T04–T08: matriz editorial, diseño accesible, inicio, derechos y catálogo de preguntas por etapas con fuentes.
3. T09–T13: navegación de siete pasos, datos generales, preguntas configurables, persistencia y resumen editable.
4. T14–T17: composición pura, vista previa HTML y PDF, descarga y guía de presentación.
5. T18–T20: pruebas de privacidad, accesibilidad, PDF y flujo; documentación; revisión profesional antes de publicación.

Cada preferencia es opcional. El nombre es obligatorio para descargar. Los datos se guardan solo en el navegador y pueden borrarse con confirmación. El documento debe expresar preferencias sin limitar derechos ni sustituir consentimientos informados. Los contenidos sin verificar deben identificarse como pendientes. No se deben agregar servicios de terceros, seguimiento, cuentas ni funcionalidades fuera de alcance.

## Riesgos y controles

- Contenido jurídico o clínico inexacto: fuentes por afirmación y revisión profesional antes de publicar.
- Pérdida de borrador: validar versiones, no sobrescribir datos incompatibles, informar fallas del almacenamiento.
- Exposición en dispositivos compartidos: explicación visible y borrado explícito.
- Texto contradictorio o PDF ilegible: opciones excluyentes, composición determinista, pruebas y revisión visual de paginación.
- Fallos móviles o de accesibilidad: navegación por teclado, controles semánticos y validación con navegadores y tecnologías disponibles.

La especificación completa y las decisiones de implementación aprobadas están registradas en la conversación del proyecto.

## Arquitectura y contratos

El MVP usa App Router, TypeScript estricto, Tailwind y exportación estática (`output: "export"`, `trailingSlash: true`). Rutas: `/`, `/derechos`, `/plan` y `/privacidad`. El contenido educativo se separa de los componentes, las preguntas se configuran como datos y las respuestas se procesan en el navegador. No hay API, acciones de servidor, cuentas, almacenamiento remoto ni scripts de seguimiento.

Contratos internos: `SourceReference` (fuente y revisión), `QuestionDefinition` (ID, etapa, opciones, clasificación, referencias y versión), `Answer` (selección simple, múltiple o texto), `Draft` (versiones, datos personales, respuestas y etapa) y `PlanDocument` (datos, secciones redactadas, referencias y firma). `composePlan(draft, catalog)` crea un documento común para HTML y PDF. Zod valida borradores; React maneja el estado; `@react-pdf/renderer` genera el archivo bajo demanda; `pdf-lib` agrega numeración de página localmente. Vitest, Playwright y axe verifican lógica y flujos.

### Wizard

Son siete pasos: datos generales; acompañamiento y entorno; trabajo de parto; nacimiento; primeros momentos del bebé; posparto e internación; revisión final. Las preferencias son opcionales, ninguna está seleccionada inicialmente y pueden editarse u omitirse. «Sin preferencia» no produce párrafo; «Prefiero conversarlo» expresa una solicitud de diálogo. El nombre y apellido solo se exigen al generar el PDF; DNI, fecha probable, establecimiento y acompañante son opcionales. La fecha de elaboración usa la fecha local editable. Hay observaciones por pregunta y generales; se tratan como texto plano.

Los límites son 150 caracteres para nombre y acompañante, 200 para establecimiento, 20 para DNI, 1.000 para observaciones de pregunta y 3.000 para observaciones generales. Las fechas deben ser válidas sin restricciones clínicas arbitrarias. Las opciones incompatibles son excluyentes y las solicitudes equivalentes se deduplican. Los avisos al comenzar, antes de descargar y dentro del PDF usan el contenido especificado en `SPEC.md` y no exigen aceptación.

### Persistencia y privacidad

Una clave propia de `localStorage` guarda un borrador con versión de esquema y de contenido. La lectura y validación ocurren después del montaje, antes de autoguardar. Guardar cambios con demora breve y al cambiar de paso. Si el almacenamiento falla, continuar en memoria e informar que el progreso no queda guardado. Ante datos corruptos o incompatibles, no sobrescribirlos: ofrecer borrarlos con confirmación. Si cambia el contenido, solicitar revisar respuestas antes de exportar.

«Borrar mis datos» elimina el borrador, estado en memoria y vistas temporales después de confirmar; no debe recrearse por autoguardado. Explicar que los datos permanecen en el navegador, pueden verse en dispositivos compartidos y pueden perderse al borrar datos del navegador. No incluir datos personales en URL, registros, nombre de archivo o monitoreo.

### Documento

Generar PDF A4 en el navegador, con márgenes de 20 mm, tipografía legible, numeración y espacio de firma. Incluir encabezado y destinatarios, datos personales, introducción con la ley y el decreto, cinco secciones de preferencias, observaciones, nota orientativa, fecha y firma. Los campos opcionales y secciones vacías se omiten. Las respuestas se redactan en primera persona y se vinculan a las referencias pertinentes; el documento no reemplaza el consentimiento informado ni limita derechos.

La vista previa HTML accesible y el PDF consumen el mismo modelo compuesto. Generar un Blob local con nombre fijo `plan-de-parto.pdf`; invalidar el PDF al cambiar respuestas y liberar URLs temporales. Mostrar progreso y error con reintento. La descarga debe funcionar aunque el visor incorporado falle. Mantener títulos con contenido y permitir partir observaciones largas. Después de descargar, mostrar recomendaciones para revisión y presentación.

## Fuentes, contenido y riesgos

- Fuentes jurídicas: Ley 25.929, Decreto 2035/2015 y publicación oficial conjunta enlazadas en `REVISION-CONTENIDOS.md` y el catálogo de fuentes.
- Cada afirmación debe tener fuente y artículo o estado pendiente. Diferenciar derechos, preferencias y recomendaciones clínicas. Revisar normativa modificatoria y vigencia antes de publicar.
- Mantener un registro editorial con estado, responsable, fecha y versión revisada. Analgesia, inducción, episiotomía, pinzamiento, piel con piel, alimentación neonatal, cesárea e internación requieren revisión clínica y jurídica profesional.
- Riesgos principales: formulaciones jurídicas o médicas inexactas; contradicciones entre respuestas; pérdida de borrador; acceso desde un dispositivo compartido; fuga por recursos externos; PDF ilegible o cortado; accesibilidad y fallos móviles. Mitigarlos con fuentes, validación, almacenamiento local controlado, controles explícitos y pruebas.
- La publicación para uso público queda bloqueada hasta la revisión y aprobación jurídica y clínica profesional. La guía OMS de atención intraparto es una fuente clínica candidata sujeta a verificación específica.

## Tareas y aceptación

| ID | Tarea | Dependencias | Aceptación |
|---|---|---|---|
| T01 | Base del proyecto | — | Next.js, TypeScript, Tailwind y exportación estática funcionan |
| T02 | Contratos y esquemas | T01 | Modelos estrictos y validación de entradas inválidas |
| T03 | Viabilidad del PDF | T01 | PDF local con tildes y varias páginas |
| T04 | Matriz de contenido | T02 | Temas, clasificación, fuentes y pendientes registrados |
| T05 | Base visual accesible | T01 | Controles, foco y estructura usables desde 320 px |
| T06 | Landing | T05 | Explicación, tres pasos y enlaces principales |
| T07 | Derechos | T04–T05 | Nueve temas con explicaciones y referencias |
| T08 | Catálogo de preguntas | T04 | Cinco etapas con IDs únicos, opciones y textos PDF |
| T09 | Navegación del wizard | T02, T05 | Siete pasos con avance, retroceso y omisión |
| T10 | Datos generales | T09 | Campos, fecha, límites y errores accesibles |
| T11 | Preguntas configurables | T08–T09 | Selección simple, múltiple y observaciones |
| T12 | Persistencia y borrado | T10–T11 | Recuperación, versiones, fallos y eliminación confirmada |
| T13 | Revisión editable | T11 | Editar secciones, quitar respuestas y agregar observaciones |
| T14 | Composición documental | T08, T13 | Párrafos y referencias sin omisiones accidentales ni duplicados |
| T15 | Vista HTML | T14 | Documento accesible y edición desde el resumen |
| T16 | PDF y descarga | T03, T14 | Documento A4 completo, visor opcional y errores recuperables |
| T17 | Orientación posterior | T16 | Instrucciones para revisar, presentar y conservar el plan |
| T18 | Flujo y calidad | T06–T17 | Pruebas críticas y comprobaciones manuales documentadas |
| T19 | Documentación | T18 | Instalación, ejecución, despliegue y pendientes |
| T20 | Revisión y publicación | T04, T18–T19 | Aprobación profesional y cierre de pendientes bloqueantes |

## Verificación final

Validar IDs, fuentes y cobertura; omisiones, selecciones y versiones; navegación, recarga, edición, errores de almacenamiento y borrado; PDF válido con extracción de texto y casos extensos; accesibilidad con axe, teclado, lector de pantalla, zoom y contraste; Chromium, Firefox y WebKit, además de revisión física móvil. Comprobar con datos sintéticos que no se envían respuestas a solicitudes, URL ni logs. Ejecutar pruebas, TypeScript, lint y build, servir `out/` y recorrer la descarga. Registrar toda comprobación no ejecutada como pendiente.
