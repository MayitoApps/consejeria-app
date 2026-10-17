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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto glass-card rounded-2xl p-5 sm:p-7 border border-stone-200 shadow-2xl animate-slide-up bg-white">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 mb-3.5 border-b border-stone-100">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-semibold tracking-wide uppercase">
                Análisis Exegético & Hermenéutico
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
              <span>{verse.reference}</span>
              <span className="text-xs text-amber-800 font-sans font-normal">({verse.version || 'RVR1960'})</span>
            </h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 px-2.5 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-stone-100 border border-stone-200 transition-all text-xs flex items-center space-x-1"
              title="Copiar estudio completo"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Versicle Quote Box */}
        <div className="verse-blockquote mb-4">
          <p className="font-serif text-xs sm:text-[13px] text-slate-800 italic leading-relaxed">
            "{verse.text}"
          </p>
        </div>

        {/* Exegetical Pillars Grid */}
        <div className="space-y-3">
          
          {/* 1. Original Languages & Terms */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-amber-200/80 hover:border-amber-400 transition-all">
            <div className="flex items-center space-x-2 text-amber-800 font-semibold text-xs mb-1">
              <div className="p-1 rounded-md bg-amber-100 text-amber-800">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span>1. Términos Originales (Hebreo / Griego)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-6">
              {verse.exegesis.originalTerms}
            </p>
          </div>

          {/* 2. Historical & Cultural Context */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-blue-200/80 hover:border-blue-400 transition-all">
            <div className="flex items-center space-x-2 text-blue-800 font-semibold text-xs mb-1">
              <div className="p-1 rounded-md bg-blue-100 text-blue-800">
                <History className="w-3.5 h-3.5" />
              </div>
              <span>2. Contexto Histórico y Audiencia Original</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-6">
              {verse.exegesis.historicalContext}
            </p>
          </div>

          {/* 3. Perennial Theological Principle */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-emerald-200/80 hover:border-emerald-400 transition-all">
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs mb-1">
              <div className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span>3. Principio Teológico Central</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-6">
              {verse.exegesis.theologicalPrinciple}
            </p>
          </div>

          {/* 4. Pastoral & Counseling Application */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300">
            <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs mb-1">
              <div className="p-1 rounded-md bg-amber-100 text-amber-800">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <span>4. Aplicación Práctica en Consejería</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed pl-6 font-medium">
              {verse.exegesis.pastoralApplication}
            </p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold transition-all border border-stone-200"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
