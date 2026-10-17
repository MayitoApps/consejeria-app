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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#fbfcfa] rounded-2xl p-5 sm:p-7 border border-[#d2daca] shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d2daca]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-800">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-sage-950">
                {initialData ? 'Editar Expediente de Aconsejado' : 'Nuevo Expediente de Aconsejado'}
              </h3>
              <p className="text-[11px] text-[#52645b]">
                Información confidencial resguardada en tu cuenta de consejero
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#52645b] hover:text-sage-950 bg-[#edf2ea] hover:bg-[#e4eae0] border border-[#d2daca] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1.5 space-y-5 flex-1 text-xs">
          
          {/* Datos Personales */}
          <div>
            <h4 className="text-[11px] uppercase font-semibold text-sage-900 tracking-wider mb-2.5 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-sage-800" />
              <span>Datos Personales</span>
            </h4>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Juan Pérez Martínez"
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Edad</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#718579] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full pl-8 pr-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#718579] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aconsejado@ejemplo.com"
                    className="w-full pl-8 pr-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Estado Civil</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                >
                  <option value="Soltero(a)">Soltero(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viudo(a)">Viudo(a)</option>
                  <option value="Unión Libre">Unión Libre</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Fecha Inicio Consejería</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Estado del Expediente</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AdviseeStatus)}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 font-semibold shadow-sm"
                >
                  <option value="Activo">🟢 Activo</option>
                  <option value="Suspendido">🟡 Suspendido</option>
                  <option value="Cerrado">⚪ Cerrado / Graduado</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Referido por quién</label>
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Ej: Pastor Carlos / Su cónyuge / Búsqueda propia"
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Motivo y Antecedentes */}
          <div>
            <h4 className="text-[11px] uppercase font-semibold text-sage-900 tracking-wider mb-2.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-sage-800" />
              <span>Motivo de la Consejería & Antecedentes</span>
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Motivo de la Búsqueda de Consejería *</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe la problemática principal por la cual busca ayuda bíblica..."
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 leading-relaxed shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Antecedentes & Notas Generales del Consejero</label>
                <textarea
                  rows={3}
                  value={backgroundNotes}
                  onChange={(e) => setBackgroundNotes(e.target.value)}
                  placeholder="Historial familiar, dinámicas relacionales, contexto espiritual y observaciones preliminares..."
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] text-xs focus:outline-none focus:border-sage-500 leading-relaxed shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Próxima Sesión */}
          <div>
            <h4 className="text-[11px] uppercase font-semibold text-sage-900 tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-sage-800" />
              <span>Programación de Próxima Sesión</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Fecha</label>
                <input
                  type="date"
                  value={nextSessionDate}
                  onChange={(e) => setNextSessionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#2c3d36] mb-1">Hora</label>
                <input
                  type="time"
                  value={nextSessionTime}
                  onChange={(e) => setNextSessionTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-lg text-sage-950 text-xs focus:outline-none focus:border-sage-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Asignar Tareas */}
          <div>
            <h4 className="text-[11px] uppercase font-semibold text-sage-900 tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-sage-800" />
              <span>Tareas Bíblicas Asignadas</span>
            </h4>

            {/* List of current tasks */}
            {tasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbfcfa] border border-[#d2daca] shadow-sm">
                    <div>
                      <p className="text-sage-950 font-medium text-xs">{task.description}</p>
                      {task.biblicalReference && (
                        <p className="text-[11px] text-sage-800 font-serif font-semibold">{task.biblicalReference}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-[#718579] hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new task input */}
            <div className="p-3 rounded-xl bg-[#edf2ea] border border-[#d2daca] space-y-2 shadow-sm">
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Descripción de la tarea (ej: Leer Efesios 4 y anotar 3 aplicaciones)..."
                className="w-full px-2.5 py-1.5 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] focus:outline-none focus:border-sage-500 text-xs shadow-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskRef}
                  onChange={(e) => setNewTaskRef(e.target.value)}
                  placeholder="Cita Bíblica opcional (ej: Efesios 4:22-32)"
                  className="flex-1 px-2.5 py-1.5 bg-[#fbfcfa] border border-[#d2daca] rounded-lg text-sage-950 placeholder-[#718579] focus:outline-none focus:border-sage-500 text-xs shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-3 py-1.5 bg-sage-800 hover:bg-sage-700 text-[#fbfcfa] rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#d2daca] flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#edf2ea] hover:bg-[#e4eae0] text-[#3b4c44] font-semibold text-xs border border-[#d2daca] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="gold-button px-5 py-2 font-semibold flex items-center space-x-1.5 text-xs disabled:opacity-50 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Expediente'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
