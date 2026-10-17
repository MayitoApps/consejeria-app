import React, { useState } from 'react';
import { Anchor, ShieldCheck, Lock, AlertCircle, Sparkles, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, signInAsGuest, authError, clearAuthError, isFirebaseConfigured } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalSignIn = () => {
    signInAsGuest();
  };

  return (
    <div className="min-h-screen bg-[#f2f4ee] flex items-center justify-center p-4 selection:bg-sage-200 selection:text-sage-950">
      <div className="w-full max-w-sm bg-[#fbfcfa] rounded-2xl p-6 sm:p-7 border border-[#d2daca] shadow-xl animate-fade-in relative overflow-hidden">
        
        {/* Subtle glow background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-sage-400/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Logo and Branding */}
        <div className="text-center mb-5 relative z-10">
          <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-gradient-to-br from-sage-700 to-sage-900 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-[#fbfcfa] rounded-[10px] flex items-center justify-center">
              <Anchor className="w-5 h-5 text-sage-800" />
            </div>
          </div>
          <h1 className="font-serif text-xl font-bold tracking-tight text-sage-950">
            ANCLA
          </h1>
          <span className="text-[9px] uppercase tracking-widest text-sage-800 font-bold block mt-0.5">
            Consejería Bíblica
          </span>
          <p className="text-xs text-[#3b4c44] mt-2 leading-relaxed">
            Plataforma pastoral para estudios bíblicos, metodología y gestión privada de expedientes.
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start space-x-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-[11px] leading-tight block">{authError}</span>
              <button 
                onClick={clearAuthError}
                className="block text-[10px] text-rose-700 underline font-semibold mt-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Auth Buttons */}
        <div className="space-y-2.5 relative z-10">
          {/* Sign In with Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-3.5 rounded-xl bg-[#edf2ea] border border-[#d2daca] text-sage-950 font-semibold text-xs hover:bg-[#e4eae0] transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión con Google'}</span>
          </button>

          {/* Sign In in Local / Guest Mode */}
          <button
            onClick={handleLocalSignIn}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-950 border border-sage-300 font-semibold text-xs transition-all shadow-sm active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5 text-sage-800" />
            <span>Ingresar en Modo Local / Pruebas</span>
          </button>
        </div>

        {/* Info about Firebase status */}
        {!isFirebaseConfigured && (
          <div className="mt-3.5 p-2 rounded-lg bg-[#edf2ea] border border-[#d2daca] text-[10px] text-[#3b4c44] flex items-start space-x-2">
            <Database className="w-3.5 h-3.5 text-sage-800 flex-shrink-0 mt-0.5" />
            <span>Modo Local activado. Los expedientes se guardan en este navegador. Para sincronizar con Firebase, añade tus claves en <code>.env</code>.</span>
          </div>
        )}

        {/* Security & Confidentiality Badges */}
        <div className="mt-4 pt-3.5 border-t border-[#d2daca] space-y-1.5 text-[10px] text-[#52645b]">
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3 text-sage-800 flex-shrink-0" />
            <span>Acceso restringido exclusivamente a consejeros bíblicos.</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3 h-3 text-emerald-700 flex-shrink-0" />
            <span>Tus datos y expedientes se mantienen confidenciales.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

