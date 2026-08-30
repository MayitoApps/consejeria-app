export interface ExegeticalStudy {
  originalTerms: string;
  historicalContext: string;
  theologicalPrinciple: string;
  pastoralApplication: string;
}

export interface VerseItem {
  reference: string;
  text: string;
  version?: string;
  exegesis: ExegeticalStudy;
}

export interface DocumentSection {
  number?: number;
  title: string;
  paragraphs: string[];
}

export interface BibleStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  readTime: string;
  summary: string;
  sections: {
    verses: VerseItem[];
    introduction: DocumentSection;
    problemToTreat: DocumentSection;
    rootProblem: DocumentSection;
    consequences: DocumentSection;
    counselingApproach: DocumentSection;
    sanctificationFollowUp: DocumentSection;
    conclusions: DocumentSection;
  };
}

export interface BookPassage {
  id: string;
  bookTitle: string;
  author: string;
  chapter: string;
  pages: string;
  passageTitle: string;
  excerpt: string;
  fullText: string;
  biblicalReferences: string[];
  keyTakeaway: string;
}

export interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  year?: string;
  publisher?: string;
  coverGradient: string;
  coverIcon?: string;
  summary: string;
  passages: BookPassage[];
}

export interface GlossaryTopic {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  categoryColor?: string;
  books: RecommendedBook[];
}

export interface MethodologySection {
  number: number;
  title: string;
  subtitle?: string;
  badge: string;
  iconName: string;
  content: {
    overview?: string;
    subsections?: {
      title: string;
      points: string[];
    }[];
    questions?: string[];
    items?: string[];
    checklist?: string[];
    books?: string[];
  };
}

export type AdviseeStatus = 'Activo' | 'En Pausa' | 'Suspendido' | 'Cerrado' | 'Completado';
export type MaritalStatus = 'Soltero(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)' | 'Unión Libre' | 'Otro';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'No Realizada' | 'Completada' | 'Parcial';

export interface AdviseeTask {
  id: string;
  description: string;
  biblicalReference?: string;
  status?: TaskStatus;
  isCompleted?: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface TaskReviewItem {
  taskId: string;
  description?: string;
  taskDescription?: string;
  status: TaskStatus;
  feedback?: string;
  notes?: string;
}

export interface SessionRecord {
  id: string;
  adviseeId?: string;
  sessionNumber: number;
  date: string;
  time?: string;
  theme?: string;
  mainProblem?: string;
  spiritualState?: string;
  biblicalPassagesWorked?: string[];
  sessionSummary?: string;
  generalNotes?: string;
  previousTasksReview?: TaskReviewItem[];
  actionPlan?: string[];
  assignedHomework?: string[];
  prayerRequests?: string[];
  notes?: string;
  status?: 'completada' | 'pendiente' | 'en_progreso';
  evaluationScore?: number;
  newAssignedTasks?: AdviseeTask[];
  nextAppointmentDate?: string;
  nextAppointmentTime?: string;
  createdAt?: string;
}

export interface Advisee {
  id: string;
  counselorId?: string;
  userId?: string;
  fullName: string;
  name?: string;
  age: number;
  phone?: string;
  email?: string;
  maritalStatus: MaritalStatus;
  birthDate?: string;
  occupation?: string;
  livingWith?: string;
  religion?: string;
  medicalConditions?: string;
  referredBy?: string;
  reason?: string;
  counselingReason?: string;
  backgroundNotes?: string;
  understandsNecessity?: boolean;
  status: AdviseeStatus;
  startDate: string;
  lastSessionDate?: string;
  nextSessionDate?: string;
  nextSessionTime?: string;
  currentAssignedTasks?: AdviseeTask[];
  sessions?: SessionRecord[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CounselorUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
}
