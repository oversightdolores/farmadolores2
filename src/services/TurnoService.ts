// src/services/turnoService.ts
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';
import { showNotification } from './notificationService';
import { createNotificationChannels } from '../constants/notificationChannels';
import { TriggerType, TimestampTrigger } from '@notifee/react-native';
import { Farmacia } from '../types/navigationTypes';

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
 */
export async function checkAndNotifyTurnos(): Promise<void> {
  try {
    // 1) Crear canales de notificación (si no lo hiciste antes).
    await createNotificationChannels();

    // 2) Consulta directa a Firestore (una sola vez).
    const snapshot = await firestore().collection('farmacias').get();
    const farmacias: Farmacia[] = snapshot.docs.map(doc => {
      const data = doc.data() as Partial<Farmacia>;
      return {
        ...data,
        id: doc.id,
      } as Farmacia;
    });

    // 3) Determinar si hay farmacia de turno
    const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');
    const matchingPharmacy = farmacias.find((pharmacy) => {
      return pharmacy.turn?.some((t: FirebaseFirestoreTypes.Timestamp) => {
        const turnStart = DateTime.fromJSDate(t.toDate()).set({
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
      return;
    }

    // Programar las notificaciones
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
        );
      }
    }
  }
  } catch (error) {
    console.error('[checkAndNotifyTurnos] Error:', error);
  }
}
