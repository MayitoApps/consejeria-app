import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Bookmark, 
  MessageCircle, 
  Copy, 
  Check, 
  Quote, 
  Lightbulb, 
  Sparkles 
} from 'lucide-react';
import { CounselingNoteCard } from '../../types/notes';
import { shareToWhatsApp, copyCardToClipboard } from '../../utils/counselingNotesShare';

interface FlashcardStudyModalProps {
  cards: CounselingNoteCard[];
  initialIndex?: number;
  onClose: () => void;
  learnedIds: Set<string>;
  onToggleLearned: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const FlashcardStudyModal: React.FC<FlashcardStudyModalProps> = ({
  cards,
  initialIndex = 0,
  onClose,
  learnedIds,
  onToggleLearned,
  onShowToast
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!cards.length) return null;

  const currentCard = cards[currentIndex];
  const isLearned = learnedIds.has(currentCard.id);
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentIndex(randomIndex);
    if (onShowToast) onShowToast('¡Tarjeta al azar seleccionada!');
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCopy = async () => {
    const success = await copyCardToClipboard(currentCard);
    if (success) {
      setCopied(true);
      if (onShowToast) onShowToast('¡Copiado para WhatsApp!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    shareToWhatsApp(currentCard);
    if (onShowToast) onShowToast('Abriendo WhatsApp...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#f2f4ee] border border-[#d2daca] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Barra superior de estado */}
        <div className="px-6 py-4 border-b border-[#d2daca] flex items-center justify-between bg-[#fbfcfa]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-900 block">
                Modo Didáctico • Tarjeta {currentIndex + 1} de {cards.length}
              </span>
              <span className="text-[11px] text-[#56685f]">
                {cards.length - learnedIds.size} por dominar • {learnedIds.size} dominadas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="p-2 rounded-xl text-sage-800 hover:text-sage-950 bg-[#edf2ea] hover:bg-[#dfe8da] transition-colors"
              title="Tarjeta aleatoria"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sage-800 hover:text-sage-950 bg-[#edf2ea] hover:bg-[#dfe8da] transition-colors"
              title="Cerrar modo didáctico"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-[#d2daca] h-1.5">
          <div 
            className="h-full bg-sage-800 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Contenido interactivo de la Flashcard */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-center min-h-[380px]">
          
          <div 
            onClick={handleFlip}
            className={`w-full min-h-[340px] rounded-2xl border p-6 sm:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              isFlipped 
                ? 'bg-[#fbfcfa] border-sage-500 shadow-xl shadow-sage-950/10' 
                : 'bg-[#fbfcfa] border-[#d2daca] hover:border-sage-400 shadow-md'
            }`}
          >
            {/* LADO ANVERSO (Pregunta / Desafío) */}
            {!isFlipped ? (
              <div className="flex flex-col h-full justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sage-100 text-sage-900 border border-sage-300">
                      {currentCard.category}
                    </span>
                    <span className="text-xs font-mono text-[#71847a]">
                      Toca para voltear ↺
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#192722] tracking-tight leading-snug mb-6">
                    {currentCard.title}
                  </h3>

                  <div className="p-5 rounded-2xl bg-[#f0f5ee] border border-[#cfe0cb] flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-sage-700 flex-shrink-0 mt-0.5" />
                    <p className="text-base sm:text-lg font-medium text-sage-950 italic leading-relaxed">
                      "{currentCard.studyQuestion}"
                    </p>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-[#e6eae0] flex items-center justify-center gap-2 text-xs font-medium text-sage-800">
                  <RotateCw className="w-4 h-4 animate-spin-slow" />
                  <span>Haz clic en cualquier parte de la tarjeta para ver la respuesta bíblica</span>
                </div>
              </div>
            ) : (
              /* LADO REVERSO (Respuesta / Fundamento Bíblico Fiel) */
              <div className="flex flex-col h-full justify-between space-y-5 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sage-100 text-sage-900 border border-sage-300">
                      Principio Bíblico Verificado
                    </span>
                    <span className="text-xs font-mono text-[#71847a]">
                      Toca para volver a la pregunta ↺
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#192722] leading-relaxed font-normal mb-4">
                    {currentCard.coreTeaching}
                  </p>

                  {/* Cita */}
                  {currentCard.quote && (
                    <div className="mb-3 p-3 rounded-xl bg-[#edf2ea] border border-[#d2ded0]">
                      <Quote className="w-4 h-4 text-sage-700 mb-1 opacity-80" />
                      <p className="text-xs text-[#192722] italic">
                        «{currentCard.quote.text}»
                      </p>
                      <span className="text-[10px] text-sage-800 font-semibold block text-right mt-1">
                        — {currentCard.quote.author}
                      </span>
                    </div>
                  )}

                  {/* Pasajes Bíblicos */}
                  {currentCard.biblicalPassages && (
                    <div className="mb-3 space-y-2">
                      {currentCard.biblicalPassages.map((p, idx) => (
                        <div key={idx} className="verse-blockquote text-xs leading-relaxed">
                          <span className="text-sage-900 font-bold block mb-0.5">{p.reference}</span>
                          <span className="text-[#192722] italic">"{p.text}"</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preguntas o Puntos */}
                  {currentCard.keyQuestions && (
                    <div className="p-2.5 rounded-xl bg-[#f0f5ee] border border-[#cfe0cb] text-xs">
                      <span className="text-sage-950 font-semibold block mb-1">Preguntas clave:</span>
                      {currentCard.keyQuestions.map((q, idx) => (
                        <p key={idx} className="text-[#253831]">• {q}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center pt-3 border-t border-[#e6eae0] text-[11px] text-[#71847a]">
                  Capacitado para orientar • Fiel al texto original
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Barra inferior de navegación y compartir */}
        <div className="px-6 py-4 border-t border-[#d2daca] bg-[#fbfcfa] flex flex-wrap items-center justify-between gap-3">
          
          {/* Navegación Anterior / Siguiente */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#edf2ea] hover:bg-[#dfe8da] text-[#253831] flex items-center gap-1.5 transition-colors border border-[#d2daca]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleFlip}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sage-100 hover:bg-sage-200 text-sage-950 border border-sage-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Ver Pregunta' : 'Voltear'}</span>
            </button>
            <button
              onClick={handleNext}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#edf2ea] hover:bg-[#dfe8da] text-[#253831] flex items-center gap-1.5 transition-colors border border-[#d2daca]"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Marcar y Compartir */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLearned(currentCard.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isLearned 
                  ? 'bg-sage-200 text-sage-950 border border-sage-400' 
                  : 'bg-[#edf2ea] text-[#253831] hover:text-sage-950 border border-[#d2daca]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isLearned ? 'fill-sage-800' : ''}`} />
              <span>{isLearned ? 'Dominada' : 'Por Dominar'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-xs bg-[#edf2ea] hover:bg-[#dfe8da] text-[#253831] border border-[#d2daca]"
              title="Copiar texto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-black flex items-center gap-1.5 transition-all shadow-sm"
              title="Compartir por WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
