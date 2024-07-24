import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para Material Design
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Para FontAwesome
import Emergencias from '../pages/Emergencias';
import Farmacias from '../pages/Farmacias';
import Home from '../pages/Home';
import Perfil from '../pages/Profile';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tab = createBottomTabNavigator();

const BottomTabs: React.FC = () => {
  useEffect(() => {
    // Aquí puedes colocar las llamadas a las funciones fetch si las necesitas
    // Ejemplo: dispatch(fetchFarmacias());
    // dispatch(fetchEmergencias());
    // dispatch(fetchPublicidad());
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: string;
          let IconComponent = Icon;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              IconComponent = Icon;
              break;
            case 'Farmacias':
              iconName = 'medkit';
              IconComponent = FontAwesome;
              break;
            case 'Emergencias':
              iconName = 'phone';
              IconComponent = FontAwesome;
              break;
            case 'Perfil':
              iconName = 'user';
              IconComponent = FontAwesome;
              break;
            default:
              iconName = 'circle';
              IconComponent = Icon;
              break;
          }

          return <IconComponent name={iconName} size={size} color={focused ? 'green' : 'gray'} />;
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: 'green',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Farmacias" options={{ headerShown: false }} component={Farmacias} />
      <Tab.Screen name="Emergencias" options={{ headerShown: false }} component={Emergencias} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
