// permissions.ts
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Alert } from 'react-native';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const requestPermissions = async (): Promise<boolean> => {
  try {
    // Solicitar permisos de notificación
    const notificationSettings = await notifee.getNotificationSettings();
    if (notificationSettings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
      const { authorizationStatus } = await notifee.requestPermission();
      if (authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
        Alert.alert('Permiso de notificaciones denegado', 'No se otorgó el permiso para mostrar notificaciones.');
        return false;
      }
    }

    // Solicitar permisos adicionales
    const permissions = [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      
    ];

    for (const permission of permissions) {
      const status = await check(permission);
      if (status !== RESULTS.GRANTED) {
        const requestStatus = await request(permission);
        if (requestStatus !== RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', `No se otorgó el permiso: ${permission}`);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error solicitando permisos:', error);
    return false;
  }
};
