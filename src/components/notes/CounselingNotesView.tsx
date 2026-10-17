import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  BookOpen, 
  Quote, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  ListFilter,
  Link2
} from 'lucide-react';
import { useBible } from '../../context/BibleContext';
import { COUNSELING_NOTE_CARDS } from '../../data/counselingNotesData';
import { 
  shareToWhatsApp, 
  copyCardToClipboard, 
  copyDirectLinkToClipboard,
  downloadCardAsImage 
} from '../../utils/counselingNotesShare';

interface CounselingNotesViewProps {
  initialNoteNumber?: number;
}

export const CounselingNotesView: React.FC<CounselingNotesViewProps> = ({ initialNoteNumber }) => {
  const { openBible } = useBible();
  const totalNotes = COUNSELING_NOTE_CARDS.length;

  // Detectar la nota inicial a partir de props o de los parámetros de la URL (?nota=X o ?note=X)
  const getInitialIndex = (): number => {
    if (initialNoteNumber && initialNoteNumber >= 1) {
      const idx = COUNSELING_NOTE_CARDS.findIndex((c) => c.number === initialNoteNumber);
      if (idx !== -1) return idx;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const noteParam = params.get('nota') || params.get('note') || params.get('id');
      if (noteParam) {
        const num = parseInt(noteParam, 10);
        if (!isNaN(num)) {
          const idx = COUNSELING_NOTE_CARDS.findIndex((c) => c.number === num);
          if (idx !== -1) return idx;
        }
        const idx = COUNSELING_NOTE_CARDS.findIndex(
          (c) => c.id === noteParam || c.id === `nota-${noteParam.padStart(2, '0')}`
        );
        if (idx !== -1) return idx;
      }
    } catch {
      // Ignorar errores de parseo
    }
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getInitialIndex);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showIndexDropdown, setShowIndexDropdown] = useState(false);

  const currentNote = COUNSELING_NOTE_CARDS[currentIndex] || COUNSELING_NOTE_CARDS[0];
  const containerId = `counseling-center-card-${currentNote.id}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Mantener actualizada la URL con la nota activa actual (?tab=notes&nota=X)
  useEffect(() => {
    try {
      if (currentNote) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'notes');
        url.searchParams.set('nota', currentNote.number.toString());
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      console.error('Error sincronizando URL de la nota:', e);
    }
  }, [currentIndex, currentNote]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalNotes);
  }, [totalNotes]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalNotes) % totalNotes);
  }, [totalNotes]);

  // Navegación por teclado (Flechas izquierda y derecha)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Compartir en WhatsApp con link directo a esta nota
  const handleWhatsApp = () => {
    shareToWhatsApp(currentNote);
    showToast('Abriendo WhatsApp con enlace directo...');
  };

  // Copiar el texto completo de la nota
  const handleCopyText = async () => {
    const ok = await copyCardToClipboard(currentNote);
    if (ok) {
      setCopiedText(true);
      showToast('¡Texto copiado para WhatsApp!');
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Copiar únicamente el enlace directo
  const handleCopyLink = async () => {
    const ok = await copyDirectLinkToClipboard(currentNote);
    if (ok) {
      setCopiedLink(true);
      showToast('¡Enlace directo a esta nota copiado!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Descargar imagen PNG de la nota
  const handleDownload = async () => {
    setIsDownloading(true);
    showToast('Generando imagen de la nota...');
    await downloadCardAsImage(containerId, currentNote.title);
    setIsDownloading(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-between px-3 sm:px-6 lg:px-12 py-4 sm:py-6 max-w-6xl mx-auto animate-fade-in select-none">
        {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 px-4 py-2.5 rounded-xl bg-white/95 text-amber-900 border border-amber-300 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Barra superior de control y selector de notas */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#d2daca] mb-4">
        
        {/* Indicador de posición y título del documento */}
        <div className="flex items-center space-x-3">
          <div className="px-2.5 py-1 rounded-lg bg-sage-100 border border-sage-300 text-sage-900 font-mono text-xs font-bold">
            Nota {currentIndex + 1} de {totalNotes}
          </div>
          <span className="hidden sm:inline text-xs text-[#56685f] font-medium">
            Capacitado para orientar
          </span>
        </div>

        {/* Acciones superiores: Copiar link directo + Selector rápido de notas */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#fbfcfa] hover:bg-sage-50 border border-[#d2daca] text-xs text-[#253831] hover:text-sage-950 shadow-sm transition-colors"
            title="Copiar link directo a esta nota"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Link2 className="w-3.5 h-3.5 text-sage-700" />}
            <span className="hidden sm:inline">{copiedLink ? '¡Enlace copiado!' : 'Copiar link'}</span>
          </button>

          {/* Selector desplegable de notas */}
          <div className="relative">
            <button
              onClick={() => setShowIndexDropdown(!showIndexDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#fbfcfa] hover:bg-sage-50 border border-[#d2daca] text-xs text-[#253831] hover:text-sage-950 shadow-sm transition-colors"
            >
              <ListFilter className="w-3.5 h-3.5 text-sage-700" />
              <span>Índice</span>
            </button>

            {showIndexDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto bg-[#fbfcfa] border border-[#d2daca] rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#56685f] border-b border-[#e6eae0]">
                  Selecciona una nota
                </div>
                {COUNSELING_NOTE_CARDS.map((note, idx) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowIndexDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentIndex === idx 
                        ? 'bg-sage-200 text-sage-950 font-semibold' 
                        : 'text-[#253831] hover:bg-sage-50'
                    }`}
                  >
                    <span className="truncate pr-2 font-medium">
                      {idx + 1}. {note.title}
                    </span>
                    <span className="text-[10px] text-[#71847a] whitespace-nowrap font-mono">
                      #{note.number}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ÁREA CENTRAL: Nota centrada con botones de navegación a los costados */}
      <div className="flex-1 flex items-center justify-center my-2 sm:my-4">
        <div className="w-full flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
          
          {/* BOTÓN IZQUIERDA (Anterior) */}
          <button
            onClick={handlePrev}
            className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#fbfcfa] hover:bg-sage-50 border border-[#d2daca] hover:border-sage-600 text-sage-800 hover:text-sage-950 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105 active:scale-95 group"
            title="Nota anterior (o usa flecha izquierda del teclado)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* TARJETA CENTRADA */}
          <div 
            id={containerId}
            className="w-full max-w-2xl sm:max-w-3xl bg-[#fbfcfa] rounded-2xl sm:rounded-3xl border border-[#d2daca] shadow-[0_8px_30px_-4px_rgba(35,57,46,0.07)] p-6 sm:p-8 lg:p-9 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              {/* Metadatos superiores de la nota */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e6eae0]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-900 border border-sage-300">
                    {currentNote.category}
                  </span>
                  {currentNote.elementTag && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#eaf0e6] text-sage-900 border border-sage-300">
                      {currentNote.elementTag}
                    </span>
                  )}
                  {currentNote.documentPage && (
                    <span className="text-[11px] text-[#56685f] font-mono bg-[#edf2ea] px-2 py-0.5 rounded">
                      {currentNote.documentPage}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-[#71847a] font-semibold">
                  #{currentNote.number.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Título de la nota */}
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#192722] tracking-tight leading-snug mb-5">
                {currentNote.title}
              </h2>

              {/* Contenido condicional: Nota de Introducción vs Nota Estándar */}
              {currentNote.isIntro ? (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Declaración inicial / Callout destacado */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sage-50 to-[#edf2ea] border border-sage-300 shadow-sm">
                    <p className="text-sm sm:text-base lg:text-[17px] text-sage-950 font-serif italic leading-relaxed">
                      «Si existe un ministerio que es vital para la salud espiritual de una iglesia local es el de <span className="font-semibold text-emerald-900 not-italic">discipular y aconsejar bíblicamente</span>.»
                    </p>
                  </div>

                  {/* Mandato de Cristo y Efesios 4:12 */}
                  <div className="space-y-2.5">
                    <p className="text-xs sm:text-sm text-[#253831] leading-relaxed">
                      El Señor Jesucristo nos llama a <strong className="text-[#192722]">‘Hacer discípulos… enseñándoles a guardar todo lo que os he mandado...’</strong>, este es el ministerio que <strong className="text-sage-900">Efesios 4:12</strong> nos apunta:
                    </p>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#f0f5ee] border-l-4 border-l-sage-600 border border-[#cfe0cb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sage-900 font-semibold text-xs">
                          <BookOpen className="w-4 h-4 text-sage-700" />
                          <span>Efesios 4:12</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#192722] italic font-serif">
                          « 12 a fin de capacitar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo. »
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openBible('Efesios 4:12')}
                        className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-medium text-sage-900 hover:text-black bg-[#e0ecdc] hover:bg-sage-200 border border-[#b8ceb4] flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
                        title="Abrir Efesios 4:12 en el Lector Bíblico"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sage-700" />
                        <span>Consultar Pasaje</span>
                      </button>
                    </div>
                  </div>

                  {/* La Importancia del Ministerio (3 Puntos Centrales) */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 rounded-full bg-sage-700" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sage-950 font-serif">
                        Quisiera que entendamos la importancia del ministerio al que Dios nos ha llamado:
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Punto 1 */}
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#fbfcfa] border border-[#d2daca] shadow-sm hover:border-sage-400 transition-colors">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-200 border border-sage-300 text-sage-950 text-xs font-bold flex items-center justify-center mt-0.5">
                          1
                        </span>
                        <div className="text-xs sm:text-sm text-[#253831] leading-relaxed">
                          Reconociendo siempre que el <strong className="text-[#192722]">Consejero detrás de toda su consejería</strong> es el <span className="font-semibold text-emerald-900">Espíritu Santo</span>.
                        </div>
                      </div>

                      {/* Punto 2 */}
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#fbfcfa] border border-[#d2daca] shadow-sm hover:border-sage-400 transition-colors">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-200 border border-sage-300 text-sage-950 text-xs font-bold flex items-center justify-center mt-0.5">
                          2
                        </span>
                        <div className="text-xs sm:text-sm text-[#253831] leading-relaxed">
                          El aconsejado y el consejero tienen un <strong className="text-[#192722]">trabajo que hacer</strong>, entendiendo y actuando de acuerdo a la <span className="font-semibold text-sage-900">Biblia</span>.
                        </div>
                      </div>

                      {/* Punto 3 */}
                      <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#fbfcfa] border border-[#d2daca] shadow-sm hover:border-sage-400 transition-colors">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-200 border border-sage-300 text-sage-950 text-xs font-bold flex items-center justify-center mt-0.5">
                          3
                        </span>
                        <div className="text-xs sm:text-sm text-[#253831] leading-relaxed">
                          El ministerio de la palabra pública (<em className="text-sage-900 font-serif">predicación expositiva</em>), así como la ministración de la palabra en privado, <strong className="text-[#192722]">uno a uno</strong>, son la base de una iglesia sana bíblicamente.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crecimiento Espiritual y Efesios 4:13 */}
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs sm:text-sm text-[#253831] leading-relaxed">
                      De este ministerio depende el crecimiento espiritual de cada uno de nosotros al conocer y vivir lo que Dios pide a su iglesia:
                    </p>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#f0f5ee] border-l-4 border-l-sage-600 border border-[#cfe0cb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sage-900 font-semibold text-xs">
                          <BookOpen className="w-4 h-4 text-sage-700" />
                          <span>Efesios 4:13</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#192722] italic font-serif">
                          « 13 hasta que todos lleguemos a la unidad de la fe y del conocimiento pleno del Hijo de Dios, a la condición de un hombre maduro, a la medida de la estatura de la plenitud de Cristo; »
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openBible('Efesios 4:13')}
                        className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-medium text-sage-900 hover:text-black bg-[#e0ecdc] hover:bg-sage-200 border border-[#b8ceb4] flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
                        title="Abrir Efesios 4:13 en el Lector Bíblico"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sage-700" />
                        <span>Consultar Pasaje</span>
                      </button>
                    </div>
                  </div>

                  {/* Definición Central de Consejería Bíblica (Destacado Especial) */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-[#edf4ea] border-2 border-sage-400 shadow-sm space-y-2.5 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 border-b border-sage-300 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sage-900 font-mono">
                        Definición de Consejería Bíblica:
                      </span>
                      <Quote className="w-5 h-5 text-sage-600" />
                    </div>

                    <p className="text-sm sm:text-base text-[#15231e] font-serif italic leading-relaxed font-medium">
                      “Consejería bíblica es la aplicación del ministerio uno a uno modelado por Cristo, usando la sabiduría de su Palabra para guiar a la persona en el proceso de cambio bíblico y experimentar la transformación en su caminar que dé gloria a Dios.”
                    </p>
                  </div>

                  {/* Colosenses 1:28 */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#f0f5ee] border-l-4 border-l-sage-600 border border-[#cfe0cb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sage-900 font-semibold text-xs">
                        <BookOpen className="w-4 h-4 text-sage-700" />
                        <span>Colosenses 1:28</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#192722] italic font-serif">
                        « 28 A Él nosotros proclamamos, amonestando a todos los hombres, y enseñando a todos los hombres con toda sabiduría, a fin de poder presentar a todo hombre perfecto en Cristo. »
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openBible('Colosenses 1:28')}
                      className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-medium text-sage-900 hover:text-black bg-[#e0ecdc] hover:bg-sage-200 border border-[#b8ceb4] flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
                      title="Abrir Colosenses 1:28 en el Lector Bíblico"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sage-700" />
                      <span>Consultar Pasaje</span>
                    </button>
                  </div>

                </div>
              ) : (
                <>
                  {/* Enseñanza Central (Estructurada y fácil de leer) */}
                  <div className="mb-5">
                    <p className="text-sm sm:text-base lg:text-[17px] text-[#253831] leading-relaxed font-normal">
                      {currentNote.coreTeaching}
                    </p>
                  </div>

                  {/* Cita textual si la tiene */}
                  {currentNote.quote && (
                    <div className="mb-5 p-4 rounded-xl bg-[#edf2ea] border border-[#d2ded0]">
                      <Quote className="w-5 h-5 text-sage-700 mb-1 opacity-80" />
                      <p className="text-xs sm:text-sm text-[#192722] italic leading-relaxed">
                        «{currentNote.quote.text}»
                      </p>
                      <div className="text-right mt-1.5">
                        <span className="text-xs font-semibold text-sage-800">— {currentNote.quote.author}</span>
                      </div>
                    </div>
                  )}

                  {/* Pasajes Bíblicos citados en el documento */}
                  {currentNote.biblicalPassages && currentNote.biblicalPassages.length > 0 && (
                    <div className="mb-5 space-y-2.5">
                      {currentNote.biblicalPassages.map((p, idx) => (
                        <div key={idx} className="verse-blockquote text-xs sm:text-sm leading-relaxed">
                          <div className="flex items-center justify-between text-sage-900 font-semibold mb-1">
                            <div className="flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4 text-sage-700" />
                              <span>{p.reference}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openBible(p.reference)}
                              className="text-[11px] font-medium text-sage-800 hover:text-sage-950 underline flex items-center gap-1"
                              title={`Abrir ${p.reference} en Lector Bíblico`}
                            >
                              <BookOpen className="w-3 h-3 text-sage-700" />
                              <span>Leer</span>
                            </button>
                          </div>
                          <p className="text-[#192722] italic">
                            "{p.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preguntas de Consejería en el documento */}
                  {currentNote.keyQuestions && currentNote.keyQuestions.length > 0 && (
                    <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-[#f0f5ee] border border-[#cfe0cb]">
                      <div className="flex items-center gap-1.5 text-sage-950 font-semibold text-xs sm:text-sm mb-2">
                        <HelpCircle className="w-4 h-4 text-sage-700" />
                        <span>Preguntas Clave de Orientación:</span>
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#253831]">
                        {currentNote.keyQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2 font-medium">
                            <span className="text-sage-700 font-bold">•</span>
                            <span className="text-[#192722]">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Puntos de aprendizaje estructurados */}
                  {currentNote.practicalPoints && currentNote.practicalPoints.length > 0 && (
                    <div className="pt-2 border-t border-[#e6eae0]">
                      <ul className="space-y-2 text-xs sm:text-sm text-[#253831]">
                        {currentNote.practicalPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-sage-700 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Barra de Acciones: Compartir por WhatsApp, Copiar, Descargar */}
            <div className="mt-6 pt-4 border-t border-[#e6eae0] flex items-center justify-between gap-2.5 sm:gap-3">
              
              {/* Botón principal: Compartir en WhatsApp con link directo */}
              <button
                onClick={handleWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366] hover:bg-[#20ba59] text-slate-950 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                title="Compartir por WhatsApp con enlace directo a esta nota"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Compartir en WhatsApp</span>
              </button>

              {/* Copiar enlace directo a esta nota */}
              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl text-xs font-medium bg-[#edf2ea] hover:bg-[#dfe8da] text-sage-950 border border-[#cfe0cb] shadow-sm transition-colors"
                title="Copiar enlace directo de esta nota"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Link2 className="w-4 h-4" />}
              </button>

              {/* Copiar texto completo */}
              <button
                onClick={handleCopyText}
                className="p-2.5 rounded-xl text-xs font-medium bg-[#fbfcfa] hover:bg-[#edf2ea] text-[#253831] border border-[#d2daca] shadow-sm transition-colors"
                title="Copiar texto de la nota al portapapeles"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* Descargar imagen PNG */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2.5 rounded-xl text-xs font-medium bg-[#fbfcfa] hover:bg-[#edf2ea] text-[#253831] border border-[#d2daca] shadow-sm transition-colors disabled:opacity-50"
                title="Descargar nota como imagen PNG"
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-sage-700' : ''}`} />
              </button>

            </div>

          </div>

          {/* BOTÓN DERECHA (Siguiente) */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#fbfcfa] hover:bg-sage-50 border border-[#d2daca] hover:border-sage-600 text-sage-800 hover:text-sage-950 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105 active:scale-95 group"
            title="Siguiente nota (o usa flecha derecha del teclado)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>
      </div>

      {/* Barra de progreso y navegación inferior */}
      <div className="w-full pt-4 border-t border-[#d2daca] flex items-center justify-between text-xs text-[#56685f]">
        
        {/* Botón texto Anterior */}
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#fbfcfa] hover:bg-sage-50 text-[#253831] hover:text-sage-950 border border-[#d2daca] shadow-sm transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        {/* Puntos / Barra de progreso */}
        <div className="flex items-center space-x-1.5">
          <div className="hidden sm:flex items-center space-x-1">
            {COUNSELING_NOTE_CARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx 
                    ? 'w-5 bg-sage-800' 
                    : 'w-1.5 bg-[#ccd5c6] hover:bg-[#b0c0a8]'
                }`}
                title={`Ir a nota ${idx + 1}`}
              />
            ))}
          </div>
          <span className="sm:hidden font-mono text-[#56685f]">
            {currentIndex + 1} / {totalNotes}
          </span>
        </div>

        {/* Botón texto Siguiente */}
        <button
          onClick={handleNext}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#fbfcfa] hover:bg-sage-50 text-[#253831] hover:text-sage-950 border border-[#d2daca] shadow-sm transition-colors"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
};
