import React from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ShieldAlert 
} from 'lucide-react';
import { PastoralAlert } from '../../types';

interface PastoralAlertsBannerProps {
  alerts: PastoralAlert[];
  onSelectAdvisee: (adviseeId: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PastoralAlertsBanner: React.FC<PastoralAlertsBannerProps> = ({
  alerts,
  onSelectAdvisee,
  activeFilter,
  onFilterChange
}) => {
  if (alerts.length === 0) return null;

  const todayAlerts = alerts.filter(a => a.type === 'cita_hoy');
  const upcomingAlerts = alerts.filter(a => a.type === 'cita_manana' || a.type === 'cita_proxima');
  const inactiveAlerts = alerts.filter(a => a.type === 'sin_sesion_reciente');

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-amber-500/25 bg-gradient-to-r from-slate-950 via-[#0a0f1c] to-slate-950 shadow-navy-sm space-y-3.5">
      
      {/* Header del Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-white tracking-wide flex items-center space-x-2">
              <span>Atención Pastoral Prioritaria</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-sans font-semibold">
                {alerts.length} avisos
              </span>
            </h3>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <button
            onClick={() => onFilterChange(activeFilter === 'alert_hoy' ? 'Todos' : 'alert_hoy')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all flex items-center space-x-1 ${
              activeFilter === 'alert_hoy'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-900/80 border-white/[0.06] text-rose-300 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3 h-3 text-rose-400" />
            <span>Citas Hoy ({todayAlerts.length})</span>
          </button>

          <button
            onClick={() => onFilterChange(activeFilter === 'alert_proximas' ? 'Todos' : 'alert_proximas')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all flex items-center space-x-1 ${
              activeFilter === 'alert_proximas'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-slate-900/80 border-white/[0.06] text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Próximas ({upcomingAlerts.length})</span>
          </button>

          <button
            onClick={() => onFilterChange(activeFilter === 'alert_inactivos' ? 'Todos' : 'alert_inactivos')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all flex items-center space-x-1 ${
              activeFilter === 'alert_inactivos'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900/80 border-white/[0.06] text-blue-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-blue-400" />
            <span>Seguimiento ({inactiveAlerts.length})</span>
          </button>
        </div>
      </div>

      {/* Tarjetas Horizontales de Alertas Urgentes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
        {alerts.slice(0, 3).map((alert) => (
          <div
            key={alert.id}
            onClick={() => onSelectAdvisee(alert.adviseeId)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-white/[0.06] hover:border-amber-400/40 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="overflow-hidden pr-2">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  alert.severity === 'urgent' ? 'bg-rose-500 animate-pulse' :
                  alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="font-semibold text-slate-100 truncate text-xs">{alert.adviseeName}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{alert.description}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </div>
        ))}
      </div>

    </div>
  );
};
