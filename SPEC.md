# Proyecto: Plan de Parto Respetado — Argentina

## 1. Objetivo del proyecto

Desarrollar una aplicación web gratuita, sencilla, accesible y responsive que permita a las personas gestantes en Argentina:

1. Conocer sus derechos durante el embarazo, trabajo de parto, nacimiento, posparto y atención neonatal.
2. Comprender qué decisiones pueden tomar y cuáles son sus opciones.
3. Construir un plan de parto personalizado mediante un asistente interactivo (wizard).
4. Descargar un documento PDF formal, listo para imprimir, firmar y presentar en un hospital, clínica o maternidad.

El proyecto busca democratizar el acceso a información comprensible y facilitar el ejercicio de los derechos establecidos en la Ley Nacional 25.929 de Parto Humanizado, sancionada en 2004 y reglamentada mediante el Decreto 2035/2015.

**Principio fundamental:** la herramienta debe ayudar a las personas a tomar decisiones informadas, sin sustituir el asesoramiento médico ni minimizar los derechos que reconoce la legislación.

## 2. Público objetivo

Personas embarazadas y sus acompañantes que desean participar activamente en las decisiones relacionadas con el nacimiento.

No se requieren conocimientos médicos ni jurídicos previos.

### Principios de comunicación

- Español de Argentina.
- Lenguaje sencillo, claro y accesible.
- Tono cercano, empático y respetuoso.
- Evitar tecnicismos innecesarios.
- Explicar los conceptos médicos cuando aparezcan.
- Evitar lenguaje alarmista o que genere miedo.
- No infantilizar a las personas usuarias.
- Utilizar lenguaje inclusivo y respetuoso sin dificultar la comprensión.

## 3. Marco legal y fuentes

Utilizar como fuentes principales:

**Ley Nacional 25.929:**
https://www.argentina.gob.ar/normativa/nacional/98805/texto

**Decreto Reglamentario 2035/2015:**
https://www.argentina.gob.ar/normativa/nacional/decreto-2035-2015-252755/texto

**Documento oficial consolidado:**
https://www.argentina.gob.ar/sites/default/files/ley_25929_parto_humanizado_decreto_web_0.pdf

### Requisitos sobre contenido jurídico y clínico

Es fundamental diferenciar tres tipos de contenido:

**A. Derechos legalmente reconocidos**

Derechos establecidos en la legislación vigente, como recibir información, participar en las decisiones, elegir acompañante y recibir un trato digno y respetuoso.

Deben estar asociados al artículo legal correspondiente.

**B. Preferencias personales**

Decisiones que la persona desea comunicar al equipo de salud, como determinadas posiciones durante el parto, características del entorno o preferencias sobre el pinzamiento del cordón umbilical.

No deben presentarse automáticamente como derechos absolutos.

**C. Recomendaciones clínicas**

Prácticas que pueden contar con respaldo científico o recomendaciones de organismos sanitarios, pero que no necesariamente son exigencias explícitas de la ley.

Siempre que se mencionen recomendaciones clínicas, incluir referencias confiables y aclarar cuando puedan depender de la situación médica.

### Reglas obligatorias

- No inventar derechos ni referencias legales.
- No confundir recomendaciones médicas con obligaciones legales.
- No presentar todas las preferencias como garantías absolutas.
- Priorizar fuentes oficiales argentinas y guías sanitarias reconocidas.
- No utilizar afirmaciones médicas sin fuentes verificables.
- Incorporar referencias a los artículos legales cuando corresponda.
- Separar el contenido jurídico de la lógica y de los componentes de la interfaz.
- Marcar como pendiente de revisión cualquier contenido médico o legal que no pueda verificarse.
- Preparar los contenidos para una revisión profesional antes de la publicación pública.

## 4. Estructura general de la aplicación

La aplicación tendrá tres funcionalidades principales.

### 4.1. Conocé tus derechos

Una sección educativa que explique los derechos más relevantes de manera sencilla.

### 4.2. Armá tu plan de parto

Un wizard interactivo que permita seleccionar preferencias y decisiones personales.

### 4.3. Descargá tu documento

Un generador de PDF que transforme las respuestas en un plan de parto formal y personalizado.

La experiencia debe permitir completar todo el proceso desde un teléfono, sin crear una cuenta.

## 5. Página de inicio

Diseñar una landing page sencilla y visualmente atractiva.

### Contenido principal

**Título:**
"Tu parto, tus decisiones"

**Subtítulo:**
"Conocé tus derechos y creá tu propio plan de parto respetado."

**Botón principal:**
"Crear mi plan de parto"

**Enlace secundario:**
"Conocer mis derechos"

### Contenido adicional

Explicar brevemente:

- Qué es un plan de parto.
- Para qué sirve.
- Cómo puede ayudar a comunicar preferencias.
- Cómo se presenta ante el establecimiento de salud.
- Qué establece la Ley 25.929.

Mostrar el proceso en tres pasos:

1. Informate sobre tus derechos.
2. Elegí tus preferencias.
3. Descargá y compartí tu plan de parto.

El objetivo es transmitir claridad, confianza y facilidad de uso.

## 6. Sección "Conocé tus derechos"

Crear una sección informativa con los derechos organizados por temas:

- Información y consentimiento.
- Trato digno, respetuoso y privacidad.
- Acompañamiento.
- Trabajo de parto.
- Nacimiento.
- Atención del recién nacido.
- Posparto.
- Lactancia y alimentación.
- Situaciones especiales e internación neonatal.

Cada derecho debe mostrarse en una tarjeta o sección desplegable.

### Estructura de cada tarjeta

- Título sencillo.
- Explicación en lenguaje cotidiano.
- Ejemplo práctico, si ayuda a comprenderlo.
- Referencia al artículo legal correspondiente.
- Enlace a la fuente oficial.

Diferenciar visualmente los derechos establecidos por ley de la información clínica complementaria.

No reproducir textos legales extensos cuando puedan resumirse de forma correcta.

## 7. Wizard: creación del plan de parto

Implementar un asistente dividido en pasos.

### Características generales

- Indicador de progreso.
- Botones "Anterior" y "Siguiente".
- Posibilidad de omitir preguntas.
- Posibilidad de modificar respuestas.
- Persistencia local del progreso.
- Explicaciones breves junto a cada decisión.
- Navegación sencilla en dispositivos móviles.
- Resumen final editable.

### Modelo de respuestas

Cuando sea apropiado, utilizar:

- Sí, me gustaría.
- No, prefiero otra alternativa.
- Prefiero conversarlo con el equipo de salud.

También permitir:

- Respuestas múltiples cuando corresponda.
- Campos de texto para observaciones.
- Opciones específicas según la pregunta.
- Omitir la pregunta sin responder.

No utilizar opciones genéricas de sí/no cuando la decisión requiera alternativas más precisas.

**Importante:** no todas las preguntas representan decisiones médicas que la persona pueda tomar unilateralmente. El wizard debe permitir expresar preferencias y solicitudes de información sin transmitir una falsa sensación de control sobre decisiones que requieren evaluación clínica o consentimiento específico.

### Paso 1: Datos generales

Solicitar:

- Nombre y apellido de la persona gestante.
- DNI (opcional).
- Fecha probable de parto (opcional).
- Nombre del hospital o clínica (opcional).
- Nombre de la persona acompañante (opcional).
- Fecha de elaboración del documento.

Permitir continuar sin completar los campos opcionales.

No solicitar información médica sensible que no sea necesaria.

### Paso 2: Acompañamiento y entorno

Incluir preguntas sobre:

- Presencia de una persona acompañante elegida.
- Acompañamiento durante el trabajo de parto.
- Acompañamiento durante el nacimiento.
- Acompañamiento durante el posparto.
- Privacidad e intimidad.
- Preferencias sobre el ambiente.
- Música, iluminación u otras medidas de confort cuando sean posibles.

Explicar cuáles de estos aspectos están contemplados en la legislación y cuáles constituyen preferencias personales.

### Paso 3: Trabajo de parto

Incluir preferencias sobre:

- Libertad de movimiento.
- Posibilidad de caminar.
- Posiciones durante el trabajo de parto.
- Uso de pelotas u otros elementos de apoyo.
- Métodos no farmacológicos para aliviar el dolor.
- Información sobre analgesia farmacológica.
- Ingesta de líquidos o alimentos cuando sea clínicamente apropiado.
- Información previa sobre intervenciones.
- Preferencias respecto de inducción o aceleración del parto.
- Participación en las decisiones sobre procedimientos invasivos.

Para cada intervención médica, explicar de manera breve de qué se trata y evitar sugerir que siempre es necesaria o siempre debe rechazarse.

### Paso 4: Nacimiento

Incluir preferencias sobre:

- Posición para dar a luz.
- Participación en las decisiones durante el nacimiento.
- Información sobre episiotomía y otras intervenciones.
- Solicitud de evitar intervenciones rutinarias sin justificación clínica.
- Pinzamiento tardío del cordón umbilical cuando las condiciones clínicas lo permitan.
- Información sobre el procedimiento ante una eventual cesárea.
- Preferencias de acompañamiento durante una cesárea cuando corresponda.
- Contacto temprano con el recién nacido.

Ejemplo de pregunta:

**¿Preferís que se retrase el pinzamiento del cordón umbilical?**

Explicación:
"Podés expresar tu preferencia por el pinzamiento tardío del cordón. Esta práctica puede tener beneficios para el recién nacido, pero el momento adecuado depende de las circunstancias clínicas."

Opciones:

- Sí, deseo solicitarlo cuando sea clínicamente apropiado.
- Prefiero conversarlo con el equipo médico.
- No tengo una preferencia particular.

No afirmar que esperar hasta que el cordón deje de latir sea una obligación legal universal.

### Paso 5: Primeros momentos del bebé

Incluir preferencias sobre:

- Contacto piel con piel inmediato cuando sea posible.
- Evitar separaciones innecesarias.
- Inicio temprano de la lactancia, si así se desea.
- Acompañamiento y apoyo para la alimentación.
- Información sobre procedimientos neonatales.
- Participación en las decisiones relacionadas con la atención del recién nacido.
- Presencia de progenitores o responsables durante los cuidados, según corresponda.

No ofrecer opciones que sugieran omitir automáticamente medidas sanitarias obligatorias o intervenciones médicamente necesarias.

### Paso 6: Posparto e internación

Incluir preferencias sobre:

- Internación conjunta con el bebé cuando sea posible.
- Presencia de acompañante.
- Apoyo para la lactancia.
- Respeto de las decisiones informadas sobre alimentación.
- Información sobre cuidados y recuperación.
- Información ante la necesidad de internación neonatal.
- Participación familiar en los cuidados cuando corresponda.

### Paso 7: Revisión final

Mostrar todas las respuestas organizadas por categoría.

Permitir:

- Editar cada sección.
- Eliminar preferencias seleccionadas.
- Agregar observaciones personales.
- Previsualizar el documento final.
- Descargar el PDF.

No incluir en el PDF las preguntas omitidas, salvo información esencial que deba figurar como nota general.

## 8. Carácter orientativo de la herramienta

La aplicación debe explicar claramente que funciona como una herramienta informativa y de apoyo para elaborar un plan de parto personalizado.

**Principio conceptual:** la plantilla es orientativa, pero los derechos reconocidos legalmente no lo son.

Evitar que las aclaraciones hagan parecer que el documento carece de importancia o que el equipo de salud puede ignorar las preferencias sin justificación.

### 8.1. Aviso al comenzar el wizard

Mostrar un mensaje visible pero no invasivo.

Título:
"Antes de comenzar"

Texto:

"Este formulario es una guía orientativa para ayudarte a conocer tus opciones y elaborar tu propio plan de parto.

El documento que generes expresa tus preferencias y decisiones, pero no reemplaza el diálogo con el equipo de salud ni los consentimientos informados que correspondan. Algunas preferencias pueden necesitar adaptaciones según las circunstancias médicas."

No exigir que se acepte el aviso mediante un checkbox.

### 8.2. Aviso antes de descargar el PDF

Mostrar el mensaje:

"Tu plan de parto está listo.

Este documento es una plantilla personalizable para comunicar tus preferencias al equipo de salud. Te recomendamos revisarlo con anticipación con el establecimiento donde planeás dar a luz.

El plan no sustituye el consentimiento informado ni limita tus derechos reconocidos por ley."

### 8.3. Nota dentro del PDF

Incluir al final del documento:

"Sobre este documento: Este plan de parto fue elaborado a partir de una plantilla orientativa y refleja las preferencias de quien lo suscribe. Su contenido podrá ser revisado y adaptado mediante el diálogo con el equipo de salud, respetando los derechos establecidos por la legislación vigente y las necesidades clínicas que pudieran presentarse."

### Reglas de UX

- Utilizar lenguaje sencillo y no alarmista.
- Evitar disclaimers excesivamente largos.
- No exigir aceptación de términos legales.
- No presentar el plan como un documento sin valor.
- No sugerir que los derechos dependen de la aceptación del establecimiento.
- No transmitir que una urgencia médica elimina automáticamente la obligación de informar y respetar los derechos aplicables.

## 9. Modelo de datos de preguntas

Las preguntas deben definirse en archivos estructurados de configuración, sin estar hardcodeadas dentro de los componentes visuales.

Utilizar TypeScript para modelar las preguntas.

Cada pregunta debe contener:

- ID único.
- Categoría.
- Orden.
- Título.
- Descripción.
- Tipo de respuesta.
- Opciones disponibles.
- Texto correspondiente para el PDF.
- Clasificación legal o clínica.
- Referencias legales, cuando corresponda.
- Fuentes médicas, cuando corresponda.
- Condiciones o advertencias relevantes.
- Posibilidad de omitir la respuesta.
- Versión del contenido, cuando sea útil.

Los textos para el PDF deben poder variar según la respuesta seleccionada.

No generar automáticamente afirmaciones contradictorias.

Separar:

- Configuración de preguntas.
- Contenido educativo.
- Referencias legales y médicas.
- Estado de las respuestas.
- Reglas de generación del documento.

El sistema debe permitir incorporar o modificar preguntas sin reescribir el wizard.

## 10. Generación del PDF

Generar un documento profesional, legible y correctamente paginado en formato A4.

### Título

"Plan de parto y nacimiento — Manifestación de preferencias"

### Destinatarios

Dirigido a:

- Dirección del establecimiento de salud.
- Servicio de Obstetricia.
- Servicio de Neonatología.

Los destinatarios deben ser genéricos cuando no se haya informado un establecimiento.

### Estructura del documento

1. Encabezado y destinatarios.
2. Datos personales.
3. Introducción con referencia a la Ley 25.929 y al Decreto 2035/2015.
4. Preferencias sobre acompañamiento y entorno.
5. Preferencias durante el trabajo de parto.
6. Preferencias durante el nacimiento.
7. Preferencias sobre la atención del recién nacido.
8. Preferencias durante el posparto.
9. Observaciones adicionales.
10. Nota sobre el carácter orientativo del documento.
11. Fecha, firma y aclaración.

### Redacción

El PDF debe utilizar frases naturales, formales y respetuosas.

Ejemplo:

"Solicito que, siempre que las condiciones clínicas lo permitan, se considere el pinzamiento tardío del cordón umbilical."

Evitar generar un documento que simplemente copie preguntas y respuestas.

Las respuestas deben convertirse en solicitudes o manifestaciones de preferencias redactadas en primera persona.

### Requisitos técnicos

- Formato A4.
- Márgenes adecuados para impresión.
- Paginación correcta.
- Tipografía legible.
- Encabezados claros.
- Secciones agrupadas.
- Evitar cortes de párrafos o títulos entre páginas.
- Incluir solamente las preferencias seleccionadas.
- Espacio suficiente para firma manuscrita.
- Generación del PDF en el navegador.
- Sin enviar los datos personales a servicios externos.

### Condiciones importantes

No presentar el documento como:

- Una autorización médica general.
- Un consentimiento informado universal.
- Una renuncia anticipada a derechos.
- Una garantía de que todas las preferencias podrán cumplirse.

El plan debe expresar preferencias, facilitar el diálogo y servir como instrumento de comunicación.

## 11. Cómo presentar el documento

Agregar una sección informativa breve después de descargar el PDF.

Título:
"¿Qué hago con mi plan de parto?"

Explicar que se recomienda:

1. Revisarlo antes del nacimiento.
2. Conversarlo con el equipo de salud.
3. Consultar con el hospital o clínica cómo presentarlo.
4. Solicitar, cuando corresponda, su incorporación a la historia clínica.
5. Conservar una copia y, si es posible, una constancia de recepción.

No afirmar que existe un único procedimiento administrativo obligatorio en todos los establecimientos.

## 12. Diseño y experiencia de usuario

La aplicación debe transmitir tranquilidad, confianza y autonomía.

### Dirección visual

- Diseño moderno.
- Estética cálida y minimalista.
- Colores suaves y accesibles.
- Tipografía clara.
- Mucho espacio visual.
- Componentes sencillos.
- Evitar estilos infantiles.
- Evitar elementos decorativos innecesarios.
- No utilizar una estética excesivamente médica o institucional.

### UX

Priorizar:

- Mobile-first.
- Navegación intuitiva.
- Formularios simples.
- Botones cómodos para pantallas táctiles.
- Progreso visible.
- Posibilidad de volver a pasos anteriores.
- Mensajes de ayuda contextuales.
- Estados de selección claramente diferenciados.
- Validación de datos comprensible.
- Estados vacíos bien resueltos.
- Excelente experiencia desde dispositivos móviles.

### Accesibilidad

Apuntar a WCAG 2.2 AA.

Incluir:

- Navegación por teclado.
- Etiquetas accesibles.
- Estados de foco visibles.
- Buen contraste.
- Estructura semántica.
- Compatibilidad con lectores de pantalla.
- Mensajes de error accesibles.
- No depender exclusivamente del color para comunicar información.

## 13. Arquitectura técnica

Construir el MVP utilizando:

- Next.js con App Router.
- TypeScript.
- Tailwind CSS.
- Componentes reutilizables.
- Una biblioteca apropiada para generar PDF en el navegador.
- localStorage para guardar temporalmente el progreso.
- Validación de formularios con herramientas apropiadas.
- Tests de la lógica principal.

### Principios de arquitectura

- Mantener el código simple.
- Evitar sobreingeniería.
- Separar responsabilidades.
- Priorizar mantenibilidad.
- Tipado estricto.
- Utilizar dependencias estables.
- Facilitar la incorporación de nuevas preguntas.
- Facilitar la actualización del contenido legal.
- Mantener independiente la generación del PDF.

### No implementar inicialmente

- Registro de usuarios.
- Autenticación.
- Base de datos.
- Backend innecesario.
- Pagos.
- Panel de administración.
- Envío de documentos por correo.
- Analítica invasiva.
- Integraciones con hospitales.
- Sistemas de gestión médica.

El MVP debe poder desplegarse como una aplicación principalmente estática.

## 14. Privacidad y protección de datos

La aplicación puede manejar información personal y potencialmente sensible.

Aplicar un enfoque de privacidad desde el diseño.

### Requisitos

- Procesar las respuestas en el navegador.
- No enviar información personal al servidor.
- No utilizar servicios externos para generar documentos.
- No registrar las respuestas en herramientas de analítica.
- No incluir datos personales en URLs.
- Evitar recopilar información médica innecesaria.
- Permitir borrar los datos guardados.
- Explicar claramente dónde se almacena la información.
- No utilizar cookies de seguimiento.
- No transmitir el contenido del formulario a herramientas de monitoreo de errores.

### Persistencia

Utilizar localStorage para conservar las respuestas durante la elaboración del plan.

Aclarar que:

- Los datos permanecen almacenados en ese navegador.
- Otras personas con acceso al mismo navegador podrían verlos.
- El usuario puede eliminarlos desde la aplicación.
- Eliminar datos del navegador también puede borrar el progreso.

Agregar un botón visible:
"Borrar mis datos"

Solicitar confirmación antes de ejecutar la eliminación.

## 15. Tests y calidad

Agregar pruebas para los comportamientos críticos.

### Wizard

Verificar:

- Navegación entre pasos.
- Conservación de respuestas.
- Edición de respuestas.
- Preguntas omitidas.
- Validación de datos.
- Persistencia local.
- Recuperación tras recargar la página.

### Generación del documento

Verificar:

- Que se incluyan las preferencias seleccionadas.
- Que se omitan las respuestas no contestadas.
- Que el documento no contenga textos contradictorios.
- Que las opciones se conviertan correctamente en párrafos.
- Que el archivo generado sea un PDF válido.
- Que no se pierdan los datos personales relevantes.
- Que se incluyan las referencias legales correspondientes.
- Que las aclaraciones sobre el carácter orientativo estén presentes.

### Accesibilidad

Verificar controles con teclado, etiquetas y estados de foco.

### Privacidad

Verificar que los datos del formulario no se envíen al servidor ni a servicios externos.

## 16. Criterios de aceptación del MVP

El proyecto estará completo cuando:

1. Una persona pueda entender los principales derechos sin tener que leer toda la legislación.
2. Pueda comenzar a crear su plan desde la página principal.
3. Pueda responder preguntas organizadas por etapas.
4. Pueda omitir preguntas que no desea contestar.
5. Pueda modificar respuestas anteriores.
6. El progreso permanezca disponible al recargar la página.
7. Pueda revisar todas sus preferencias.
8. Pueda generar un PDF personalizado.
9. El documento tenga una redacción formal y natural.
10. El PDF incluya referencias legales verificadas.
11. El carácter orientativo de la plantilla esté claramente explicado.
12. Se respeten las condiciones de privacidad definidas.
13. Pueda completarse todo el proceso sin registrarse.
14. La aplicación funcione correctamente en dispositivos móviles.
15. El proyecto pueda ejecutarse localmente y desplegarse fácilmente.

## 17. Organización sugerida del código

Mantener una estructura clara y modular.

Separar al menos:

- `app/`: rutas y páginas.
- `components/`: componentes compartidos.
- `components/wizard/`: interfaz del asistente.
- `content/`: contenido educativo.
- `data/`: preguntas y referencias.
- `lib/`: lógica y utilidades.
- `lib/pdf/`: generación del documento.
- `types/`: modelos y tipos.
- `hooks/`: hooks reutilizables.
- `tests/`: pruebas automatizadas.

Esta estructura es orientativa; ajustarla si existe una alternativa más simple y mantenible.

## 18. Preparación para futuras funcionalidades

Diseñar el MVP para que sea posible agregar más adelante:

- Nuevas preguntas.
- Nuevas guías clínicas.
- Actualizaciones normativas.
- Adaptaciones para distintas jurisdicciones.
- Versiones del documento.
- Distintos idiomas.
- Mejoras en la previsualización.
- Posibilidad de compartir el plan.

No implementar estas funcionalidades ahora.

No crear abstracciones complejas para escenarios futuros que todavía no se necesitan.

## 19. Instrucciones de implementación para Codex

Quiero que implementes un MVP completo y funcional de esta aplicación.

### Orden de trabajo

1. Analizá los requisitos.
2. Inspeccioná el repositorio existente, si lo hay.
3. Definí una arquitectura simple y mantenible.
4. Identificá las dependencias necesarias.
5. Creá la estructura del proyecto.
6. Implementá la landing page.
7. Implementá la sección educativa.
8. Creá el modelo estructurado de preguntas.
9. Implementá el wizard.
10. Agregá persistencia local.
11. Implementá el resumen editable.
12. Implementá la previsualización.
13. Implementá el generador de PDF.
14. Incorporá los avisos sobre el carácter orientativo.
15. Agregá tests para las funciones críticas.
16. Verificá accesibilidad básica y diseño responsive.
17. Documentá instalación, ejecución y despliegue.

### Reglas de desarrollo

- Priorizá una versión funcional sobre funcionalidades secundarias.
- No implementes características que no fueron solicitadas.
- Evitá dependencias innecesarias.
- No incluyas textos legales inventados.
- No inventes referencias médicas.
- Si no podés verificar una fuente, dejá el contenido marcado para revisión.
- No utilices datos personales reales como ejemplos.
- No agregues servicios externos que procesen información de las personas.
- Mantené separados los contenidos legales y médicos del código de presentación.
- Utilizá componentes reutilizables sin generar abstracciones innecesarias.
- Incluí estados de error y mensajes claros para el usuario.
- No ocultes limitaciones técnicas.

### Entregables esperados

- Código fuente del MVP.
- Aplicación responsive y funcional.
- Wizard completo con preguntas configurables.
- Generación de PDF en el navegador.
- Contenido educativo inicial.
- Tests de funcionalidades críticas.
- README con instrucciones de instalación y ejecución.
- Lista de contenidos legales o médicos pendientes de validación profesional.

### Validación final

Antes de finalizar:

- Ejecutá los tests disponibles.
- Ejecutá las verificaciones de TypeScript y lint.
- Verificá que el proyecto compile correctamente.
- Comprobá que el PDF se pueda generar.
- Revisá que no se transmitan respuestas personales al servidor.
- Identificá y explicá cualquier limitación pendiente.

No afirmes que algo funciona si no pudiste verificarlo.

Si el entorno permite ejecutar la aplicación, probá el flujo completo desde la página de inicio hasta la descarga del documento.

## 20. Prioridad final

La prioridad absoluta es construir una experiencia en la que una persona embarazada, sin conocimientos médicos ni legales, pueda:

**Conocer sus derechos → comprender sus opciones → expresar sus preferencias → obtener un plan de parto personalizado y presentable.**

El resultado debe ser sencillo, confiable y respetuoso.

No quiero solamente un prototipo visual ni una landing page estática: quiero un MVP funcional que permita completar el proceso y generar un documento real.

El contenido jurídico y clínico debe estar preparado para revisión profesional antes de publicar la herramienta para uso público.