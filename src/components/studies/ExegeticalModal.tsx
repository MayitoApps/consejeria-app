import React from 'react';
import { X, BookOpen, History, Lightbulb, HeartHandshake, Copy, Check } from 'lucide-react';
import { VerseItem } from '../../types';

interface ExegeticalModalProps {
  verse: VerseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExegeticalModal: React.FC<ExegeticalModalProps> = ({ verse, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !verse) return null;

  const handleCopy = () => {
    const textToCopy = `[ESTUDIO EXEGÉTICO - ${verse.reference}]\n"${verse.text}"\n\n1. Términos Originales:\n${verse.exegesis.originalTerms}\n\n2. Contexto Histórico:\n${verse.exegesis.historicalContext}\n\n3. Principio Teológico:\n${verse.exegesis.theologicalPrinciple}\n\n4. Aplicación en Consejería:\n${verse.exegesis.pastoralApplication}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-navy-lg animate-slide-up">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
                Análisis Exegético & Hermenéutico
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mt-1.5 flex items-center space-x-2">
              <span>{verse.reference}</span>
              <span className="text-xs text-amber-400 font-sans font-normal">({verse.version || 'RVR1960'})</span>
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 border border-slate-700 transition-all text-xs flex items-center space-x-1.5"
              title="Copiar estudio completo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Versicle Quote Box */}
        <div className="verse-blockquote mb-6">
          <p className="font-serif text-base sm:text-lg text-amber-100/95 italic leading-relaxed">
            "{verse.text}"
          </p>
        </div>

        {/* Exegetical Pillars Grid */}
        <div className="space-y-4">
          
          {/* 1. Original Languages & Terms */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="flex items-center space-x-2.5 text-amber-400 font-semibold text-sm mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>1. Términos Originales (Hebreo / Griego)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
              {verse.exegesis.originalTerms}
            </p>
          </div>

          {/* 2. Historical & Cultural Context */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="flex items-center space-x-2.5 text-amber-400 font-semibold text-sm mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300">
                <History className="w-4 h-4" />
              </div>
              <span>2. Contexto Histórico y Audiencia Original</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
              {verse.exegesis.historicalContext}
            </p>
          </div>

          {/* 3. Perennial Theological Principle */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="flex items-center space-x-2.5 text-amber-400 font-semibold text-sm mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span>3. Principio Teológico Central</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
              {verse.exegesis.theologicalPrinciple}
            </p>
          </div>

          {/* 4. Pastoral & Counseling Application */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30">
            <div className="flex items-center space-x-2.5 text-amber-300 font-semibold text-sm mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span>4. Aplicación Práctica en Consejería</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed pl-8 font-medium">
              {verse.exegesis.pastoralApplication}
            </p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
