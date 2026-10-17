import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  loadLblaBible, 
  findLblaBook, 
  getLblaChapterData, 
  parseBibleReference, 
  searchLblaBible, 
  BIBLE_CATEGORIES, 
  LblaBook, 
  LblaChapter 
} from '../../services/bibleService';

interface BibleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

export const BibleReaderModal: React.FC<BibleReaderModalProps> = ({
  isOpen,
  onClose,
  initialReference = 'Efesios 4:22-24'
}) => {
  const [loading, setLoading] = useState(true);
  const [bibleBooks, setBibleBooks] = useState<LblaBook[]>([]);
  
  // Posición actual de lectura
  const [currentBookName, setCurrentBookName] = useState('Efesios');
  const [currentChapterNum, setCurrentChapterNum] = useState(4);
  const [highlightStart, setHighlightStart] = useState<number | undefined>(22);
  const [highlightEnd, setHighlightEnd] = useState<number | undefined>(24);
  
  // Datos del capítulo cargado
  const [chapterData, setChapterData] = useState<LblaChapter | null>(null);
  const [totalChaptersInBook, setTotalChaptersInBook] = useState(6);

  // Estados de navegación y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    reference: string;
    text: string;
  }[]>([]);

  // Modales y drawers internos
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [bookFilterText, setBookFilterText] = useState('');
  const [selectedTestamentTab, setSelectedTestamentTab] = useState<'Nuevo' | 'Antiguo'>('Nuevo');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const readingContainerRef = useRef<HTMLDivElement>(null);
  const highlightedVerseRef = useRef<HTMLDivElement>(null);

  // Cargar la Biblia LBLA completa al montar
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        setLoading(true);
        const data = await loadLblaBible();
        if (isMounted) {
          setBibleBooks(data.books);
          handleNavigateToRef(initialReference || 'Efesios 4:22-24', data.books);
        }
      } catch (err) {
        console.error('Error al inicializar LBLA:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isOpen) {
      init();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Si cambia la referencia inicial desde afuera mientras está abierto
  useEffect(() => {
    if (isOpen && initialReference && bibleBooks.length > 0) {
      handleNavigateToRef(initialReference, bibleBooks);
    }
  }, [initialReference]);

  // Auto-scroll al versículo resaltado cuando cambia
  useEffect(() => {
    if (highlightedVerseRef.current && readingContainerRef.current) {
      setTimeout(() => {
        highlightedVerseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [chapterData, highlightStart]);

  const handleNavigateToRef = async (refText: string, booksList = bibleBooks) => {
    const parsed = parseBibleReference(refText);
    if (!parsed) return;

    const books = booksList.length > 0 ? booksList : (await loadLblaBible()).books;
    const book = findLblaBook(books, parsed.bookName);
    if (!book) return;

    setCurrentBookName(book.name);
    setCurrentChapterNum(parsed.chapter);
    setHighlightStart(parsed.verseStart);
    setHighlightEnd(parsed.verseEnd);
    setIsBookPickerOpen(false);
    setIsSearching(false);

    const chapterRes = await getLblaChapterData(book.name, parsed.chapter);
    if (chapterRes) {
      setChapterData(chapterRes.chapter);
      setTotalChaptersInBook(chapterRes.totalChapters);
    }
  };

  const handleSelectBook = async (book: LblaBook) => {
    setCurrentBookName(book.name);
    setCurrentChapterNum(1);
    setHighlightStart(undefined);
    setHighlightEnd(undefined);
    setIsBookPickerOpen(false);

    const chapterRes = await getLblaChapterData(book.name, 1);
    if (chapterRes) {
      setChapterData(chapterRes.chapter);
      setTotalChaptersInBook(chapterRes.totalChapters);
    }
  };

  const handleSelectChapter = async (chapNum: number) => {
    setCurrentChapterNum(chapNum);
    setHighlightStart(undefined);
    setHighlightEnd(undefined);
    setIsBookPickerOpen(false);

    const chapterRes = await getLblaChapterData(currentBookName, chapNum);
    if (chapterRes) {
      setChapterData(chapterRes.chapter);
      setTotalChaptersInBook(chapterRes.totalChapters);
    }
  };

  const handlePrevChapter = async () => {
    if (currentChapterNum > 1) {
      handleSelectChapter(currentChapterNum - 1);
    }
  };

  const handleNextChapter = async () => {
    if (currentChapterNum < totalChaptersInBook) {
      handleSelectChapter(currentChapterNum + 1);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Verificar si es una referencia bíblica directa (e.g. "Rom 8:28", "Salmo 23")
    const parsed = parseBibleReference(searchQuery);
    if (parsed) {
      const book = findLblaBook(bibleBooks, parsed.bookName);
      if (book) {
        handleNavigateToRef(searchQuery);
        setSearchQuery('');
        return;
      }
    }

    // De lo contrario, buscar por palabra clave / concordancia
    setIsSearching(true);
    const results = await searchLblaBible(searchQuery.trim(), 40);
    setSearchResults(results);
  };

  const handleCopyChapter = () => {
    if (!chapterData) return;
    const textLines = chapterData.items
      .filter(it => it.type === 'verse')
      .map(it => `${it.verse_numbers.join('-')} ${it.lines.join(' ')}`);

    const fullCopy = `«${currentBookName} ${currentChapterNum} (LBLA)»\n\n${textLines.join('\n\n')}\n\n— La Biblia de las Américas © The Lockman Foundation`;
    navigator.clipboard.writeText(fullCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in ${
      isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
    }`}>
      
      {/* Marco de la Biblia */}
      <div 
        className={`relative w-full bg-[#f2f4ee] border border-[#d2daca] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#192722] transition-all ${
          isFullscreen ? 'h-full rounded-none border-none' : 'max-w-5xl h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Barra Superior de Control de la Biblia */}
        <div className="p-3 sm:p-4 border-b border-[#d2daca] bg-[#fbfcfa] flex flex-wrap items-center justify-between gap-2.5 z-20">
          
          {/* Selector de Libro y Capítulo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
              className="px-3 py-1.5 rounded-xl bg-[#edf2ea] hover:bg-[#dfe8da] border border-[#d2daca] hover:border-sage-500 text-xs font-semibold text-[#192722] flex items-center space-x-2 transition-all shadow-sm group"
              title="Abrir índice de libros y capítulos"
            >
              <BookOpen className="w-4 h-4 text-sage-800 group-hover:scale-110 transition-transform" />
              <span className="font-serif text-sm text-[#192722] font-bold">{currentBookName} {currentChapterNum}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#71847a] transition-transform ${isBookPickerOpen ? 'rotate-180 text-sage-800' : ''}`} />
            </button>

            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-sage-100 border border-sage-300 text-sage-950 text-[10px] font-bold tracking-wider uppercase">
              LBLA
            </span>
          </div>

          {/* Buscador Universal Integrado */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-2">
            <Search className="w-3.5 h-3.5 text-[#71847a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cita (Rom 8:28) o palabra (gracia, perdón)..."
              className="w-full pl-8 pr-16 py-1.5 bg-[#edf2ea] border border-[#d2daca] rounded-xl text-xs text-[#192722] placeholder-[#71847a] focus:outline-none focus:border-sage-600 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-sage-800 hover:bg-sage-900 text-white text-[10px] font-bold tracking-wide transition-all"
            >
              Ir
            </button>
          </form>

          {/* Herramientas del Lector */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* Ajuste de Fuente */}
            <div className="hidden md:flex items-center space-x-1 bg-[#edf2ea] p-0.5 rounded-lg border border-[#d2daca]">
              <button
                onClick={() => setFontSize(fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'base' : 'sm')}
                className="p-1 rounded hover:bg-[#dfe8da] text-[#253831] hover:text-black"
                title="Reducir letra"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-[#253831] px-1 font-mono uppercase">{fontSize}</span>
              <button
                onClick={() => setFontSize(fontSize === 'sm' ? 'base' : fontSize === 'base' ? 'lg' : 'xl')}
                className="p-1 rounded hover:bg-[#dfe8da] text-[#253831] hover:text-black"
                title="Aumentar letra"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Copiar Capítulo */}
            <button
              onClick={handleCopyChapter}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1 transition-all ${
                copied
                  ? 'bg-sage-200 border-sage-400 text-sage-950 font-semibold'
                  : 'bg-[#edf2ea] border-[#d2daca] hover:border-sage-500 text-[#253831] hover:text-sage-950'
              }`}
              title="Copiar capítulo completo"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-sage-800" />}
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            {/* Pantalla Completa */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl bg-[#edf2ea] hover:bg-[#dfe8da] text-[#253831] hover:text-black border border-[#d2daca] transition-all"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Modo pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-[#edf2ea] hover:bg-[#dfe8da] text-[#253831] hover:text-black border border-[#d2daca] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Panel Desplegable de Selector de Libros y Capítulos (100% Sólido y Opaco) */}
        {isBookPickerOpen && (
          <div className="absolute inset-0 bg-[#f2f4ee] z-40 flex flex-col animate-fade-in overflow-hidden">
            
            {/* Header del Selector */}
            <div className="p-4 sm:p-5 border-b border-[#d2daca] bg-[#fbfcfa] flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-800">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#192722] leading-tight">
                    Índice Bíblico LBLA
                  </h3>
                  <span className="text-[10px] text-sage-800 font-medium">
                    66 Libros • La Biblia de las Américas
                  </span>
                </div>
              </div>

              {/* Botón Volver a la Lectura */}
              <button
                onClick={() => setIsBookPickerOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-[#edf2ea] hover:bg-[#dfe8da] text-[#253831] hover:text-black border border-[#d2daca] text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
                <span>Volver a la lectura</span>
              </button>
            </div>

            {/* Barra de Filtro y Pestañas */}
            <div className="p-3 sm:p-4 bg-[#f0f5ee] border-b border-[#d2daca] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              
              {/* Buscador de Libro */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#71847a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookFilterText}
                  onChange={(e) => setBookFilterText(e.target.value)}
                  placeholder="Filtrar libro (ej. Salmos, Rom, Mat)..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#fbfcfa] border border-[#d2daca] rounded-xl text-xs text-[#192722] placeholder-[#71847a] focus:outline-none focus:border-sage-600 transition-all"
                />
              </div>

              {/* Pestañas de Testamento */}
              <div className="flex items-center space-x-1 bg-[#edf2ea] p-1 rounded-xl border border-[#d2daca]">
                <button
                  onClick={() => setSelectedTestamentTab('Nuevo')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedTestamentTab === 'Nuevo'
                      ? 'bg-sage-800 text-white shadow-sm'
                      : 'text-[#253831] hover:text-black'
                  }`}
                >
                  Nuevo Testamento (27)
                </button>
                <button
                  onClick={() => setSelectedTestamentTab('Antiguo')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedTestamentTab === 'Antiguo'
                      ? 'bg-sage-800 text-white shadow-sm'
                      : 'text-[#253831] hover:text-black'
                  }`}
                >
                  Antiguo Testamento (39)
                </button>
              </div>
            </div>

            {/* Contenido con Scroll: Capítulos y Libros */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f2f4ee]">
              <div className="max-w-4xl mx-auto w-full space-y-6">
                
                {/* Selector de Capítulos del Libro Seleccionado */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#fbfcfa] border border-[#d2daca] shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-sage-800" />
                      <span className="font-serif text-sm sm:text-base font-bold text-[#192722]">
                        Capítulos de <span className="text-sage-800">{currentBookName}</span>:
                      </span>
                    </div>
                    <span className="text-[11px] text-[#56685f]">
                      {totalChaptersInBook} {totalChaptersInBook === 1 ? 'capítulo' : 'capítulos'} disponibles
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {Array.from({ length: totalChaptersInBook }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSelectChapter(num)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          currentChapterNum === num
                            ? 'bg-sage-800 text-white shadow-sm border border-sage-950 scale-105'
                            : 'bg-[#edf2ea] hover:bg-sage-100 text-[#253831] border border-[#d2daca] hover:border-sage-400'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de Libros Agrupados por Categorías */}
                <div className="space-y-5">
                  {BIBLE_CATEGORIES.filter(c => c.testament === selectedTestamentTab).map((category) => {
                    const filteredBooks = category.books.filter(bName => 
                      !bookFilterText.trim() || 
                      bName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
                        bookFilterText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                      )
                    );

                    if (filteredBooks.length === 0) return null;

                    return (
                      <div key={category.name} className="space-y-2.5">
                        <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-600 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sage-700"></span>
                          <span>{category.name}</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                          {filteredBooks.map((bookName) => {
                            const bookObj = bibleBooks.find(b => b.name === bookName);
                            if (!bookObj) return null;
                            const isSelected = currentBookName === bookObj.name;

                            return (
                              <button
                                key={bookObj.name}
                                onClick={() => handleSelectBook(bookObj)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'bg-sage-200 border-sage-500 text-sage-950 font-bold shadow-sm scale-[1.02]'
                                    : 'bg-[#fbfcfa] hover:bg-[#edf2ea] border-[#d2daca] hover:border-sage-400 text-[#192722]'
                                }`}
                              >
                                <span className="font-serif text-xs font-semibold block truncate">{bookObj.name}</span>
                                <span className="text-[10px] text-[#56685f] block mt-0.5">{bookObj.chapters.length} caps.</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Panel de Resultados de Búsqueda */}
        {isSearching && (
          <div className="p-3 sm:p-4 bg-[#f0f5ee] border-b border-[#cfe0cb] max-h-48 overflow-y-auto space-y-2 z-10 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-sage-950 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-sage-700" />
                <span>Resultados de búsqueda ({searchResults.length}):</span>
              </span>
              <button
                onClick={() => setIsSearching(false)}
                className="text-[#56685f] hover:text-black text-[11px]"
              >
                Cerrar resultados
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleNavigateToRef(res.reference);
                  }}
                  className="p-2 rounded-lg bg-[#fbfcfa] hover:bg-[#edf2ea] border border-[#d2daca] hover:border-sage-400 cursor-pointer transition-all"
                >
                  <span className="font-serif font-bold text-sage-950 text-xs block">{res.reference}</span>
                  <p className="text-[11px] text-[#253831] line-clamp-2 mt-0.5">{res.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cuerpo Principal del Lector de la Biblia (Texto Íntegro LBLA) */}
        <div 
          ref={readingContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 space-y-6 bg-[#f2f4ee]"
        >
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-sage-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#56685f] font-medium">Abriendo La Biblia de las Américas...</p>
            </div>
          ) : chapterData ? (
            <div className="max-w-3xl mx-auto space-y-6 bg-[#fbfcfa] p-6 sm:p-10 rounded-3xl border border-[#d2daca] shadow-sm">
              
              {/* Encabezado del Capítulo */}
              <div className="text-center space-y-2 pb-6 border-b border-[#e6eae0]">
                <span className="text-[11px] uppercase tracking-widest text-sage-800 font-semibold font-sans block">
                  La Biblia de las Américas
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#192722] tracking-wide">
                  {currentBookName} {currentChapterNum}
                </h1>
                <p className="text-xs text-[#56685f]">
                  {totalChaptersInBook} {totalChaptersInBook === 1 ? 'Capítulo' : 'Capítulos en total'}
                </p>
              </div>

              {/* Versículos y Encabezados del Capítulo */}
              <div className={`space-y-4 font-serif text-[#192722] ${
                fontSize === 'sm' ? 'text-xs sm:text-sm leading-relaxed' :
                fontSize === 'base' ? 'text-sm sm:text-base leading-relaxed' :
                fontSize === 'lg' ? 'text-base sm:text-lg leading-loose' :
                'text-lg sm:text-xl leading-loose'
              }`}>
                {chapterData.items.map((item, idx) => {
                  if (item.type === 'heading1' || item.type === 'heading2') {
                    return (
                      <h3 
                        key={idx} 
                        className="font-sans text-xs sm:text-sm uppercase tracking-wider font-bold text-sage-900 pt-4 pb-1 border-b border-[#d2daca]"
                      >
                        {item.lines.join(' ')}
                      </h3>
                    );
                  }

                  if (item.type === 'verse') {
                    const verseNum = item.verse_numbers[0];
                    const isHighlighted = highlightStart !== undefined &&
                      verseNum >= highlightStart &&
                      verseNum <= (highlightEnd || highlightStart);

                    return (
                      <div
                        key={idx}
                        ref={isHighlighted && verseNum === highlightStart ? highlightedVerseRef : null}
                        className={`p-2.5 rounded-xl transition-all duration-300 flex items-start space-x-2 text-justify ${
                          isHighlighted
                            ? 'bg-[#e3eae0] border border-sage-300 shadow-sm text-sage-950 font-medium'
                            : 'hover:bg-[#f0f5ee] text-[#192722]'
                        }`}
                      >
                        <span className="font-sans font-bold text-[11px] sm:text-xs text-sage-800 select-none mr-1 flex-shrink-0 mt-0.5">
                          {item.verse_numbers.join('-')}
                        </span>
                        <p className="flex-1 break-words">
                          {item.lines.join(' ')}
                        </p>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-[#56685f] text-xs">
              No se pudo cargar el capítulo seleccionado.
            </div>
          )}
        </div>

        {/* Barra de Navegación de Capítulos al Pie */}
        <div className="p-3 sm:p-4 bg-[#fbfcfa] border-t border-[#d2daca] flex items-center justify-between text-xs text-[#56685f] z-20">
          
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterNum <= 1}
            className="px-3 py-1.5 rounded-xl bg-[#edf2ea] hover:bg-[#dfe8da] disabled:opacity-40 disabled:hover:bg-[#edf2ea] text-[#253831] text-xs font-semibold flex items-center space-x-1.5 border border-[#d2daca] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Capítulo Anterior</span>
            <span className="sm:hidden">Ant.</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-[#192722] font-semibold text-xs block">
              {currentBookName} {currentChapterNum}
            </span>
            <span className="text-[10px] text-[#71847a] hidden sm:block">
              La Biblia de las Américas (LBLA) • © The Lockman Foundation
            </span>
          </div>

          <button
            onClick={handleNextChapter}
            disabled={currentChapterNum >= totalChaptersInBook}
            className="px-3 py-1.5 rounded-xl bg-[#edf2ea] hover:bg-[#dfe8da] disabled:opacity-40 disabled:hover:bg-[#edf2ea] text-[#253831] text-xs font-semibold flex items-center space-x-1.5 border border-[#d2daca] transition-all"
          >
            <span className="hidden sm:inline">Capítulo Siguiente</span>
            <span className="sm:hidden">Sig.</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
