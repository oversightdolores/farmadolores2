import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabs from '../components/BottomTabs';
import Home from './Home';
import Farmacias from './Farmacias';
import Emergencias from './Emergencias';
import DetailScreen from './DetailScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import PrimerosAuxilios from './PrimeroAuxilios';
import WelcomeScreen from './WelcomeScreen';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContextProvider, useAuth } from '../context/AuthContext';
import SettingsScreen from './SettingsScreen';
import Profile from './Profile';
import OnboardingScreen from '../onboarding/OnboardingScreen';
import { lightTheme, darkTheme } from '../theme';
import { useColorScheme } from 'react-native';
import {  ThemeContextProvider, useTheme } from '../context/ThemeContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Locales from './Locales';
import LocalDetailScreen from './LocalDetailScreen';
import DetailE from './DetailE';
import { PharmacyProvider } from '../context/PharmacyContext';
import EditProfileScreen from './EditProfileScreen';
import ReportProblemScreen from './ReportProblemScreen';
import HelpScreen from './HelpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

type OnboardingStackProps = {
  setIsFirstLaunch: React.Dispatch<React.SetStateAction<boolean | null>>;
};
// Navigator for Authentication Screens
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

// Navigator for Onboarding Screens
const OnboardingStack: React.FC<OnboardingStackProps> = ({ setIsFirstLaunch }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" options={{ headerShown: false }}>
        {props => <OnboardingScreen {...props} setIsFirstLaunch={setIsFirstLaunch} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Navigator for Main App Screens
const AppStack = () => {
  return (
    <>
    
    <Stack.Navigator>
      <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Farmacias" component={Farmacias} options={{ headerShown: false }} />
      <Stack.Screen name="Emergencias" component={Emergencias} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
      <Stack.Screen name="PrimeroAuxilios" component={PrimerosAuxilios}  />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false, title: 'Perfil' }} />
      <Stack.Screen name="Local" component={Locales} options={{ title: 'Locales' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{title: 'Editar perfil'}} />
      <Stack.Screen name="ReportProblem" component={ReportProblemScreen} options={{title: 'Reportar Problema'}} />
      <Stack.Screen name="Help" component={HelpScreen} options={{title: 'Ayuda'}} />
      <Stack.Screen name="LocalDetail" component={LocalDetailScreen} options={{ title: 'Detalles del Local' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params.farmacia.name })} />
      <Stack.Screen name="DetailE" component={DetailE} options={({ route }) => ({ title: route.params.emergencia.name })} />
    </Stack.Navigator>
    </>
  );
};

const AppNavigator: React.FC = ({ ...rest }) => {
  const { user } = useAuth();
  const {theme} = useTheme()
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
      setIsFirstLaunch(hasOpenedBefore === null);
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isFirstLaunch === false) {
      AsyncStorage.setItem('hasOpenedBefore', 'true');
    }
  }, [isFirstLaunch]);

  if (isFirstLaunch === null) {
    return null; // Puedes mostrar una pantalla de carga aquí
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator {...rest}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {props => <OnboardingStack {...props} setIsFirstLaunch={setIsFirstLaunch} />}
          </Stack.Screen>
        ) : user ? (
          <>
          <Stack.Screen name="App" component={AppStack} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default () => (
  <AuthContextProvider>
    <ThemeContextProvider>
      <PharmacyProvider>
    <AppNavigator />
      </PharmacyProvider>
    </ThemeContextProvider>
  </AuthContextProvider>
);
