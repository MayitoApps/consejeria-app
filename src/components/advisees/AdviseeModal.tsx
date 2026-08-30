import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Plus, Trash2, Calendar, Phone, Mail, User, FileText, Heart } from 'lucide-react';
import { Advisee, AdviseeStatus, MaritalStatus, AdviseeTask } from '../../types';

interface AdviseeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adviseeData: Omit<Advisee, 'id' | 'counselorId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Advisee | null;
}

export const AdviseeModal: React.FC<AdviseeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Casado(a)');
  const [birthDate, setBirthDate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [referredBy, setReferredBy] = useState('');
  const [reason, setReason] = useState('');
  const [backgroundNotes, setBackgroundNotes] = useState('');
  const [status, setStatus] = useState<AdviseeStatus>('Activo');
  const [nextSessionDate, setNextSessionDate] = useState('');
  const [nextSessionTime, setNextSessionTime] = useState('18:00');
  const [tasks, setTasks] = useState<AdviseeTask[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskRef, setNewTaskRef] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || '');
      setAge(initialData.age || 30);
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setMaritalStatus(initialData.maritalStatus || 'Casado(a)');
      setBirthDate(initialData.birthDate || '');
      setStartDate(initialData.startDate || new Date().toISOString().split('T')[0]);
      setReferredBy(initialData.referredBy || '');
      setReason(initialData.reason || '');
      setBackgroundNotes(initialData.backgroundNotes || '');
      setStatus(initialData.status || 'Activo');
      setNextSessionDate(initialData.nextSessionDate || '');
      setNextSessionTime(initialData.nextSessionTime || '18:00');
      setTasks(initialData.currentAssignedTasks || []);
    } else {
      setFullName('');
      setAge(30);
      setPhone('');
      setEmail('');
      setMaritalStatus('Casado(a)');
      setBirthDate('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setReferredBy('');
      setReason('');
      setBackgroundNotes('');
      setStatus('Activo');
      setNextSessionDate('');
      setNextSessionTime('18:00');
      setTasks([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddTask = () => {
    if (!newTaskDesc.trim()) return;
    const newTask: AdviseeTask = {
      id: Date.now().toString(),
      description: newTaskDesc.trim(),
      biblicalReference: newTaskRef.trim() || undefined,
      isCompleted: false,
      status: 'No Realizada'
    };
    setTasks([...tasks, newTask]);
    setNewTaskDesc('');
    setNewTaskRef('');
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    try {
      setIsSaving(true);
      await onSave({
        fullName: fullName.trim(),
        age: Number(age),
        phone: phone.trim(),
        email: email.trim(),
        maritalStatus,
        birthDate,
        startDate,
        referredBy: referredBy.trim(),
        reason: reason.trim(),
        backgroundNotes: backgroundNotes.trim(),
        status,
        nextSessionDate: nextSessionDate || undefined,
        nextSessionTime: nextSessionTime || undefined,
        currentAssignedTasks: tasks
      });
      onClose();
    } catch (error) {
      console.error('Error al guardar aconsejado:', error);
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {initialData ? 'Editar Expediente de Aconsejado' : 'Nuevo Expediente de Aconsejado'}
              </h3>
              <p className="text-xs text-slate-400">
                Información confidencial resguardada en tu cuenta de consejero
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
          
          {/* Datos Personales */}
          <div>
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3 flex items-center space-x-1.5">
              <User className="w-4 h-4" />
              <span>Datos Personales</span>
            </h4>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Juan Pérez Martínez"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Edad</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aconsejado@ejemplo.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado Civil</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Soltero(a)">Soltero(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viudo(a)">Viudo(a)</option>
                  <option value="Unión Libre">Unión Libre</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fecha Inicio Consejería</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado del Expediente</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AdviseeStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 font-semibold text-amber-300"
                >
                  <option value="Activo">🟢 Activo</option>
                  <option value="Suspendido">🟡 Suspendido</option>
                  <option value="Cerrado">⚪ Cerrado / Graduado</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-slate-300 font-semibold mb-1">Referido por quién</label>
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Ej: Pastor Carlos / Su cónyuge / Búsqueda propia"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Motivo y Antecedentes */}
          <div>
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3 flex items-center space-x-1.5">
              <FileText className="w-4 h-4" />
              <span>Motivo de la Consejería & Antecedentes</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motivo de la Búsqueda de Consejería *</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe la problemática principal por la cual busca ayuda bíblica..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Antecedentes & Notas Generales del Consejero</label>
                <textarea
                  rows={3}
                  value={backgroundNotes}
                  onChange={(e) => setBackgroundNotes(e.target.value)}
                  placeholder="Historial familiar, dinámicas relacionales, contexto espiritual y observaciones preliminares..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Próxima Sesión */}
          <div>
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4" />
              <span>Programación de Próxima Sesión</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fecha</label>
                <input
                  type="date"
                  value={nextSessionDate}
                  onChange={(e) => setNextSessionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hora</label>
                <input
                  type="time"
                  value={nextSessionTime}
                  onChange={(e) => setNextSessionTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Asignar Tareas */}
          <div>
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3 flex items-center space-x-1.5">
              <Heart className="w-4 h-4" />
              <span>Tareas Bíblicas Asignadas</span>
            </h4>

            {/* List of current tasks */}
            {tasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="text-slate-200 font-medium">{task.description}</p>
                      {task.biblicalReference && (
                        <p className="text-xs text-amber-400 font-serif">{task.biblicalReference}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new task input */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Descripción de la tarea (ej: Leer Efesios 4 y anotar 3 aplicaciones)..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskRef}
                  onChange={(e) => setNewTaskRef(e.target.value)}
                  placeholder="Cita Bíblica opcional (ej: Efesios 4:22-32)"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
              <span>{isSaving ? 'Guardando...' : 'Guardar Expediente'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
