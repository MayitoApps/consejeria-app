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
import jsPDF from 'jspdf';

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
  const handleExportPDF = () => {
    try {
      setIsExportingPDF(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 15;
      let y = margin;
      const pageWidth = 210;
      const contentWidth = pageWidth - (margin * 2);

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, 'F');
      
      doc.setTextColor(217, 119, 6);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('ANCLA CONSEJERÍA BÍBLICA', margin, 14);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Documento Oficial: Metodología de Consejería Pastoral (13 Dimensiones)', margin, 22);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin - 35, 22);

      y = 42;

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Fundamento Bíblico: ${METHODOLOGY_VERSE.reference}`, margin, y);
      y += 6;

      doc.setTextColor(180, 83, 9);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const verseLines = doc.splitTextToSize(`"${METHODOLOGY_VERSE.text}"`, contentWidth);
      doc.text(verseLines, margin, y);
      y += verseLines.length * 4.5 + 6;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 275) {
          doc.addPage();
          y = 20;
        }
      };

      METHODOLOGY_SECTIONS.forEach((sec) => {
        checkPageBreak(20);
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sec.number}. ${sec.title}`, margin, y);
        y += 4.5;

        if (sec.subtitle) {
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          doc.text(sec.subtitle, margin, y);
          y += 4.5;
        }

        if (sec.content.overview) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          const ovLines = doc.splitTextToSize(sec.content.overview, contentWidth);
          doc.text(ovLines, margin, y);
          y += ovLines.length * 4 + 2;
        }

        if (sec.content.subsections) {
          sec.content.subsections.forEach(sub => {
            checkPageBreak(12);
            doc.setTextColor(180, 83, 9);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(sub.title, margin + 2, y);
            y += 4;

            doc.setTextColor(51, 65, 85);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            sub.points.forEach(p => {
              checkPageBreak(7);
              const pLines = doc.splitTextToSize(`• ${p}`, contentWidth - 4);
              doc.text(pLines, margin + 4, y);
              y += pLines.length * 3.5;
            });
            y += 2;
          });
        }

        if (sec.content.questions) {
          doc.setTextColor(180, 83, 9);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'bold');
          doc.text('Preguntas Clave:', margin + 2, y);
          y += 4;

          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          sec.content.questions.forEach((q, idx) => {
            checkPageBreak(7);
            const qLines = doc.splitTextToSize(`${idx + 1}. ${q}`, contentWidth - 4);
            doc.text(qLines, margin + 4, y);
            y += qLines.length * 3.5;
          });
          y += 2;
        }

        if (sec.content.items) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          sec.content.items.forEach(it => {
            checkPageBreak(7);
            const itLines = doc.splitTextToSize(`- ${it}`, contentWidth - 4);
            doc.text(itLines, margin + 4, y);
            y += itLines.length * 3.5;
          });
          y += 2;
        }

        if (sec.content.checklist) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          sec.content.checklist.forEach(c => {
            checkPageBreak(7);
            const cLines = doc.splitTextToSize(`[✓] ${c}`, contentWidth - 4);
            doc.text(cLines, margin + 4, y);
            y += cLines.length * 3.5;
          });
          y += 2;
        }

        if (sec.content.books) {
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          sec.content.books.forEach(b => {
            checkPageBreak(7);
            const bLines = doc.splitTextToSize(`📖 ${b}`, contentWidth - 4);
            doc.text(bLines, margin + 4, y);
            y += bLines.length * 3.5;
          });
          y += 2;
        }

        y += 3;
      });

      doc.save('Metodologia-de-Consejeria-Biblica.pdf');
    } catch (err) {
      console.error('Error al generar PDF de metodología:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 animate-fade-in space-y-8">
      
      {/* Header Banner - Expansivo y Elegante */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-500/20 shadow-navy-md relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Metodología Pastoral de Acompañamiento</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text tracking-tight leading-tight">
              Metodología de Consejería Bíblica
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed pt-1">
              Guía estructurada en 4 fases y 13 dimensiones para el abordaje, discernimiento y evaluación pastoral conforme a las Escrituras.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white text-xs font-semibold transition-all shadow-sm flex-shrink-0 self-start lg:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPDF ? 'Generando PDF...' : 'Descargar PDF Oficial'}</span>
          </button>
        </div>
      </div>

      {/* Foundational Verse Card (Romanos 15:14) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-sm relative overflow-hidden bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-sm">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-sans">
                Fundamento Bíblico
              </span>
              <span className="text-xs text-slate-400 font-medium">• {METHODOLOGY_VERSE.reference}</span>
            </div>
            <p className="font-serif text-sm sm:text-base lg:text-lg text-amber-100 italic leading-relaxed break-words">
              "{METHODOLOGY_VERSE.text}"
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-1 break-words">
              <strong className="text-amber-300">Principio Doctrinal:</strong> {METHODOLOGY_VERSE.reflection}
            </p>
          </div>
        </div>
      </div>

      {/* 4 FASES INTERACTIVAS (SELECTOR DIRECTO DE FASE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = activePhaseIndex === idx;

          return (
            <button
              key={phase.id}
              onClick={() => goToPhase(idx, true)}
              className={`p-5 sm:p-6 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between select-none shadow-sm ${
                isActive
                  ? `bg-slate-900 border-amber-500 shadow-navy-sm ${phase.borderColor}`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                  {phase.badge}
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-1">
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="font-serif text-sm sm:text-base font-bold text-white leading-tight">
                  {phase.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tarjetas Estructuradas de los Pasos de la Fase Seleccionada */}
      <div ref={phaseHeaderRef} className="space-y-6 scroll-mt-24">
        {METHODOLOGY_SECTIONS
          .filter(sec => PHASES[activePhaseIndex].sectionNumbers.includes(sec.number))
          .map(sec => {
            const Icon = getSectionIcon(sec.iconName);

            return (
              <div
                key={sec.number}
                className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-sm space-y-5"
              >
                {/* Encabezado del Paso */}
                <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {sec.number}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {sec.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-1 break-words">
                      {sec.title}
                    </h3>
                    {sec.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5 break-words">{sec.subtitle}</p>
                    )}
                  </div>
                  <Icon className="w-6 h-6 text-amber-400 ml-auto flex-shrink-0" />
                </div>

                {/* Resumen */}
                {sec.content.overview && (
                  <p className="text-xs sm:text-sm text-slate-300 italic border-l-2 border-amber-500/50 pl-4 leading-relaxed break-words">
                    {sec.content.overview}
                  </p>
                )}

                {/* Subsecciones */}
                {sec.content.subsections && (
                  <div className="grid md:grid-cols-2 gap-4 pt-1">
                    {sec.content.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <h4 className="font-serif text-sm font-bold text-amber-300 break-words">
                          {sub.title}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {sub.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-2 break-words">
                              <span className="text-amber-400 font-bold">•</span>
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
                  <div className="space-y-3 pt-1">
                    <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>Preguntas de Diagnóstico Pastoral:</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      {sec.content.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/20 text-xs sm:text-sm text-slate-200">
                          <strong className="text-amber-400 block mb-1 text-xs">Pregunta {qIdx + 1}:</strong>
                          <p className="font-medium break-words">"{q}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                {sec.content.items && (
                  <div className="space-y-2 pt-1">
                    {sec.content.items.map((item, iIdx) => (
                      <div key={iIdx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checklist */}
                {sec.content.checklist && (
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 pt-1">
                    <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                      Criterios de Evaluación y Fruto:
                    </h4>
                    <div className="space-y-2">
                      {sec.content.checklist.map((chk, cIdx) => (
                        <div key={cIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-200 break-words">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Libros */}
                {sec.content.books && (
                  <div className="space-y-3 pt-1">
                    <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center space-x-2">
                      <Library className="w-4 h-4" />
                      <span>Obras Teológicas Recomendadas:</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {sec.content.books.map((b, bIdx) => (
                        <div key={bIdx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start space-x-2.5">
                          <Bookmark className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="font-medium break-words">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
      </div>

      {/* BOTONES INFERIORES DE NAVEGACIÓN ENTRE FASES CON SCROLL SUAVE AL INICIO DE LA FASE */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        {activePhaseIndex > 0 ? (
          <button
            onClick={() => goToPhase(activePhaseIndex - 1, true)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
            <span>Fase Anterior: {PHASES[activePhaseIndex - 1].title}</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        <div className="text-xs text-slate-400 font-semibold px-4 py-1.5 rounded-full bg-slate-950/60 border border-slate-800">
          Fase {activePhaseIndex + 1} de {PHASES.length}
        </div>

        {activePhaseIndex < PHASES.length - 1 ? (
          <button
            onClick={() => goToPhase(activePhaseIndex + 1, true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-gold-sm group"
          >
            <span>Siguiente Fase: {PHASES[activePhaseIndex + 1].title}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

    </div>
  );
};
