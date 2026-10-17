import React, { useState } from 'react';
import { 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  Lightbulb, 
  Quote, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Bookmark
} from 'lucide-react';
import { CounselingNoteCard } from '../../types/notes';
import { 
  shareToWhatsApp, 
  copyCardToClipboard, 
  downloadCardAsImage 
} from '../../utils/counselingNotesShare';

interface CounselingNoteCardItemProps {
  card: CounselingNoteCard;
  isLearned?: boolean;
  onToggleLearned?: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const CounselingNoteCardItem: React.FC<CounselingNoteCardItemProps> = ({
  card,
  isLearned = false,
  onToggleLearned,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const containerId = `counseling-card-${card.id}`;

  const handleCopy = async () => {
    const success = await copyCardToClipboard(card);
    if (success) {
      setCopied(true);
      if (onShowToast) onShowToast('¡Copiado al portapapeles listo para WhatsApp!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    shareToWhatsApp(card);
    if (onShowToast) onShowToast('Abriendo WhatsApp...');
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    if (onShowToast) onShowToast('Generando tarjeta en imagen PNG...');
    await downloadCardAsImage(containerId, card.title);
    setIsDownloading(false);
  };

  // Asignar colores temáticos para badges y bordes
  const getCategoryTheme = (color: string) => {
    switch (color) {
      case 'amber':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          numberBg: 'bg-amber-100 text-amber-900',
          borderGlow: 'hover:border-amber-400'
        };
      case 'emerald':
        return {
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          numberBg: 'bg-emerald-100 text-emerald-900',
          borderGlow: 'hover:border-emerald-400'
        };
      case 'blue':
        return {
          badge: 'bg-blue-100 text-blue-900 border-blue-300',
          numberBg: 'bg-blue-100 text-blue-900',
          borderGlow: 'hover:border-blue-400'
        };
      case 'purple':
        return {
          badge: 'bg-purple-100 text-purple-900 border-purple-300',
          numberBg: 'bg-purple-100 text-purple-900',
          borderGlow: 'hover:border-purple-400'
        };
      case 'rose':
        return {
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          numberBg: 'bg-rose-100 text-rose-900',
          borderGlow: 'hover:border-rose-400'
        };
      case 'indigo':
      default:
        return {
          badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          numberBg: 'bg-indigo-100 text-indigo-900',
          borderGlow: 'hover:border-indigo-400'
        };
    }
  };

  const theme = getCategoryTheme(card.categoryColor);

  return (
    <div 
      className={`group relative flex flex-col rounded-2xl bg-white border transition-all duration-300 ${
        isLearned ? 'border-emerald-500/40 bg-emerald-50/20 shadow-sm' : 'border-stone-200 hover:border-amber-400/60 shadow-sm'
      } ${theme.borderGlow}`}
    >
      {/* Contenedor capturable para exportación a imagen */}
      <div id={containerId} className="p-5 sm:p-6 flex-1 flex flex-col bg-white rounded-t-2xl">
        
        {/* Cabecera de la tarjeta */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold font-mono ${theme.numberBg}`}>
              #{card.number}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${theme.badge}`}>
              {card.category}
            </span>
            {card.elementTag && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-300">
                {card.elementTag}
              </span>
            )}
            {card.documentPage && (
              <span className="text-[10px] text-slate-500 font-mono bg-stone-100 px-1.5 py-0.5 rounded">
                {card.documentPage}
              </span>
            )}
          </div>

          {/* Botón de marcar como estudiada/aprendida */}
          {onToggleLearned && (
            <button
              onClick={() => onToggleLearned(card.id)}
              title={isLearned ? 'Marcar como pendiente' : 'Marcar como dominada'}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isLearned 
                  ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200' 
                  : 'text-slate-400 hover:text-amber-600 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isLearned ? 'fill-emerald-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Título de la tarjeta */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug mb-3 group-hover:text-amber-800 transition-colors">
          {card.title}
        </h3>

        {/* Pregunta didáctica / reflexiva */}
        <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] font-medium text-amber-900 leading-relaxed italic">
            "{card.studyQuestion}"
          </p>
        </div>

        {/* Enseñanza Clave (Fiel al documento) */}
        <div className="mb-4">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {card.coreTeaching}
          </p>
        </div>

        {/* Cita textual del documento si existe */}
        {card.quote && (
          <div className="mb-4 p-3 rounded-xl bg-purple-50 border border-purple-200 relative">
            <Quote className="w-4 h-4 text-purple-600 mb-1 opacity-80" />
            <p className="text-xs text-purple-950 italic leading-relaxed">
              «{card.quote.text}»
            </p>
            <div className="text-right mt-1.5">
              <span className="text-[11px] font-semibold text-purple-800">— {card.quote.author}</span>
            </div>
          </div>
        )}

        {/* Pasajes Bíblicos del documento */}
        {card.biblicalPassages && card.biblicalPassages.length > 0 && (
          <div className="mb-4 space-y-2">
            {card.biblicalPassages.map((p, idx) => (
              <div key={idx} className="verse-blockquote text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>{p.reference}</span>
                </div>
                <p className="text-slate-800 italic text-[12px]">
                  "{p.text}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Preguntas de consejería clave extraídas del texto */}
        {card.keyQuestions && card.keyQuestions.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200">
            <div className="flex items-center gap-1.5 text-sky-800 font-semibold text-xs mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>Preguntas Clave en la Orientación:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {card.keyQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-1.5 font-medium">
                  <span className="text-sky-600 font-bold">•</span>
                  <span className="text-slate-800">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Puntos Didácticos extraídos del texto */}
        {card.practicalPoints && card.practicalPoints.length > 0 && (
          <div className="mt-auto pt-2 border-t border-stone-100">
            <ul className="space-y-1.5 text-xs text-slate-700">
              {card.practicalPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Firma discreta en la captura */}
        <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-slate-400 font-serif">
          <span>Capacitado para orientar</span>
          <span>Ancla Consejería Bíblica</span>
        </div>
      </div>

      {/* Barra de Acciones (Compartir en WhatsApp, Copiar, Descargar) */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 rounded-b-2xl flex items-center justify-between gap-2">
        
        {/* Botón principal: Compartir en WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-slate-950 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          title="Compartir tarjeta formateada en WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950" />
          <span>Enviar por WhatsApp</span>
        </button>

        {/* Botón: Copiar Texto */}
        <button
          onClick={handleCopy}
          className="p-2 rounded-xl text-xs font-medium bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 transition-colors shadow-sm"
          title="Copiar texto completo al portapapeles"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Botón: Descargar como Imagen */}
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="p-2 rounded-xl text-xs font-medium bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 transition-colors disabled:opacity-50 shadow-sm"
          title="Descargar como tarjeta en imagen PNG"
        >
          <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-amber-600' : ''}`} />
        </button>
      </div>

    </div>
  );
};
