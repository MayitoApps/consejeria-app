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
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 animate-fade-in space-y-8">
      
      {/* Top Banner - Expansivo y Elegante */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-500/20 shadow-navy-md relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Base de Datos Privada & Confidencial</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text tracking-tight leading-tight">
              Expedientes de Consejería
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Consejero Pastoral: <strong className="text-slate-200">{user?.displayName}</strong>
            </p>
          </div>

          <button
            onClick={() => {
              setEditingAdvisee(null);
              setIsModalOpen(true);
            }}
            className="gold-button px-5 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 shadow-gold-sm flex-shrink-0 self-start lg:self-auto rounded-2xl"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Dar de Alta Aconsejado</span>
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
            <span className="text-slate-400 text-xs block">Total Expedientes</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 block">{advisees.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 shadow-sm">
            <span className="text-emerald-400 text-xs block font-semibold">🟢 Activos</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300 mt-1 block">{activeCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 shadow-sm">
            <span className="text-amber-400 text-xs block font-semibold">🟡 Suspendidos</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 mt-1 block">{suspendedCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 shadow-sm">
            <span className="text-slate-400 text-xs block font-semibold">⚪ Cerrados</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-slate-300 mt-1 block">{closedCount}</span>
          </div>
        </div>

      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-amber-500/15 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, teléfono, motivo de consulta..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs font-semibold">
            {['Todos', 'Activo', 'Suspendido', 'Cerrado'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap select-none ${
                  selectedStatus === st
                    ? 'bg-amber-600 text-white shadow-gold-sm border border-amber-500'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
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
        <div className="text-center py-16">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs sm:text-sm text-slate-400">Sincronizando con Cloud Firestore...</p>
        </div>
      ) : filteredAdvisees.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-2xl mx-auto">
          <FolderLock className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-300">
            {searchQuery || selectedStatus !== 'Todos'
              ? 'No se encontraron expedientes con los filtros seleccionados'
              : 'Aún no has registrado ningún aconsejado'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
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
              className="gold-button px-5 py-2.5 text-xs font-semibold inline-flex items-center space-x-2 rounded-xl mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Dar de Alta Aconsejado</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {filteredAdvisees.map((advisee) => {
            const pendingTasks = (advisee.currentAssignedTasks || []).filter(t => !t.isCompleted).length;
            return (
              <div
                key={advisee.id}
                onClick={() => setSelectedAdvisee(advisee)}
                className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-amber-500/20 flex flex-col justify-between cursor-pointer group transition-all hover:border-amber-500/40 shadow-sm"
              >
                <div className="space-y-4">
                  
                  {/* Top card bar with status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      advisee.status === 'Activo'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : advisee.status === 'Suspendido'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-slate-700/50 border-slate-600 text-slate-400'
                    }`}>
                      {advisee.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      Inicio: {advisee.startDate}
                    </span>
                  </div>

                  {/* Name and Basic Info */}
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors break-words">
                      {advisee.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {advisee.age} años • {advisee.maritalStatus}
                    </p>
                  </div>

                  {/* Reason preview */}
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80 break-words">
                    "{advisee.reason || 'Sin motivo especificado'}"
                  </p>

                  {/* Next session and Tasks alert */}
                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                    {advisee.nextSessionDate ? (
                      <div className="flex items-center space-x-2 text-amber-300 text-xs font-medium">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Próxima sesión: {advisee.nextSessionDate}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-500 text-xs">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Sin próxima cita agendada</span>
                      </div>
                    )}

                    {pendingTasks > 0 && (
                      <div className="flex items-center space-x-2 text-slate-300 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>{pendingTasks} {pendingTasks === 1 ? 'tarea pendiente de santificación' : 'tareas pendientes de santificación'}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Abrir Expediente Completo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
