import type { QuestionDefinition, StepId } from '@/types';
export const CONTENT_VERSION = 1;
export const steps: { id: StepId; title: string; intro: string }[] = [
  { id: 'entorno', title: 'Acompañamiento y entorno', intro: 'Elegí quién querés que te acompañe y qué condiciones te ayudan a sentirte cómoda.' },
  { id: 'trabajo', title: 'Trabajo de parto', intro: 'Podés compartir qué necesitás para transitar este momento y qué querés conversar.' },
  { id: 'nacimiento', title: 'Nacimiento', intro: 'Estas preguntas te ayudan a expresar tus preferencias para el nacimiento, incluida una posible cesárea.' },
  { id: 'bebe', title: 'Primeros momentos del bebé', intro: 'Pensá cómo te gustaría compartir los primeros cuidados y recibir información.' },
  { id: 'posparto', title: 'Posparto e internación', intro: 'También podés dejar por escrito qué apoyo e información necesitás después del nacimiento.' },
];
type Seed = [StepId, string, string, string, string, string[], ('derecho'|'preferencia'|'información clínica')?];
// Las frases clínicas son solicitudes de información o preferencias, no recomendaciones clínicas.
const seeds: Seed[] = [
 ['entorno','acompanante','¿Querés estar acompañada por una persona de tu elección?','La ley reconoce el acompañamiento durante el trabajo de parto, el parto y el posparto.','Solicito estar acompañada por una persona de mi confianza y elección durante el trabajo de parto, el nacimiento y el posparto.',['ley2g','decreto2g'],'derecho'],
 ['entorno','privacidad','¿Querés solicitar privacidad e intimidad?','Tenés derecho a un trato respetuoso y a la intimidad durante la atención.','Solicito que se respete mi privacidad e intimidad durante toda la atención.',['ley2b'],'derecho'],
 ['entorno','ambiente','¿Querés conversar sobre el ambiente?','Podés contar qué condiciones te ayudan a sentirte cómoda.','Me gustaría conversar sobre un ambiente tranquilo y respetuoso de mi intimidad.',['ley2b']],
 ['entorno','musica','¿Te gustaría contar con música, iluminación u otras medidas de confort?','Podés indicar los detalles en observaciones, según las posibilidades del lugar.','Me gustaría que se consideren mis preferencias de música, iluminación y otras medidas de confort, cuando sea posible.',[]],
 ['trabajo','movimiento','¿Querés moverte o caminar durante el trabajo de parto?','La reglamentación contempla la libertad de movimiento y elección informada, con condiciones relacionadas con la salud.','Solicito poder moverme y caminar durante el trabajo de parto, respetando mis decisiones informadas y las circunstancias clínicas.',['decreto2a','decreto2d'],'derecho'],
 ['trabajo','posiciones','¿Querés elegir posiciones durante el trabajo de parto?','Podés conversar sobre las posiciones disponibles y sus condiciones.','Solicito participar de manera informada en la elección de posiciones durante el trabajo de parto.',['decreto2a'],'derecho'],
 ['trabajo','elementos','¿Te gustaría usar una pelota u otros elementos de apoyo?','Podés conversar sobre los elementos disponibles en el establecimiento.','Me gustaría usar una pelota u otros elementos de apoyo si están disponibles y son apropiados.',['decreto2a']],
 ['trabajo','dolor','¿Querés conocer opciones no farmacológicas para aliviar el dolor?','Por ejemplo, cambios de posición, movimiento o técnicas de respiración.','Solicito información y apoyo para considerar métodos no farmacológicos de alivio del dolor.',['ley2a']],
 ['trabajo','analgesia','¿Querés información sobre analgesia farmacológica?','La analgesia utiliza medicamentos para aliviar el dolor. Podés preguntar por opciones, beneficios y riesgos.','Solicito información comprensible sobre las opciones de analgesia, sus beneficios y riesgos.',['ley2a','decreto2a'],'derecho'],
 ['trabajo','alimentos','¿Querés conversar sobre tomar líquidos o comer?','La reglamentación contempla líquidos y alimentos durante el trabajo de parto cuando las circunstancias lo permitan.','Solicito que se respete la posibilidad de recibir líquidos y alimentos durante el trabajo de parto cuando las circunstancias lo permitan.',['decreto2d'],'derecho'],
 ['trabajo','intervenciones','¿Querés recibir información antes de las intervenciones?','Podés pedir que te expliquen qué se propone, por qué, sus riesgos y alternativas.','Solicito recibir información clara y participar en las decisiones sobre las intervenciones propuestas.',['ley2a','decreto2a'],'derecho'],
 ['trabajo','induccion','¿Querés conversar sobre inducción o aceleración del parto?','Son intervenciones que buscan iniciar o acelerar el trabajo de parto. Su indicación depende de cada situación.','Solicito que se me explique cualquier propuesta de inducción o aceleración, sus motivos, alternativas y riesgos, para participar en la decisión.',['ley2a'],'derecho'],
 ['trabajo','invasivos','¿Querés participar en las decisiones sobre procedimientos invasivos?','Un procedimiento invasivo implica ingresar al cuerpo o intervenir sobre él. Pedí información antes de decidir.','Solicito información y participación en las decisiones sobre procedimientos invasivos propuestos.',['ley2a','ley2d'],'derecho'],
 ['nacimiento','posicion-nacimiento','¿Querés participar en la elección de la posición para dar a luz?','La reglamentación contempla la elección informada de la forma de transitar el nacimiento, con condiciones de salud.','Solicito participar en la elección informada de la posición para dar a luz.',['decreto2a'],'derecho'],
 ['nacimiento','decisiones','¿Querés participar en las decisiones durante el nacimiento?','El equipo debe darte información comprensible y hacerte partícipe de las actuaciones.','Solicito información clara y participación en las decisiones durante el nacimiento.',['ley2a','ley2d'],'derecho'],
 ['nacimiento','episiotomia','¿Querés información sobre episiotomía y otras intervenciones?','La episiotomía es un corte en el periné que puede proponerse en algunas circunstancias.','Solicito información sobre los motivos, beneficios, riesgos y alternativas de una eventual episiotomía u otra intervención.',['ley2a'],'derecho'],
 ['nacimiento','rutina','¿Querés solicitar que se eviten intervenciones sin justificación clínica?','La ley contempla evitar prácticas invasivas y medicación que no estén justificadas por el estado de salud.','Solicito que se eviten prácticas invasivas y medicación sin justificación clínica, con información y participación en las decisiones.',['ley2d'],'derecho'],
 ['nacimiento','cordon','¿Querés solicitar pinzamiento tardío del cordón?','El momento adecuado depende de las circunstancias clínicas. Podés conversar sobre esta preferencia.','Solicito que, cuando las condiciones clínicas lo permitan, se considere el pinzamiento tardío del cordón umbilical.',[]],
 ['nacimiento','cesarea','¿Querés información ante una posible cesárea?','La cesárea es un nacimiento mediante una intervención quirúrgica. Podés preguntar cómo sería la atención.','Ante una eventual cesárea, solicito información sobre el procedimiento y participación en las decisiones.',['ley2a'],'derecho'],
 ['nacimiento','cesarea-acompanante','¿Querés acompañamiento durante una cesárea?','La reglamentación contempla el acompañamiento cualquiera sea la vía de parto.','Solicito el acompañamiento de una persona de mi elección también si el nacimiento es por cesárea.',['decreto2g'],'derecho'],
 ['nacimiento','contacto','¿Querés contacto temprano con tu bebé?','La reglamentación promueve el contacto desde el nacimiento, independientemente de la vía de parto.','Solicito que se facilite el contacto temprano con mi bebé desde el nacimiento.',['decreto2h'],'derecho'],
 ['bebe','piel','¿Te gustaría el contacto piel con piel?','Podés expresar esta preferencia y conversar cómo facilitarla en tu situación.','Me gustaría tener contacto piel con piel con mi bebé lo antes posible, si las circunstancias lo permiten.',['decreto2h']],
 ['bebe','separacion','¿Querés evitar separaciones innecesarias?','La ley contempla que el bebé permanezca a tu lado, salvo que requiera cuidados especiales.','Solicito evitar separaciones innecesarias y recibir información si mi bebé requiere cuidados especiales.',['ley2h','ley3'],'derecho'],
 ['bebe','lactancia-inicio','¿Querés apoyo para iniciar la lactancia?','Podés solicitar información y apoyo para alimentar a tu bebé según tu decisión.','Si decido amamantar, solicito apoyo para iniciar la lactancia lo antes posible.',['ley2i'],'derecho'],
 ['bebe','alimentacion','¿Querés apoyo para la alimentación de tu bebé?','Podés conversar tus necesidades y decisiones informadas sobre la alimentación.','Solicito información y apoyo respetuoso para la alimentación de mi bebé.',['ley2i']],
 ['bebe','procedimientos-bebe','¿Querés información sobre los cuidados y procedimientos del bebé?','Podés pedir explicaciones comprensibles y participar en las decisiones que correspondan.','Solicito información comprensible sobre los cuidados y procedimientos que se propongan para mi bebé.',['ley3','decreto2h']],
 ['bebe','presencia-cuidados','¿Querés estar presente durante los cuidados del bebé?','Podés conversar cómo acompañar los cuidados junto con la otra persona responsable, según corresponda.','Solicito poder estar presente y participar, junto con quien corresponda, en los cuidados de mi bebé.',['ley3','ley4']],
 ['posparto','conjunta','¿Querés internación conjunta con tu bebé?','La ley contempla la internación conjunta teniendo en cuenta el estado de salud de ambos.','Solicito la internación conjunta con mi bebé, teniendo en cuenta nuestros estados de salud.',['ley2h','ley3'],'derecho'],
 ['posparto','acompanante-posparto','¿Querés acompañamiento durante el posparto?','La ley reconoce el acompañamiento por una persona de confianza y elección.','Solicito estar acompañada por una persona de mi confianza y elección durante el posparto.',['ley2g','decreto2g'],'derecho'],
 ['posparto','apoyo-lactancia','¿Querés recibir apoyo para la lactancia durante la internación?','La ley reconoce el derecho a recibir información y apoyo para amamantar.','Si decido amamantar, solicito información y apoyo para la lactancia durante la internación.',['ley2i'],'derecho'],
 ['posparto','alimentacion-respeto','¿Querés apoyo respetuoso para tus decisiones sobre alimentación?','Podés solicitar información que te ayude a tomar decisiones informadas.','Solicito información y apoyo respetuoso para mis decisiones informadas sobre alimentación.',['ley2a','ley2i']],
 ['posparto','recuperacion','¿Querés información sobre tu recuperación y los cuidados del bebé?','La ley contempla asesoramiento e información sobre estos cuidados.','Solicito información comprensible sobre mi recuperación y los cuidados de mi bebé.',['ley2i'],'derecho'],
 ['posparto','neonatal','¿Querés información si tu bebé necesita internación neonatal?','La ley contempla información, acceso y participación para madres y padres de recién nacidos en situación de riesgo, con condiciones clínicas.','Si mi bebé necesita internación neonatal, solicito información comprensible y continuada sobre su evolución y cuidados.',['ley4'],'derecho'],
 ['posparto','familia-neonatal','¿Querés participar en los cuidados durante una internación neonatal?','Podés conversar cómo acceder y participar en sus cuidados según la situación clínica.','Si mi bebé requiere internación neonatal, solicito acceso y participación familiar en su atención, según la situación clínica.',['ley4'],'derecho'],
];
const conversationParagraphs: Record<string, string> = {
  "acompanante": "Me gustaría conversar con el equipo de salud sobre el acompañamiento durante el trabajo de parto, el nacimiento y el posparto.",
  "privacidad": "Me gustaría conversar con el equipo de salud sobre cómo resguardar mi privacidad e intimidad.",
  "ambiente": "Me gustaría conversar con el equipo de salud sobre las condiciones del ambiente que me ayudan a sentirme cómoda.",
  "musica": "Me gustaría conversar con el equipo de salud sobre música, iluminación y otras medidas de confort.",
  "movimiento": "Me gustaría conversar con el equipo de salud sobre las posibilidades de moverme y caminar durante el trabajo de parto.",
  "posiciones": "Me gustaría conversar con el equipo de salud sobre las posiciones durante el trabajo de parto.",
  "elementos": "Me gustaría conversar con el equipo de salud sobre el uso de una pelota u otros elementos de apoyo.",
  "dolor": "Me gustaría conversar con el equipo de salud sobre métodos no farmacológicos para aliviar el dolor.",
  "analgesia": "Me gustaría conversar con el equipo de salud sobre las opciones de analgesia farmacológica, sus beneficios y sus riesgos.",
  "alimentos": "Me gustaría conversar con el equipo de salud sobre la posibilidad de recibir líquidos y alimentos durante el trabajo de parto.",
  "intervenciones": "Me gustaría conversar con el equipo de salud sobre la información que necesito antes de las intervenciones propuestas.",
  "induccion": "Me gustaría conversar con el equipo de salud sobre los motivos, las alternativas y los riesgos de una eventual inducción o aceleración del parto.",
  "invasivos": "Me gustaría conversar con el equipo de salud sobre mi participación en las decisiones relacionadas con procedimientos invasivos.",
  "posicion-nacimiento": "Me gustaría conversar con el equipo de salud sobre la elección de la posición para dar a luz.",
  "decisiones": "Me gustaría conversar con el equipo de salud sobre mi participación en las decisiones durante el nacimiento.",
  "episiotomia": "Me gustaría conversar con el equipo de salud sobre una eventual episiotomía u otras intervenciones, sus motivos, riesgos y alternativas.",
  "rutina": "Me gustaría conversar con el equipo de salud sobre cómo evitar intervenciones sin justificación clínica.",
  "cordon": "Me gustaría conversar con el equipo de salud sobre el momento del pinzamiento del cordón umbilical.",
  "cesarea": "Me gustaría conversar con el equipo de salud sobre el procedimiento y la atención ante una eventual cesárea.",
  "cesarea-acompanante": "Me gustaría conversar con el equipo de salud sobre el acompañamiento durante una eventual cesárea.",
  "contacto": "Me gustaría conversar con el equipo de salud sobre cómo facilitar el contacto temprano con mi bebé.",
  "piel": "Me gustaría conversar con el equipo de salud sobre el contacto piel con piel con mi bebé.",
  "separacion": "Me gustaría conversar con el equipo de salud sobre cómo evitar separaciones innecesarias de mi bebé.",
  "lactancia-inicio": "Me gustaría conversar con el equipo de salud sobre el apoyo para iniciar la lactancia, si decido amamantar.",
  "alimentacion": "Me gustaría conversar con el equipo de salud sobre la información y el apoyo para alimentar a mi bebé.",
  "procedimientos-bebe": "Me gustaría conversar con el equipo de salud sobre los cuidados y procedimientos propuestos para mi bebé.",
  "presencia-cuidados": "Me gustaría conversar con el equipo de salud sobre mi presencia y participación durante los cuidados de mi bebé.",
  "conjunta": "Me gustaría conversar con el equipo de salud sobre la internación conjunta con mi bebé.",
  "acompanante-posparto": "Me gustaría conversar con el equipo de salud sobre el acompañamiento durante el posparto.",
  "apoyo-lactancia": "Me gustaría conversar con el equipo de salud sobre el apoyo para la lactancia durante la internación, si decido amamantar.",
  "alimentacion-respeto": "Me gustaría conversar con el equipo de salud sobre mis decisiones informadas relacionadas con la alimentación de mi bebé.",
  "recuperacion": "Me gustaría conversar con el equipo de salud sobre mi recuperación y los cuidados de mi bebé.",
  "neonatal": "Me gustaría conversar con el equipo de salud sobre la información que recibiré si mi bebé necesita internación neonatal.",
  "familia-neonatal": "Me gustaría conversar con el equipo de salud sobre el acceso y la participación familiar si mi bebé requiere internación neonatal."
};
export const questions: QuestionDefinition[] = seeds.map(([step,id,title,description,pdf,references,classification],order) => ({ id,step,order,title,description,kind:'single',classification:classification ?? 'preferencia',references,optional:true,version:1,options:[{id:'si',label:'Sí, me gustaría solicitarlo',pdf},{id:'conversar',label:'Prefiero conversarlo con el equipo de salud',pdf:conversationParagraphs[id]},{id:'sin-preferencia',label:'No tengo una preferencia particular',pdf:null}] }));

// Las medidas de confort admiten varias elecciones; las opciones de diálogo y omisión son exclusivas.
const comfort = questions.find(q=>q.id==='musica')!;
comfort.kind='multiple';
comfort.options=[{id:'musica',label:'Música',pdf:'Me gustaría escuchar música durante la atención, cuando sea posible.'},{id:'luz',label:'Iluminación tenue',pdf:'Me gustaría contar con iluminación tenue, cuando sea posible.'},{id:'conversar',label:'Prefiero conversarlo con el equipo de salud',pdf:'Me gustaría conversar con el equipo de salud sobre música, iluminación y medidas de confort.',exclusive:true},{id:'sin-preferencia',label:'No tengo una preferencia particular',pdf:null,exclusive:true}];
const accompaniment=questions.find(q=>q.id==='acompanante')!;
accompaniment.options.splice(1,0,{id:'no',label:'No deseo acompañamiento',pdf:'No deseo estar acompañada durante el trabajo de parto, el nacimiento ni el posparto.'});
