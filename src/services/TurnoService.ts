// src/services/turnoService.ts
import firestore from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';
import { showNotification } from './notificationService';
import { createNotificationChannels } from '../constants/notificationChannels'; 
import { TriggerType, TimestampTrigger } from '@notifee/react-native';

type Farmacia = {
  id: string;
  name: string;
  dir: string;
  image: string;
  detail: string;
  turn: any[]; // Ajusta el tipo si necesitas
  // ...cualquier otro campo
};

/**
 * checkAndNotifyTurnos()
 * 
 * Llama directamente a Firestore (sin Hooks ni Context) para ver si hay una farmacia de turno 
 * y, de ser así, programa notificaciones locales para ciertas horas.
 */
export async function checkAndNotifyTurnos() {
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
      return pharmacy.turn?.some((t: any) => {
        // Asumiendo que t es un Timestamp de Firestore
        // (puede ser firestore.Timestamp o Date, ajusta según necesites)
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

    // 4) Si hay farmacia de turno, programa las notificaciones
    console.log('matching', matchingPharmacy)
    if (matchingPharmacy) {
      console.log('se a cargado la notificasion ')
      const notifications = [
        {
          hour: 8,
          minute: 35,
          title: 'De turno hoy',
          body: `La farmacia de turno es ${matchingPharmacy.name}`,
        },
        {
          hour: 12,
          minute: 0,
          title: 'Recordatorio de Turno',
          body: `La farmacia de turno es ${matchingPharmacy.name}`,
        },
        {
          hour: 20,
          minute: 0,
          title: 'Recordatorio de Turno',
          body: `La farmacia de turno es ${matchingPharmacy.name}`,
        },
      ];

      for (const { hour, minute, title, body } of notifications) {
        const notificationTime = now.set({
          hour,
          minute,
          second: 0,
          millisecond: 0,
        });

        // Sólo programamos si la hora futura es > now
        if (notificationTime > now) {
          const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: notificationTime.toMillis(),
          };
          // Notifee: crea la notificación disparada en ese momento
          await showNotification(
            title,
            body,
            {
              name: matchingPharmacy.name,
              dir: matchingPharmacy.dir,
              image: matchingPharmacy.image,
              detail: matchingPharmacy.detail,
            },
            trigger
          );
        }
      }
    }
  } catch (error) {
    console.error('[checkAndNotifyTurnos] Error:', error);
  }
}
