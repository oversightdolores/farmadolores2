import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

const Login: React.FC = () => {
  const { theme } = useTheme();
  const colors = theme.colors
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, loginWithGoogle, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error de validación', 'El email y la contraseña son obligatorios.');
      return;
    }
    try {
      await login(email, password);
    } catch (error) {
      console.error('Error iniciando sesión: ', error);
      Alert.alert('Error de inicio de sesión', error.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Error iniciando sesión con Google: ', error);
      Alert.alert('Error de inicio de sesión con Google', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
      <Text style={[styles.title, { color: colors.text }]}>Bienvenido</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor={colors.placeholderText}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.placeholderText}
      />
      <TouchableOpacity style={[styles.button,styles.registerButton, { backgroundColor: colors.background, borderColor: colors.primary }]} onPress={handleLogin}>
            <Text style={[styles.buttonText, { color: colors.primary }]}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.registerButton, {backgroundColor: colors.background, borderColor: colors.primary }]} onPress={handleRegister}>
            <Text style={[styles.buttonText, styles.registerButtonText, { color: colors.primary }]}>Registrarse</Text>
          </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color={colors.notification} />
      ) : (
        <>
          
          <TouchableOpacity style={[styles.button, styles.googleButton, { backgroundColor: '#db4437' }]} onPress={handleGoogleLogin}>
            <Icon name="google" size={20} color="#fff" style={styles.googleIcon} />
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Iniciar sesión con Google</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    elevation: 3,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    elevation: 3,
  },
  googleIcon: {
    marginRight: 10,
  },
  registerButton: {
   
    borderWidth: 1,
  },
  registerButtonText: {
    color: '#007bff',
  },
});
