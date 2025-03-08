// src/services/notificationService.ts
import notifee, {
  AndroidImportance,
  TimestampTrigger,
} from '@notifee/react-native';

/**
 * showNotification
 * @param title Título de la notificación
 * @param body  Texto de la notificación
 * @param data  Objeto con información adicional
 * @param trigger Objeto TimestampTrigger para programar notificación futura
 */
export const showNotification = async (
  title: string,
  body: string,
  data: any,
  trigger: TimestampTrigger
) => {
  // Creamos una notificación con trigger (programada)
  await notifee.createTriggerNotification(
    {
      title,
      body,
      // Opciones de Android
      android: {
        channelId: 'turno',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        actions: [
          {
            title: 'Ver Farmacia',
            pressAction: {
              id: 'viewFarmacia',
              launchActivity: 'default',
            },
          },
        ],
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        // Si quieres que suene inmediatamente, aunque sea programada, 
        // pones el timestamp. Pero usualmente con programadas no hace falta.
        timestamp: Date.now() + 5 * 1000,
      },
      data,
    },
    trigger
  );
};
