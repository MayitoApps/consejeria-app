import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { CounselorUser } from '../types';

interface AuthContextType {
  user: CounselorUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CounselorUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Consejero Bíblico',
          email: fbUser.email,
          photoURL: fbUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
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

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, authError, clearAuthError }}>
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
