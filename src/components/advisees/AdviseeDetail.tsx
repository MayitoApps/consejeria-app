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
  History
} from 'lucide-react';
import { Advisee, SessionRecord, AdviseeStatus } from '../../types';
import { 
  subscribeToSessions, 
  createSessionRecord, 
  updateAdviseeTasks
} from '../../services/adviseesService';
import { NewSessionModal } from './NewSessionModal';
import { useAuth } from '../../context/AuthContext';

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
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'sessions' | 'tasks'>('sessions');

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

  const getStatusBadge = (st: AdviseeStatus) => {
    switch (st) {
      case 'Activo':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'Suspendido':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'Cerrado':
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

        <div className="flex items-center space-x-2 self-end sm:self-auto">
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

      {/* Advisee Profile Header Card - Limpio y Elegante */}
      <div className="glass-card rounded-2xl p-5 sm:p-7 border border-white/[0.08] shadow-navy-md relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-amber-950/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-gold-sm flex-shrink-0">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center font-serif text-lg font-bold text-amber-300">
                {advisee.fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="overflow-hidden space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${getStatusBadge(advisee.status)}`}>
                  {advisee.status}
                </span>
                <span className="text-[11px] text-slate-400">
                  Inicio: {advisee.startDate || 'No registrada'}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-white break-words">
                {advisee.fullName}
              </h1>
              <p className="text-xs text-slate-300">
                {advisee.age} años • Estado civil: {advisee.maritalStatus} • Referido por: {advisee.referredBy || 'Directo'}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
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
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 text-slate-400 flex-shrink-0 ml-2">
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
                          <div className="space-y-1.5">
                            <h4 className="text-[11px] uppercase font-semibold text-emerald-400 tracking-wider">
                              Tareas Asignadas en esta Sesión:
                            </h4>
                            <div className="space-y-1.5">
                              {session.newAssignedTasks.map((t, idx) => (
                                <div key={idx} className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-900/80 border border-white/[0.05] overflow-hidden">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                  <span className="text-slate-200 text-xs break-words">{t.description}</span>
                                  {t.biblicalReference && (
                                    <span className="font-serif text-amber-300 text-[11px] ml-auto flex-shrink-0">({t.biblicalReference})</span>
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

      {/* TAB 3: Tareas Vigentes */}
      {activeTab === 'tasks' && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.07] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-white">
              Checklist de Tareas de Santificación en Curso
            </h3>
            <span className="text-[11px] text-slate-400">
              Clic para marcar o desmarcar cumplimiento
            </span>
          </div>

          {!advisee.currentAssignedTasks || advisee.currentAssignedTasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No hay tareas vigentes asignadas actualmente.
            </p>
          ) : (
            <div className="space-y-2">
              {advisee.currentAssignedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all flex items-start space-x-2.5 cursor-pointer overflow-hidden ${
                    task.isCompleted
                      ? 'bg-slate-900/30 border-white/[0.04] opacity-60'
                      : 'bg-slate-900/80 border-amber-500/20 hover:border-amber-400/40 shadow-sm'
                  }`}
                >
                  <button className="mt-0.5 flex-shrink-0">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 hover:text-amber-400" />
                    )}
                  </button>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-xs font-medium break-words ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}>
                      {task.description}
                    </p>
                    {task.biblicalReference && (
                      <span className="font-serif text-[11px] text-amber-400 block mt-0.5 break-words">
                        Pasaje Bíblico: {task.biblicalReference}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Session Modal */}
      <NewSessionModal
        advisee={advisee}
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onSaveSession={handleSaveSession}
        currentSessionCount={sessions.length}
      />

    </div>
  );
};
