import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  UserPlus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Advisee } from '../../types';
import { 
  subscribeToAdvisees, 
  createAdvisee, 
  updateAdvisee, 
  deleteAdvisee 
} from '../../services/adviseesService';
import { useAuth } from '../../context/AuthContext';
import { AdviseeModal } from './AdviseeModal';
import { AdviseeDetail } from './AdviseeDetail';

export const AdviseesDashboard: React.FC = () => {
  const { user } = useAuth();
  const [advisees, setAdvisees] = useState<Advisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvisee, setEditingAdvisee] = useState<Advisee | null>(null);
  const [selectedAdvisee, setSelectedAdvisee] = useState<Advisee | null>(null);

  // Scroll automático al tope al abrir o cerrar ficha de aconsejado
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [selectedAdvisee]);

  useEffect(() => {
    if (!user) {
      setAdvisees([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToAdvisees(
      user.uid,
      (data) => {
        setAdvisees(data);
        setLoading(false);
        if (selectedAdvisee) {
          const updated = data.find(a => a.id === selectedAdvisee.id);
          if (updated) setSelectedAdvisee(updated);
        }
      },
      (error) => {
        console.error('Error al cargar aconsejados:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (selectedAdvisee) {
    return (
      <AdviseeDetail
        advisee={selectedAdvisee}
        onBack={() => setSelectedAdvisee(null)}
        onEdit={() => {
          setEditingAdvisee(selectedAdvisee);
          setIsModalOpen(true);
        }}
        onDelete={async () => {
          if (user && confirm(`¿Estás seguro de eliminar el expediente de ${selectedAdvisee.fullName}? Esta acción no se puede deshacer.`)) {
            await deleteAdvisee(user.uid, selectedAdvisee.id);
            setSelectedAdvisee(null);
          }
        }}
      />
    );
  }

  const handleSaveAdvisee = async (
    adviseeData: Omit<Advisee, 'id' | 'counselorId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return;
    if (editingAdvisee) {
      await updateAdvisee(user.uid, editingAdvisee.id, adviseeData);
      setEditingAdvisee(null);
    } else {
      await createAdvisee(user.uid, adviseeData);
    }
  };

  const filteredAdvisees = advisees.filter(a => {
    const matchesStatus = selectedStatus === 'Todos' || a.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      a.fullName.toLowerCase().includes(q) ||
      (a.phone && a.phone.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.reason && a.reason.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  const activeCount = advisees.filter(a => a.status === 'Activo').length;
  const suspendedCount = advisees.filter(a => a.status === 'Suspendido').length;
  const closedCount = advisees.filter(a => a.status === 'Cerrado').length;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 animate-fade-in space-y-6 sm:space-y-8">
      
      {/* Top Banner - Limpio y Elegante */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/[0.08] shadow-navy-md relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-amber-950/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Base de Datos Privada & Confidencial</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold gold-gradient-text tracking-tight leading-tight">
              Expedientes de Consejería
            </h1>
            <p className="text-xs text-slate-400">
              Consejero Pastoral: <strong className="text-slate-200">{user?.displayName}</strong>
            </p>
          </div>

          <button
            onClick={() => {
              setEditingAdvisee(null);
              setIsModalOpen(true);
            }}
            className="gold-button px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-gold-sm flex-shrink-0 self-start lg:self-auto rounded-xl"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Dar de Alta Aconsejado</span>
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/[0.06] text-xs">
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.05] shadow-sm">
            <span className="text-slate-400 text-[11px] block">Total Expedientes</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5 block">{advisees.length}</span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 shadow-sm">
            <span className="text-emerald-400 text-[11px] block font-semibold">🟢 Activos</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5 block">{activeCount}</span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/20 shadow-sm">
            <span className="text-amber-400 text-[11px] block font-semibold">🟡 Suspendidos</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-amber-300 mt-0.5 block">{suspendedCount}</span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.05] shadow-sm">
            <span className="text-slate-400 text-[11px] block font-semibold">⚪ Cerrados</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-slate-300 mt-0.5 block">{closedCount}</span>
          </div>
        </div>

      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/[0.07] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, teléfono, motivo de consulta..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-900/80 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 lg:pb-0 scrollbar-none text-xs font-semibold">
            {['Todos', 'Activo', 'Suspendido', 'Cerrado'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap select-none text-xs ${
                  selectedStatus === st
                    ? 'bg-amber-600 text-white shadow-gold-sm border border-amber-500'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                {st === 'Todos' ? 'Todos los Estados' : st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Advisees Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
          <p className="text-xs text-slate-400">Sincronizando con Cloud Firestore...</p>
        </div>
      ) : filteredAdvisees.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 sm:p-10 text-center border border-white/[0.06] space-y-3 max-w-xl mx-auto">
          <FolderLock className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-serif text-base font-bold text-slate-300">
            {searchQuery || selectedStatus !== 'Todos'
              ? 'No se encontraron expedientes con los filtros seleccionados'
              : 'Aún no has registrado ningún aconsejado'}
          </h3>
          <p className="text-xs text-slate-400">
            {searchQuery || selectedStatus !== 'Todos'
              ? 'Prueba modificando tus términos de búsqueda.'
              : 'Da de alta a tu primer aconsejado para iniciar el seguimiento pastoral con citas y tareas.'}
          </p>
          {!searchQuery && selectedStatus === 'Todos' && (
            <button
              onClick={() => {
                setEditingAdvisee(null);
                setIsModalOpen(true);
              }}
              className="gold-button px-4 py-2 text-xs font-semibold inline-flex items-center space-x-1.5 rounded-xl mt-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Dar de Alta Aconsejado</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredAdvisees.map((advisee) => {
            const pendingTasks = (advisee.currentAssignedTasks || []).filter(t => !t.isCompleted).length;
            return (
              <div
                key={advisee.id}
                onClick={() => setSelectedAdvisee(advisee)}
                className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 border border-white/[0.07] flex flex-col justify-between cursor-pointer group transition-all hover:border-amber-500/30 shadow-sm"
              >
                <div className="space-y-3.5">
                  
                  {/* Top card bar with status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      advisee.status === 'Activo'
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                        : advisee.status === 'Suspendido'
                        ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                        : 'bg-slate-800 border-white/[0.06] text-slate-400'
                    }`}>
                      {advisee.status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Inicio: {advisee.startDate}
                    </span>
                  </div>

                  {/* Name and Basic Info */}
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors break-words">
                      {advisee.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {advisee.age} años • {advisee.maritalStatus}
                    </p>
                  </div>

                  {/* Reason preview */}
                  <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-white/[0.04] break-words">
                    "{advisee.reason || 'Sin motivo especificado'}"
                  </p>

                  {/* Next session and Tasks alert */}
                  <div className="pt-2.5 border-t border-white/[0.05] space-y-1.5 text-xs">
                    {advisee.nextSessionDate ? (
                      <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Próxima sesión: {advisee.nextSessionDate}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Sin próxima cita agendada</span>
                      </div>
                    )}

                    {pendingTasks > 0 && (
                      <div className="flex items-center space-x-1.5 text-slate-300 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{pendingTasks} {pendingTasks === 1 ? 'tarea pendiente de santificación' : 'tareas pendientes de santificación'}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-medium text-amber-400/90 group-hover:text-amber-300">
                  <span>Abrir Expediente</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Alta / Edición */}
      <AdviseeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAdvisee(null);
        }}
        onSave={handleSaveAdvisee}
        initialData={editingAdvisee}
      />

    </div>
  );
};
