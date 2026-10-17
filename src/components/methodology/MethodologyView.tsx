import React, { useState, useRef } from 'react';
import { 
  Compass, 
  HeartHandshake, 
  HelpCircle, 
  BookOpen, 
  FileCheck, 
  Layers, 
  CalendarCheck, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Library, 
  FileText,
  CheckCircle2,
  Download,
  Bookmark,
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { METHODOLOGY_SECTIONS, METHODOLOGY_VERSE } from '../../data/methodologyData';

export const MethodologyView: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const phaseHeaderRef = useRef<HTMLDivElement>(null);

  const goToPhase = (index: number, shouldScroll = true) => {
    setActivePhaseIndex(index);
    if (shouldScroll) {
      setTimeout(() => {
        phaseHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return Compass;
      case 'HeartHandshake': return HeartHandshake;
      case 'HelpCircle': return HelpCircle;
      case 'BookOpen': return BookOpen;
      case 'FileCheck': return FileCheck;
      case 'Layers': return Layers;
      case 'CalendarCheck': return CalendarCheck;
      case 'Sparkles': return Sparkles;
      case 'TrendingUp': return TrendingUp;
      case 'ShieldCheck': return ShieldCheck;
      case 'Award': return Award;
      case 'Library': return Library;
      default: return FileText;
    }
  };

  // Definición de las 4 Fases de la Metodología Pastoral
  const PHASES = [
    {
      id: 0,
      title: 'Fase I: Recepción & Apertura',
      badge: 'Inicio & Exploración',
      borderColor: 'border-amber-500/40',
      icon: Compass,
      description: 'Oración inicial, formato de información general del aconsejado y apertura de expediente confidencial.',
      sectionNumbers: [1, 2, 3]
    },
    {
      id: 1,
      title: 'Fase II: Instrucción & Fundamentación',
      badge: 'Escritura & Verdad',
      borderColor: 'border-blue-500/40',
      icon: BookOpen,
      description: 'Entender el verdadero problema a la luz de Dios, brindar esperanza viva e instruir desde la 1ª sesión.',
      sectionNumbers: [4, 5, 6]
    },
    {
      id: 2,
      title: 'Fase III: Plan de Acción & Aplicación',
      badge: 'Santificación & Tareas',
      borderColor: 'border-emerald-500/40',
      icon: CalendarCheck,
      description: 'Desarrollo del plan pastoral por sesiones, tareas de santificación y monitoreo del compromiso mutuo.',
      sectionNumbers: [7, 8, 9, 10]
    },
    {
      id: 3,
      title: 'Fase IV: Evaluación & Recursos',
      badge: 'Fruto & Cierre',
      borderColor: 'border-purple-500/40',
      icon: Award,
      description: 'Evaluación de frutos de santidad conforme a Cristo, bibliografía doctrinal y notas de campo.',
      sectionNumbers: [11, 12, 13]
    }
  ];

  // Exportar Metodología a PDF Oficial
  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      const { exportMethodologyToPDF } = await import('../../services/pdfService');
      await exportMethodologyToPDF();
    } catch (err) {
      console.error('Error al generar PDF de metodología:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 animate-fade-in space-y-6 sm:space-y-8">
      
      {/* Header Banner - Verde Salvia & Pergamino Pastoral */}
      <div className="rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#d2daca] shadow-sm relative overflow-hidden bg-gradient-to-r from-[#e8ece2] via-[#f1f3ec] to-[#e4e9dd]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-sage-100 border border-sage-300 text-sage-950 text-[10px] font-semibold uppercase tracking-wider">
              <Compass className="w-3 h-3 text-sage-700" />
              <span>Metodología Pastoral de Acompañamiento</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#192722] tracking-tight leading-tight">
              Metodología de Consejería Bíblica
            </h1>
            <p className="text-xs sm:text-[13px] text-[#253831] max-w-2xl leading-relaxed pt-0.5">
              Guía estructurada en 4 fases y 13 dimensiones para el abordaje, discernimiento y evaluación pastoral conforme a las Escrituras.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#fbfcfa] border border-[#d2daca] hover:border-sage-500 text-sage-900 hover:bg-[#edf2ea] text-xs font-semibold transition-all shadow-sm flex-shrink-0 self-start lg:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'Generando PDF...' : 'Descargar PDF Oficial'}</span>
          </button>
        </div>
      </div>

      {/* Foundational Verse Card (Romanos 15:14) */}
      <div className="rounded-2xl p-4 sm:p-6 border border-[#cfe0cb] shadow-sm relative overflow-hidden bg-[#f0f5ee]">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-800 flex-shrink-0 shadow-sm">
            <Bookmark className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1.5 overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-sage-800 font-sans">
                Fundamento Bíblico
              </span>
              <span className="text-[11px] text-[#56685f] font-medium">• {METHODOLOGY_VERSE.reference}</span>
            </div>
            <p className="font-serif text-xs sm:text-sm text-[#192722] italic leading-relaxed break-words">
              "{METHODOLOGY_VERSE.text}"
            </p>
            <p className="text-xs text-[#253831] font-sans leading-relaxed pt-0.5 break-words">
              <strong className="text-sage-950 font-medium">Principio Doctrinal:</strong> {METHODOLOGY_VERSE.reflection}
            </p>
          </div>
        </div>
      </div>

      {/* 4 FASES INTERACTIVAS (SELECTOR DIRECTO DE FASE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = activePhaseIndex === idx;

          return (
            <button
              key={phase.id}
              onClick={() => goToPhase(idx, true)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between select-none shadow-sm ${
                isActive
                  ? `bg-sage-100/90 border-sage-500 shadow-md`
                  : 'bg-[#fbfcfa] border-[#d2daca] hover:border-sage-400 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-sage-800 text-white shadow-sm' : 'bg-[#edf2ea] text-[#253831]'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-[9px] uppercase font-semibold text-sage-800 tracking-wider">
                  {phase.badge}
                </span>
              </div>

              <div className="flex items-center space-x-2.5 mt-0.5">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sage-800' : 'text-[#71847a]'}`} />
                <span className="font-serif text-xs sm:text-[13px] font-bold text-[#192722] leading-tight">
                  {phase.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tarjetas Estructuradas de los Pasos de la Fase Seleccionada */}
      <div ref={phaseHeaderRef} className="space-y-5 scroll-mt-24">
        {METHODOLOGY_SECTIONS
          .filter(sec => PHASES[activePhaseIndex].sectionNumbers.includes(sec.number))
          .map(sec => {
            const Icon = getSectionIcon(sec.iconName);

            return (
              <div
                key={sec.number}
                className="rounded-2xl p-5 sm:p-7 border border-[#d2daca] shadow-sm space-y-4 bg-[#fbfcfa]"
              >
                {/* Encabezado del Paso */}
                <div className="flex items-center space-x-3.5 border-b border-[#e6eae0] pb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-sage-100 border border-sage-300 text-sage-950 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {sec.number}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-sage-100 text-sage-950 border border-sage-300">
                        {sec.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#192722] mt-0.5 break-words">
                      {sec.title}
                    </h3>
                    {sec.subtitle && (
                      <p className="text-xs text-[#56685f] mt-0.5 break-words">{sec.subtitle}</p>
                    )}
                  </div>
                  <Icon className="w-5 h-5 text-sage-700 ml-auto flex-shrink-0" />
                </div>

                {/* Resumen */}
                {sec.content.overview && (
                  <p className="text-xs text-[#253831] italic border-l-2 border-sage-500 pl-3 leading-relaxed break-words">
                    {sec.content.overview}
                  </p>
                )}

                {/* Subsecciones */}
                {sec.content.subsections && (
                  <div className="grid md:grid-cols-2 gap-3.5 pt-0.5">
                    {sec.content.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="p-3.5 sm:p-4 rounded-xl bg-[#f0f5ee] border border-[#cfe0cb] space-y-1.5">
                        <h4 className="font-serif text-xs font-bold text-sage-950 break-words">
                          {sub.title}
                        </h4>
                        <ul className="space-y-1 text-xs text-[#253831]">
                          {sub.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-1.5 break-words">
                              <span className="text-sage-700 font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preguntas */}
                {sec.content.questions && (
                  <div className="space-y-2.5 pt-0.5">
                    <h4 className="text-[11px] uppercase font-semibold text-sage-950 tracking-wider flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-sage-700" />
                      <span>Preguntas de Diagnóstico Pastoral:</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {sec.content.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-3 rounded-xl bg-[#f0f5ee] border border-[#cfe0cb] text-xs text-[#192722]">
                          <strong className="text-sage-950 block mb-0.5 text-[11px]">Pregunta {qIdx + 1}:</strong>
                          <p className="font-normal text-[#253831] break-words">"{q}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                {sec.content.items && (
                  <div className="space-y-1.5 pt-0.5">
                    {sec.content.items.map((item, iIdx) => (
                      <div key={iIdx} className="p-2.5 sm:p-3 rounded-xl bg-[#edf2ea] border border-[#d2daca] text-xs text-[#253831] flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage-700 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checklist */}
                {sec.content.checklist && (
                  <div className="p-4 rounded-xl bg-[#eaf2e7] border border-[#c4dcbf] space-y-2 pt-1">
                    <h4 className="text-[11px] uppercase font-semibold text-emerald-950 tracking-wider">
                      Criterios de Evaluación y Fruto:
                    </h4>
                    <div className="space-y-1.5">
                      {sec.content.checklist.map((chk, cIdx) => (
                        <div key={cIdx} className="flex items-start space-x-2 text-xs text-emerald-950 break-words">
                          <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Libros */}
                {sec.content.books && (
                  <div className="space-y-2.5 pt-0.5">
                    <h4 className="text-[11px] uppercase font-semibold text-sage-950 tracking-wider flex items-center space-x-1.5">
                      <Library className="w-3.5 h-3.5 text-sage-700" />
                      <span>Obras Teológicas Recomendadas:</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {sec.content.books.map((b, bIdx) => (
                        <div key={bIdx} className="p-3 rounded-xl bg-[#edf2ea] border border-[#d2daca] text-xs text-[#253831] flex items-start space-x-2">
                          <Bookmark className="w-3.5 h-3.5 text-sage-700 flex-shrink-0 mt-0.5" />
                          <span className="font-normal text-[#253831] break-words">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
      </div>

      {/* BOTONES INFERIORES DE NAVEGACIÓN ENTRE FASES */}
      <div className="rounded-2xl p-4 sm:p-6 border border-[#d2daca] bg-[#fbfcfa] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        {activePhaseIndex > 0 ? (
          <button
            onClick={() => goToPhase(activePhaseIndex - 1, true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#edf2ea] border border-[#d2daca] hover:bg-[#dfe8da] text-[#253831] hover:text-black text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-sage-700" />
            <span>Fase Anterior: {PHASES[activePhaseIndex - 1].title}</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        <div className="text-[11px] text-[#56685f] font-medium px-3 py-1 rounded-full bg-[#edf2ea] border border-[#d2daca]">
          Fase {activePhaseIndex + 1} de {PHASES.length}
        </div>

        {activePhaseIndex < PHASES.length - 1 ? (
          <button
            onClick={() => goToPhase(activePhaseIndex + 1, true)}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm group"
          >
            <span>Siguiente Fase: {PHASES[activePhaseIndex + 1].title}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

    </div>
  );
};
