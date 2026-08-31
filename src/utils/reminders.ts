import { Advisee, PastoralAlert } from '../types';

/**
 * Calcula la diferencia en días entre dos fechas (string YYYY-MM-DD o ISO)
 */
export function getDaysDifference(dateString: string): number {
  if (!dateString) return 999;
  const target = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Obtiene todas las alertas pastorales consolidadas y priorizadas para el consejero
 */
export function calculatePastoralAlerts(advisees: Advisee[]): PastoralAlert[] {
  const alerts: PastoralAlert[] = [];

  advisees.forEach((advisee) => {
    // Solo evaluar aconsejados activos
    if (advisee.status !== 'Activo') return;

    // 1. Alertas por Cita Programada (Próxima Sesión)
    if (advisee.nextSessionDate) {
      const daysUntil = getDaysDifference(advisee.nextSessionDate);

      if (daysUntil === 0) {
        alerts.push({
          id: `cita-hoy-${advisee.id}`,
          adviseeId: advisee.id,
          adviseeName: advisee.fullName,
          type: 'cita_hoy',
          title: 'Sesión Pastoral Hoy',
          description: `Tienes sesión programada hoy con ${advisee.fullName}${advisee.nextSessionTime ? ` a las ${advisee.nextSessionTime}` : ''}.`,
          date: advisee.nextSessionDate,
          time: advisee.nextSessionTime,
          severity: 'urgent'
        });
      } else if (daysUntil === 1) {
        alerts.push({
          id: `cita-manana-${advisee.id}`,
          adviseeId: advisee.id,
          adviseeName: advisee.fullName,
          type: 'cita_manana',
          title: 'Cita Mañana',
          description: `Sesión programada para mañana con ${advisee.fullName}${advisee.nextSessionTime ? ` a las ${advisee.nextSessionTime}` : ''}.`,
          date: advisee.nextSessionDate,
          time: advisee.nextSessionTime,
          severity: 'warning'
        });
      } else if (daysUntil > 1 && daysUntil <= 7) {
        alerts.push({
          id: `cita-prox-${advisee.id}`,
          adviseeId: advisee.id,
          adviseeName: advisee.fullName,
          type: 'cita_proxima',
          title: 'Cita en Próximos Días',
          description: `Sesión en ${daysUntil} días (${advisee.nextSessionDate})${advisee.nextSessionTime ? ` a las ${advisee.nextSessionTime}` : ''}.`,
          date: advisee.nextSessionDate,
          time: advisee.nextSessionTime,
          severity: 'info'
        });
      }
    }

    // 2. Alertas por Falta de Seguimiento / Inactividad (>14 días sin sesión)
    const referenceDate = advisee.lastSessionDate || advisee.startDate || advisee.createdAt;
    if (referenceDate) {
      const daysSince = -getDaysDifference(referenceDate);
      if (daysSince >= 14 && !advisee.nextSessionDate) {
        const isVeryLong = daysSince >= 30;
        alerts.push({
          id: `inactivo-${advisee.id}`,
          adviseeId: advisee.id,
          adviseeName: advisee.fullName,
          type: 'sin_sesion_reciente',
          title: isVeryLong ? 'Seguimiento Urgente (>30 días)' : 'Seguimiento Recomendado (>14 días)',
          description: `Han transcurrido ${daysSince} días desde la última sesión y no tiene próxima cita agendada.`,
          daysInactive: daysSince,
          severity: isVeryLong ? 'urgent' : 'warning'
        });
      }
    }

    // 3. Alertas por Tareas Pendientes Acumuladas
    if (advisee.currentAssignedTasks && advisee.currentAssignedTasks.length > 0) {
      const pendingTasks = advisee.currentAssignedTasks.filter(t => !t.isCompleted);
      if (pendingTasks.length >= 3) {
        alerts.push({
          id: `tareas-${advisee.id}`,
          adviseeId: advisee.id,
          adviseeName: advisee.fullName,
          type: 'tareas_pendientes',
          title: `${pendingTasks.length} Tareas Pendientes`,
          description: `${advisee.fullName} tiene ${pendingTasks.length} tareas de santificación sin completar.`,
          pendingTasksCount: pendingTasks.length,
          severity: 'info'
        });
      }
    }
  });

  // Ordenar: urgentes primero, luego advertencias, luego informativas
  return alerts.sort((a, b) => {
    const priority = { urgent: 0, warning: 1, info: 2 };
    return priority[a.severity] - priority[b.severity];
  });
}
