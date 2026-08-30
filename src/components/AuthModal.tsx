import React from 'react';
import { ShieldCheck, Lock, X, Anchor, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle, authError, clearAuthError } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] shadow-navy-lg animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
              <Anchor className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h3 className="font-serif text-xl font-bold gold-gradient-text">
            Acceso para Consejeros
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Inicia sesión con tu cuenta de Google para acceder a tus expedientes confidenciales y sincronización en la nube.
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-start space-x-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{authError}</span>
              <button 
                onClick={clearAuthError}
                className="block text-[10px] text-rose-300 underline font-semibold mt-0.5"
              >
                Cerrar aviso
              </button>
            </div>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-3.5 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
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
          <span>{isSubmitting ? 'Conectando con Google...' : 'Continuar con Google'}</span>
        </button>

        {/* Security and Privacy Badges */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-1.5 text-[10px] text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Tus expedientes son 100% privados y aislados a tu cuenta.</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Sincronización en tiempo real protegida por Cloud Firestore.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
