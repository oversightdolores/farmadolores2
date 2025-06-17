import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '@react-native-vector-icons/material-design-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import AnimatedToggleSwitch from '../components/AnimatedToggleSwitch';
import DeviceInfo from 'react-native-device-info'

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { colors, dark } = theme;
  const { logout, loading } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
  const version = DeviceInfo.getVersion();
  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkTheme(!isDarkTheme);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };
  console.log('version', dark); 

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Text style={[styles.menuText, { color: colors.text }]}>Theme</Text>
          <AnimatedToggleSwitch  isOn={isDarkTheme} onToggle={handleToggleTheme} />
        </View>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="account-edit" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ReportProblem')}>
          <Icon name="alert-circle" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Reporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Help')}>
          <Icon name="help-circle-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Ayuda</Text>
        </TouchableOpacity>
        {loading ? (
          <View style={styles.menuItem}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Icon name="logout" size={24} color={colors.error} />
            <Text style={[styles.menuText, { color: colors.error }]}>Cerrar sesion</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: colors.text }]}>Versión {DeviceInfo.getVersion()}</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
   
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    flex: 1,
    marginLeft: 20,
    marginRight: 'auto',
    fontSize: 15,
    color: '#333',
  },
  versionContainer: {
    
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  versionText: {
    fontSize: 14,
    
  },
});
