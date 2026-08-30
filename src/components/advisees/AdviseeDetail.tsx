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
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 animate-fade-in space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 text-xs sm:text-sm font-semibold transition-all group self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a Expedientes</span>
        </button>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Editar Ficha</span>
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:border-rose-500 text-rose-300 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Eliminar Expediente</span>
          </button>
        </div>
      </div>

      {/* Advisee Profile Header Card - Expansivo y Elegante */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-amber-500/25 shadow-navy-md relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-gold-sm flex-shrink-0">
              <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center font-serif text-2xl font-bold text-amber-300">
                {advisee.fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="overflow-hidden space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-0.5 rounded-full border text-xs font-bold ${getStatusBadge(advisee.status)}`}>
                  {advisee.status}
                </span>
                <span className="text-xs text-slate-400">
                  Fecha de Inicio: {advisee.startDate || 'No registrada'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words">
                {advisee.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {advisee.age} años • Estado civil: {advisee.maritalStatus} • Referido por: {advisee.referredBy || 'Directo'}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="gold-button px-5 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 shadow-gold-sm flex-shrink-0 rounded-2xl"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>+ Documentar Nueva Sesión</span>
            </button>
          </div>

        </div>

        {/* Contact info bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-slate-300">
            <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">{advisee.phone || 'Sin teléfono'}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">{advisee.email || 'Sin correo'}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Heart className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{advisee.maritalStatus}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <History className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{sessions.length} {sessions.length === 1 ? 'Sesión Documentada' : 'Sesiones Documentadas'}</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-5 py-2 rounded-xl transition-all select-none ${
            activeTab === 'sessions'
              ? 'bg-amber-600 text-white shadow-gold-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Historial de Sesiones ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2 rounded-xl transition-all select-none ${
            activeTab === 'profile'
              ? 'bg-amber-600 text-white shadow-gold-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Motivo & Antecedentes
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-5 py-2 rounded-xl transition-all select-none ${
            activeTab === 'tasks'
              ? 'bg-amber-600 text-white shadow-gold-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Tareas Vigentes ({advisee.currentAssignedTasks?.length || 0})
        </button>
      </div>

      {/* TAB 1: Historial de Sesiones */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-xl mx-auto">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-slate-300">
                Aún no hay sesiones documentadas
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Registra la primera sesión de consejería bíblica de este aconsejado para iniciar la bitácora pastoral.
              </p>
              <button
                onClick={() => setIsNewSessionModalOpen(true)}
                className="gold-button px-5 py-2.5 text-xs font-semibold inline-flex items-center space-x-2 rounded-xl"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Registrar Primera Sesión</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const isExpanded = expandedSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    className="glass-card rounded-3xl border border-amber-500/20 shadow-sm overflow-hidden transition-all"
                  >
                    {/* Header bar of the session */}
                    <div
                      onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                      className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-850/60 transition-colors"
                    >
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <span className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          #{session.sessionNumber}
                        </span>
                        <div className="overflow-hidden">
                          <h3 className="font-serif text-base sm:text-lg font-bold text-white break-words">
                            {session.theme}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Fecha: {session.date} {session.time && `• ${session.time}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-400 flex-shrink-0 ml-3">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Expandable session content */}
                    {isExpanded && (
                      <div className="p-6 sm:p-8 border-t border-slate-800/80 bg-slate-950/40 space-y-6 animate-fade-in text-xs sm:text-sm overflow-hidden">
                        
                        {/* Session Notes */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                            Notas y Acuerdos Pastorales:
                          </h4>
                          <p className="text-slate-200 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-900/80 border border-slate-800 break-words">
                            {session.generalNotes}
                          </p>
                        </div>

                        {/* Previous Tasks Evaluation */}
                        {session.previousTasksReview && session.previousTasksReview.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                              Revisión de Tareas Previas:
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {session.previousTasksReview.map((rev, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 overflow-hidden">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-200 font-semibold text-xs sm:text-sm break-words">{rev.description}</span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg flex-shrink-0 ${
                                      rev.status === 'Completada' 
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                        : rev.status === 'Parcial'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                                    }`}>
                                      {rev.status}
                                    </span>
                                  </div>
                                  {rev.feedback && (
                                    <p className="text-xs text-slate-400 italic break-words">"{rev.feedback}"</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Newly Assigned Tasks */}
                        {session.newAssignedTasks && session.newAssignedTasks.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                              Tareas Asignadas en esta Sesión:
                            </h4>
                            <div className="space-y-2">
                              {session.newAssignedTasks.map((t, idx) => (
                                <div key={idx} className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  <span className="text-slate-200 text-xs sm:text-sm break-words">{t.description}</span>
                                  {t.biblicalReference && (
                                    <span className="font-serif text-amber-300 text-xs ml-auto flex-shrink-0">({t.biblicalReference})</span>
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
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
              Motivo de la Búsqueda de Consejería
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed p-5 rounded-2xl bg-slate-900/80 border border-slate-800 whitespace-pre-line break-words">
              {advisee.reason || 'Sin motivo especificado.'}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
              Antecedentes y Notas Generales
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed p-5 rounded-2xl bg-slate-900/80 border border-slate-800 whitespace-pre-line break-words">
              {advisee.backgroundNotes || 'Sin antecedentes registrados.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Tareas Vigentes */}
      {activeTab === 'tasks' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">
              Checklist de Tareas de Santificación en Curso
            </h3>
            <span className="text-xs text-slate-400">
              Clic para marcar o desmarcar cumplimiento
            </span>
          </div>

          {!advisee.currentAssignedTasks || advisee.currentAssignedTasks.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 py-8 text-center">
              No hay tareas vigentes asignadas actualmente.
            </p>
          ) : (
            <div className="space-y-3">
              {advisee.currentAssignedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-start space-x-3 cursor-pointer overflow-hidden ${
                    task.isCompleted
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <button className="mt-0.5 flex-shrink-0">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                    )}
                  </button>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-xs sm:text-sm font-medium break-words ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}>
                      {task.description}
                    </p>
                    {task.biblicalReference && (
                      <span className="font-serif text-xs text-amber-400 block mt-1 break-words">
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
