import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { colors } = theme;
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
          <Icon name="brightness-6" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Toggle Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { /* Navegar a Editar Perfil */ }}>
          <Icon name="edit" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { /* Navegar a Reportar Problema */ }}>
          <Icon name="report-problem" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Report Problem</Text>
        </TouchableOpacity>
        {loading ? (
          <View style={styles.menuItem}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
          ) : (
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={[styles.menuText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
            
          )}
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
    marginLeft: 20,
    fontSize: 15,
    color: '#333',
  },
});
