import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Advisee, SessionRecord, AdviseeStatus, AdviseeTask } from '../types';

// Colección raíz aislada por usuario: users/{counselorId}/advisees
const getAdviseesRef = (counselorId: string) => {
  return collection(db, 'users', counselorId, 'advisees');
};

const getSessionsRef = (counselorId: string, adviseeId: string) => {
  return collection(db, 'users', counselorId, 'advisees', adviseeId, 'sessions');
};

// Local storage fallback keys and reactive event system
const LOCAL_ADVISEES_KEY = (counselorId: string) => `ancla_advisees_${counselorId}`;
const LOCAL_SESSIONS_KEY = (counselorId: string, adviseeId: string) => `ancla_sessions_${counselorId}_${adviseeId}`;

const localListeners: Array<() => void> = [];
const notifyLocalListeners = () => {
  localListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error('Error in local listener:', e);
    }
  });
};

const getLocalAdvisees = (counselorId: string): Advisee[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ADVISEES_KEY(counselorId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const saveLocalAdvisees = (counselorId: string, advisees: Advisee[]) => {
  try {
    localStorage.setItem(LOCAL_ADVISEES_KEY(counselorId), JSON.stringify(advisees));
    notifyLocalListeners();
  } catch (e) {
    console.error('Error saving local advisees:', e);
  }
};

const getLocalSessions = (counselorId: string, adviseeId: string): SessionRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY(counselorId, adviseeId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const saveLocalSessions = (counselorId: string, adviseeId: string, sessions: SessionRecord[]) => {
  try {
    localStorage.setItem(LOCAL_SESSIONS_KEY(counselorId, adviseeId), JSON.stringify(sessions));
    notifyLocalListeners();
  } catch (e) {
    console.error('Error saving local sessions:', e);
  }
};

/**
 * Escucha en tiempo real la lista de aconsejados del consejero autenticado
 */
export const subscribeToAdvisees = (
  counselorId: string,
  callback: (advisees: Advisee[]) => void,
  onError?: (error: Error) => void
) => {
  if (!isFirebaseConfigured || !db) {
    const handleUpdate = () => {
      callback(getLocalAdvisees(counselorId));
    };
    handleUpdate();
    localListeners.push(handleUpdate);
    return () => {
      const idx = localListeners.indexOf(handleUpdate);
      if (idx !== -1) localListeners.splice(idx, 1);
    };
  }

  try {
    const q = query(getAdviseesRef(counselorId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const advisees: Advisee[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Advisee));
      callback(advisees);
    }, (error) => {
      console.error('Error al escuchar aconsejados en Firestore:', error);
      if (onError) onError(error);
    });
  } catch (err: any) {
    console.error('Error al inicializar suscripción de aconsejados:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Registra un nuevo aconsejado en Firestore o LocalStorage
 */
export const createAdvisee = async (
  counselorId: string,
  adviseeData: Omit<Advisee, 'id' | 'counselorId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const advisees = getLocalAdvisees(counselorId);
    const newId = 'advisee_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newAdvisee: Advisee = {
      ...adviseeData,
      id: newId,
      counselorId,
      createdAt: now,
      updatedAt: now
    };
    saveLocalAdvisees(counselorId, [newAdvisee, ...advisees]);
    return newId;
  }

  const adviseesRef = getAdviseesRef(counselorId);
  const docRef = await addDoc(adviseesRef, {
    ...adviseeData,
    counselorId,
    createdAt: now,
    updatedAt: now,
    timestamp: serverTimestamp()
  });
  return docRef.id;
};

/**
 * Actualiza los datos de un aconsejado
 */
export const updateAdvisee = async (
  counselorId: string,
  adviseeId: string,
  adviseeData: Partial<Advisee>
): Promise<void> => {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const advisees = getLocalAdvisees(counselorId);
    const updated = advisees.map(a => a.id === adviseeId ? { ...a, ...adviseeData, updatedAt: now } : a);
    saveLocalAdvisees(counselorId, updated);
    return;
  }

  const docRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  await updateDoc(docRef, {
    ...adviseeData,
    updatedAt: now
  });
};

/**
 * Cambia el estado del aconsejado (Activo / Suspendido / Cerrado)
 */
export const updateAdviseeStatus = async (
  counselorId: string,
  adviseeId: string,
  status: AdviseeStatus
): Promise<void> => {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const advisees = getLocalAdvisees(counselorId);
    const updated = advisees.map(a => a.id === adviseeId ? { ...a, status, updatedAt: now } : a);
    saveLocalAdvisees(counselorId, updated);
    return;
  }

  const docRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  await updateDoc(docRef, {
    status,
    updatedAt: now
  });
};

/**
 * Elimina un aconsejado y sus sesiones
 */
export const deleteAdvisee = async (
  counselorId: string,
  adviseeId: string
): Promise<void> => {
  if (!isFirebaseConfigured || !db) {
    const advisees = getLocalAdvisees(counselorId);
    saveLocalAdvisees(counselorId, advisees.filter(a => a.id !== adviseeId));
    try {
      localStorage.removeItem(LOCAL_SESSIONS_KEY(counselorId, adviseeId));
    } catch (e) {}
    return;
  }

  const docRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  await deleteDoc(docRef);
};

/**
 * Escucha en tiempo real el historial de sesiones de un aconsejado
 */
export const subscribeToSessions = (
  counselorId: string,
  adviseeId: string,
  callback: (sessions: SessionRecord[]) => void
) => {
  if (!isFirebaseConfigured || !db) {
    const handleUpdate = () => {
      callback(getLocalSessions(counselorId, adviseeId));
    };
    handleUpdate();
    localListeners.push(handleUpdate);
    return () => {
      const idx = localListeners.indexOf(handleUpdate);
      if (idx !== -1) localListeners.splice(idx, 1);
    };
  }

  const q = query(getSessionsRef(counselorId, adviseeId), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const sessions: SessionRecord[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SessionRecord));
    callback(sessions);
  }, (error) => {
    console.error('Error al escuchar sesiones:', error);
  });
};

/**
 * Registra una nueva sesión y actualiza las tareas vigentes y próxima cita del aconsejado
 */
export const createSessionRecord = async (
  counselorId: string,
  adviseeId: string,
  sessionData: Omit<SessionRecord, 'id' | 'createdAt'>
): Promise<string> => {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const sessions = getLocalSessions(counselorId, adviseeId);
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newSession: SessionRecord = {
      ...sessionData,
      id: newSessionId,
      createdAt: now
    };
    saveLocalSessions(counselorId, adviseeId, [newSession, ...sessions]);

    // Actualizar aconsejado
    const advisees = getLocalAdvisees(counselorId);
    const updatedAdvisees = advisees.map(a => {
      if (a.id !== adviseeId) return a;
      const updates: Partial<Advisee> = {
        updatedAt: now,
        lastSessionDate: sessionData.date
      };
      if (sessionData.newAssignedTasks && sessionData.newAssignedTasks.length > 0) {
        updates.currentAssignedTasks = sessionData.newAssignedTasks;
      }
      if (sessionData.nextAppointmentDate) {
        updates.nextSessionDate = sessionData.nextAppointmentDate;
      }
      if (sessionData.nextAppointmentTime) {
        updates.nextSessionTime = sessionData.nextAppointmentTime;
      }
      return { ...a, ...updates };
    });
    saveLocalAdvisees(counselorId, updatedAdvisees);
    return newSessionId;
  }

  const sessionsRef = getSessionsRef(counselorId, adviseeId);

  // 1. Guardar la sesión en la subcolección
  const docRef = await addDoc(sessionsRef, {
    ...sessionData,
    createdAt: now,
    timestamp: serverTimestamp()
  });

  // 2. Actualizar las tareas vigentes y la fecha de próxima sesión en el documento principal del aconsejado
  const adviseeDocRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  const updates: Partial<Advisee> = {
    updatedAt: now,
    lastSessionDate: sessionData.date
  };

  if (sessionData.newAssignedTasks && sessionData.newAssignedTasks.length > 0) {
    updates.currentAssignedTasks = sessionData.newAssignedTasks;
  }
  if (sessionData.nextAppointmentDate) {
    updates.nextSessionDate = sessionData.nextAppointmentDate;
  }
  if (sessionData.nextAppointmentTime) {
    updates.nextSessionTime = sessionData.nextAppointmentTime;
  }

  await updateDoc(adviseeDocRef, updates);
  return docRef.id;
};

/**
 * Actualiza el estado de una tarea asignada en el perfil del aconsejado
 */
export const updateAdviseeTasks = async (
  counselorId: string,
  adviseeId: string,
  tasks: AdviseeTask[]
): Promise<void> => {
  const now = new Date().toISOString();

  if (!isFirebaseConfigured || !db) {
    const advisees = getLocalAdvisees(counselorId);
    const updated = advisees.map(a => a.id === adviseeId ? { ...a, currentAssignedTasks: tasks, updatedAt: now } : a);
    saveLocalAdvisees(counselorId, updated);
    return;
  }

  const adviseeDocRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  await updateDoc(adviseeDocRef, {
    currentAssignedTasks: tasks,
    updatedAt: now
  });
};

