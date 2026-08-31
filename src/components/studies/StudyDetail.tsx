import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check,
  Bookmark,
  Layers,
  FileText,
  Search,
  Type,
  Shield,
  Heart,
  Compass,
  CheckCircle2,
  ListFilter,
  Library,
  ExternalLink,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { BibleStudy, VerseItem } from '../../types';
import { exportStudyToPDF } from '../../services/pdfService';
import { useBible } from '../../context/BibleContext';
import { GLOSSARY_TOPICS } from '../../data/glossaryBooksData';

interface StudyDetailProps {
  study: BibleStudy;
  onBack: () => void;
  onNavigateToGlossary?: (topicId: string, bookId?: string) => void;
}

export const StudyDetail: React.FC<StudyDetailProps> = ({ study, onBack, onNavigateToGlossary }) => {
  const { openBible } = useBible();
  // Estados de interactividad y lectura dinámica (todos los versículos cerrados por defecto)
  const [expandedVerseIndices, setExpandedVerseIndices] = useState<Record<number, boolean>>({});
  const [copiedVerseIndex, setCopiedVerseIndex] = useState<number | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [verseSearchQuery, setVerseSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'grande'>('normal');
  const [activeFilterSection, setActiveFilterSection] = useState<string>('todos');

  const toggleVerseExegesis = (index: number) => {
    setExpandedVerseIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAllExegesis = () => {
    const allExpanded: Record<number, boolean> = {};
    study.sections.verses.forEach((_, idx) => {
      allExpanded[idx] = true;
    });
    setExpandedVerseIndices(allExpanded);
  };

  const collapseAllExegesis = () => {
    setExpandedVerseIndices({});
  };

  const handleCopyExegesis = (v: VerseItem, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `[ESTUDIO EXEGÉTICO - ${v.reference}]\n"${v.text}"\n\n1. Términos Originales:\n${v.exegesis.originalTerms}\n\n2. Contexto Histórico:\n${v.exegesis.historicalContext}\n\n3. Principio Teológico:\n${v.exegesis.theologicalPrinciple}\n\n4. Aplicación en Consejería:\n${v.exegesis.pastoralApplication}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseIndex(index);
    setTimeout(() => setCopiedVerseIndex(null), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportStudyToPDF(study, `study-content-${study.id}`);
    } catch (err) {
      console.error('Error al exportar PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Filtrar versículos en tiempo real
  const filteredVerses = study.sections.verses.filter(v => 
    v.reference.toLowerCase().includes(verseSearchQuery.toLowerCase()) ||
    v.text.toLowerCase().includes(verseSearchQuery.toLowerCase()) ||
    v.exegesis.originalTerms.toLowerCase().includes(verseSearchQuery.toLowerCase())
  );

  const SECTIONS_NAV = [
    { id: 'todos', label: 'Todo el Estudio' },
    { id: 'pasajes', label: '1. Pasajes Bíblicos' },
    { id: 'introduccion', label: '2. Introducción' },
    { id: 'problema', label: '3. Problema a tratar' },
    { id: 'raiz', label: '4. Raíz del problema' },
    { id: 'consecuencias', label: '5. Consecuencias' },
    { id: 'consejeria', label: '6. Cómo tratar en consejería' },
    { id: 'santificacion', label: '7. Plan de santificación' },
    { id: 'conclusiones', label: '8. Conclusiones' },
    { id: 'bibliografia', label: '9. Índice Didáctico & Libros' }
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 animate-fade-in space-y-6 sm:space-y-8">
      
      {/* Barra de Acciones Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 text-xs font-medium transition-all group self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a Estudios Bíblicos</span>
        </button>

        {/* Controles de lectura interactiva */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          {/* Selector de tamaño de fuente */}
          <div className="flex items-center bg-slate-900/70 p-1 rounded-lg border border-white/[0.06] text-xs shadow-inner">
            <Type className="w-3 h-3 text-slate-400 mr-1.5 ml-1" />
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                fontSize === 'normal' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFontSize('grande')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                fontSize === 'grande' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grande
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] hover:border-amber-500/40 text-amber-300 hover:text-white text-xs font-medium transition-all shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'Exportando...' : 'Descargar PDF'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtro Rápido / Navegación por Pestañas de Sección */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        <span className="text-slate-500 text-[11px] flex items-center space-x-1 mr-1 flex-shrink-0">
          <ListFilter className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline font-medium">Sección:</span>
        </span>
        {SECTIONS_NAV.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveFilterSection(nav.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all select-none ${
              activeFilterSection === nav.id
                ? 'bg-amber-600 text-white shadow-gold-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/[0.05]'
            }`}
          >
            {nav.label}
          </button>
        ))}
      </div>

      {/* Contenedor Principal del Estudio */}
      <div id={`study-content-${study.id}`} className="space-y-6 sm:space-y-8">
        
        {/* Banner Principal del Estudio - Refinado y Espacioso */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/[0.08] shadow-navy-md relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-amber-950/15">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold uppercase tracking-wider">
              {study.category}
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-900/70 px-2.5 py-0.5 rounded-full border border-white/[0.05] font-medium">
              {study.readTime}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold gold-gradient-text tracking-tight leading-tight break-words">
            {study.title}
          </h1>
          <p className="font-serif text-xs sm:text-[13px] text-amber-200/70 italic mt-1.5 break-words max-w-3xl">
            {study.subtitle}
          </p>

          {/* RESUMEN DESTACADO */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400/90 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resumen Ejecutivo</span>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-slate-950/40 border border-white/[0.05]">
              <p className={`font-serif text-slate-200/90 leading-relaxed italic ${
                fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
              }`}>
                {study.summary}
              </p>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-1.5 mt-5 pt-3.5 border-t border-white/[0.06]">
            {study.tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-900/80 text-slate-400 border border-white/[0.05] font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 1. SECCIÓN: Pasajes Bíblicos & Exégesis */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'pasajes') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-5 overflow-hidden animate-fade-in">
            
            {/* Encabezado con buscador y controles */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">
                    Fundamentación Escritural
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                    Pasajes bíblicos & Exégesis ({study.sections.verses.length} Pasajes)
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Buscador de versículo */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={verseSearchQuery}
                    onChange={(e) => setVerseSearchQuery(e.target.value)}
                    placeholder="Buscar versículo..."
                    className="pl-8 pr-3 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 w-40 sm:w-48 transition-all"
                  />
                </div>

                <button
                  onClick={expandAllExegesis}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.06] hover:border-white/[0.12] text-slate-300 text-[11px] font-medium"
                >
                  Expandir
                </button>
                <button
                  onClick={collapseAllExegesis}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.06] hover:border-white/[0.12] text-slate-400 text-[11px] font-medium"
                >
                  Colapsar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredVerses.map((v, i) => {
                const isExpanded = !!expandedVerseIndices[i];
                return (
                  <div 
                    key={i} 
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded 
                        ? 'bg-slate-900/90 border-amber-500/30 shadow-navy-sm' 
                        : 'bg-slate-900/60 border-white/[0.05] hover:border-amber-500/20'
                    }`}
                  >
                    {/* Encabezado del Pasaje */}
                    <div 
                      onClick={() => toggleVerseExegesis(i)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer select-none bg-slate-900/40 hover:bg-slate-850/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-serif font-bold text-amber-300 text-sm sm:text-base">
                            {v.reference}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-2 font-sans">
                            ({v.version || 'RVR1960'})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBible(v.reference);
                          }}
                          className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-800 border border-white/[0.06] text-[11px] flex items-center space-x-1.5 transition-all"
                          title="Abrir en Lector Bíblico"
                        >
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span className="hidden sm:inline">Leer Pasaje</span>
                        </button>

                        <button
                          onClick={(e) => handleCopyExegesis(v, i, e)}
                          className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-white/[0.06] text-[11px] flex items-center space-x-1.5 transition-all"
                          title="Copiar texto y exégesis"
                        >
                          {copiedVerseIndex === i ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
                            isExpanded 
                              ? 'bg-amber-600 text-white shadow-sm' 
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isExpanded ? 'Ocultar Exégesis' : 'Ver Exégesis'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Texto Íntegro del Pasaje */}
                    <div className="px-4 sm:px-5 pb-4">
                      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/40 border border-white/[0.04]">
                        <p className={`font-serif text-slate-100 italic leading-relaxed break-words whitespace-pre-line ${
                          fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                        }`}>
                          "{v.text}"
                        </p>
                      </div>
                    </div>

                    {/* ACORDEÓN DE EXÉGESIS (4 PILARES INTEGRADOS) */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-slate-950/70 space-y-3.5 animate-fade-in">
                        <div className="flex items-center space-x-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Estudio Exegético & Teológico:</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3.5">
                          
                          {/* 1. Términos Originales */}
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                            <span className="text-[11px] uppercase font-semibold text-amber-400 block tracking-wider">
                              1. Términos Originales (Griego/Hebreo)
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed break-words">
                              {v.exegesis.originalTerms}
                            </p>
                          </div>

                          {/* 2. Contexto Histórico */}
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-500/20 space-y-1">
                            <span className="text-[11px] uppercase font-semibold text-blue-400 block tracking-wider">
                              2. Contexto Histórico & Cultural
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed break-words">
                              {v.exegesis.historicalContext}
                            </p>
                          </div>

                          {/* 3. Principio Teológico */}
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-1">
                            <span className="text-[11px] uppercase font-semibold text-emerald-400 block tracking-wider">
                              3. Principio Teológico Central
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed break-words">
                              {v.exegesis.theologicalPrinciple}
                            </p>
                          </div>

                          {/* 4. Aplicación en Consejería */}
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-1">
                            <span className="text-[11px] uppercase font-semibold text-purple-400 block tracking-wider">
                              4. Aplicación en Consejería Pastoral
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed break-words">
                              {v.exegesis.pastoralApplication}
                            </p>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. SECCIÓN: Introducción */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'introduccion') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.introduction.title}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-0.5">
              {study.sections.introduction.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-white/[0.05] space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-400/90 text-[11px] font-semibold uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center text-[10px] font-bold">
                      {pIdx + 1}
                    </span>
                    <span>{pIdx === 0 ? 'Abordaje Integral' : 'Factores Interrelacionados'}</span>
                  </div>
                  <p className={`text-slate-300/90 leading-relaxed break-words pt-0.5 ${
                    fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. SECCIÓN: Problema a tratar */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'problema') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.problemToTreat.title}
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-0.5">
              {study.sections.problemToTreat.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-white/[0.05] space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block">
                    Paso {pIdx + 1}
                  </span>
                  <p className={`text-slate-300/90 leading-relaxed break-words pt-0.5 ${
                    fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. SECCIÓN: Raíz del problema */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'raiz') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.rootProblem.title}
                </h2>
              </div>
            </div>

            <div className="space-y-3.5 pt-0.5">
              {study.sections.rootProblem.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-amber-500/15 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 block">
                    {pIdx === 0 ? 'Diagnóstico del Corazón Corrompido:' : 'El Diálogo Íntimo y los Pensamientos Planeados:'}
                  </span>
                  <p className={`text-slate-300/90 leading-relaxed break-words ${
                    fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. SECCIÓN: Consecuencias del pecado tratado */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'consecuencias') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.consequences.title}
                </h2>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-2 pt-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 block">
                Teología del Cuerpo en la Instrucción Paulina:
              </span>
              {study.sections.consequences.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={`text-slate-300/90 leading-relaxed break-words ${
                  fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                }`}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 6. SECCIÓN: Cómo tratar el problema en consejería */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'consejeria') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.counselingApproach.title}
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-0.5">
              {study.sections.counselingApproach.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-white/[0.05] space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-block">
                    Pilar Pastoral {pIdx + 1}
                  </span>
                  <p className={`text-slate-300/90 leading-relaxed break-words pt-0.5 ${
                    fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. SECCIÓN: Seguimiento del plan de santificación */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'santificacion') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.sanctificationFollowUp.title}
                </h2>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-2 pt-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90 block">
                Esperanza Cristiana y Nueva Identidad:
              </span>
              {study.sections.sanctificationFollowUp.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={`text-slate-300/90 leading-relaxed break-words ${
                  fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                }`}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 8. SECCIÓN: Conclusiones */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'conclusiones') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-white/[0.07] shadow-sm space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2.5 border-b border-white/[0.06] pb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {study.sections.conclusions.title}
                </h2>
              </div>
            </div>

            <div className="space-y-3 pt-0.5">
              {study.sections.conclusions.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-white/[0.05] space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block">
                    {pIdx === 0 && '1. La Enseñanza Escritural & Orden Natural'}
                    {pIdx === 1 && '2. Responsabilidad Personal vs. Determinismo'}
                    {pIdx === 2 && '3. Libertad, Lavamiento y Transformación'}
                  </span>
                  <p className={`text-slate-300/90 leading-relaxed break-words pt-0.5 ${
                    fontSize === 'grande' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. SECCIÓN: Fuentes Bibliográficas & Vínculos al Índice Didáctico */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'bibliografia') && (
          <section className="glass-card rounded-2xl p-5 sm:p-7 lg:p-8 border border-amber-500/25 shadow-navy-md space-y-6 animate-fade-in bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-amber-950/20">
            
            {/* Encabezado de la Sección */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-gold-sm">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">Sección 9</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] font-medium text-slate-400">Literatura & Consejería</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    Fuentes Bibliográficas & Vínculos al Índice Didáctico
                  </h2>
                </div>
              </div>

              {onNavigateToGlossary && (
                <button
                  onClick={() => onNavigateToGlossary(study.id)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-gold-sm transition-all group self-start sm:self-auto select-none"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Explorar Tema en el Índice Didáctico</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-[13px] text-slate-300/90 leading-relaxed max-w-4xl">
              Las siguientes obras maestras de hermenéutica, exégesis bíblica y consejería pastoral fundamentan doctrinalmente este estudio. Haz clic en cualquiera de los libros para abrirlo directamente en el <strong className="text-amber-300">Índice Didáctico</strong> y consultar sus capítulos, páginas exactas, citas textuales y principios de aplicación pastoral:
            </p>

            {/* Grid de Libros Citados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
              {((GLOSSARY_TOPICS.find(t => t.id === study.id) || GLOSSARY_TOPICS.find(t => t.id === 'inmoralidad-sexual'))?.books || []).map((book) => {
                const passage = book.passages[0];
                const topicId = (GLOSSARY_TOPICS.find(t => t.id === study.id) || GLOSSARY_TOPICS[0]).id;
                return (
                  <div
                    key={book.id}
                    onClick={() => onNavigateToGlossary?.(topicId, book.id)}
                    className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-amber-500/40 cursor-pointer group flex flex-col justify-between space-y-4 transition-all shadow-sm bg-slate-900/60"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
                            {book.author}
                          </span>
                          <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                            {book.title}
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-white/[0.05] whitespace-nowrap">
                          {book.year}
                        </span>
                      </div>

                      {passage && (
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/[0.04] space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-amber-300/90 font-medium">
                            <span>{passage.chapter}</span>
                            <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded text-[9px]">{passage.pages}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed">
                            "{passage.passageTitle}"
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {book.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {book.publisher}
                      </span>
                      <div className="flex items-center space-x-2">
                        {book.logosUrl && (
                          <a
                            href={book.logosUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center space-x-1 transition-all"
                            title="Abrir en Logos Bible Software"
                          >
                            <span>Logos</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                          <span>Índice Didáctico</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>
        )}

      </div>
    </div>
  );
};
