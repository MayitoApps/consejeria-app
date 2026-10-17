import React, { useState } from 'react';
import { 
  X, 
  CalendarPlus, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Bookmark 
} from 'lucide-react';
import { Advisee, AdviseeTask, SessionRecord, TaskStatus, TaskCategory } from '../../types';
import { BibleRefBadge } from '../bible/BibleRefBadge';
import { useBible } from '../../context/BibleContext';

interface NewSessionModalProps {
  advisee: Advisee;
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (sessionData: Omit<SessionRecord, 'id' | 'createdAt'>) => Promise<void>;
  currentSessionCount: number;
}

interface TaskPreset {
  label: string;
  description: string;
  reference: string;
  category: TaskCategory;
}

const TASK_PRESETS: TaskPreset[] = [
  {
    label: 'Despojo y Renovación',
    description: 'Lectura y meditación diaria en el principio de despojarse del viejo hombre y vestirse del nuevo.',
    reference: 'Efesios 4:22-24',
    category: 'lectura'
  },
  {
    label: 'Diario de Pensamientos',
    description: 'Escribir un diario anotando las situaciones donde surgen emociones de ira, ansiedad o temor y filtrarlas.',
    reference: 'Filipenses 4:6-8',
    category: 'diario'
  },
  {
    label: 'Confesión y Perdón',
    description: 'Tiempo devocional de oración confesando el pecado a Dios y experimentando Su perdón fiel.',
    reference: '1 Juan 1:9',
    category: 'oracion'
  },
  {
    label: 'Ídolos del Corazón',
    description: 'Reflexión y detección de deseos dominantes (epithumia) que producen pleitos o frustración.',
    reference: 'Santiago 4:1-3',
    category: 'lectura'
  },
  {
    label: 'Petición de Perdón',
    description: 'Conversación presencial de humildad y reconciliación con el ofendido siguiendo el principio bíblico.',
    reference: 'Mateo 18:15',
    category: 'accion'
  },
  {
    label: 'Memorización Semanal',
    description: 'Memorizar y recitar el versículo clave de victoria sobre la tentación.',
    reference: '1 Corintios 10:13',
    category: 'memorizacion'
  }
];

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  advisee,
  isOpen,
  onClose,
  onSaveSession,
  currentSessionCount
}) => {
  const { openBible } = useBible();
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
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('lectura');
  
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
      category: newTaskCategory,
      isCompleted: false,
      status: 'No Realizada',
      createdAt: new Date().toISOString()
    };
    setNewTasks([...newTasks, task]);
    setNewTaskDesc('');
    setNewTaskRef('');
  };

  const handleApplyPreset = (preset: TaskPreset) => {
    setNewTaskDesc(preset.description);
    setNewTaskRef(preset.reference);
    setNewTaskCategory(preset.category);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#fbfcfa] rounded-2xl p-5 sm:p-7 border border-[#d2daca] shadow-2xl animate-slide-up text-sage-950 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d2daca] flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-800">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-sage-950 tracking-tight">
                Documentar Sesión #{sessionNumber}
              </h3>
              <p className="text-[11px] text-[#52645b]">
                Aconsejado: <strong className="text-sage-900 font-semibold">{advisee.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#52645b] hover:text-sage-950 bg-[#edf2ea] border border-[#d2daca] hover:bg-[#e4eae0] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 sm:pr-2 space-y-5 flex-1 text-xs">
          
          {/* General Session Info */}
          <div className="grid sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#edf2ea] border border-[#d2daca]">
            <div>
              <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Fecha de Sesión *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Tema Principal *</label>
              <input
                type="text"
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej: Ídolos del corazón / Reconciliación"
                className="w-full px-3 py-2 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
              />
            </div>
          </div>

          {/* 1. Revision of previous tasks */}
          {tasksReview.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#edf2ea] border border-[#d2daca] space-y-2.5">
              <h4 className="text-[11px] uppercase font-semibold text-sage-900 tracking-wider flex items-center justify-between">
                <span>1. Revisión de Tareas de la Sesión Pasada</span>
                <span className="text-[10px] text-[#52645b] font-normal">Evalúa el fruto práctico</span>
              </h4>
              <div className="space-y-2">
                {tasksReview.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#fbfcfa] border border-[#d2daca] space-y-1.5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-sage-950 text-xs">{item.description}</span>
                      <div className="flex items-center space-x-1">
                        {(['Completada', 'Parcial', 'No Realizada'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(idx, st)}
                            className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase transition-all ${
                              item.status === st
                                ? st === 'Completada'
                                  ? 'bg-emerald-700 text-white shadow-sm'
                                  : st === 'Parcial'
                                  ? 'bg-amber-700 text-white shadow-sm'
                                  : 'bg-rose-700 text-white shadow-sm'
                                : 'bg-[#edf2ea] text-[#3b4c44] hover:text-sage-950 border border-[#d2daca]'
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
                      placeholder="Observaciones de santificación o dificultades..."
                      className="w-full px-2.5 py-1.5 bg-[#edf2ea] border border-[#d2daca] rounded-md text-sage-950 text-xs focus:outline-none focus:border-sage-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. General Notes & Counseling Documentation */}
          <div className="p-3.5 rounded-xl bg-[#edf2ea] border border-[#d2daca] space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-900">
              2. Notas Exegéticas y Documentación Pastoral *
            </label>
            <textarea
              required
              rows={4}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Detalla las confesiones, raíces del problema expuestas a la luz bíblica, pasajes confrontados y compromisos acordados..."
              className="w-full px-3 py-2.5 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] focus:outline-none focus:border-sage-500 leading-relaxed text-xs shadow-sm"
            />
          </div>

          {/* 3. Assign New Tasks (Mejorado con Plantillas y Categorías) */}
          <div className="p-4 rounded-xl bg-[#edf2ea] border border-[#d2daca] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] uppercase font-semibold text-sage-900 tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sage-800" />
                <span>3. Asignar Tareas de Santificación</span>
              </h4>
              <span className="text-[10px] text-[#52645b]">Se incluirán en la Hoja Pastoral</span>
            </div>

            {/* Chips de Plantillas Rápidas */}
            <div className="space-y-1.5 bg-[#fbfcfa] p-2.5 rounded-lg border border-[#d2daca]">
              <span className="text-[10px] text-[#52645b] font-semibold uppercase tracking-wider flex items-center space-x-1">
                <Bookmark className="w-3 h-3 text-sage-800" />
                <span>Plantillas Rápidas Frecuentes:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TASK_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2 py-1 rounded bg-[#edf2ea] hover:bg-sage-100 border border-[#d2daca] hover:border-sage-400 text-[10px] text-[#3b4c44] hover:text-sage-950 transition-all text-left"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Nuevas Tareas Asignadas */}
            {newTasks.length > 0 && (
              <div className="space-y-2">
                {newTasks.map((t) => (
                  <div key={t.id} className="flex items-start justify-between p-2.5 rounded-lg bg-[#fbfcfa] border border-sage-300 shadow-sm">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-sage-100 border border-sage-200 text-sage-900">
                          {t.category || 'general'}
                        </span>
                        <p className="text-sage-950 text-xs font-medium">{t.description}</p>
                      </div>
                      {t.biblicalReference && (
                        <div className="mt-1">
                          <BibleRefBadge reference={t.biblicalReference} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewTask(t.id)}
                      className="text-[#718579] hover:text-rose-600 p-1 transition-colors"
                      title="Quitar tarea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulario de Entrada de Nueva Tarea */}
            <div className="p-3 rounded-lg bg-[#fbfcfa] border border-[#d2daca] space-y-2.5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[#52645b] font-medium">Categoría:</span>
                {(['lectura', 'memorizacion', 'diario', 'accion', 'oracion', 'general'] as TaskCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewTaskCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase transition-all ${
                      newTaskCategory === cat
                        ? 'bg-sage-800 text-[#fbfcfa] font-semibold shadow-sm'
                        : 'bg-[#edf2ea] text-[#3b4c44] hover:text-sage-950 border border-[#d2daca]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Descripción de la tarea de santificación..."
                className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
              />

              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newTaskRef}
                    onChange={(e) => setNewTaskRef(e.target.value)}
                    placeholder="Referencia Bíblica (ej: Efesios 4:22-24, Salmo 32)..."
                    className="w-full pl-3 pr-8 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                  />
                  {newTaskRef.trim() && (
                    <button
                      type="button"
                      onClick={() => openBible(newTaskRef)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sage-800 hover:text-sage-950 p-1"
                      title="Leer pasaje ahora"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddNewTask}
                  className="px-3.5 py-2 bg-sage-800 hover:bg-sage-700 text-[#fbfcfa] rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm transition-all flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Tarea</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Next Appointment */}
          <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#edf2ea] border border-[#d2daca]">
            <div>
              <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Próxima Cita (Fecha)</label>
              <input
                type="date"
                value={nextAppointmentDate}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Próxima Cita (Hora)</label>
              <input
                type="time"
                value={nextAppointmentTime}
                onChange={(e) => setNextAppointmentTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#d2daca] flex justify-end space-x-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#edf2ea] hover:bg-[#e4eae0] border border-[#d2daca] text-[#3b4c44] font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="gold-button px-5 py-2 font-semibold flex items-center space-x-1.5 text-xs disabled:opacity-50 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar y Finalizar Sesión'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
