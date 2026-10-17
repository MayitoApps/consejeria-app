import React, { useState, useEffect } from 'react';
import { X, Copy, Check, BookOpen, Type, Sparkles } from 'lucide-react';
import { BookPassage } from '../../types';

interface ZenReaderModalProps {
  passage: BookPassage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ZenReaderModal: React.FC<ZenReaderModalProps> = ({ passage, isOpen, onClose }) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('sm');
  const [themeMode, setThemeMode] = useState<'light' | 'sepia'>('light');
  const [copied, setCopied] = useState(false);

  // Bloquea el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !passage) return null;

  const fontClasses = {
    sm: 'text-xs leading-relaxed',
    base: 'text-[13px] leading-relaxed',
    lg: 'text-sm leading-relaxed',
  };

  const themeClasses = {
    light: 'bg-[#fbf9f5] text-slate-800 border-stone-200 shadow-2xl',
    sepia: 'bg-[#f5eedc] text-[#422e1b] border-amber-300/80 shadow-2xl',
  };

  const handleCopy = () => {
    const textToCopy = `"${passage.passageTitle}"\nLibro: ${passage.bookTitle} (${passage.author})\n${passage.chapter} | ${passage.pages}\n\n${passage.fullText || passage.excerpt}\n\nConclusión: ${passage.keyTakeaway}\n\nReferencias Bíblicas: ${passage.biblicalReferences.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Fondo oscuro clicable para cerrar */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Ventana Modal perfectamente centrada y proporcionada */}
      <div className={`relative z-10 w-full max-w-2xl h-[72vh] sm:h-[75vh] max-h-[600px] flex flex-col rounded-2xl border shadow-2xl animate-slide-up transition-all overflow-hidden ${themeClasses[themeMode]}`}>
        
        {/* BARRA SUPERIOR FIJA: Controles y Título Siempre Visibles */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-2.5 border-b border-stone-200 flex-shrink-0 bg-stone-100/80">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0">
              <BookOpen className="w-3 h-3" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-800 block leading-tight">
                Lectura Completa
              </span>
              <p className="font-serif text-xs font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs leading-tight">
                {passage.bookTitle}
              </p>
            </div>
          </div>

          {/* Botones de Control en una sola fila */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            
            {/* Tamaño de Letra */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-stone-200 text-xs shadow-sm">
              <Type className="w-3 h-3 text-slate-500 ml-1 mr-0.5" />
              {(['sm', 'base', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] transition-all ${
                    fontSize === s ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Tema */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-stone-200 text-[10px] shadow-sm">
              <button
                onClick={() => setThemeMode('light')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  themeMode === 'light' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Claro
              </button>
              <button
                onClick={() => setThemeMode('sepia')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  themeMode === 'sepia' ? 'bg-amber-800 text-amber-50' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sepia
              </button>
            </div>

            {/* Copiar */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-700 hover:text-amber-800 bg-white border border-stone-200 transition-all text-xs flex items-center space-x-1 shadow-sm"
              title="Copiar texto completo"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline text-[10px]">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 bg-white border border-stone-200 hover:border-stone-400 transition-all shadow-sm"
              title="Cerrar ventana"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ÁREA DE CONTENIDO CON SCROLL INTERNO Y PADDING CÓMODO */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 min-h-0 text-xs sm:text-[13px]">
          
          {/* Metadata y Título del Pasaje */}
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-semibold">
                {passage.chapter}
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-slate-700 text-[10px] font-medium border border-stone-200">
                {passage.pages}
              </span>
              <span className="text-[11px] text-slate-600">
                Autor: <strong className="text-slate-900">{passage.author}</strong>
              </span>
            </div>

            <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 break-words mt-1">
              {passage.passageTitle}
            </h2>
          </div>

          {/* Texto Completo del Libro */}
          <div className={`font-serif ${fontClasses[fontSize]} text-slate-800 space-y-2 whitespace-pre-line leading-relaxed break-words bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-sm`}>
            {passage.fullText || passage.excerpt}
          </div>

          {/* Conclusión Pastoral Clave */}
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-900 font-semibold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>Conclusión Pastoral Clave</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed break-words">
              {passage.keyTakeaway}
            </p>
          </div>

          {/* Referencias Bíblicas */}
          {passage.biblicalReferences && passage.biblicalReferences.length > 0 && (
            <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-slate-500 mr-1">
                Referencias Bíblicas:
              </span>
              {passage.biblicalReferences.map((ref, idx) => (
                <span key={idx} className="font-serif text-[10px] px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900">
                  {ref}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* PIE DEL MODAL FIJO Y VISIBLE */}
        <div className="px-4 sm:px-5 py-2 border-t border-stone-200 bg-stone-100/80 flex items-center justify-between flex-shrink-0 text-[11px] text-slate-600">
          <span>{passage.author} • {passage.bookTitle}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white hover:bg-stone-200 text-slate-800 text-xs font-semibold border border-stone-200 shadow-sm transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
