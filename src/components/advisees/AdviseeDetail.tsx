import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CalendarPlus, 
  Phone, 
  Mail, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  History, 
  Printer, 
  Plus, 
  Sparkles, 
  BookOpen, 
  X 
} from 'lucide-react';
import { Advisee, SessionRecord, AdviseeStatus, AdviseeTask, TaskCategory } from '../../types';
import { 
  subscribeToSessions, 
  createSessionRecord, 
  updateAdviseeTasks,
  addSingleAdviseeTask,
  deleteSingleAdviseeTask
} from '../../services/adviseesService';
import { NewSessionModal } from './NewSessionModal';
import { TaskPrintModal } from './TaskPrintModal';
import { BibleRefBadge } from '../bible/BibleRefBadge';
import { useAuth } from '../../context/AuthContext';
import { useBible } from '../../context/BibleContext';

interface AdviseeDetailProps {
  advisee: Advisee;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AdviseeDetail: React.FC<AdviseeDetailProps> = ({
  advisee,
  onBack,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const { openBible } = useBible();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [sessionForPrint, setSessionForPrint] = useState<SessionRecord | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'sessions' | 'tasks'>('sessions');

  // Inline task addition state
  const [isAddingInlineTask, setIsAddingInlineTask] = useState(false);
  const [inlineTaskDesc, setInlineTaskDesc] = useState('');
  const [inlineTaskRef, setInlineTaskRef] = useState('');
  const [inlineTaskCategory, setInlineTaskCategory] = useState<TaskCategory>('lectura');
  const [isSavingInlineTask, setIsSavingInlineTask] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToSessions(user.uid, advisee.id, (loadedSessions) => {
      setSessions(loadedSessions);
      if (loadedSessions.length > 0 && !expandedSessionId) {
        setExpandedSessionId(loadedSessions[0].id);
      }
    });

    return () => unsubscribe();
  }, [user, advisee.id]);

  const handleSaveSession = async (sessionData: Omit<SessionRecord, 'id' | 'createdAt'>) => {
    if (!user) return;
    await createSessionRecord(user.uid, advisee.id, sessionData);
  };

  const handleToggleTask = async (taskId: string) => {
    if (!user || !advisee.currentAssignedTasks) return;
    const updated = advisee.currentAssignedTasks.map(t => {
      if (t.id === taskId) {
        const nextComplete = !t.isCompleted;
        return {
          ...t,
          isCompleted: nextComplete,
          status: (nextComplete ? 'Completada' : 'No Realizada') as any
        };
      }
      return t;
    });
    await updateAdviseeTasks(user.uid, advisee.id, updated);
  };

  const handleCreateInlineTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inlineTaskDesc.trim()) return;
    try {
      setIsSavingInlineTask(true);
      const newTask: AdviseeTask = {
        id: Date.now().toString(),
        description: inlineTaskDesc.trim(),
        biblicalReference: inlineTaskRef.trim() || undefined,
        category: inlineTaskCategory,
        isCompleted: false,
        status: 'No Realizada',
        createdAt: new Date().toISOString()
      };
      await addSingleAdviseeTask(user.uid, advisee.id, newTask);
      setInlineTaskDesc('');
      setInlineTaskRef('');
      setIsAddingInlineTask(false);
    } catch (err) {
      console.error('Error al agregar tarea:', err);
    } finally {
      setIsSavingInlineTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (confirm('¿Deseas eliminar esta tarea de santificación?')) {
      await deleteSingleAdviseeTask(user.uid, advisee.id, taskId);
    }
  };

  const handleOpenPrintForSession = (session: SessionRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionForPrint(session);
    setIsPrintModalOpen(true);
  };

  const handleOpenPrintCurrent = () => {
    setSessionForPrint(null);
    setIsPrintModalOpen(true);
  };

  const getStatusBadge = (st: AdviseeStatus) => {
    switch (st) {
      case 'Activo':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'En Pausa':
      case 'Suspendido':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'Cerrado':
      case 'Completado':
        return 'bg-slate-700/50 border-slate-600 text-slate-300';
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 animate-fade-in space-y-6 sm:space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 text-xs font-medium transition-all group self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a Expedientes</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Botón Imprimir / Enviar Tareas */}
          <button
            onClick={handleOpenPrintCurrent}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
            title="Generar hoja de tareas imprimible o para WhatsApp"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Imprimir / WhatsApp Tareas</span>
          </button>

          <button
            onClick={onEdit}
            className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] hover:border-amber-400 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Editar Ficha</span>
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 hover:border-rose-500 text-rose-300 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Eliminar Expediente</span>
          </button>
        </div>
      </div>

      {/* Advisee Profile Header Card */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 lg:p-7 border border-white/[0.08] shadow-navy-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                {advisee.fullName}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusBadge(advisee.status)}`}>
                {advisee.status}
              </span>
              <span className="text-xs text-slate-400">
                • {advisee.age} años
              </span>
              {advisee.occupation && (
                <span className="text-xs text-slate-400">
                  • {advisee.occupation}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Inicio de Proceso Pastoral: <strong className="text-slate-300">{advisee.startDate}</strong>
              {advisee.nextSessionDate && (
                <span className="ml-3 text-amber-300 font-medium">
                  • Próxima Cita: <strong>{advisee.nextSessionDate}</strong> {advisee.nextSessionTime && `a las ${advisee.nextSessionTime}`}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="gold-button px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-gold-sm flex-shrink-0 rounded-xl"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>+ Documentar Nueva Sesión</span>
            </button>
          </div>

        </div>

        {/* Contact info bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/[0.06] text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{advisee.phone || 'Sin teléfono'}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{advisee.email || 'Sin correo'}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Heart className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{advisee.maritalStatus}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <History className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{sessions.length} {sessions.length === 1 ? 'Sesión Documentada' : 'Sesiones Documentadas'}</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 border-b border-white/[0.06] pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-3.5 py-1.5 rounded-lg transition-all select-none text-xs ${
            activeTab === 'sessions'
              ? 'bg-amber-600 text-white shadow-gold-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Historial de Sesiones ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-lg transition-all select-none text-xs ${
            activeTab === 'profile'
              ? 'bg-amber-600 text-white shadow-gold-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Motivo & Antecedentes
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3.5 py-1.5 rounded-lg transition-all select-none text-xs ${
            activeTab === 'tasks'
              ? 'bg-amber-600 text-white shadow-gold-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Tareas Vigentes ({advisee.currentAssignedTasks?.length || 0})
        </button>
      </div>

      {/* TAB 1: Historial de Sesiones */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 sm:p-10 text-center border border-white/[0.06] space-y-3 max-w-lg mx-auto">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="font-serif text-base font-bold text-slate-300">
                Aún no hay sesiones documentadas
              </h3>
              <p className="text-xs text-slate-400">
                Registra la primera sesión de consejería bíblica de este aconsejado para iniciar la bitácora pastoral.
              </p>
              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="gold-button px-4 py-2 text-xs font-semibold inline-flex items-center space-x-1.5 rounded-xl"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Registrar Primera Sesión</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const isExpanded = expandedSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    className="glass-card rounded-2xl border border-white/[0.07] shadow-sm overflow-hidden transition-all"
                  >
                    {/* Header bar of the session */}
                    <div
                      onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850/60 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          #{session.sessionNumber}
                        </span>
                        <div className="overflow-hidden">
                          <h3 className="font-serif text-sm sm:text-base font-bold text-white break-words">
                            {session.theme}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Fecha: {session.date} {session.time && `• ${session.time}`}
                            {session.nextAppointmentDate && (
                              <span className="ml-2 text-amber-300/90 font-medium">
                                (Próxima Cita: {session.nextAppointmentDate})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-400 flex-shrink-0 ml-2">
                        {/* Imprimir Tareas de esta sesión */}
                        {session.newAssignedTasks && session.newAssignedTasks.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => handleOpenPrintForSession(session, e)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950/40 border border-white/[0.06] hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs transition-all flex items-center space-x-1"
                            title="Imprimir o compartir tareas de esta sesión"
                          >
                            <Printer className="w-3 h-3 text-emerald-400" />
                            <span className="hidden sm:inline text-[11px]">Hoja de Tareas</span>
                          </button>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expandable session content */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-slate-950/40 space-y-4 animate-fade-in text-xs sm:text-[13px] overflow-hidden">
                        
                        {/* Session Notes */}
                        <div className="space-y-1.5">
                          <h4 className="text-[11px] uppercase font-semibold text-amber-400 tracking-wider">
                            Notas y Acuerdos Pastorales:
                          </h4>
                          <p className="text-slate-200/90 leading-relaxed whitespace-pre-line p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-white/[0.05] break-words text-xs sm:text-[13px]">
                            {session.generalNotes}
                          </p>
                        </div>

                        {/* Previous Tasks Evaluation */}
                        {session.previousTasksReview && session.previousTasksReview.length > 0 && (
                          <div className="space-y-1.5">
                            <h4 className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                              Revisión de Tareas Previas:
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                              {session.previousTasksReview.map((rev, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.05] space-y-1 overflow-hidden">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-200 font-medium text-xs break-words">{rev.description}</span>
                                    <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                                      rev.status === 'Completada' 
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' 
                                        : rev.status === 'Parcial'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                    }`}>
                                      {rev.status}
                                    </span>
                                  </div>
                                  {rev.feedback && (
                                    <p className="text-[11px] text-slate-400 italic break-words">"{rev.feedback}"</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Newly Assigned Tasks */}
                        {session.newAssignedTasks && session.newAssignedTasks.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] uppercase font-semibold text-emerald-400 tracking-wider">
                                Tareas Asignadas en esta Sesión:
                              </h4>
                              <button
                                type="button"
                                onClick={(e) => handleOpenPrintForSession(session, e)}
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Imprimir Hoja de Tareas</span>
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {session.newAssignedTasks.map((t, idx) => (
                                <div key={idx} className="flex flex-wrap items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-white/[0.05] gap-2">
                                  <div className="flex items-center space-x-2 overflow-hidden">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                    <span className="text-slate-200 text-xs break-words">{t.description}</span>
                                  </div>
                                  {t.biblicalReference && (
                                    <BibleRefBadge reference={t.biblicalReference} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Motivo y Antecedentes */}
      {activeTab === 'profile' && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.07] shadow-sm space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-white">
              Motivo de la Búsqueda de Consejería
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-200/90 leading-relaxed p-4 rounded-xl bg-slate-900/70 border border-white/[0.05] whitespace-pre-line break-words">
              {advisee.reason || 'Sin motivo especificado.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-white">
              Antecedentes y Notas Generales
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-200/90 leading-relaxed p-4 rounded-xl bg-slate-900/70 border border-white/[0.05] whitespace-pre-line break-words">
              {advisee.backgroundNotes || 'Sin antecedentes registrados.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Tareas Vigentes (Con Creador Rápido y Exportación) */}
      {activeTab === 'tasks' && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.07] shadow-sm space-y-5">
          
          {/* Header de Tareas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-serif text-base font-bold text-white flex items-center space-x-2">
                <span>Checklist de Tareas de Santificación en Curso</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Marca el cumplimiento o asigna nuevas tareas prácticas
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleOpenPrintCurrent}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / WhatsApp</span>
              </button>

              <button
                onClick={() => setIsAddingInlineTask(!isAddingInlineTask)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-gold-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingInlineTask ? 'Cerrar Creador' : 'Nueva Tarea'}</span>
              </button>
            </div>
          </div>

          {/* Formulario Rápido de Creación de Tarea Directa */}
          {isAddingInlineTask && (
            <form onSubmit={handleCreateInlineTask} className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-3 animate-slide-up text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Asignar Tarea Rápida al Expediente</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingInlineTask(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selector de Categoría */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['lectura', 'memorizacion', 'diario', 'accion', 'oracion', 'general'] as TaskCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setInlineTaskCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-medium transition-all ${
                      inlineTaskCategory === cat
                        ? 'bg-amber-600 text-white font-semibold shadow-gold-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-white/[0.05]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                required
                value={inlineTaskDesc}
                onChange={(e) => setInlineTaskDesc(e.target.value)}
                placeholder="Descripción de la tarea de santificación..."
                className="w-full px-3 py-2 bg-slate-950 border border-white/[0.08] rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inlineTaskRef}
                    onChange={(e) => setInlineTaskRef(e.target.value)}
                    placeholder="Referencia Bíblica (ej: Romanos 12:1-2)..."
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-white/[0.08] rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                  {inlineTaskRef.trim() && (
                    <button
                      type="button"
                      onClick={() => openBible(inlineTaskRef)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 p-1"
                      title="Leer pasaje ahora"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSavingInlineTask}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-gold-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSavingInlineTask ? 'Guardando...' : 'Guardar Tarea'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Lista de Tareas Vigentes */}
          {!advisee.currentAssignedTasks || advisee.currentAssignedTasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              No hay tareas vigentes asignadas actualmente. Haz clic en "Nueva Tarea" o documenta una sesión para agregarlas.
            </p>
          ) : (
            <div className="space-y-2.5">
              {advisee.currentAssignedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer overflow-hidden group ${
                    task.isCompleted
                      ? 'bg-slate-900/30 border-white/[0.04] opacity-60'
                      : 'bg-slate-900/80 border-amber-500/20 hover:border-amber-400/40 shadow-sm'
                  }`}
                >
                  <button className="mt-0.5 flex-shrink-0">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                    )}
                  </button>
                  
                  <div className="flex-1 overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className={`text-xs sm:text-[13px] font-medium break-words ${
                        task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}>
                        {task.description}
                      </p>
                      {task.category && (
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-white/[0.06] text-amber-300">
                          {task.category}
                        </span>
                      )}
                    </div>

                    {task.biblicalReference && (
                      <div className="mt-1.5">
                        <BibleRefBadge reference={task.biblicalReference} />
                      </div>
                    )}
                  </div>

                  {/* Botón Eliminar Tarea Individual */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteTask(task.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity flex-shrink-0"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal para Documentar Nueva Sesión */}
      <NewSessionModal
        advisee={advisee}
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onSaveSession={handleSaveSession}
        currentSessionCount={sessions.length}
      />

      {/* Modal para Imprimir / Exportar Hoja de Tareas */}
      <TaskPrintModal
        advisee={advisee}
        session={sessionForPrint}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

    </div>
  );
};
