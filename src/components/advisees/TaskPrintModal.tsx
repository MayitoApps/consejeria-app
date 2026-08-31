import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Check, 
  Anchor, 
  BookOpen, 
  CheckSquare 
} from 'lucide-react';
import { Advisee, AdviseeTask, SessionRecord } from '../../types';

interface TaskPrintModalProps {
  advisee: Advisee;
  session?: SessionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskPrintModal: React.FC<TaskPrintModalProps> = ({
  advisee,
  session,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Determinar las tareas a imprimir (de la sesión seleccionada o las vigentes del aconsejado)
  const tasksToPrint: AdviseeTask[] = (session?.newAssignedTasks && session.newAssignedTasks.length > 0)
    ? session.newAssignedTasks
    : (advisee.currentAssignedTasks || []);

  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const nextAppointmentFormatted = (session?.nextAppointmentDate || advisee.nextSessionDate) 
    ? `${session?.nextAppointmentDate || advisee.nextSessionDate}${session?.nextAppointmentTime || advisee.nextSessionTime ? ` a las ${session?.nextAppointmentTime || advisee.nextSessionTime}` : ''}`
    : 'Por definir';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    let text = `⚓ *ANCLA Consejería Bíblica*\n`;
    text += `📋 *Hoja de Tareas de Santificación*\n`;
    text += `👤 *Aconsejado(a):* ${advisee.fullName}\n`;
    text += `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n`;
    if (nextAppointmentFormatted !== 'Por definir') {
      text += `⏰ *Próxima Cita:* ${nextAppointmentFormatted}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (tasksToPrint.length === 0) {
      text += `_No hay tareas asignadas para este periodo._\n\n`;
    } else {
      text += `📖 *TAREAS ASIGNADAS PARA ESTA SEMANA:*\n\n`;
      tasksToPrint.forEach((t, index) => {
        const catEmoji = t.category === 'lectura' ? '📖' :
                         t.category === 'memorizacion' ? '🧠' :
                         t.category === 'diario' ? '📝' :
                         t.category === 'oracion' ? '🙏' : '🎯';
        
        text += `${index + 1}. ${catEmoji} *${t.description}*\n`;
        if (t.biblicalReference) {
          text += `   ↳ _Pasaje Bíblico:_ ${t.biblicalReference}\n`;
        }
        text += `\n`;
      });
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✍️ *VERBO Y ACCIÓN:*\n`;
    text += `_"Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos." (Santiago 1:22)_\n\n`;
    text += `_Que la gracia del Señor acompañe tu semana de crecimiento y santificación._`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static">
      
      {/* Contenedor Principal */}
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#0b0f19] border border-amber-500/30 rounded-2xl shadow-navy-lg flex flex-col overflow-hidden text-slate-100 print:max-w-none print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header con Acciones (Oculto en Impresión) */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Hoja de Tareas de Santificación
              </h2>
              <p className="text-[11px] text-slate-400">Generador de formato pastoral imprimible y para WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Copiar para WhatsApp */}
            <button
              onClick={handleCopyWhatsApp}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado para WhatsApp!' : 'Copiar WhatsApp'}</span>
            </button>

            {/* Imprimir */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-gold-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/[0.06]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hoja de Impresión Pastoral (Visualización en pantalla y formato papel) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-white text-slate-900 print:overflow-visible print:p-0 print:space-y-4">
          
          {/* Encabezado Ministerial Editorial */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 print:border print:border-black">
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  ANCLA Consejería Bíblica
                </h1>
                <p className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                  Ministerio de Cuidado Pastoral y Restauración
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Plan de Santificación
              </span>
              <p className="text-[11px] text-slate-500 mt-1 capitalize">{todayFormatted}</p>
            </div>
          </div>

          {/* Ficha de Datos del Aconsejado */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Aconsejado(a):</span>
              <span className="font-bold text-slate-900 text-sm">{advisee.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Sesión Registrada:</span>
              <span className="font-semibold text-slate-800">{session ? `Sesión #${session.sessionNumber}` : 'Seguimiento Vigente'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Próxima Cita Pastoral:</span>
              <span className="font-bold text-amber-800">{nextAppointmentFormatted}</span>
            </div>
          </div>

          {/* Lista de Tareas Asignadas con Casillas para Marcar */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-slate-700" />
              <span>Tareas y Compromisos para la Semana</span>
            </h3>

            {tasksToPrint.length === 0 ? (
              <p className="text-xs italic text-slate-500 py-4 text-center">
                No hay tareas pendientes en este registro.
              </p>
            ) : (
              <div className="space-y-3">
                {tasksToPrint.map((task, idx) => (
                  <div 
                    key={task.id || idx}
                    className="p-3 rounded-lg border border-slate-300 bg-white flex items-start space-x-3 text-slate-900"
                  >
                    {/* Casilla de verificación imprimible */}
                    <div className="w-5 h-5 border-2 border-slate-600 rounded flex-shrink-0 mt-0.5 flex items-center justify-center">
                      {task.isCompleted && <Check className="w-3.5 h-3.5 text-slate-900 font-bold" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900">
                          {task.description}
                        </p>
                        {task.category && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700">
                            {task.category}
                          </span>
                        )}
                      </div>

                      {task.biblicalReference && (
                        <div className="mt-1 flex items-center space-x-1.5 text-xs text-amber-900 font-serif font-semibold">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Pasaje Bíblico de Meditación: {task.biblicalReference}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Diario / Reflexión Personal del Aconsejado */}
          <div className="pt-3 space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Reflexiones, Victorias y Preguntas para la Próxima Sesión:
            </h3>
            <div className="h-28 border border-slate-300 rounded-lg p-2 bg-slate-50/50 flex flex-col justify-between">
              <div className="border-b border-slate-200 border-dashed h-6"></div>
              <div className="border-b border-slate-200 border-dashed h-6"></div>
              <div className="border-b border-slate-200 border-dashed h-6"></div>
              <div className="border-b border-slate-200 border-dashed h-6"></div>
            </div>
          </div>

          {/* Pie Pastoral con Versículo */}
          <div className="border-t-2 border-slate-900 pt-3 text-center space-y-1">
            <p className="font-serif text-xs italic text-slate-800">
              «Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos.»
            </p>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Santiago 1:22 — Firmeza en la Verdad, Gracia en el Corazón
            </p>
          </div>

        </div>

        {/* Footer del Modal en Pantalla */}
        <div className="p-3 bg-[#070b12] border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 print:hidden">
          <span>Presiona "Imprimir" para obtener formato PDF o papel carta limpio.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
