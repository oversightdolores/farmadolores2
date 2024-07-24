// notifeeBackgroundHandler.js
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  switch (type) {
    case EventType.ACTION_PRESS:
      // Manejar la acción del botón de la notificación
      console.log('User pressed an action:', pressAction);
      break;
    case EventType.DISMISSED:
      // Manejar el evento de que la notificación fue descartada
      console.log('Notification dismissed:', notification);
      break;
  }
});
