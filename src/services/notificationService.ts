// services/notificationService.ts
import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { createNotificationChannels } from '../constants/notificationChannels';



export const showNotification = async (title: string, body: string, data: any, trigger: TimestampTrigger) => {
  await notifee.createTriggerNotification(
    {
      title,
      body,
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
        timestamp: Date.now() + 5 * 1000,
      },
      data,
    },
    trigger
  );
};
