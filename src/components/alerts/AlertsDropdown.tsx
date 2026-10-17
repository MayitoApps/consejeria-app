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
        className={`relative p-2 rounded-xl border transition-all text-slate-700 hover:text-slate-900 ${
          totalCount > 0 
            ? 'bg-amber-50 border-amber-300 hover:border-amber-400 shadow-sm' 
            : 'bg-stone-100 border-stone-200 hover:bg-stone-200'
        }`}
        title="Alertas y Recordatorios Pastorales"
      >
        <Bell className="w-4 h-4 text-amber-700" />
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
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl p-3 border border-stone-200 shadow-2xl animate-slide-up z-50 text-slate-800 max-h-[80vh] flex flex-col">
          
          {/* Encabezado del Dropdown */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-200 px-1">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-700" />
              <span className="font-serif font-bold text-sm text-slate-900">Alertas Pastorales</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-slate-600 font-medium">
              {totalCount} {totalCount === 1 ? 'notificación' : 'notificaciones'}
            </span>
          </div>

          {/* Lista de Alertas */}
          <div className="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
            {alerts.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-semibold text-xs text-slate-800">¡Todo al día en el ministerio!</p>
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
                        ? 'bg-rose-50 border-rose-200 hover:border-rose-300'
                        : isWarning
                        ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-700'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
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
                          isUrgent ? 'text-rose-900' : isWarning ? 'text-amber-900' : 'text-slate-800'
                        }`}>
                          {alert.title}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
                        {alert.adviseeName}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Dropdown */}
          <div className="pt-2 mt-2 border-t border-stone-200 text-center">
            <span className="text-[10px] text-slate-400 italic">
              Haz clic en cualquier alerta para abrir el expediente pastoral
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
