import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function createManualPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helpers de color
  const setColor = (r, g, b) => doc.setTextColor(r, g, b);
  const setDrawColor = (r, g, b) => doc.setDrawColor(r, g, b);
  const setFillColor = (r, g, b) => doc.setFillColor(r, g, b);

  // Verificación de salto de página
  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 22) {
      doc.addPage();
      y = 22; // Deja espacio para el header de páginas siguientes
      drawHeader();
    }
  };

  const drawHeader = () => {
    setFillColor(11, 16, 28);
    doc.rect(0, 0, pageWidth, 12, 'F');

    setColor(217, 119, 6);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('ANCLA CONSEJERÍA BÍBLICA', margin, 8);

    setColor(148, 163, 184);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Manual de Desarrollo, Arquitectura & Despliegue', pageWidth - margin - 65, 8);

    setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.line(0, 12, pageWidth, 12);
  };

  // ----------------------------------------------------
  // PORTADA / ENCABEZADO PRINCIPAL (PÁGINA 1)
  // ----------------------------------------------------
  // Barra superior decorativa oscura
  setFillColor(11, 16, 28);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Acento dorado en barra
  setFillColor(217, 119, 6);
  doc.rect(0, 41, pageWidth, 1.5, 'F');

  // Título en Banner
  setColor(217, 119, 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('GUÍA TÉCNICA DE ONBOARDING & COLABORACIÓN', margin, 14);

  setColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ANCLA Consejería Bíblica — Manual del Desarrollador', margin, 24);

  setColor(203, 213, 225);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Servidor Local • Despliegue en Firebase Hosting • Arquitectura • Seguridad & Git', margin, 32);

  setColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} | Versión 1.0.0`, margin, 37);

  y = 50;

  // Helper para títulos de sección
  const printSectionHeader = (number, title) => {
    checkPageBreak(16);
    setFillColor(241, 245, 249);
    setDrawColor(217, 119, 6);
    doc.setLineWidth(0.8);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.line(margin, y, margin, y + 8);

    setColor(180, 83, 9);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${number}. ${title}`, margin + 3, y + 5.5);
    y += 12;
  };

  // Helper para subtítulos
  const printSubSection = (title) => {
    checkPageBreak(10);
    setColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    y += 5;
  };

  // Helper para párrafos
  const printParagraph = (text, isItalic = false) => {
    checkPageBreak(10);
    setColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', isItalic ? 'italic' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 3.8 + 2;
  };

  // Helper para bloques de código
  const printCodeBlock = (codeLines) => {
    const blockHeight = codeLines.length * 4.2 + 6;
    checkPageBreak(blockHeight + 4);

    setFillColor(15, 23, 42);
    setDrawColor(30, 41, 59);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, 'FD');

    setColor(248, 250, 252);
    doc.setFontSize(7.5);
    doc.setFont('courier', 'normal');

    codeLines.forEach((line, idx) => {
      doc.text(line, margin + 4, y + 4.5 + idx * 4.2);
    });

    y += blockHeight + 4;
  };

  // Helper para viñetas
  const printBullet = (label, desc) => {
    checkPageBreak(7);
    setColor(217, 119, 6);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('•', margin + 2, y);

    setColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`${label}: `, margin + 6, y);

    const labelWidth = doc.getTextWidth(`${label}: `);
    setColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(desc, contentWidth - 6 - labelWidth);
    doc.text(lines[0] || '', margin + 6 + labelWidth, y);

    if (lines.length > 1) {
      y += 3.8;
      const rest = lines.slice(1);
      rest.forEach((l) => {
        doc.text(l, margin + 6, y);
        y += 3.8;
      });
    } else {
      y += 4.5;
    }
  };

  // Helper para llamadas / alertas
  const printCallout = (title, text, type = 'info') => {
    checkPageBreak(16);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    const boxHeight = lines.length * 3.8 + 10;

    if (type === 'warning') {
      setFillColor(254, 242, 242);
      setDrawColor(239, 68, 68);
    } else if (type === 'gold') {
      setFillColor(254, 243, 199);
      setDrawColor(217, 119, 6);
    } else {
      setFillColor(240, 249, 255);
      setDrawColor(2, 132, 199);
    }

    doc.setLineWidth(0.8);
    doc.rect(margin, y, contentWidth, boxHeight, 'F');
    doc.line(margin, y, margin, y + boxHeight);

    if (type === 'warning') setColor(185, 28, 28);
    else if (type === 'gold') setColor(146, 64, 14);
    else setColor(3, 105, 161);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 4, y + 4.5);

    setColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(lines, margin + 4, y + 9);

    y += boxHeight + 4;
  };

  // ----------------------------------------------------
  // SECCIÓN 1: VISIÓN GENERAL Y PROPÓSITO
  // ----------------------------------------------------
  printSectionHeader('1', 'Visión General y Propósito del Sistema');
  printParagraph(
    'ANCLA Consejería Bíblica es una aplicación web progresiva diseñada para pastores, líderes y consejeros bíblicos. Centraliza estudios doctrinales exegéticos, una biblioteca de obras maestras teológicas clasificadas por raíz de pecado, una metodología pastoral estructurada en 4 fases (13 dimensiones) y un sistema seguro de gestión de expedientes y sesiones confidenciales.'
  );

  // ----------------------------------------------------
  // SECCIÓN 2: STACK TECNOLÓGICO Y ARQUITECTURA
  // ----------------------------------------------------
  printSectionHeader('2', 'Stack Tecnológico Utilizado');
  printParagraph(
    'La aplicación está construida con tecnologías modernas que garantizan alto rendimiento, tipado estricto, seguridad en tiempo real y despliegue serverless optimizado:'
  );

  printBullet('Frontend Core', 'React 19 con TypeScript (~5.7) para máxima seguridad de tipos en componentes y datos.');
  printBullet('Bundler & Entorno', 'Vite 6 — Compilaciones ultrarrápidas, HMR (Hot Module Replacement) instantáneo.');
  printBullet('Diseño & Estilos', 'Tailwind CSS v3 con arquitectura Glassmorphism oscura (paleta Slate, Amber y Navy).');
  printBullet('Tipografías', 'Playfair Display (para citas y encabezados solemnes) y Plus Jakarta Sans (interfaz limpia).');
  printBullet('Autenticación', 'Firebase Authentication con Google Identity Provider (OAuth) en modo single-tenant.');
  printBullet('Base de Datos', 'Cloud Firestore (NoSQL en tiempo real) con aislamiento estricto por ID de consejero.');
  printBullet('Exportación & Reportes', 'jsPDF y html2canvas para generación de documentos y guías oficiales en PDF.');
  printBullet('Hosting & CDN', 'Firebase Hosting con compresión Gzip/Brotli y rewrite para Single Page Application (SPA).');

  // ----------------------------------------------------
  // SECCIÓN 3: REQUISITOS PREVIOS
  // ----------------------------------------------------
  printSectionHeader('3', 'Requisitos Previos en el Equipo de Desarrollo');
  printParagraph('Antes de iniciar, el desarrollador debe contar con el siguiente software instalado:');

  printBullet('Node.js', 'Versión 18.x o 20.x LTS instalada (comprobar con: node -v).');
  printBullet('Gestor de Paquetes', 'npm versión 9+ o 10+ (comprobar con: npm -v).');
  printBullet('Control de Versiones', 'Git instalado y configurado con cuenta de GitHub.');
  printBullet('Firebase CLI', 'Herramienta de línea de comandos de Firebase (npm install -g firebase-tools).');

  // ----------------------------------------------------
  // SECCIÓN 4: PUESTA EN MARCHA LOCAL (PASO A PASO)
  // ----------------------------------------------------
  printSectionHeader('4', 'Cómo Levantar el Servidor Local (Paso a Paso)');
  printParagraph('Sigue estos pasos en orden para clonar, configurar y ejecutar el entorno de desarrollo:');

  printSubSection('Paso 4.1: Clonar el repositorio desde GitHub');
  printCodeBlock([
    'git clone https://github.com/MayitoApps/consejeria-app.git',
    'cd consejeria-app'
  ]);

  printSubSection('Paso 4.2: Instalar dependencias del proyecto');
  printCodeBlock([
    'npm install'
  ]);

  printSubSection('Paso 4.3: Configurar variables de entorno (.env)');
  printParagraph(
    'Crea un archivo llamado .env en la raíz del proyecto (puedes duplicar el archivo .env.example) con las credenciales oficiales de Firebase:'
  );
  printCodeBlock([
    'VITE_FIREBASE_API_KEY=AIzaSyBmTFMmsPmd4ApTzsGOUIw8GCzUXyPtoc4',
    'VITE_FIREBASE_AUTH_DOMAIN=anclaconsejo.firebaseapp.com',
    'VITE_FIREBASE_PROJECT_ID=anclaconsejo',
    'VITE_FIREBASE_STORAGE_BUCKET=anclaconsejo.firebasestorage.app',
    'VITE_FIREBASE_MESSAGING_SENDER_ID=63423105940',
    'VITE_FIREBASE_APP_ID=1:63423105940:web:d98ab54187f8883e0b5d81'
  ]);

  printCallout(
    'IMPORTANTE SOBRE VARIABLES EN VITE',
    'Todas las variables de entorno en Vite deben comenzar obligatoriamente con el prefijo "VITE_". De lo contrario, no serán expuestas al cliente web en import.meta.env.',
    'warning'
  );

  printSubSection('Paso 4.4: Iniciar el servidor de desarrollo local');
  printCodeBlock([
    'npm run dev'
  ]);
  printParagraph(
    'El servidor arrancará por defecto en http://localhost:5173 con Hot Reload habilitado. Cualquier cambio guardado en el código se reflejará al instante.'
  );

  // ----------------------------------------------------
  // SECCIÓN 5: ESTRUCTURA DEL CÓDIGO FUENTE
  // ----------------------------------------------------
  printSectionHeader('5', 'Estructura de Carpetas y Arquitectura');
  printParagraph('El código está organizado de manera modular bajo el directorio /src:');

  printBullet('src/components/studies/', 'Vistas de estudios bíblicos, acordeón exegético (ExegeticalModal) y selector.');
  printBullet('src/components/glossary/', 'Glosario teológico (3 niveles: Temas -> Libros -> Pasajes) y ZenReaderModal.');
  printBullet('src/components/methodology/', 'Metodología en 4 fases y 13 dimensiones, diagnóstico y generador PDF.');
  printBullet('src/components/advisees/', 'Expedientes de aconsejados, bitácora de sesiones y tareas de santificación.');
  printBullet('src/context/AuthContext.tsx', 'Proveedor global de autenticación Firebase Auth con persistencia de estado.');
  printBullet('src/services/adviseesService.ts', 'Funciones CRUD y suscripciones en tiempo real (onSnapshot) de Cloud Firestore.');
  printBullet('src/data/', 'Bases de datos estáticas tipadas (estudios exegéticos, libros clásicos y metodología).');
  printBullet('src/types/index.ts', 'Contratos de interfaces TypeScript (Advisee, SessionRecord, VerseItem, etc.).');
  printBullet('src/config/firebase.ts', 'Inicialización del SDK de Firebase, Firestore DB y Google Auth Provider.');

  // ----------------------------------------------------
  // SECCIÓN 6: SEGURIDAD Y REGLAS DE FIRESTORE
  // ----------------------------------------------------
  printSectionHeader('6', 'Seguridad y Aislamiento de Expedientes');
  printParagraph(
    'La privacidad pastoral es crítica. Cada consejero autenticado únicamente tiene acceso a sus propios aconsejados y notas mediante las reglas de seguridad definidas en firestore.rules:'
  );

  printCodeBlock([
    '// Estructura de documentos en Firestore:',
    '/users/{userId}/advisees/{adviseeId}',
    '/users/{userId}/advisees/{adviseeId}/sessions/{sessionId}',
    '',
    '// Regla de autorización estricta:',
    'allow read, write: if request.auth != null && request.auth.uid == userId;'
  ]);

  printCallout(
    'CONFIDENCIALIDAD DE DATOS',
    'Nunca guardes datos personales sensibles de aconsejados en colecciones públicas o sin la validación de request.auth.uid.',
    'gold'
  );

  // ----------------------------------------------------
  // SECCIÓN 7: COMPILACIÓN Y DESPLIEGUE EN HOSTING
  // ----------------------------------------------------
  printSectionHeader('7', 'Cómo Subir las Actualizaciones al Hosting');
  printParagraph(
    'Para publicar cambios en el entorno de producción (https://anclaconsejo.web.app), sigue este procedimiento:'
  );

  printSubSection('Paso 7.1: Autenticarse en Firebase CLI (solo la 1ª vez)');
  printCodeBlock([
    'firebase login'
  ]);
  printParagraph('Se abrirá el navegador para autorizar la cuenta de Google con acceso al proyecto "anclaconsejo".');

  printSubSection('Paso 7.2: Compilar el proyecto para Producción');
  printCodeBlock([
    'npm run build'
  ]);
  printParagraph(
    'Este comando ejecuta "tsc -b && vite build". Verifica que no haya errores de tipado TypeScript y empaqueta los archivos optimizados dentro de la carpeta /dist.'
  );

  printSubSection('Paso 7.3: Desplegar a Firebase Hosting');
  printCodeBlock([
    'firebase deploy --only hosting'
  ]);
  printParagraph(
    'Una vez completado el despliegue, la versión estará disponible de inmediato en la URL pública:'
  );
  printParagraph('🌐 URL Oficial: https://anclaconsejo.web.app', true);

  printSubSection('Paso 7.4 (Opcional): Desplegar Reglas de Firestore');
  printParagraph(
    'Si modificaste el archivo firestore.rules, debes desplegar las nuevas reglas de seguridad con:'
  );
  printCodeBlock([
    'firebase deploy --only firestore:rules'
  ]);

  // ----------------------------------------------------
  // SECCIÓN 8: FLUJO DE TRABAJO EN GIT & COLABORACIÓN
  // ----------------------------------------------------
  printSectionHeader('8', 'Buenas Prácticas de Git y Trabajo en Equipo');
  printParagraph('Para mantener la estabilidad del código al colaborar entre varias personas:');

  printBullet('Sincronizar antes de editar', 'Ejecuta "git pull origin main" antes de comenzar a trabajar.');
  printBullet('Validar antes de hacer Push', 'Ejecuta siempre "npm run build" localmente para asegurar que no haya errores de compilación.');
  printBullet('Commits descriptivos', 'Usa mensajes concisos en imperativo (ej: "Add: Nuevo filtro en glosario", "Fix: Corrección modal de sesión").');
  printBullet('Subir cambios a GitHub', 'git add . -> git commit -m "Descripción" -> git push origin main.');

  // ----------------------------------------------------
  // SECCIÓN 9: SOLUCIÓN DE PROBLEMAS FRECUENTES
  // ----------------------------------------------------
  printSectionHeader('9', 'Solución de Problemas Frecuentes (Troubleshooting)');

  printBullet(
    'Error ExecutionPolicy en PowerShell',
    'En Windows, si npm no ejecuta scripts, usa el comando "npm.cmd run dev" o ejecuta en PowerShell como Admin: Set-ExecutionPolicy RemoteSigned.'
  );
  printBullet(
    'Error de Autenticación de Firebase',
    'Verifica que el dominio "localhost" y el dominio de hosting estén autorizados en Firebase Console > Authentication > Settings > Authorized Domains.'
  );
  printBullet(
    'Error 404 al recargar rutas en Hosting',
    'El archivo firebase.json ya cuenta con la regla de reescritura rewrites: [{ source: "**", destination: "/index.html" }] para soportar rutas SPA.'
  );

  // ----------------------------------------------------
  // PIE DE PÁGINA GLOBAL (PAGINACIÓN X de Y)
  // ----------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Si es página > 1, dibujamos el header superior si no se dibujó
    if (i > 1) {
      drawHeader();
    }

    // Pie de página
    setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    setColor(148, 163, 184);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('ANCLA Consejería Bíblica — Documentación Técnica de Proyecto', margin, pageHeight - 7);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 22, pageHeight - 7);
  }

  // Guardar archivo
  const outputPath = path.resolve(process.cwd(), 'MANUAL_DESARROLLO_ANCLA.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);

  console.log(`PDF generado exitosamente en: ${outputPath}`);
}

createManualPDF();
