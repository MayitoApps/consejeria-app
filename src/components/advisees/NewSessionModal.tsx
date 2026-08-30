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
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-navy-lg animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-amber-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Documentar Sesión #{sessionNumber}
              </h3>
              <p className="text-xs text-slate-400">
                Aconsejado: <strong className="text-amber-300">{advisee.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* General Session Info */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fecha de Sesión *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tema Principal *</label>
              <input
                type="text"
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej: Ídolos del corazón / Perdón"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 1. Revision of previous tasks */}
          {tasksReview.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                1. Revisión de Tareas de la Sesión Pasada
              </h4>
              <div className="space-y-3">
                {tasksReview.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200">{item.description}</span>
                      <div className="flex items-center space-x-1">
                        {(['Completada', 'Parcial', 'No Realizada'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(idx, st)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
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
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. General Notes & Counseling Documentation */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Notas y Documentación de la Sesión *
            </label>
            <textarea
              required
              rows={5}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Escribe los aspectos tratados, confesiones, respuestas del aconsejado, pasajes bíblicos confrontados y acuerdos de la sesión..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed text-xs sm:text-sm"
            />
          </div>

          {/* 3. Assign New Tasks */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              3. Asignar Nuevas Tareas para la Próxima Semana
            </h4>

            {newTasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {newTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <p className="text-slate-200 text-xs font-semibold">{t.description}</p>
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskRef}
                  onChange={(e) => setNewTaskRef(e.target.value)}
                  placeholder="Cita Bíblica (ej: Salmo 51)"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewTask}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Next Appointment */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Próxima Cita (Fecha)</label>
              <input
                type="date"
                value={nextAppointmentDate}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Próxima Cita (Hora)</label>
              <input
                type="time"
                value={nextAppointmentTime}
                onChange={(e) => setNextAppointmentTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="gold-button px-6 py-2.5 font-semibold flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar y Cerrar Sesión'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
