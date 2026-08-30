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
import { db } from '../config/firebase';
import { Advisee, SessionRecord, AdviseeStatus, AdviseeTask } from '../types';

// Colección raíz aislada por usuario: users/{counselorId}/advisees
const getAdviseesRef = (counselorId: string) => {
  return collection(db, 'users', counselorId, 'advisees');
};

const getSessionsRef = (counselorId: string, adviseeId: string) => {
  return collection(db, 'users', counselorId, 'advisees', adviseeId, 'sessions');
};

/**
 * Escucha en tiempo real la lista de aconsejados del consejero autenticado
 */
export const subscribeToAdvisees = (
  counselorId: string,
  callback: (advisees: Advisee[]) => void,
  onError?: (error: Error) => void
) => {
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
 * Registra un nuevo aconsejado en Firestore
 */
export const createAdvisee = async (
  counselorId: string,
  adviseeData: Omit<Advisee, 'id' | 'counselorId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const adviseesRef = getAdviseesRef(counselorId);
  const now = new Date().toISOString();
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
  const docRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  const now = new Date().toISOString();
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
  const docRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date().toISOString()
  });
};

/**
 * Elimina un aconsejado y sus sesiones
 */
export const deleteAdvisee = async (
  counselorId: string,
  adviseeId: string
): Promise<void> => {
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
  const sessionsRef = getSessionsRef(counselorId, adviseeId);
  const now = new Date().toISOString();

  // 1. Guardar la sesión en la subcolección
  const docRef = await addDoc(sessionsRef, {
    ...sessionData,
    createdAt: now,
    timestamp: serverTimestamp()
  });

  // 2. Actualizar las tareas vigentes y la fecha de próxima sesión en el documento principal del aconsejado
  const adviseeDocRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  const updates: Partial<Advisee> = {
    updatedAt: now
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
  const adviseeDocRef = doc(db, 'users', counselorId, 'advisees', adviseeId);
  await updateDoc(adviseeDocRef, {
    currentAssignedTasks: tasks,
    updatedAt: new Date().toISOString()
  });
};
