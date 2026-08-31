import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { PastoralAlert } from '../../types';

interface AlertsDropdownProps {
  alerts: PastoralAlert[];
  onSelectAdvisee: (adviseeId: string) => void;
}

export const AlertsDropdown: React.FC<AlertsDropdownProps> = ({
  alerts,
  onSelectAdvisee
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const urgentCount = alerts.filter(a => a.severity === 'urgent').length;
  const totalCount = alerts.length;

  const handleAlertClick = (adviseeId: string) => {
    setIsOpen(false);
    onSelectAdvisee(adviseeId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Botón Campana con Insignia */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-all text-slate-300 hover:text-white ${
          totalCount > 0 
            ? 'bg-slate-900/80 border-amber-500/30 hover:border-amber-400 shadow-gold-sm' 
            : 'bg-slate-900/60 border-white/[0.06] hover:bg-slate-800'
        }`}
        title="Alertas y Recordatorios Pastorales"
      >
        <Bell className="w-4 h-4 text-amber-400" />
        {totalCount > 0 && (
          <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold text-white shadow-sm animate-pulse ${
            urgentCount > 0 ? 'bg-rose-600' : 'bg-amber-600'
          }`}>
            {totalCount}
          </span>
        )}
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl p-3 border border-amber-500/25 shadow-navy-lg animate-slide-up z-50 text-slate-100 max-h-[80vh] flex flex-col">
          
          {/* Encabezado del Dropdown */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/[0.06] px-1">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="font-serif font-bold text-sm text-white">Alertas Pastorales</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-white/[0.06] text-slate-300 font-medium">
              {totalCount} {totalCount === 1 ? 'notificación' : 'notificaciones'}
            </span>
          </div>

          {/* Lista de Alertas */}
          <div className="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
            {alerts.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400/80 mx-auto" />
                <p className="font-semibold text-xs text-slate-300">¡Todo al día en el ministerio!</p>
                <p className="text-[11px] text-slate-500">No hay citas pendientes inmediatas ni aconsejados inactivos.</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const isUrgent = alert.severity === 'urgent';
                const isWarning = alert.severity === 'warning';

                return (
                  <div
                    key={alert.id}
                    onClick={() => handleAlertClick(alert.adviseeId)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-2.5 group ${
                      isUrgent
                        ? 'bg-rose-950/25 border-rose-800/40 hover:border-rose-500/60'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-500/60'
                        : 'bg-slate-900/70 border-white/[0.05] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isUrgent
                        ? 'bg-rose-500/20 text-rose-400'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {alert.type === 'cita_hoy' ? (
                        <Calendar className="w-3.5 h-3.5" />
                      ) : alert.type === 'cita_manana' || alert.type === 'cita_proxima' ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-semibold text-[11px] truncate ${
                          isUrgent ? 'text-rose-300' : isWarning ? 'text-amber-300' : 'text-slate-200'
                        }`}>
                          {alert.title}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                        {alert.adviseeName}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Dropdown */}
          <div className="pt-2 mt-2 border-t border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-500 italic">
              Haz clic en cualquier alerta para abrir el expediente pastoral
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
