import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Flame, 
  Zap, 
  Wind, 
  HeartCrack, 
  Sparkles, 
  ArrowLeft, 
  Bookmark, 
  Library, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Type 
} from 'lucide-react';
import { GlossaryTopic, RecommendedBook, BookPassage } from '../../types';
import { GLOSSARY_TOPICS } from '../../data/glossaryBooksData';

export const GlossaryView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<GlossaryTopic | null>(null);
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);
  
  // Desplazar automáticamente al tope de la página al cambiar de nivel en el glosario
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [selectedTopic, selectedBook]);
  
  // Control de expansión de pasajes
  const [expandedPassageIds, setExpandedPassageIds] = useState<Record<string, boolean>>({});
  const [copiedPassageId, setCopiedPassageId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'grande'>('normal');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Zap': return Zap;
      case 'Wind': return Wind;
      default: return HeartCrack;
    }
  };

  const toggleExpandPassage = (passageId: string) => {
    setExpandedPassageIds(prev => ({
      ...prev,
      [passageId]: !prev[passageId]
    }));
  };

  const handleCopyPassage = (passage: BookPassage, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `"${passage.passageTitle}"\nLibro: ${passage.bookTitle} (${passage.author})\n${passage.chapter} | ${passage.pages}\n\n${passage.fullText || passage.excerpt}\n\nConclusión Pastoral: ${passage.keyTakeaway}\n\nReferencias Bíblicas: ${passage.biblicalReferences.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPassageId(passage.id);
    setTimeout(() => setCopiedPassageId(null), 2000);
  };

  const expandAllPassages = () => {
    if (!selectedBook) return;
    const allExpanded: Record<string, boolean> = {};
    selectedBook.passages.forEach(p => {
      allExpanded[p.id] = true;
    });
    setExpandedPassageIds(allExpanded);
  };

  const collapseAllPassages = () => {
    setExpandedPassageIds({});
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 animate-fade-in space-y-8">
      
      {/* NIVEL 1: LISTA DE TEMAS */}
      {!selectedTopic && (
        <div className="space-y-8">
          
          {/* Header Banner Principal - Expansivo y Luminoso */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-500/20 shadow-navy-md relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20">
            <div className="max-w-4xl relative z-10 space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Library className="w-3.5 h-3.5" />
                <span>Biblioteca de Referencia Pastoral</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text tracking-tight leading-tight">
                Glosario Teológico & Obras Maestras
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl pt-1">
                Explora los pecados originales y raíces del corazón, descubre las obras literarias de consejería bíblica más influyentes y examina los pasajes con su capítulo y página exacta.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Selecciona un Tema o Pecado Raíz
            </h2>
            <span className="text-xs text-slate-400 font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              {GLOSSARY_TOPICS.length} Categorías
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {GLOSSARY_TOPICS.map((topic) => {
              const Icon = getIconComponent(topic.iconName);
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-amber-500/20 cursor-pointer group flex flex-col justify-between transition-all hover:border-amber-500/40 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:text-amber-300 transition-all shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                        {topic.books.length} {topic.books.length === 1 ? 'Libro' : 'Libros'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors break-words">
                        {topic.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed break-words">
                        {topic.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-400">
                    <span>Ver Libros de Referencia</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NIVEL 2: LIBROS DEL TEMA SELECCIONADO */}
      {selectedTopic && !selectedBook && (
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 font-semibold transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a Temas</span>
            </button>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {selectedTopic.title}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white break-words">
              Libros sobre: {selectedTopic.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
              {selectedTopic.shortDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {selectedTopic.books.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-amber-500/20 cursor-pointer group flex flex-col sm:flex-row gap-5 transition-all hover:border-amber-500/40 shadow-sm"
              >
                {/* Portada */}
                <div className={`w-full sm:w-32 h-44 rounded-2xl bg-gradient-to-b ${book.coverGradient} border border-amber-500/30 p-4 flex flex-col justify-between shadow-md flex-shrink-0 group-hover:scale-102 transition-transform`}>
                  <div className="flex justify-between items-start">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span className="text-[9px] text-amber-300 uppercase tracking-widest font-bold">Biblia</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white leading-tight line-clamp-3">
                      {book.title}
                    </h4>
                    <p className="text-[10px] text-amber-300 mt-1">{book.author}</p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-amber-400">{book.author}</span>
                      {book.year && (
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                          {book.year}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug break-words">
                      {book.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2.5 line-clamp-3 leading-relaxed break-words">
                      {book.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-400">
                    <span>{book.passages.length} Pasajes Clave</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIVEL 3: VISTA DE UN LIBRO (DIRECTO DESDE EL TÍTULO DEL LIBRO, SIN BANNER GENÉRICO) */}
      {selectedBook && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Barra Superior con botón Volver y Controles de Lectura */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
            <button
              onClick={() => setSelectedBook(null)}
              className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 font-semibold transition-all group self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a Libros</span>
            </button>

            {/* Controles de lectura general */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs shadow-inner">
                <Type className="w-3.5 h-3.5 text-slate-400 mr-2 ml-1" />
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    fontSize === 'normal' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setFontSize('grande')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    fontSize === 'grande' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Grande
                </button>
              </div>

              <button
                onClick={expandAllPassages}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium"
              >
                Expandir Todos
              </button>
              <button
                onClick={collapseAllPassages}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-medium"
              >
                Colapsar
              </button>
            </div>
          </div>

          {/* Tarjeta del Libro (Empieza directamente aquí) */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/25 shadow-navy-md space-y-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                {selectedTopic?.title}
              </span>
              <span className="text-xs text-slate-400">
                {selectedBook.publisher} {selectedBook.year && `• Año: ${selectedBook.year}`}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text tracking-tight leading-tight break-words">
              {selectedBook.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Autor: <strong className="text-white">{selectedBook.author}</strong>
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic pt-2 border-t border-slate-800/80 break-words max-w-4xl">
              "{selectedBook.summary}"
            </p>
          </div>

          {/* Lista de Pasajes del Libro */}
          <div className="space-y-6">
            {selectedBook.passages.map((passage, pIdx) => {
              const isFullOpen = !!expandedPassageIds[passage.id];

              return (
                <div
                  key={passage.id}
                  className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-sm space-y-5 transition-all"
                >
                  {/* Encabezado del Pasaje */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {pIdx + 1}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                        {passage.chapter}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-700">
                        {passage.pages}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={(e) => handleCopyPassage(passage, e)}
                        className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-700 text-xs flex items-center space-x-1.5 transition-all"
                        title="Copiar extracto"
                      >
                        {copiedPassageId === passage.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => toggleExpandPassage(passage.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                          isFullOpen 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                            : 'bg-amber-600 text-white shadow-sm hover:bg-amber-500'
                        }`}
                      >
                        <span>{isFullOpen ? 'Mostrar Menos' : 'Leer Texto Completo'}</span>
                        {isFullOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Título del Pasaje */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug break-words">
                    {passage.passageTitle}
                  </h3>

                  {/* Cuerpo de Lectura */}
                  <div className="p-5 sm:p-7 rounded-2xl bg-slate-950/60 border border-slate-850">
                    <div className={`font-serif ${fontSize === 'grande' ? 'text-base sm:text-lg leading-relaxed' : 'text-xs sm:text-sm leading-relaxed'} text-slate-200 whitespace-pre-line break-words ${
                      !isFullOpen ? 'line-clamp-3' : ''
                    }`}>
                      {passage.fullText || passage.excerpt}
                    </div>
                  </div>

                  {/* Conclusión Pastoral Clave */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Conclusión Pastoral Clave</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100 leading-relaxed break-words">
                      {passage.keyTakeaway}
                    </p>
                  </div>

                  {/* Referencias Bíblicas */}
                  {passage.biblicalReferences && passage.biblicalReferences.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                      <span className="text-xs uppercase font-bold text-slate-500 mr-1">
                        Referencias Bíblicas:
                      </span>
                      {passage.biblicalReferences.map((ref, idx) => (
                        <span key={idx} className="font-serif text-xs px-3 py-1 rounded-lg bg-slate-900 border border-amber-500/20 text-amber-300">
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
