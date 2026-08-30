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
  ListFilter
} from 'lucide-react';
import { BibleStudy, VerseItem } from '../../types';
import { exportStudyToPDF } from '../../services/pdfService';

interface StudyDetailProps {
  study: BibleStudy;
  onBack: () => void;
}

export const StudyDetail: React.FC<StudyDetailProps> = ({ study, onBack }) => {
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
    { id: 'conclusiones', label: '8. Conclusiones' }
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 animate-fade-in space-y-8">
      
      {/* Barra de Acciones Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 text-xs sm:text-sm font-semibold transition-all group self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a Estudios Bíblicos</span>
        </button>

        {/* Controles de lectura interactiva */}
        <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
          {/* Selector de tamaño de fuente */}
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
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPDF ? 'Exportando...' : 'Descargar PDF Oficial'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtro Rápido / Navegación por Pestañas de Sección */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-slate-500 text-xs flex items-center space-x-1.5 mr-1 flex-shrink-0">
          <ListFilter className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline font-semibold">Sección:</span>
        </span>
        {SECTIONS_NAV.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveFilterSection(nav.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none ${
              activeFilterSection === nav.id
                ? 'bg-amber-600 text-white shadow-gold-sm border border-amber-500'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {nav.label}
          </button>
        ))}
      </div>

      {/* Contenedor Principal del Estudio */}
      <div id={`study-content-${study.id}`} className="space-y-8">
        
        {/* Banner Principal del Estudio - Expansivo y Espacioso */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-500/25 shadow-navy-md relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              {study.category}
            </span>
            <span className="text-xs text-slate-400 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700 font-medium">
              {study.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text tracking-tight leading-tight break-words">
            {study.title}
          </h1>
          <p className="font-serif text-sm sm:text-base text-amber-200/80 italic mt-2 break-words max-w-4xl">
            {study.subtitle}
          </p>

          {/* RESUMEN DESTACADO */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Resumen Ejecutivo del Estudio</span>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/60 border border-amber-500/20">
              <p className={`font-serif text-slate-200 leading-relaxed italic ${
                fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
              }`}>
                {study.summary}
              </p>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
            {study.tags.map((tag, idx) => (
              <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-slate-900/90 text-slate-400 border border-slate-700/60 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 1. SECCIÓN: Pasajes Bíblicos & Exégesis */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'pasajes') && (
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-6 overflow-hidden animate-fade-in">
            
            {/* Encabezado con buscador y controles */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                    Fundamentación Escritural
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    Pasajes bíblicos & Exégesis ({study.sections.verses.length} Pasajes)
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Buscador de versículo */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={verseSearchQuery}
                    onChange={(e) => setVerseSearchQuery(e.target.value)}
                    placeholder="Buscar versículo..."
                    className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-44 sm:w-56 transition-all"
                  />
                </div>

                <button
                  onClick={expandAllExegesis}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium"
                >
                  Expandir Todo
                </button>
                <button
                  onClick={collapseAllExegesis}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs font-medium"
                >
                  Colapsar
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredVerses.map((v, i) => {
                const isExpanded = !!expandedVerseIndices[i];
                return (
                  <div 
                    key={i} 
                    className={`rounded-3xl border transition-all overflow-hidden ${
                      isExpanded 
                        ? 'bg-slate-900/95 border-amber-500/40 shadow-navy-sm' 
                        : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/30'
                    }`}
                  >
                    {/* Encabezado del Pasaje */}
                    <div 
                      onClick={() => toggleVerseExegesis(i)}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none bg-slate-900/60 hover:bg-slate-850 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-serif font-bold text-amber-300 text-base sm:text-lg">
                            {v.reference}
                          </span>
                          <span className="text-xs text-slate-400 ml-2 font-sans">
                            ({v.version || 'RVR1960'})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={(e) => handleCopyExegesis(v, i, e)}
                          className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-700/70 text-xs flex items-center space-x-1.5 transition-all"
                          title="Copiar texto y exégesis"
                        >
                          {copiedVerseIndex === i ? (
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
                          type="button"
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                            isExpanded 
                              ? 'bg-amber-600 text-white shadow-sm' 
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Ocultar Exégesis' : 'Ver Exégesis'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Texto Íntegro del Pasaje */}
                    <div className="px-5 sm:px-6 pb-5">
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <p className={`font-serif text-slate-100 italic leading-relaxed break-words whitespace-pre-line ${
                          fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                        }`}>
                          "{v.text}"
                        </p>
                      </div>
                    </div>

                    {/* ACORDEÓN DE EXÉGESIS (4 PILARES INTEGRADOS) */}
                    {isExpanded && (
                      <div className="p-5 sm:p-7 border-t border-amber-500/20 bg-slate-950/80 space-y-4 animate-fade-in">
                        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>Estudio Exegético & Teológico Reformado:</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          
                          {/* 1. Términos Originales */}
                          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/25 space-y-1.5">
                            <span className="text-xs uppercase font-bold text-amber-400 block tracking-wider">
                              1. Términos Originales (Griego/Hebreo)
                            </span>
                            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words">
                              {v.exegesis.originalTerms}
                            </p>
                          </div>

                          {/* 2. Contexto Histórico */}
                          <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/25 space-y-1.5">
                            <span className="text-xs uppercase font-bold text-blue-400 block tracking-wider">
                              2. Contexto Histórico & Cultural
                            </span>
                            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words">
                              {v.exegesis.historicalContext}
                            </p>
                          </div>

                          {/* 3. Principio Teológico */}
                          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/25 space-y-1.5">
                            <span className="text-xs uppercase font-bold text-emerald-400 block tracking-wider">
                              3. Principio Teológico Central
                            </span>
                            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words">
                              {v.exegesis.theologicalPrinciple}
                            </p>
                          </div>

                          {/* 4. Aplicación en Consejería */}
                          <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/25 space-y-1.5">
                            <span className="text-xs uppercase font-bold text-purple-400 block tracking-wider">
                              4. Aplicación en Consejería Pastoral
                            </span>
                            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words">
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
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.introduction.title}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 pt-1">
              {study.sections.introduction.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-xs">
                      {pIdx + 1}
                    </span>
                    <span>{pIdx === 0 ? 'Abordaje Integral' : 'Factores Interrelacionados'}</span>
                  </div>
                  <p className={`text-slate-200 leading-relaxed break-words pt-1 ${
                    fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
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
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.problemToTreat.title}
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 pt-1">
              {study.sections.problemToTreat.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block">
                    Paso {pIdx + 1}
                  </span>
                  <p className={`text-slate-200 leading-relaxed break-words pt-1 ${
                    fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
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
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.rootProblem.title}
                </h2>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {study.sections.rootProblem.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    {pIdx === 0 ? 'Diagnóstico del Corazón Corrompido:' : 'El Diálogo Íntimo y los Pensamientos Planeados:'}
                  </span>
                  <p className={`text-slate-200 leading-relaxed break-words ${
                    fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
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
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.consequences.title}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2.5 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Teología del Cuerpo en la Instrucción Paulina:
              </span>
              {study.sections.consequences.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={`text-slate-200 leading-relaxed break-words ${
                  fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                }`}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 6. SECCIÓN: Cómo tratar el problema en consejería */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'consejeria') && (
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.counselingApproach.title}
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 pt-1">
              {study.sections.counselingApproach.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-block">
                    Pilar Pastoral {pIdx + 1}
                  </span>
                  <p className={`text-slate-200 leading-relaxed break-words pt-1 ${
                    fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
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
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.sanctificationFollowUp.title}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Esperanza Cristiana y Nueva Identidad:
              </span>
              {study.sections.sanctificationFollowUp.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={`text-slate-200 leading-relaxed break-words ${
                  fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                }`}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 8. SECCIÓN: Conclusiones */}
        {(activeFilterSection === 'todos' || activeFilterSection === 'conclusiones') && (
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Sección</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {study.sections.conclusions.title}
                </h2>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {study.sections.conclusions.paragraphs.map((p, pIdx) => (
                <div key={pIdx} className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block">
                    {pIdx === 0 && '1. La Enseñanza Escritural & Orden Natural'}
                    {pIdx === 1 && '2. Responsabilidad Personal vs. Determinismo'}
                    {pIdx === 2 && '3. Libertad, Lavamiento y Compromiso de Transformación'}
                  </span>
                  <p className={`text-slate-200 leading-relaxed break-words pt-1 ${
                    fontSize === 'grande' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                  }`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
