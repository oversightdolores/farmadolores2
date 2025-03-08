// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Tu navegación y contextos
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './src/context/AuthContext';
import AppNavigator from './src/screens/AppNavigator';

// Para actualizaciones CodePush (si lo usas)
import codePush from 'react-native-code-push';

// Importamos BackgroundFetch
import BackgroundFetch from 'react-native-background-fetch';

// Importamos la función que hace el chequeo y la notificación
import { checkAndNotifyTurnos } from './src/services/TurnoService';

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // Inicializa y configura BackgroundFetch al montar el componente raíz
    const initBackgroundFetch = async () => {
      console.log('app')
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Se intentará ejecutar aprox cada 15 minutos
          stopOnTerminate: false,   // iOS: continuar corriendo incluso si el usuario cierra la app
          startOnBoot: true,        // Android: iniciar al encender el dispositivo
          enableHeadless: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        },
        async (taskId) => {
          console.log('[BackgroundFetch] Task start:', taskId);
          // Llamamos a nuestra lógica para revisar turnos y programar notificaciones
          await checkAndNotifyTurnos();
          console.log('solicitando notificasion')
          // MUY IMPORTANTE: marcar la tarea como finalizada
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.log('[BackgroundFetch] configure error:', error);
        },
      );

      // Iniciar el proceso de background (en versiones recientes quizá no sea 100% necesario, pero recomendable)
      BackgroundFetch.start();
    };

    initBackgroundFetch();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {/* Navegación principal */}
        <AppNavigator />
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
};

export default codePush(codePushOptions)(App);
