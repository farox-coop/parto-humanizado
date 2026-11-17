# Plan de Parto Respetado

Aplicación web estática para conocer derechos en Argentina, crear un plan de parto y generar un PDF en el navegador. El contenido requiere revisión profesional jurídica y clínica antes de su publicación pública. Consultá [SPEC.md](SPEC.md), [PLAN.md](PLAN.md) y [REVISION-CONTENIDOS.md](REVISION-CONTENIDOS.md).

## Requisitos y ejecución

Node.js 20.9 o superior (desarrollado con Node 24) y npm. Instalá con `npm ci` y ejecutá `npm run dev`. Next.js indicará el puerto disponible; podés elegir otro con `npm run dev -- -p 3001`.

Para producir el sitio estático: `npm run build`. El directorio `out/` puede servirse con cualquier servidor de archivos estáticos, por ejemplo `python3 -m http.server 8000 --directory out`. Elegí otro puerto si el 8000 está ocupado. No uses `next start` para la exportación estática.

## Verificación

- `npm run typecheck`, `npm run lint` y `npm test`.
- `npx playwright install chromium firefox webkit` y `npm run test:e2e` tras compilar. El puerto predeterminado de prueba es 4173; si está ocupado, elegí uno libre con `TEST_PORT=<puerto>` y serví `out/` en ese puerto antes de ejecutar la prueba.
- Las pruebas automatizadas no sustituyen la revisión visual del PDF, la revisión con lector de pantalla o las pruebas en dispositivos físicos.

## Datos y arquitectura

Las respuestas, el estado y la fecha se almacenan en `localStorage` en el navegador. La generación de PDF y su vista previa se realizan localmente. La aplicación no envía respuestas a un servidor, no utiliza analítica ni cookies de seguimiento, y no requiere cuentas. El acceso al mismo navegador permite ver el borrador. El botón «Borrar mis datos» lo elimina tras confirmación; los PDF ya descargados se borran desde el dispositivo.

Las preguntas y fuentes viven en `data/`; `lib/compose.ts` transforma respuestas en un modelo común para HTML y PDF; `lib/pdf/` genera el documento con react-pdf y agrega la numeración localmente con pdf-lib. La versión del catálogo permite pedir una nueva revisión si cambian las preguntas. La aplicación no contiene backend.

## Limitaciones previas a publicación

Los textos se prepararon contra fuentes oficiales pero no cuentan con aprobación profesional. Revisar vigencia normativa, afirmaciones clínicas y redacción inclusiva con profesionales antes de publicar. Verificar también lector de pantalla, zoom, paginación extensa y funcionamiento físico en Safari de iOS y Chrome de Android.

## Comprobaciones pendientes en este entorno

Firefox de Playwright no pudo iniciar: el proceso informó que no encontraba su perfil temporal, incluso al probar otro directorio. La comprobación manual con lector de pantalla y en dispositivos físicos iOS y Android requiere realizarse antes de publicar.

## Correcciones de la revisión

La generación pendiente se invalida al editar, borrar, recibir cambios de otra pestaña o salir del asistente. Las pestañas sincronizan el borrador y verifican el almacenamiento antes de guardar para evitar restaurar datos borrados. Omitir una pregunta elimina también su observación.

El renderizador admite selección simple, múltiple y texto, con descripciones y advertencias asociadas mediante `aria-describedby`. Las solicitudes de diálogo tienen redacción documental explícita en primera persona.

El PDF incorpora Noto Sans Regular y Bold desde `public/fonts/`, con licencia SIL Open Font License incluida en `OFL.txt`; fuentes obtenidas del repositorio oficial https://github.com/notofonts/noto-fonts. La fuente conserva los diacríticos latinos y los caracteres griegos y cirílicos cubiertos. Si un carácter no tiene cobertura, se informa el problema y se conservan los datos, sin descargar un archivo con texto alterado. No se consultan servicios externos para cargar fuentes en tiempo de uso.

Las pruebas de navegador se ejecutan en serie para evitar interferencias entre instancias en este entorno de escritorio.

## Guardado, privacidad y CAPTCHA

El asistente guarda sin demora cada cambio y cada paso en una única entrada versionada de `localStorage`. Una descarga o vista previa no modifica el borrador; se pueden editar respuestas y generar otro PDF. El indicador solo confirma el guardado cuando el navegador completó la escritura o se recuperó un borrador válido. Si no se puede leer o escribir, se puede continuar en memoria y se avisa que no hay persistencia. Si se recupera el acceso y existe otro borrador mientras hay cambios sin guardar, se conservan ambos sin sobrescribir el anterior. El botón de borrado pide confirmación y elimina únicamente los datos del asistente; los PDF descargados se eliminan por separado.

Los datos permanecen en ese navegador, no se sincronizan entre dispositivos y la aplicación no los cifra. Borrar los datos del navegador puede borrar el progreso.

No se incorpora CAPTCHA. La aplicación se exporta como archivos estáticos y genera el PDF en el navegador con recursos locales: generar documentos automáticamente consume recursos del dispositivo cliente, no procesamiento de un servidor propio ni de un servicio externo de PDF. Las solicitudes habituales de archivos estáticos siguen dependiendo del alojamiento. No hay cuentas, envíos ni otras operaciones de servidor que requieran CAPTCHA para este MVP.
