import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, DrawerLayoutAndroid, StatusBar, Linking } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import SettingsScreen from './SettingsScreen';
import { RootStackParamList } from '../types/navigationTypes';
import AdBanner from '../components/ads/AdBanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';

const Profile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout, loading } = useAuth();
  const { toggleTheme } = useTheme();
  const { theme } = useTheme();
  const { colors } = theme;
  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  const cafecitoLink = 'https://cafecito.app/crazedev';


  const handleCafecitoPress = () => {
    Linking.openURL(cafecitoLink);
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
      <StatusBar 
        backgroundColor={colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
        <View style={[styles.header, {backgroundColor: colors.background}]}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Perfil</Text>
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
          <Text style={[styles.name, {color: colors.text}]}>{user?.displayName || 'User Name'}</Text>
          <Text style={[styles.email, {color: colors.text}]}>{user?.email || 'user@example.com'}</Text>
          <Text style={[styles.bio, {color: colors.text}]}>
          ¡Gracias por usar nuestra aplicación! Apreciamos tu confianza y apoyo. Nos esforzamos por ofrecerte la mejor experiencia posible. Tu satisfacción es nuestra prioridad.
          </Text>
        <View style={styles.cafecitoContainer}>
        <Text style={[styles.cafecitoText, { color: colors.text }]}>
          ¿Te gusta mi trabajo? ¡Invítame un cafecito!
        </Text>
        <TouchableOpacity style={[styles.cafecitoButton, { backgroundColor: colors.card }]} onPress={handleCafecitoPress}>
          <Icon name="local-cafe" size={24} color={colors.text} />
          <Text style={[styles.cafecitoButtonText, {color: colors.text}]}>Donar en Cafecito</Text>
        </TouchableOpacity>
      </View>
        </View>
        
      </View>
      <AdBanner size={BannerAdSize.MEDIUM_RECTANGLE} />
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
    backgroundColor: '#fff',
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
  cafecitoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  cafecitoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  cafecitoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cafecitoButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
