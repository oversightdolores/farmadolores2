import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, DrawerLayoutAndroid } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import SettingsScreen from './SettingsScreen';

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, loading } = useAuth();
  const { toggleTheme } = useTheme();
  const { theme } = useTheme();
  const { colors } = theme;
  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition={'right'}
      renderNavigationView={() => (
        <View style={styles.drawerContent}>
          <SettingsScreen />
        </View>
      )}
    >
        <View style={[styles.header, {backgroundColor: colors.background}]}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Profile</Text>
          <TouchableOpacity onPress={() => drawerRef.current?.openDrawer()}>
            <Icon name="menu" size={30} color={colors.text} />
          </TouchableOpacity>
        </View>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
          />
          <Text style={styles.name}>{user?.displayName || 'User Name'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.bio}>
            This is the bio of the user. It can be a few lines long and give a brief description about the user.
          </Text>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={20} color="#333" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <Icon name="brightness-6" size={20} color="#333" />
            <Text style={styles.buttonText}>Toggle Theme</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Icon name="logout" size={20} color="#fff" />
              <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </DrawerLayoutAndroid>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#007bff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: '#007bff',
    borderWidth: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
  },
  menu: {
    marginTop: 20,
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 15,
  },
  buttonText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    borderColor: '#ff4d4d',
  },
  logoutButtonText: {
    color: '#fff',
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
