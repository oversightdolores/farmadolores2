// src/services/turnoService.ts
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';
import { showNotification } from './notificationService';
import { createNotificationChannels } from '../constants/notificationChannels';
import { TriggerType, TimestampTrigger } from '@notifee/react-native';
import { Farmacia } from '../types/navigationTypes';
import notifee from '@notifee/react-native';

interface NotificationSchedule {
  readonly hour: number;
  readonly minute: number;
  readonly title: string;
  readonly body: (name: string) => string;
}

const NOTIFICATION_SCHEDULES: NotificationSchedule[] = [
  {
    hour: 8,
    minute: 35,
    title: 'De turno hoy',
    body: name => `La farmacia de turno es ${name}`,
  },
  {
    hour: 12,
    minute: 0,
    title: 'Recordatorio de Turno',
    body: name => `La farmacia de turno es ${name}`,
  },
  {
    hour: 20,
    minute: 0,
    title: 'Recordatorio de Turno',
    body: name => `La farmacia de turno es ${name}`,
  },
];

/**
 * checkAndNotifyTurnos()
 *
 * Llama directamente a Firestore (sin Hooks ni Context) para ver si hay una farmacia de turno
 * y, de ser así, programa notificaciones locales para ciertas horas.
 * Ahora evita notificaciones duplicadas y mejora logs/errores.
 */
export async function checkAndNotifyTurnos(): Promise<void> {
  try {
    await createNotificationChannels();
    // 1. Consulta farmacias
    const snapshot = await firestore().collection('farmacias').get();
    const farmacias: Farmacia[] = snapshot.docs.map(doc => {
      const data = doc.data() as Partial<Farmacia>;
      return {
        ...data,
        id: doc.id,
      } as Farmacia;
    });
    // 2. Determinar farmacia de turno
    const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
    const matchingPharmacy = farmacias.find((pharmacy) => {
      return pharmacy.turn?.some((t: any) => {
        const timestamp: FirebaseFirestoreTypes.Timestamp = t?.timestamp ?? t;
        if (!timestamp?.toDate) return false;
        const turnStart = DateTime.fromJSDate(timestamp.toDate()).set({
          hour: 8,
          minute: 30,
          second: 0,
          millisecond: 0,
        });
        const turnEnd = turnStart.plus({ hours: 24 });
        return now >= turnStart && now <= turnEnd;
      });
    });
    if (!matchingPharmacy) {
      console.log('[TurnoService] No hay farmacia de turno.');
      // Cancela notificaciones previas del canal si quieres
      await notifee.cancelAllNotifications();
      return;
    }
    // 3. Evitar duplicados: cancela notificaciones futuras de este canal
    await notifee.cancelAllNotifications();
    // 4. Programar notificaciones
    for (const schedule of NOTIFICATION_SCHEDULES) {
      const notificationTime = now.set({
        hour: schedule.hour,
        minute: schedule.minute,
        second: 0,
        millisecond: 0,
      });
      if (notificationTime > now) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime.toMillis(),
        };
        // ID único por farmacia y horario
        const notificationId = `${matchingPharmacy.id}_${schedule.hour}_${schedule.minute}`;
        console.log(`[TurnoService] Programando notificación ${notificationId} para ${notificationTime.toISO()}`);
        try {
          await showNotification(
            schedule.title,
            schedule.body(matchingPharmacy.name),
            {
              name: matchingPharmacy.name,
              dir: matchingPharmacy.dir,
              image: matchingPharmacy.image,
              detail: matchingPharmacy.detail,
            },
            trigger,
            notificationId
          );
          console.log(`[TurnoService] Notificación programada: ${notificationId}`);
        } catch (err) {
          console.error(`[TurnoService] Error programando notificación ${notificationId}:`, err);
        }
      }
    }
  } catch (error) {
    console.error('[checkAndNotifyTurnos] Error:', error);
  }
}
