import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Flame, 
  Zap, 
  Wind, 
  HeartCrack, 
  Sparkles, 
  HeartHandshake, 
  ArrowLeft, 
  Bookmark, 
  Library, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Type,
  ExternalLink
} from 'lucide-react';
import { GlossaryTopic, RecommendedBook, BookPassage } from '../../types';
import { GLOSSARY_TOPICS } from '../../data/glossaryBooksData';
import { BibleRefBadge } from '../bible/BibleRefBadge';

interface GlossaryViewProps {
  initialTopicId?: string | null;
  initialBookId?: string | null;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ initialTopicId, initialBookId }) => {
  const [selectedTopic, setSelectedTopic] = useState<GlossaryTopic | null>(() => {
    if (initialTopicId) {
      return GLOSSARY_TOPICS.find(t => t.id === initialTopicId) || null;
    }
    return null;
  });
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(() => {
    if (initialTopicId && initialBookId) {
      const topic = GLOSSARY_TOPICS.find(t => t.id === initialTopicId);
      return topic?.books.find(b => b.id === initialBookId) || null;
    }
    return null;
  });
  
  // Sincronizar si cambian los props
  useEffect(() => {
    if (initialTopicId) {
      const topic = GLOSSARY_TOPICS.find(t => t.id === initialTopicId) || null;
      setSelectedTopic(topic);
      if (topic && initialBookId) {
        const book = topic.books.find(b => b.id === initialBookId) || null;
        setSelectedBook(book);
      } else {
        setSelectedBook(null);
      }
    }
  }, [initialTopicId, initialBookId]);

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
      case 'Sparkles': return Sparkles;
      case 'HeartHandshake': return HeartHandshake;
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
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 animate-fade-in space-y-6 sm:space-y-8">
      
      {/* NIVEL 1: LISTA DE TEMAS */}
      {!selectedTopic && (
        <div className="space-y-6 sm:space-y-8">
          
          {/* Header Banner Principal - Verde Salvia & Pergamino Pastoral */}
          <div className="bg-gradient-to-r from-[#e8ece2] via-[#f1f3ec] to-[#e4e9dd] rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#d2daca] shadow-sm relative overflow-hidden">
            <div className="max-w-3xl relative z-10 space-y-2.5">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#e3eae0] border border-sage-300 text-sage-900 text-[10px] font-semibold uppercase tracking-wider">
                <Library className="w-3 h-3 text-sage-800" />
                <span>Biblioteca de Referencia Pastoral</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sage-950 tracking-tight leading-tight">
                Índice Didáctico & Obras Maestras
              </h1>
              <p className="text-xs sm:text-[13px] text-[#3b4c44] leading-relaxed max-w-2xl pt-0.5">
                Explora los pecados originales y raíces del corazón, descubre las obras literarias de consejería bíblica más influyentes y examina los pasajes con su capítulo y página exacta.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-sage-950">
              Selecciona un Tema o Pecado Raíz
            </h2>
            <span className="text-[11px] text-[#2c3d36] font-medium px-2.5 py-0.5 rounded-full bg-[#edf2ea] border border-[#d2daca]">
              {GLOSSARY_TOPICS.length} Categorías
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {GLOSSARY_TOPICS.map((topic) => {
              const Icon = getIconComponent(topic.iconName);
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="bg-[#fbfcfa] rounded-2xl p-5 sm:p-6 border border-[#d2daca] cursor-pointer group flex flex-col justify-between transition-all hover:border-sage-500 hover:shadow-md shadow-sm"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center text-sage-800 group-hover:scale-105 group-hover:bg-sage-200 transition-all shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#edf2ea] border border-[#d2daca] text-[#2c3d36] font-medium">
                        {topic.books.length} {topic.books.length === 1 ? 'Libro' : 'Libros'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-sage-950 group-hover:text-sage-800 transition-colors break-words">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[#3b4c44] mt-1.5 leading-relaxed break-words">
                        {topic.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#e2e8dc] flex items-center justify-between text-xs font-semibold text-sage-800">
                    <span>Ver Libros</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-sage-800" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NIVEL 2: LIBROS DEL TEMA SELECCIONADO */}
      {selectedTopic && !selectedBook && (
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-[#d2daca]">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center space-x-2 text-xs text-[#3b4c44] hover:text-sage-800 font-medium transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a Temas</span>
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-900 border border-sage-300">
              {selectedTopic.title}
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sage-950 break-words">
              Libros sobre: {selectedTopic.title}
            </h2>
            <p className="text-xs sm:text-[13px] text-[#3b4c44] max-w-2xl">
              {selectedTopic.shortDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {selectedTopic.books.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-[#fbfcfa] rounded-2xl p-4 sm:p-5 border border-[#d2daca] cursor-pointer group flex flex-col sm:flex-row gap-4 transition-all hover:border-sage-500 hover:shadow-md shadow-sm"
              >
                {/* Portada */}
                <div className={`w-full sm:w-28 h-40 rounded-xl bg-gradient-to-b ${book.coverGradient} border border-sage-400/25 p-3.5 flex flex-col justify-between shadow-md flex-shrink-0 group-hover:scale-102 transition-transform`}>
                  <div className="flex justify-between items-start">
                    <Bookmark className="w-3.5 h-3.5 text-sage-300" />
                    <span className="text-[8px] text-sage-200 uppercase tracking-widest font-bold">Biblia</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white leading-tight line-clamp-3">
                      {book.title}
                    </h4>
                    <p className="text-[9px] text-sage-200/90 mt-0.5">{book.author}</p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold text-sage-800">{book.author}</span>
                      {book.year && (
                        <span className="text-[10px] text-[#3b4c44] bg-[#edf2ea] px-1.5 py-0.5 rounded border border-[#d2daca]">
                          {book.year}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-sage-950 group-hover:text-sage-800 transition-colors leading-snug break-words">
                      {book.title}
                    </h3>

                    <p className="text-xs text-[#3b4c44] mt-1.5 line-clamp-3 leading-relaxed break-words">
                      {book.summary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#e2e8dc] flex items-center justify-between text-xs font-semibold text-sage-800">
                    <span>{book.passages.length} Pasajes Clave</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-sage-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIVEL 3: VISTA DE UN LIBRO */}
      {selectedBook && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Barra Superior con botón Volver y Controles de Lectura */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d2daca]">
            <button
              onClick={() => setSelectedBook(null)}
              className="flex items-center space-x-2 text-xs text-[#3b4c44] hover:text-sage-800 font-medium transition-all group self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a Libros</span>
            </button>

            {/* Controles de lectura general */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-[#edf2ea] p-1 rounded-lg border border-[#d2daca] text-xs shadow-inner">
                <Type className="w-3 h-3 text-[#52645b] mr-1.5 ml-1" />
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    fontSize === 'normal' ? 'bg-sage-800 text-[#fbfcfa] shadow-sm' : 'text-[#3b4c44] hover:text-sage-950'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setFontSize('grande')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    fontSize === 'grande' ? 'bg-sage-800 text-[#fbfcfa] shadow-sm' : 'text-[#3b4c44] hover:text-sage-950'
                  }`}
                >
                  Grande
                </button>
              </div>

              <button
                onClick={expandAllPassages}
                className="px-2.5 py-1 rounded-lg bg-[#fbfcfa] border border-[#d2daca] hover:border-sage-400 text-[#2c3d36] text-[11px] font-medium shadow-sm transition-all"
              >
                Expandir Todos
              </button>
              <button
                onClick={collapseAllPassages}
                className="px-2.5 py-1 rounded-lg bg-[#fbfcfa] border border-[#d2daca] hover:border-sage-400 text-[#3b4c44] text-[11px] font-medium shadow-sm transition-all"
              >
                Colapsar
              </button>
            </div>
          </div>

          {/* Tarjeta del Libro */}
          <div className="bg-[#fbfcfa] rounded-2xl p-5 sm:p-7 border border-[#d2daca] shadow-sm space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-900 border border-sage-300 text-[10px] font-semibold uppercase tracking-wider">
                {selectedTopic?.title}
              </span>
              <span className="text-[11px] text-[#52645b]">
                {selectedBook.publisher} {selectedBook.year && `• Año: ${selectedBook.year}`}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sage-950 tracking-tight leading-tight break-words">
              {selectedBook.title}
            </h1>

            <p className="text-xs sm:text-[13px] text-[#2c3d36] font-medium">
              Autor: <strong className="text-sage-950">{selectedBook.author}</strong>
            </p>

            <p className="text-xs text-[#3b4c44] leading-relaxed italic pt-2 border-t border-[#e2e8dc] break-words max-w-3xl">
              "{selectedBook.summary}"
            </p>

            {selectedBook.logosUrl && (
              <div className="pt-2">
                <a
                  href={selectedBook.logosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-sage-50 hover:bg-sage-100 border border-sage-300 text-sage-800 hover:text-sage-900 text-xs font-semibold shadow-sm transition-all group/booklogos"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sage-700 group-hover/booklogos:scale-110 transition-transform" />
                  <span>Abrir Libro en Logos Bible Software</span>
                </a>
              </div>
            )}
          </div>

          {/* Lista de Pasajes del Libro */}
          <div className="space-y-4">
            {selectedBook.passages.map((passage, pIdx) => {
              const isFullOpen = !!expandedPassageIds[passage.id];
              const logosTargetUrl = passage.logosUrl || selectedBook.logosUrl;

              return (
                <div
                  key={passage.id}
                  className="bg-[#fbfcfa] rounded-2xl p-5 sm:p-6 border border-[#d2daca] shadow-sm space-y-4 transition-all"
                >
                  {/* Encabezado del Pasaje */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#e2e8dc] pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-sage-100 border border-sage-300 text-sage-900 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {pIdx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-sage-100 text-sage-900 border border-sage-300 text-[10px] font-semibold">
                        {passage.chapter}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#edf2ea] text-[#2c3d36] text-[10px] font-medium border border-[#d2daca]">
                        {passage.pages}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleCopyPassage(passage, e)}
                        className="px-2.5 py-1 rounded-lg text-[#3b4c44] hover:text-sage-950 bg-[#edf2ea] hover:bg-[#e4eae0] border border-[#d2daca] text-[11px] flex items-center space-x-1 transition-all"
                        title="Copiar extracto"
                      >
                        {copiedPassageId === passage.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span className="text-emerald-800 font-semibold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      {logosTargetUrl && (
                        <a
                          href={logosTargetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg text-sage-800 hover:text-sage-900 bg-sage-50 hover:bg-sage-100 border border-sage-300 text-[11px] font-medium flex items-center space-x-1.5 transition-all shadow-sm group/logos"
                          title="Abrir página del libro en Logos Bible Software"
                        >
                          <ExternalLink className="w-3 h-3 text-sage-700 group-hover/logos:scale-110 transition-transform" />
                          <span>Ver en Logos</span>
                        </a>
                      )}

                      <button
                        onClick={() => toggleExpandPassage(passage.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-all ${
                          isFullOpen 
                            ? 'bg-[#edf2ea] text-[#2c3d36] hover:bg-[#e4eae0] border border-[#d2daca]' 
                            : 'bg-sage-800 text-[#fbfcfa] shadow-sm hover:bg-sage-700'
                        }`}
                      >
                        <span>{isFullOpen ? 'Mostrar Menos' : 'Leer Texto Completo'}</span>
                        {isFullOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Título del Pasaje */}
                  <h3 className="font-serif text-base sm:text-lg font-bold text-sage-950 leading-snug break-words">
                    {passage.passageTitle}
                  </h3>

                  {/* Cuerpo de Lectura */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#edf2ea] border border-[#d2daca]/80">
                    <div className={`font-serif ${fontSize === 'grande' ? 'text-sm sm:text-base leading-relaxed' : 'text-xs sm:text-[13px] leading-relaxed'} text-[#192722] whitespace-pre-line break-words ${
                      !isFullOpen ? 'line-clamp-3' : ''
                    }`}>
                      {passage.fullText || passage.excerpt}
                    </div>
                  </div>

                  {/* Conclusión Pastoral Clave */}
                  <div className="p-3.5 rounded-xl bg-sage-100/70 border border-sage-300 space-y-1">
                    <div className="flex items-center space-x-1.5 text-sage-900 font-semibold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-sage-800 flex-shrink-0" />
                      <span>Conclusión Pastoral Clave</span>
                    </div>
                    <p className="text-xs text-[#2c3d36] leading-relaxed break-words">
                      {passage.keyTakeaway}
                    </p>
                  </div>

                  {/* Referencias Bíblicas */}
                  {passage.biblicalReferences && passage.biblicalReferences.length > 0 && (
                    <div className="pt-2.5 border-t border-[#e2e8dc] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-semibold text-[#52645b] mr-1">
                        Referencias Bíblicas:
                      </span>
                      {passage.biblicalReferences.map((ref, idx) => (
                        <BibleRefBadge key={idx} reference={ref} />
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
