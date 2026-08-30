import { MethodologySection } from '../types';

export const METHODOLOGY_VERSE = {
  reference: 'Romanos 15:14',
  text: 'En cuanto a vosotros, hermanos míos, yo mismo estoy también convencido de que vosotros estáis llenos de bondad, llenos de todo conocimiento y capaces también de amonestaros los unos a los otros.',
  version: 'LBLA / RVR1960',
  reflection: 'El fundamento apostólico de la consejería bíblica: creyentes llenos de bondad (amor pastoral compasivo), llenos de todo conocimiento (sabiduría bíblica exegética) y capacitados para amonestar y restaurar en gracia.'
};

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    number: 1,
    title: 'Cómo Abordar el Tiempo de Consejería',
    subtitle: 'Estructura inicial, recolección de datos y orden de la sesión pastoral',
    iconName: 'Compass',
    badge: 'Inicio & Formato',
    content: {
      overview: 'Establecer desde el primer minuto un ambiente de reverencia, confidencialidad y dirección espiritual guiada por el Espíritu Santo.',
      subsections: [
        {
          title: '1.1 Inicio de la Sesión',
          points: [
            'Apertura siempre en Oración sincera pidiendo la iluminación del Espíritu Santo y la guía de la Palabra.'
          ]
        },
        {
          title: '1.2 Formato de Información General (Ficha Inicial)',
          points: [
            '1. Nombre completo del aconsejado',
            '2. Edad',
            '3. Estado civil (Soltero, Casado, Divorciado, Viudo, Unión Libre)',
            '4. Dónde trabaja o estudia',
            '5. Con quién vive (dinámica familiar)',
            '6. Religión / Trasfondo espiritual',
            '7. Enfermedades, medicamentos y tratamientos médicos en curso',
            '8. Caso: Cuál es la razón principal por la que busca consejería',
            '9. Conocer si la persona sabe y entiende por qué es necesaria la consejería bíblica',
            '10. Motivos de oración específicos'
          ]
        },
        {
          title: '1.3 Expediente: Anotar el Detalle y Seguimiento',
          points: [
            'Clarificar la idea del problema que el aconsejado quiere compartir.',
            'Escucha activa para reconocer y discernir el problema real de raíz.',
            'Anotar cada detalle; no dejar nada confiado a la memoria.',
            'Registrar situaciones, fechas, nombres y relaciones clave.',
            'Documentar cada pregunta realizada y su respuesta textual.'
          ]
        },
        {
          title: '1.4 Desarrollo del Tiempo Pastoral',
          points: [
            'Explicar qué haremos en el tiempo de consejería bíblica.',
            'Explicar la dinámica y propósito de cada sesión.',
            'Traer instrucción bíblica fiel y dar esperanza viva en Cristo Jesús.',
            'Pedir tareas y revisar tareas (Proyecto de Santificación Personal).',
            'Cierre en Oración juntos intercediendo por la obediencia al Evangelio.'
          ]
        }
      ]
    }
  },
  {
    number: 2,
    title: 'Preguntas de Encuentro para Conocer al Aconsejado',
    subtitle: 'Establecer nuestro interés genuino por ayudarlo y explorar su corazón',
    iconName: 'HeartHandshake',
    badge: 'Diagnóstico Afectivo',
    content: {
      overview: 'Preguntas orientadas a revelar los amores supremos, las fuentes de confianza y la comprensión teológica del aconsejado.',
      questions: [
        '¿Por qué estás buscando consejería?',
        '¿Cuál es tu mayor deseo en esta etapa de tu vida?',
        '¿Qué es lo que te produce mayor placer, deleite y felicidad?',
        '¿En qué o en quién tienes puesta tu confianza para tu seguridad y bienestar?',
        '¿Cuál es el concepto que tienes de Dios y del Evangelio de Jesucristo?'
      ]
    }
  },
  {
    number: 3,
    title: 'Preguntas de Encuentro para Conocer el Problema',
    subtitle: 'Discernir el dolor, la angustia y la visión de la realidad del aconsejado',
    iconName: 'HelpCircle',
    badge: 'Dilema & Dolor',
    content: {
      overview: 'El consejero debe articular una visión bíblica de la realidad que comprenda el dilema del aconsejado y ofrezca una respuesta redentora a ese dilema.',
      questions: [
        '¿Qué te produce mayor dolor, angustia o insatisfacción actualmente?',
        '¿Cuáles son tus mayores problemas y cómo los describirías con tus propias palabras?',
        '¿Qué piensas hacer al respecto o qué soluciones has intentado hasta ahora?'
      ]
    }
  },
  {
    number: 4,
    title: 'Enseñar qué dice la Escritura Acerca del Problema',
    subtitle: 'Clarificar el problema real, dar esperanza en Cristo e instruir desde la 1ª sesión',
    iconName: 'BookOpen',
    badge: 'Instrucción Bíblica',
    content: {
      overview: 'La Palabra de Dios es la autoridad suficiente para reinterpretar las circunstancias y traer luz redentora.',
      subsections: [
        {
          title: '4.1 Entender el Problema',
          points: [
            'Después de escuchar los detalles del caso, clarificar: ¿CUÁL ES EL VERDADERO PROBLEMA delante de Dios?',
            'Dar esperanza incondicional en Cristo: amamos y servimos activamente.'
          ]
        },
        {
          title: '4.2 Dedicación e Instrucción Inmediata',
          points: [
            'La instrucción bíblica requiere dedicación y se debe compartir desde la 1ª sesión, impartiendo esperanza en Cristo.',
            'Conocer con precisión y profundidad la Palabra de Dios para aplicarla.',
            'Preparar un principio bíblico que responda en forma "general" y precisa a lo que el aconsejado registró en el cuadro de caso.'
          ]
        }
      ]
    }
  },
  {
    number: 5,
    title: 'Estudiar y ser Fiel a la Escritura',
    subtitle: 'Estudio diligente, aplicación personalizada y ajustes continuos en el expediente',
    iconName: 'FileCheck',
    badge: 'Fidelidad Exegética',
    content: {
      overview: 'El consejero bíblico es un estudiante riguroso de las Escrituras y de la literatura teológica aplicándola a la vida real.',
      items: [
        'Estudio diligente de cada caso de consejería: examinar qué dice la Escritura, los libros de teología sistemática y las obras maestras de consejería bíblica.',
        'Aplicar la Palabra a la circunstancia específica de la persona: anotar en el expediente el plan de seguimiento, los principios, las acciones y las tareas asignadas.',
        'Evaluar y ajustar en base a la información de avance del aconsejado: registrar cada ajuste y maduración en el seguimiento.'
      ]
    }
  },
  {
    number: 6,
    title: 'Qué dice la Escritura de Cada Tema de Consejería',
    subtitle: 'Sistematización teológica, versículos clave e Índice de Conocimientos',
    iconName: 'Layers',
    badge: 'Índice Doctrinal',
    content: {
      overview: 'Construir una base sólida de recursos hermenéuticos para interpretar los problemas desde la cosmovisión divina.',
      items: [
        'Estructurar la base del estudio bíblico para cada situación.',
        'Interpretar el problema bíblicamente, no a través de psicologías seculares.',
        'Sistematizar el tema de consejería: versículos clave y versículos paralelos.',
        'ÍNDICE DE CONOCIMIENTOS: Organizar en dónde encuentro la información (Teología sistemática, libros de teología de la consejería, comentarios bíblicos - libro, capítulo, página y versos clave).'
      ]
    }
  },
  {
    number: 7,
    title: 'Desarrollar el Plan de Consejería por Sesiones',
    subtitle: 'Situación real, permeado de oración y evangelio, y dispensación de la Palabra',
    iconName: 'CalendarCheck',
    badge: 'Plan por Sesiones',
    content: {
      overview: 'Diseño de un plan pastoral progresivo que guíe al aconsejado al encuentro continuo con la suficiencia de Dios.',
      subsections: [
        {
          title: '7.1 Conocer la Situación Real',
          points: [
            'Diferenciar entre percepciones emocionales y los hechos objetivos ante la soberanía de Dios.'
          ]
        },
        {
          title: '7.2 Madurar el Plan de Consejería',
          points: [
            'Permeado continuamente de oración ferviente.',
            'Permeado del Evangelio y de la Palabra de Dios.',
            'Dispensar Su Palabra examinando: ¿Para ti qué es el Evangelio? ¿Cómo está tu vida de oración? ¿Cómo está tu estudio de la Palabra? ¿Cómo está tu comunión viva con Dios? (1 Corintios 3:1-3).'
          ]
        },
        {
          title: '7.3 Esperanza y Suficiencia Divina',
          points: [
            'Escuchamos qué dice la Escritura, interpretamos bíblicamente y damos esperanza amorosa, recordando las promesas de Dios y Sus propósitos eternos.',
            'Alinearnos a la voluntad divina y a Sus atributos de carácter: saber quién es Dios en Su santidad, justicia, misericordia y omnipotencia.',
            'Recordar siempre que Dios está presente y Él es plenamente suficiente para ayudar y transformar.',
            'Usar la Escritura continuamente como ancla inamovible de esperanza.'
          ]
        }
      ]
    }
  },
  {
    number: 8,
    title: '¿Cómo Aplico la Escritura a Cada Caso de Consejería?',
    subtitle: 'Negativas, principios e historias bíblicas aplicadas al problema específico',
    iconName: 'Sparkles',
    badge: 'Aplicación Práctica',
    content: {
      overview: 'El uso hábil de la espada del Espíritu en cuatro dimensiones fundamentales:',
      items: [
        '1. Conocer las negativas bíblicas: lo que Dios prohíbe explícitamente para guardar nuestra alma del daño.',
        '2. Conocer los principios bíblicos: las verdades morales y espirituales universales que rigen la vida humana.',
        '3. Conocer las historias bíblicas y sus implicaciones doctrinales y teológicas (tipología, ejemplos de fe, caídas y restauración en Cristo).',
        '4. Aplicar este conocimiento de forma personalizada y certera al problema específico del aconsejado.'
      ]
    }
  },
  {
    number: 9,
    title: '¿Cómo Doy Seguimiento a Cada Aconsejado?',
    subtitle: 'Monitoreo constante, rendición de cuentas y constancia entre sesiones',
    iconName: 'TrendingUp',
    badge: 'Seguimiento',
    content: {
      overview: 'La consejería efectiva no se limita a 60 minutos semanales; implica acompañar al creyente en su caminar cotidiano.',
      items: [
        'Revisión minuciosa de tareas bíblicas al inicio de cada nueva sesión.',
        'Contacto pastoral breve entre sesiones para verificar el cumplimiento del plan devocional.',
        'Supervisión de la integración del aconsejado a la vida comunitaria y al discipulado de la iglesia local.',
        'Registro constante de evidencias de avance y áreas donde aún se presenta resistencia o tropiezo.'
      ]
    }
  },
  {
    number: 10,
    title: 'Proceso de Consejería & Compromiso Mutuo',
    subtitle: 'Vida espiritual del consejero, responsabilidad testimonial y pacto de consejería',
    iconName: 'ShieldCheck',
    badge: 'Compromiso & Ética',
    content: {
      overview: 'El carácter del consejero y la disposición del aconsejado son el marco ético y espiritual del ministerio.',
      subsections: [
        {
          title: '10.1 Responsabilidad del Consejero',
          points: [
            'Que nuestra vida sea realmente espiritual y llena del Espíritu Santo.',
            'Es mi responsabilidad como consejero mantener mi estabilidad espiritual, ser ejemplo visible de piedad y una influencia santa.'
          ]
        },
        {
          title: '10.2 Firma del Compromiso Mutuo (Pacto de Consejería)',
          points: [
            '1. Acudir puntualmente a todas las citas y reuniones programadas.',
            '2. Leer, estudiar con diligencia y realizar fielmente las tareas asignadas.',
            '3. Asumir con responsabilidad bíblica las consecuencias de su propio pecado y comprometerse al arrepentimiento.'
          ]
        }
      ]
    }
  },
  {
    number: 11,
    title: 'Evaluar el Proceso de Consejería',
    subtitle: 'Criterios de madurez, fruto manifiesto y pautas de graduación o cancelación',
    iconName: 'Award',
    badge: 'Evaluación & Fruto',
    content: {
      overview: 'Medir el avance no por emociones temporales sino por transformación de carácter y frutos de justicia.',
      checklist: [
        'Ver el crecimiento real de carácter conforme a la imagen de Cristo.',
        'La persona está entendiendo la raíz espiritual de su problema ante Dios.',
        'La persona está viniendo a los pies de Cristo en humilde dependencia.',
        'La persona está yendo a la Palabra de Dios para resolver sus dificultades cotidianas.',
        'La persona está buscando activamente la comunión y el servicio en su iglesia local.',
        'Hay fruto manifiesto de obediencia, santidad y amor fraternal.',
        'Advertencia Pastoral: Al no cumplir, no mostrar compromiso ni disposición tras amonestación paciente, se inicia la cancelación en amor de la consejería.'
      ]
    }
  },
  {
    number: 12,
    title: 'Bibliografía Fundamental de Consejería Bíblica',
    subtitle: 'Obras maestras teológicas y manuales de referencia indispensables',
    iconName: 'Library',
    badge: 'Biblioteca Esencial',
    content: {
      overview: 'Cuerpo doctrinal y bibliográfico de consulta permanente para la fundamentación de cada caso:',
      books: [
        '1. Teología de la Consejería Bíblica: Las Bases Doctrinales del Ministerio de la Consejería',
        '2. La Dinámica del Corazón en la Vida Cotidiana: Conectando a Cristo con la Experiencia Humana | Teología Aplicada',
        '3. La Consejería: Cómo Aconsejar Bíblicamente (John MacArthur)',
        '4. Cómo Asesorar a las Personas para que Cambien: El Procedimiento Bíblico de los Cuatro Pasos',
        '5. Capacitado para Orientar (Jay Adams)',
        '6. Manual del Consejero Cristiano (Jay Adams)',
        '7. Instrumentos en las Manos del Redentor (Paul David Tripp)',
        '8. ¿Qué Estabas Esperando? Redimiendo las Realidades del Matrimonio (Paul David Tripp)',
        '9. El Marido Integral: Guía Práctica para ser un Esposo Bíblico (Lou Priolo)'
      ]
    }
  },
  {
    number: 13,
    title: 'Comentarios y Notas Pastorales',
    subtitle: 'Espacio de reflexión y principios de discernimiento continuo',
    iconName: 'FileText',
    badge: 'Notas de Campo',
    content: {
      overview: 'Directrices prácticas adicionales para el consejero en su labor cotidiana:',
      items: [
        'a) La consejería bíblica es un ministerio de la gracia redentora; no sustituye la predicación ni los medios de gracia ordinarios de la iglesia local, sino que los personaliza.',
        'b) Mantén siempre una postura de humildad: el consejero no es el Sanador, sino el amigo del Novio que apunta a Cristo.',
        'c) La paciencia pastoral (2 Timoteo 4:2) debe acompañar cada paso del proceso, recordando cómo Dios tuvo paciencia con nosotros.',
        'd) La confidencialidad es sagrada, excepto en situaciones donde la ley o la Escritura exigen protección inmediata de vidas (consejeros maduros y liderazgo eclesiástico).'
      ]
    }
  }
];
