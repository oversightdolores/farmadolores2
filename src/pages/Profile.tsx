import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
      />
      <Text style={styles.name}>{user?.displayName || 'User Name'}</Text>
      <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={20} color="#007bff" />
          <Text style={styles.buttonText}>Settings</Text>
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
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 20,
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
    borderColor: '#007bff',
    borderWidth: 1,
    marginBottom: 15,
  },
  buttonText: {
    marginLeft: 10,
    color: '#007bff',
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
});
