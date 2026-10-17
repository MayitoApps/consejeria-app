export interface BiblicalPassage {
  reference: string;
  text: string;
}

export interface QuoteItem {
  text: string;
  author: string;
}

export interface CounselingNoteCard {
  id: string;
  number: number;
  category: string;
  categoryColor: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'indigo';
  title: string;
  studyQuestion: string; // Pregunta reflexiva para el modo estudio / flashcard
  coreTeaching: string; // Enseñanza extraída fielmente del documento
  biblicalPassages?: BiblicalPassage[];
  quote?: QuoteItem;
  keyQuestions?: string[]; // Preguntas clave de orientación (ej. ¿Qué ha estado haciendo usted?)
  practicalPoints?: string[]; // Puntos prácticos directos del documento
  documentPage?: string; // Ej: "pág. 72", "pág. 81"
  elementTag?: string; // Ej: "Elemento I", "Elemento II", "Elemento III"
  isIntro?: boolean; // Identificador para la tarjeta maestra de introducción
}
