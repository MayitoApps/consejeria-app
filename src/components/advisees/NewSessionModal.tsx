import React, { useState } from 'react';
import { X, CalendarPlus, Save, Plus, Trash2 } from 'lucide-react';
import { Advisee, AdviseeTask, SessionRecord, TaskStatus } from '../../types';

interface NewSessionModalProps {
  advisee: Advisee;
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (sessionData: Omit<SessionRecord, 'id' | 'createdAt'>) => Promise<void>;
  currentSessionCount: number;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  advisee,
  isOpen,
  onClose,
  onSaveSession,
  currentSessionCount
}) => {
  const [sessionNumber] = useState(currentSessionCount + 1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [theme, setTheme] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  
  // Previous tasks review
  const [tasksReview, setTasksReview] = useState<
    { taskId: string; description: string; status: TaskStatus; feedback: string }[]
  >(() => {
    return (advisee.currentAssignedTasks || []).map(t => ({
      taskId: t.id,
      description: t.description,
      status: t.status || 'Completada',
      feedback: ''
    }));
  });

  // New tasks assignment
  const [newTasks, setNewTasks] = useState<AdviseeTask[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskRef, setNewTaskRef] = useState('');
  
  // Next appointment
  const [nextAppointmentDate, setNextAppointmentDate] = useState('');
  const [nextAppointmentTime, setNextAppointmentTime] = useState('18:00');
  
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleStatusChange = (index: number, status: TaskStatus) => {
    const updated = [...tasksReview];
    updated[index].status = status;
    setTasksReview(updated);
  };

  const handleFeedbackChange = (index: number, feedback: string) => {
    const updated = [...tasksReview];
    updated[index].feedback = feedback;
    setTasksReview(updated);
  };

  const handleAddNewTask = () => {
    if (!newTaskDesc.trim()) return;
    const task: AdviseeTask = {
      id: Date.now().toString(),
      description: newTaskDesc.trim(),
      biblicalReference: newTaskRef.trim() || undefined,
      isCompleted: false,
      status: 'No Realizada'
    };
    setNewTasks([...newTasks, task]);
    setNewTaskDesc('');
    setNewTaskRef('');
  };

  const handleRemoveNewTask = (id: string) => {
    setNewTasks(newTasks.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim() || !generalNotes.trim()) return;

    try {
      setIsSaving(true);
      await onSaveSession({
        adviseeId: advisee.id,
        sessionNumber,
        date,
        time,
        theme: theme.trim(),
        generalNotes: generalNotes.trim(),
        previousTasksReview: tasksReview,
        newAssignedTasks: newTasks,
        nextAppointmentDate: nextAppointmentDate || undefined,
        nextAppointmentTime: nextAppointmentTime || undefined
      });
      onClose();
    } catch (err) {
      console.error('Error al guardar sesión:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col glass-card rounded-2xl p-5 sm:p-7 border border-white/[0.08] shadow-navy-lg animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Documentar Sesión #{sessionNumber}
              </h3>
              <p className="text-[11px] text-slate-400">
                Aconsejado: <strong className="text-amber-300">{advisee.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/80 border border-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1.5 space-y-4 flex-1 text-xs">
          
          {/* General Session Info */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Fecha de Sesión *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/[0.08] rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/[0.08] rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Tema Principal *</label>
              <input
                type="text"
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej: Ídolos del corazón / Perdón"
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/[0.08] rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 1. Revision of previous tasks */}
          {tasksReview.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.06] space-y-2.5">
              <h4 className="text-[11px] uppercase font-semibold text-amber-400 tracking-wider">
                1. Revisión de Tareas de la Sesión Pasada
              </h4>
              <div className="space-y-2">
                {tasksReview.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-white/[0.05] space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-slate-200 text-xs">{item.description}</span>
                      <div className="flex items-center space-x-1">
                        {(['Completada', 'Parcial', 'No Realizada'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(idx, st)}
                            className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase transition-all ${
                              item.status === st
                                ? st === 'Completada'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'Parcial'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-rose-600 text-white'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={item.feedback}
                      onChange={(e) => handleFeedbackChange(idx, e.target.value)}
                      placeholder="Observación o retroalimentación sobre la tarea..."
                      className="w-full px-2.5 py-1 bg-slate-900 border border-white/[0.06] rounded-md text-slate-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. General Notes & Counseling Documentation */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Notas y Documentación de la Sesión *
            </label>
            <textarea
              required
              rows={4}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Escribe los aspectos tratados, confesiones, respuestas del aconsejado, pasajes bíblicos confrontados y acuerdos de la sesión..."
              className="w-full px-3 py-2 bg-slate-900/90 border border-white/[0.08] rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed text-xs"
            />
          </div>

          {/* 3. Assign New Tasks */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.06] space-y-2.5">
            <h4 className="text-[11px] uppercase font-semibold text-amber-400 tracking-wider">
              3. Asignar Nuevas Tareas para la Próxima Semana
            </h4>

            {newTasks.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {newTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-white/[0.05]">
                    <div>
                      <p className="text-slate-200 text-xs font-medium">{t.description}</p>
                      {t.biblicalReference && (
                        <p className="text-[11px] text-amber-400 font-serif">{t.biblicalReference}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewTask(t.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Nueva tarea (ej: Escribir carta de confesión bíblica)..."
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-white/[0.06] rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskRef}
                  onChange={(e) => setNewTaskRef(e.target.value)}
                  placeholder="Cita Bíblica (ej: Salmo 51)"
                  className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-white/[0.06] rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewTask}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Next Appointment */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Próxima Cita (Fecha)</label>
              <input
                type="date"
                value={nextAppointmentDate}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/[0.08] rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Próxima Cita (Hora)</label>
              <input
                type="time"
                value={nextAppointmentTime}
                onChange={(e) => setNextAppointmentTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/90 border border-white/[0.08] rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-white/[0.06] flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="gold-button px-5 py-2 font-semibold flex items-center space-x-1.5 text-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Sesión'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
