// App.tsx
import { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Tu navegación y contextos
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './src/context/AuthContext';
import AppNavigator from './src/screens/AppNavigator';

// Para actualizaciones CodePush (si lo usas)

// Importamos BackgroundFetch
import BackgroundFetch from 'react-native-background-fetch';
// Importamos la función que hace el chequeo y la notificación
import { checkAndNotifyTurnos } from './src/services/TurnoService'; 
import { ThemeContextProvider,useTheme } from './src/context/ThemeContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const App = () => {


  const {theme} = useTheme()
  const {colors,dark} = theme;
  const style = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  useEffect(() => {
    // Inicializa y configura BackgroundFetch al montar el componente raíz
    const initBackgroundFetch = async () => {
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
      <SafeAreaProvider>
      <AuthContextProvider>
        <ThemeContextProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <StatusBar
            barStyle={dark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background} // Cambia el color de fondo del StatusBar
          />
          {/* Navegación principal */}
        <AppNavigator />
          </SafeAreaView>
        </ThemeContextProvider>
      </AuthContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;