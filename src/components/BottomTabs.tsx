import React, { useEffect, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para Material Design
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Para FontAwesome
import Emergencias from '../screens/Emergencias';
import Farmacias from '../screens/Farmacias';
import Home from '../screens/Home';
import Perfil from '../screens/Profile';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tab = createBottomTabNavigator();

const BottomTabs: React.FC = () => {
  const {theme} = useTheme();
  const { colors } = theme;

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

          return <IconComponent name={iconName} size={size} color={focused ? colors.iconActive : colors.iconInactive} />;
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.iconInactive,
        tabBarActiveTintColor: colors.iconActive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Farmacias" options={{ headerShown: false }} component={Farmacias} />
      <Tab.Screen name="Emergencias" options={{ headerShown: false }} component={Emergencias} />
      <Tab.Screen name="Perfil"  options={{ headerShown: false }} component={Perfil} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
