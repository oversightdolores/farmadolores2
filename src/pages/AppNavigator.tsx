import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabs from './../components/BottomTabs';
import Home from './Home';
import Farmacias from './Farmacias';
import Emergencias from './Emergencias';
import DetailScreen from './DetailScreen';
import PermissionScreen from './PermissionScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContextProvider, useAuth } from '../context/AuthContext'; // Asegúrate de ajustar la ruta
import SettingsScreen from './SettingsScreen';
import Profile from './Profile';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator: React.FC = ({...rest}) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
      if (hasOpenedBefore === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // Puedes mostrar una pantalla de carga aquí
  }

  return (
    <NavigationContainer>
    
      <Stack.Navigator {...rest}>
        {isFirstLaunch ? (
          <Stack.Screen name="Permission">
            {props => <PermissionScreen {...props} onComplete={() => setIsFirstLaunch(false)} />}
          </Stack.Screen>
        ) : user ? (
          <>
            <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Farmacias" component={Farmacias} />
            <Stack.Screen name="Emergencias" component={Emergencias} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params.farmacia.name })} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default () => (
  <AuthContextProvider>
    <AppNavigator />
  </AuthContextProvider>
);
