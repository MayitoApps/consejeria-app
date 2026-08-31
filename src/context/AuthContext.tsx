import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { CounselorUser } from '../types';

interface AuthContextType {
  user: CounselorUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  isFirebaseConfigured: boolean;
}

const LOCAL_USER_STORAGE_KEY = 'ancla_local_counselor_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CounselorUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Si Firebase no está configurado o no hay auth, verificar si hay sesión local persistida
    if (!isFirebaseConfigured || !auth) {
      const savedUser = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
        }
      }
      setLoading(false);
      return;
    }

    // Si Firebase está configurado, escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Consejero Bíblico',
          email: fbUser.email,
          photoURL: fbUser.photoURL
        });
      } else {
        // Verificar si hay sesión local persistida
        const savedUser = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setAuthError('Firebase no está configurado. Agrega tus credenciales en el archivo .env o ingresa en Modo Local.');
      return;
    }

    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
        setUser({
          uid: result.user.uid,
          displayName: result.user.displayName || 'Consejero Bíblico',
          email: result.user.email,
          photoURL: result.user.photoURL
        });
      }
    } catch (error: any) {
      console.error('Error al autenticar con Google:', error);
      let message = 'No se pudo iniciar sesión con Google.';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'La ventana de inicio de sesión fue cerrada.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Operación cancelada.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'Dominio no autorizado en Firebase Console. Por favor verifica los dominios autorizados en Firebase Auth.';
      } else if (error.message) {
        message = error.message;
      }
      setAuthError(message);
      throw error;
    }
  };

  const signInAsGuest = () => {
    const guestUser: CounselorUser = {
      uid: 'consejero-local',
      displayName: 'Consejero Pastoral',
      email: 'pastoral@anclaconsejeria.org',
      photoURL: null,
      role: 'Consejero Principal'
    };
    localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const signOut = async () => {
    try {
      if (auth) {
        await fbSignOut(auth);
      }
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
      setUser(null);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInAsGuest, 
      signOut, 
      authError, 
      clearAuthError,
      isFirebaseConfigured 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

