import { CounselingNoteCard } from '../types/notes';

export const COUNSELING_NOTE_CARDS: CounselingNoteCard[] = [
  // --- TARJETA 1: INTRODUCCIÓN AL MINISTERIO DE CONSEJERÍA BÍBLICA ---
  {
    id: 'nota-01',
    number: 1,
    category: 'Introducción',
    categoryColor: 'emerald',
    title: 'INTRODUCCIÓN: El Ministerio de Discipular y Aconsejar Bíblicamente',
    studyQuestion: '¿Por qué discipular y aconsejar bíblicamente es vital para la salud espiritual de la iglesia local?',
    coreTeaching: 'Si existe un ministerio que es vital para la salud espiritual de una iglesia local es el de discipular y aconsejar bíblicamente. El Señor Jesucristo nos llama a ‘Hacer discípulos… enseñándoles a guardar todo lo que os he mandado...’, este es el ministerio que Efesios 4:12 nos apunta: a fin de capacitar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo.',
    biblicalPassages: [
      {
        reference: 'Efesios 4:12',
        text: '12 a fin de capacitar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo.'
      },
      {
        reference: 'Efesios 4:13',
        text: '13 hasta que todos lleguemos a la unidad de la fe y del conocimiento pleno del Hijo de Dios, a la condición de un hombre maduro, a la medida de la estatura de la plenitud de Cristo;'
      },
      {
        reference: 'Colosenses 1:28',
        text: '28 A Él nosotros proclamamos, amonestando a todos los hombres, y enseñando a todos los hombres con toda sabiduría, a fin de poder presentar a todo hombre perfecto en Cristo.'
      }
    ],
    quote: {
      author: 'Definición Central de Consejería Bíblica',
      text: 'Consejería bíblica es la aplicación del ministerio uno a uno modelado por Cristo, usando la sabiduría de su Palabra para guiar a la persona en el proceso de cambio bíblico y experimentar la transformación en su caminar que dé gloria a Dios.'
    },
    practicalPoints: [
      '1. Reconociendo siempre que el Consejero detrás de toda su consejería es el Espíritu Santo.',
      '2. El aconsejado y el consejero tienen un trabajo que hacer, entendiendo y actuando de acuerdo a la Biblia.',
      '3. El ministerio de la palabra pública (predicación expositiva), así como la ministración de la palabra en privado, uno a uno, son la base de una iglesia sana bíblicamente.',
      'De este ministerio depende el crecimiento espiritual de cada uno de nosotros al conocer y vivir lo que Dios pide a su iglesia.'
    ],
    keyQuestions: [
      'Quisiera que entendamos la importancia del ministerio al que Dios nos ha llamado...'
    ],
    elementTag: 'Fundamento Pastoral',
    documentPage: 'Introducción',
    isIntro: true
  },
  // --- MÓDULO 1: FUNDAMENTOS Y DIAGNÓSTICO ---
  {
    id: 'nota-02',
    number: 2,
    category: 'Fundamentos del Consejero',
    categoryColor: 'amber',
    title: 'El Justo como Buen Consejero',
    studyQuestion: '¿Por qué el justo es apto para aconsejar con sabiduría y rectitud?',
    coreTeaching: 'El justo es un buen consejero por ser recto e imparcial y por distinguir entre el bien y el mal. La boca del justo profiere sabiduría y su lengua habla rectitud porque la ley de su Dios está en su corazón.',
    biblicalPassages: [
      {
        reference: 'Salmo 37:29–31',
        text: 'Los justos poseerán la tierra, y para siempre morarán en ella. La boca del justo profiere sabiduría y su lengua habla rectitud. La ley de su Dios está en su corazón; no vacilan sus pasos.'
      }
    ],
    quote: {
      author: 'K. Taylor',
      text: 'El justo es un buen consejero por ser recto e imparcial y por distinguir entre el bien y el mal.'
    },
    practicalPoints: [
      'Un consejero bíblico es recto e imparcial.',
      'Distingue con claridad entre el bien y el mal.',
      'Guarda la ley de Dios en su corazón para que sus pasos no vacilen.'
    ]
  },
  {
    id: 'nota-03',
    number: 3,
    category: 'Diagnóstico de la Iglesia',
    categoryColor: 'rose',
    title: 'El Diagnóstico de R. Mainers (Salmo 1)',
    studyQuestion: '¿Por qué las personas acuden a los impíos para resolver sus problemas personales?',
    coreTeaching: 'El salmista en el Salmo 1 llama bendito al hombre que no anda según el consejo de los impíos. A pesar de ello, debido a que la iglesia cristiana está fracasando al no proveer este consejo sabio y bueno, se obliga a las personas a ir a los impíos a encontrar en ellos la solución a sus problemas.',
    biblicalPassages: [
      {
        reference: 'Salmo 1:1',
        text: 'Bienaventurado el varón que no anduvo en consejo de malos, ni estuvo en camino de pecadores, ni en silla de escarnecedores se ha sentado.'
      }
    ],
    quote: {
      author: 'R. Mainers',
      text: '¿Tememos acaso que nuestro Señor no pueda hacer frente a los problemas del hombre?'
    },
    practicalPoints: [
      'R. Mainers pone el dedo en la llaga sobre el descuido del consejo sabio en la iglesia.',
      'La iglesia no debe empujar a los creyentes a buscar respuestas en sistemas impíos.',
      'El Señor tiene el poder y la suficiencia para hacer frente a los problemas del hombre.'
    ]
  },
  {
    id: 'nota-04',
    number: 4,
    category: 'Principios de Conducta',
    categoryColor: 'emerald',
    title: 'Eficacia de los Principios Bíblicos de Conducta',
    studyQuestion: '¿Qué es lo que verdaderamente da resultado en la vida del aconsejado?',
    coreTeaching: 'El comprender y seguir las exigencias de los principios bíblicos de conducta, tras la confesión y el arrepentimiento del pecado, dan resultado.',
    practicalPoints: [
      'Paso 1: Confesión sincera del pecado.',
      'Paso 2: Arrepentimiento genuino.',
      'Paso 3: Comprensión de las exigencias bíblicas de conducta.',
      'Paso 4: Obediencia y seguimiento práctico de los principios divinos.'
    ]
  },
  {
    id: 'nota-05',
    number: 5,
    category: 'Resolución de Conflictos',
    categoryColor: 'blue',
    title: 'Confrontación Oportuna y Honrada',
    studyQuestion: '¿Cuándo y cómo deben tratarse los desacuerdos y pecados entre hermanos?',
    coreTeaching: 'Confrontar a las personas, hablando honradamente de los asuntos en juego antes que crezcan más, en vista del mandato de reconciliación y restauración personal.',
    biblicalPassages: [
      {
        reference: 'Mateo 5:23–24',
        text: 'Por tanto, si estás presentando tu ofrenda en el altar, y allí te acuerdas que tu hermano tiene algo contra ti, deja tu ofrenda allí delante del altar, y ve, reconcíliate primero con tu hermano, y entonces ven y presenta tu ofrenda.'
      },
      {
        reference: 'Mateo 18:15–18',
        text: 'Y si tu hermano peca, ve y repréndelo a solas; si te escucha, has ganado a tu hermano. Pero si no te escucha, lleva contigo a uno o a dos más, para que TODA PALABRA SEA CONFIRMADA POR BOCA DE DOS O TRES TESTIGOS. Y si rehúsa escucharlos, dilo a la iglesia...'
      }
    ],
    practicalPoints: [
      'Hablar con honestidad y franqueza antes de que el problema crezca.',
      'Prioridad de la reconciliación antes que el culto externo (Mt 5:23-24).',
      'Seguir el orden bíblico: primero a solas con el hermano (Mt 18:15).'
    ]
  },
  {
    id: 'nota-06',
    number: 6,
    category: 'Autoridad Bíblica',
    categoryColor: 'amber',
    title: 'Reexaminación Bíblica y Fiabilidad de la Escritura',
    studyQuestion: '¿Cuál debe ser el filtro de todo método y concepto en la orientación?',
    coreTeaching: 'Todos los conceptos, términos y métodos que se utilizan en orientación necesitan ser reexaminados bíblicamente. Es la Escritura la que nos dice lo que Dios dice acerca de lo que debemos hacer. La fiabilidad total de las Escrituras en su tratamiento de las personas ha quedado demostrada.',
    practicalPoints: [
      'Reexaminar bajo el lente bíblico cualquier concepto o término secular.',
      'La Escritura es la única que tiene la autoridad de decir qué debemos hacer.',
      'La fiabilidad de las Escrituras para tratar los dilemas del ser humano es total y probada.'
    ]
  },
  {
    id: 'nota-07',
    number: 7,
    category: 'Presuposiciones',
    categoryColor: 'purple',
    title: 'El Análisis Presuposicional de Cornelius Van Til',
    studyQuestion: '¿Qué buscan en el fondo todos los sistemas no cristianos de orientación?',
    coreTeaching: 'El Dr. Cornelius Van Til del Westminster Theological Seminary ha señalado la importancia del análisis presuposicional. Ha demostrado que en el fondo todos los sistemas no cristianos demandan autonomía para el hombre, con lo que buscan destronar a Dios.',
    practicalPoints: [
      'Importancia del análisis presuposicional: examinar las premisas de origen.',
      'Los sistemas no cristianos parten de la falsa premisa de autonomía humana.',
      'Cualquier propuesta que busque la autonomía del hombre persigue destronar a Dios.'
    ]
  },

  // --- MÓDULO 2: LA OBRA DEL ESPÍRITU SANTO ---
  {
    id: 'nota-08',
    number: 8,
    category: 'La Obra del Espíritu Santo',
    categoryColor: 'indigo',
    title: 'El Espíritu Santo, El Paracleto',
    studyQuestion: '¿En qué se fundamenta la orientación bíblica eficaz?',
    coreTeaching: 'La orientación bíblica eficaz se basa en la obra del Espíritu Santo, El paracleto (consejero "otro del mismo tipo", tal como Cristo había sido para sus discípulos).',
    biblicalPassages: [
      {
        reference: 'Juan 14:16–17',
        text: 'Y yo rogaré al Padre, y os dará otro Consolador (Paracleto), para que esté con vosotros para siempre: el Espíritu de verdad, al cual el mundo no puede recibir...'
      }
    ],
    practicalPoints: [
      'El Paracleto es un Consejero divino de la misma naturaleza de Cristo.',
      'El consejero humano solo es un instrumento; la obra eficaz proviene del Espíritu.',
      'Sin el Espíritu Santo no hay verdadera consejería bíblica.'
    ]
  },
  {
    id: 'nota-09',
    number: 9,
    category: 'La Obra del Espíritu Santo',
    categoryColor: 'emerald',
    title: 'La Fuente de Todos los Cambios Genuinos',
    studyQuestion: '¿De dónde procede el cambio auténtico de la personalidad?',
    coreTeaching: 'El Espíritu Santo es la fuente de todos los cambios genuinos de personalidad, iniciando con la regeneración del pecador (impartición de vida espiritual) y continuando en la santificación del creyente.',
    biblicalPassages: [
      {
        reference: '2 Corintios 3:18',
        text: 'Por tanto, nosotros todos, mirando a cara descubierta como en un espejo la gloria del Señor, somos transformados de gloria en gloria en la misma imagen, como por el Espíritu del Señor.'
      }
    ],
    practicalPoints: [
      'Punto de partida: Regeneración (impartición de nueva vida espiritual).',
      'Proceso continuo: Santificación progresiva del creyente.',
      'Cualquier cambio sin el Espíritu es superficial o aparente.'
    ]
  },
  {
    id: 'nota-10',
    number: 10,
    category: 'La Obra del Espíritu Santo',
    categoryColor: 'amber',
    title: 'Lo que el Espíritu Santo Espera de los Consejeros',
    studyQuestion: '¿Qué demanda el Espíritu Santo de quien orienta a otros?',
    coreTeaching: 'El Espíritu Santo espera que los consejeros conozcan la Escritura (lo que Dios dice de sí mismo y de nosotros) y vivan conforme a lo que Dios ha revelado de sí mismo, de su carácter y de sus propósitos.',
    biblicalPassages: [
      {
        reference: 'Efesios 4:7–13',
        text: 'A fin de perfeccionar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo, hasta que todos lleguemos a la unidad de la fe y del conocimiento del Hijo de Dios, a un varón perfecto...'
      }
    ],
    practicalPoints: [
      'Conocer profundamente lo que Dios revela de Sí mismo y de la condición humana.',
      'Vivir de acuerdo con el carácter y los santos propósitos de Dios.',
      'El consejero debe modelar primero la verdad antes de impartirla.'
    ]
  },
  {
    id: 'nota-11',
    number: 11,
    category: 'La Obra del Espíritu Santo',
    categoryColor: 'blue',
    title: 'El Ministerio de la Palabra y la Oración',
    studyQuestion: '¿Cómo debe estudiar el consejero para conocer la respuesta de Dios?',
    coreTeaching: 'La obra de orientación se basa principalmente en el ministerio de la Palabra, que es poderosa para transformar la vida del creyente. Es necesario el estudio de la biblia en oración y en total dependencia de su Espíritu para entender y conocer lo que Dios ha dicho del consejo bíblico y de cada problemática presentada al consejero.',
    biblicalPassages: [
      {
        reference: '2 Timoteo 3:16–17',
        text: 'Toda Escritura es inspirada por Dios y útil para enseñar, para reprender, para corregir, para instruir en justicia, a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra.'
      }
    ],
    practicalPoints: [
      'La Palabra es el medio poderoso que transforma vidas.',
      'Estudio diligente de las Escrituras unido a la oración.',
      'Buscar lo que Dios dice específicamente para cada problemática.'
    ]
  },
  {
    id: 'nota-12',
    number: 12,
    category: 'La Obra del Espíritu Santo',
    categoryColor: 'purple',
    title: 'Qué Significa Ser "Guiados por el Espíritu"',
    studyQuestion: '¿Cómo se define bíblicamente ser guiados por el Espíritu?',
    coreTeaching: 'Ser guiados por el Espíritu (Gálatas 5:18) debe entenderse como ser guiados por medio de la Palabra de Dios en total dependencia del Espíritu de nuestro Dios.',
    biblicalPassages: [
      {
        reference: 'Gálatas 5:18',
        text: 'Pero si sois guiados por el Espíritu, no estáis bajo la ley.'
      }
    ],
    practicalPoints: [
      'No es misticismo ni impresiones subjetivas sin base bíblica.',
      'Ser guiado por el Espíritu es ser guiado por la Palabra inspirada por Él.',
      'Se vive en dependencia constante y sumisión al Espíritu de Dios.'
    ]
  },
  {
    id: 'nota-13',
    number: 13,
    category: 'La Obra del Espíritu Santo',
    categoryColor: 'rose',
    title: 'Actitud, Técnicas y el Peligro del Fracaso',
    studyQuestion: '¿Qué determina el éxito o fracaso de los métodos en consejería?',
    coreTeaching: 'La metodología y la técnica, la habilidad y la ejercitación de los dones solo funcionan en armonía con la obra del Espíritu. Lo que hace la diferencia es la actitud y la motivación internas de uno mismo. Lo que esté apartado de una total dependencia del Espíritu, el abuso de los dones o técnicas con fines egoístas está destinado al fracaso.',
    keyQuestions: [
      '¿Hacemos lo que hacemos apoyándonos en nuestros propios esfuerzos, dependiendo de métodos y técnicas?',
      '¿O reconocemos nuestra propia incapacidad y pedimos que el Espíritu utilice Sus dones y métodos?'
    ],
    practicalPoints: [
      'Técnicas sin el Espíritu están destinadas al fracaso.',
      'Reconocer la propia incapacidad humana.',
      'Una vida gobernada por el Espíritu obedece los mandamientos con gozo y gratitud.'
    ]
  },

  // --- MÓDULO 3: LA ORIENTACIÓN NOUTÉTICA ---
  {
    id: 'nota-14',
    number: 14,
    category: 'La Orientación Noutética',
    categoryColor: 'amber',
    title: 'Jesucristo en el Centro',
    studyQuestion: '¿Quién ocupa el centro de la orientación cristiana?',
    coreTeaching: 'Jesucristo está en el centro de toda la orientación cristiana. Conocemos de Cristo y de su voluntad por la Palabra de Dios; la Escritura nos muestra lo que Cristo ha indicado con respecto a la orientación de personas con problemas personales.',
    practicalPoints: [
      'Cristocéntrica: Cristo no es un accesorio, es el centro absoluto.',
      'Su voluntad se conoce a través de la Palabra de Dios.',
      'Las instrucciones de Cristo abordan directamente los problemas personales.'
    ]
  },
  {
    id: 'nota-15',
    number: 15,
    category: 'La Orientación Noutética',
    categoryColor: 'indigo',
    title: 'Suficiencia, Inerrancia y Autoridad de la Biblia',
    studyQuestion: '¿Cuáles son las cualidades de la Biblia para la vida piadosa?',
    coreTeaching: 'La Biblia es suficiente, inerrante y autoritativa para la vida piadosa que solo Cristo produce, por su gracia, por medio de la fe y su amor derramado en nosotros por su Espíritu que mora en nosotros y nos permite desear que Dios trate con nuestro pecado y ser transformados a la imagen de Cristo.',
    practicalPoints: [
      'Suficiente: Contiene todo lo necesario para la vida y la piedad.',
      'Inerrante: Verdad absoluta sin error.',
      'Autoritativa: Obliga nuestra conciencia y conducta.',
      'Propósito: Que Dios trate con el pecado y seamos transformados a la imagen de Cristo.'
    ]
  },
  {
    id: 'nota-16',
    number: 16,
    category: 'La Orientación Noutética',
    categoryColor: 'emerald',
    title: 'El Ministerio de Pablo: Todo el Consejo de Dios',
    studyQuestion: '¿Cómo entendía el apóstol Pablo la relación entre la predicación y el consejo personal?',
    coreTeaching: 'El apóstol Pablo consideraba la confrontación Noutética como una parte vital del ministerio, donde la Palabra predicada en público y la confrontación Noutética personal son centrales en el ministerio de la palabra. Esto es lo que conocemos como "Todo el consejo de Dios", dando a conocer el evangelio y lo que Dios dice de los problemas a los que el hombre se enfrenta día a día.',
    biblicalPassages: [
      {
        reference: 'Colosenses 1:28–29',
        text: 'A Él nosotros proclamamos, amonestando a todos los hombres, y enseñando a todos los hombres con toda sabiduría, a fin de poder presentar a todo hombre perfecto en Cristo. Y con este fin también trabajo, esforzándome según su poder que obra poderosamente en mí.'
      }
    ],
    practicalPoints: [
      'Pilar 1: La Palabra predicada en público.',
      'Pilar 2: La confrontación Noutética en lo personal.',
      'La proclamación de Cristo involucraba amonestar y enseñar a cada individuo.'
    ]
  },
  {
    id: 'nota-17',
    number: 17,
    category: 'La Orientación Noutética',
    categoryColor: 'rose',
    title: 'Amonestar a Cada Uno con Lágrimas (Hechos 20:31)',
    studyQuestion: '¿Qué nos enseña la práctica pastoral de Pablo en Éfeso?',
    coreTeaching: 'Las palabras de Hechos 20:31 nos dan una profunda percepción del ministerio de Pablo: a cada hombre que fue amonestado y corregido para llevarlos al modelo de perfección por medio de su Palabra, enseñando y confrontando noutéticamente en lo personal.',
    biblicalPassages: [
      {
        reference: 'Hechos 20:31',
        text: 'Por tanto, estad alerta, recordando que por tres años, de noche y de día, no cesé de amonestar a cada uno con lágrimas.'
      }
    ],
    practicalPoints: [
      'Constancia: Por tres años, de noche y de día.',
      'Individualidad: No cesó de amonestar a cada uno.',
      'Compasión pastoral profunda: Amonestaba con lágrimas.'
    ]
  },

  // --- MÓDULO 4: LOS TRES ELEMENTOS DE LA CONFRONTACIÓN NOUTÉTICA (PÁG. 72) ---
  {
    id: 'nota-18',
    number: 18,
    category: 'Tres Elementos (pág. 72)',
    categoryColor: 'amber',
    elementTag: 'Elemento I',
    documentPage: 'pág. 72',
    title: 'Elemento I: Presupone un Problema y Necesidad de Cambio',
    studyQuestion: '¿Qué presupone siempre la confrontación Noutética en la persona?',
    coreTeaching: 'La confrontación Noutética implica siempre que hay un problema, y presupone un obstáculo que hay que vencer. Noutésis implica específicamente la necesidad de cambio en la persona confrontada: alguna necesidad, dificultad o pecado que necesariamente tiene que ser reconocido y tratado. Es una condición en el consultante que Dios desea ver cambiada.',
    practicalPoints: [
      'Presupone la existencia de un obstáculo o problema real.',
      'El pecado, dificultad o necesidad debe ser reconocido y tratado.',
      'El propósito fundamental es efectuar un cambio en la personalidad y en el comportamiento.'
    ]
  },
  {
    id: 'nota-19',
    number: 19,
    category: 'Tres Elementos (pág. 72)',
    categoryColor: 'blue',
    elementTag: 'Elemento II',
    documentPage: 'pág. 72',
    title: 'Elemento II: Resolución por Medios Verbales (Noutesia vs Paideia)',
    studyQuestion: '¿Por qué medios se resuelven los problemas noutéticamente y qué distingue a noutesia de paideia?',
    coreTeaching: 'Los problemas se resuelven noutéticamente por medios verbales. Tiene como meta enderezar al individuo, cambiando sus normas de comportamiento para que estas se conformen a la norma bíblica.',
    quote: {
      author: 'Capacitado para orientar (pág. 72)',
      text: 'En la enseñanza por la palabra – por la palabra de aliento, cuando es suficiente – pero también por la reconvención, de reproche, de acusación, cuando sean necesarias; distinguiéndola de la enseñanza por hechos y por disciplina como se expresa con "paideia"… La característica distintiva de noutesia es la de la instrucción por la palabra hablada.'
    },
    practicalPoints: [
      'Medio verbal: Instrucción por la palabra hablada.',
      'Palabra de aliento cuando es suficiente.',
      'Reconvención, reproche o acusación cuando sean necesarias.',
      'Meta: Enderezar al individuo hacia la norma bíblica.'
    ]
  },
  {
    id: 'nota-20',
    number: 20,
    category: 'Tres Elementos (pág. 72)',
    categoryColor: 'emerald',
    elementTag: 'Elemento II',
    documentPage: 'pág. 72',
    title: 'El Cambio Bíblico: Confesión, Arrepentimiento y Nuevas Normas',
    studyQuestion: '¿Cómo se produce el cambio de personalidad según las Escrituras?',
    coreTeaching: 'El cambio de personalidad en las Escrituras involucra confesión, arrepentimiento, y el desarrollo de nuevas normas acordes con la biblia. No de forma legalista, sino que todo debe entenderse como la obra del Espíritu Santo. La confrontación Noutética incluye el ministerio de la Palabra, que es efectivo solo por el poder del Espíritu Santo.',
    biblicalPassages: [
      {
        reference: 'Hebreos 12:5, 11',
        text: 'Hijo mío, no tengas en poco la disciplina del Señor, ni te desanimes al ser reprendido por Él... Al presente ninguna disciplina parece ser causa de gozo, sino de tristeza; sin embargo, a los que han sido ejercitados por medio de ella, les da después fruto apacible de justicia.'
      }
    ],
    practicalPoints: [
      'Involucra confesión y arrepentimiento.',
      'Desarrollo de nuevas normas bíblicas de vida.',
      'Lejos de todo legalismo: es obra genuina del Espíritu Santo.',
      'La disciplina produce fruto apacible de justicia.'
    ]
  },
  {
    id: 'nota-21',
    number: 21,
    category: 'Tres Elementos (pág. 72)',
    categoryColor: 'rose',
    elementTag: 'Elemento II',
    documentPage: 'pág. 72',
    title: 'Ejemplo de Fracaso en Confrontar: Elí',
    studyQuestion: '¿Cuál fue el grave fracaso del sacerdote Elí en la confrontación noutética?',
    coreTeaching: 'Un ejemplo de fracaso al confrontar noutéticamente lo encontramos en Elí. Dios juzgó su casa para siempre a causa de la iniquidad que él conocía, pues sus hijos trajeron sobre sí maldición y él no los reprendió.',
    biblicalPassages: [
      {
        reference: '1º Samuel 3:13',
        text: 'Porque le he hecho saber que estoy a punto de juzgar su casa para siempre a causa de la iniquidad que él conocía, pues sus hijos trajeron sobre sí una maldición, y él no los reprendió.'
      }
    ],
    practicalPoints: [
      'Elí conocía la iniquidad de sus hijos.',
      'Su fracaso fue callar y no reprender con fidelidad.',
      'No confrontar el pecado conocido acarrea juicio y maldición.'
    ]
  },
  {
    id: 'nota-22',
    number: 22,
    category: 'Las Preguntas en Consejería',
    categoryColor: 'amber',
    elementTag: 'Metodología Didáctica',
    title: 'El Error del "¿Por Qué?" vs El Poder del "¿Qué?"',
    studyQuestion: '¿Por qué no debemos malgastar tiempo preguntando "¿Por qué?" y qué se debe preguntar?',
    coreTeaching: 'La razón por la que las personas entran en problemas en su relación con Dios y con otros se deriva de sus naturalezas pecaminosas. Se malgasta mucho tiempo preguntando "¿Por qué?". Esta pregunta puede llevar a especulaciones y a desplazar la propia responsabilidad. En cambio, "qué" lleva a solucionar los problemas.',
    keyQuestions: [
      '¿Qué ha estado haciendo usted?',
      '¿Qué es lo que se puede hacer en esta situación?',
      '¿Qué es lo que dice Dios que se ha de hacer?',
      '¿Qué es lo que va mal?',
      '¿Qué se debe hacer al respecto?'
    ],
    practicalPoints: [
      'El "¿Por qué?" fomenta excusas, especulaciones y evasión de responsabilidad.',
      'El "¿Qué?" enfoca la conducta real y la responsabilidad personal.',
      'Produce un cambio de dirección a una mayor conformidad a las normas bíblicas.'
    ]
  },
  {
    id: 'nota-23',
    number: 23,
    category: 'Tres Elementos (pág. 72)',
    categoryColor: 'purple',
    elementTag: 'Elemento III',
    documentPage: 'pág. 72',
    title: 'Elemento III: Motivado por Amor y Preocupación Profunda',
    studyQuestion: '¿Cuál es la motivación y la meta del tercer elemento de la confrontación?',
    coreTeaching: 'El tercer elemento incluye el cambio de aquello que hace daño en la vida del consultante. La meta debe ser enfrentarse a los obstáculos de manera directa y vencerlos verbalmente mediante el consejo, admonición y advertencia, para influenciar la mente y las disposiciones de la persona, corrigiendo según las circunstancias.',
    biblicalPassages: [
      {
        reference: '1 Corintios 4:14',
        text: 'No escribo esto para avergonzaros, sino para amonestaros como a hijos míos amados.'
      },
      {
        reference: 'Colosenses 1:28',
        text: 'A Él nosotros proclamamos, amonestando a todos los hombres, y enseñando a todos los hombres con toda sabiduría, a fin de poder presentar a todo hombre perfecto en Cristo.'
      }
    ],
    practicalPoints: [
      'No se busca avergonzar, sino amonestar como a hijos amados.',
      'Motivado por el amor y una profunda preocupación por el bien del aconsejado.',
      'Meta suprema: Que Dios sea glorificado y el hombre sea presentado perfecto en Cristo.'
    ]
  },

  // --- MÓDULO 5: EL PROPÓSITO DE LAS ESCRITURAS Y EL COMPROMISO ---
  {
    id: 'nota-24',
    number: 24,
    category: 'El Propósito de las Escrituras',
    categoryColor: 'blue',
    title: 'Las Escrituras Están Orientadas Noutéticamente',
    studyQuestion: '¿Cuáles son los cuatro medios noutéticos de 2 Timoteo 3:16?',
    coreTeaching: 'Las Escrituras están orientadas noutéticamente y son útiles para perfeccionar al hombre de Dios mediante los medios Noutéticos: enseñanza, reprensión, corrección e instrucción en justicia. El término Noutética parece ser un calificativo para consejo u orientación.',
    biblicalPassages: [
      {
        reference: '2 Timoteo 3:16',
        text: 'Toda Escritura es inspirada por Dios y útil para enseñar, para reprender, para corregir, para instruir en justicia.'
      }
    ],
    practicalPoints: [
      '1. Enseñar: Impartir la verdad de Dios.',
      '2. Reprender: Señalar el desvío y el pecado.',
      '3. Corregir: Enderezar lo torcido.',
      '4. Instruir en justicia: Educar en el nuevo camino que Dios aprueba.'
    ]
  },
  {
    id: 'nota-25',
    number: 25,
    category: 'Cuidado y Afecto Pastoral',
    categoryColor: 'emerald',
    title: 'Ternura Maternal e Impartición de Nuestras Vidas',
    studyQuestion: '¿Con qué afecto y actitud debe impartirse la orientación bíblica?',
    coreTeaching: 'La confrontación noutética no es fría ni distante; se ejerce con benignidad y entrañable amor, como una madre que cría con ternura a sus hijos, dispuestos a impartir no solo el evangelio sino nuestras propias vidas.',
    biblicalPassages: [
      {
        reference: '1 Tesalonicenses 2:7–8',
        text: 'Más bien demostramos ser benignos entre vosotros, como una madre que cría con ternura a sus propios hijos. Teniendo así un gran afecto por vosotros, nos hemos complacido en impartiros no solo el evangelio de Dios, sino también nuestras propias vidas, pues llegasteis a sernos muy amados.'
      }
    ],
    practicalPoints: [
      'Benignidad y ternura hacia los aconsejados.',
      'Afecto pastoral genuino.',
      'Entregar el evangelio y la propia vida por amor a ellos.'
    ]
  },
  {
    id: 'nota-26',
    number: 26,
    category: 'Propósito y Compromiso',
    categoryColor: 'amber',
    documentPage: 'pág. 81',
    title: 'El Compromiso Noutético y los Tres Fines de la Palabra',
    studyQuestion: '¿Cuáles son los tres propósitos de aplicar la Palabra de Dios en la vida de las personas?',
    coreTeaching: 'La aplicación de la Palabra de Dios en la vida de las personas tiene como fin manifestar normas pecaminosas, corregir lo errado y establecer nuevas formas de vida que Dios aprueba. A esto nos llama el compromiso Noutético.',
    practicalPoints: [
      '1. Manifestar las normas pecaminosas ocultas o justificadas.',
      '2. Corregir lo que está torcido y errado.',
      '3. Establecer nuevas formas de vida aprobadas por Dios.',
      'Asumir con fidelidad "El compromiso Noutético" (pág. 81).'
    ]
  }
];

export const CATEGORIES = [
  'Todos',
  'Introducción',
  'Fundamentos del Consejero',
  'Diagnóstico de la Iglesia',
  'Principios de Conducta',
  'Resolución de Conflictos',
  'Autoridad Bíblica',
  'Presuposiciones',
  'La Obra del Espíritu Santo',
  'La Orientación Noutética',
  'Tres Elementos (pág. 72)',
  'Las Preguntas en Consejería',
  'El Propósito de las Escrituras',
  'Cuidado y Afecto Pastoral',
  'Propósito y Compromiso'
] as const;
