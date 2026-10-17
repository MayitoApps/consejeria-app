import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BibleStudy, DocumentSection } from '../types';

/**
 * Exporta un estudio bíblico completo a un PDF estilizado de alta calidad
 */
export const exportStudyToPDF = async (study: BibleStudy, elementId?: string): Promise<void> => {
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0f172a'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${study.id}-estudio-biblico.pdf`);
        return;
      } catch (err) {
        console.warn('Fallback a generación directa de PDF:', err);
      }
    }
  }

  // Fallback: Generación directa con jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 15;
  let y = margin;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);

  // Encabezado
  doc.setFillColor(15, 23, 42); // Navy
  doc.rect(0, 0, 210, 32, 'F');
  
  doc.setTextColor(217, 119, 6); // Gold
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ANCLA CONSEJERÍA BÍBLICA', margin, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Guía Pastoral | Categoría: ${study.category}`, margin, 22);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin - 35, 22);

  y = 42;

  // Título del Estudio
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(study.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8;

  // Subtítulo
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const subLines = doc.splitTextToSize(study.subtitle, contentWidth);
  doc.text(subLines, margin, y);
  y += subLines.length * 6 + 6;

  // Resumen
  if (study.summary) {
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const sumLines = doc.splitTextToSize(`RESUMEN: ${study.summary}`, contentWidth);
    doc.text(sumLines, margin, y);
    y += sumLines.length * 4.5 + 6;
  }

  // Separador
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // 1. Pasajes Bíblicos
  checkPageBreak(30);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Pasajes bíblicos & Exégesis', margin, y);
  y += 7;

  study.sections.verses.forEach(v => {
    checkPageBreak(35);
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${v.reference} (${v.version || 'RVR1960'})`, margin + 2, y);
    y += 5;

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const textLines = doc.splitTextToSize(`"${v.text}"`, contentWidth - 6);
    doc.text(textLines, margin + 4, y);
    y += textLines.length * 4.5 + 3;

    // Exégesis
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const exLines = doc.splitTextToSize(`Exégesis: ${v.exegesis.originalTerms} | Principio: ${v.exegesis.theologicalPrinciple}`, contentWidth - 6);
    doc.text(exLines, margin + 4, y);
    y += exLines.length * 4 + 4;
  });

  const renderSection = (sec: DocumentSection) => {
    if (!sec) return;
    checkPageBreak(25);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(sec.title, margin, y);
    y += 6;

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    sec.paragraphs.forEach(p => {
      checkPageBreak(15);
      const pLines = doc.splitTextToSize(p, contentWidth);
      doc.text(pLines, margin, y);
      y += pLines.length * 4.5 + 3;
    });
    y += 3;
  };

  renderSection(study.sections.introduction);
  renderSection(study.sections.problemToTreat);
  renderSection(study.sections.rootProblem);
  renderSection(study.sections.consequences);
  renderSection(study.sections.counselingApproach);
  renderSection(study.sections.sanctificationFollowUp);
  renderSection(study.sections.conclusions);

  doc.save(`${study.id}-estudio-biblico.pdf`);
};

/**
 * Exporta el documento oficial de Metodología de Consejería Bíblica a PDF
 */
export const exportMethodologyToPDF = async (): Promise<void> => {
  const { METHODOLOGY_SECTIONS, METHODOLOGY_VERSE } = await import('../data/methodologyData');
  
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
};

