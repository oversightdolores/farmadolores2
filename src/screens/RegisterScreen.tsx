import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from '@react-native-vector-icons/material-design-icons';




const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const colors = theme.colors;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { register, loading, loginWithGoogle } = useAuth();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Campos Vacios', 'Email y contraseña son requeridos.');
      return;
    }
    try {
      await register(email, password);
      navigation.navigate('Home'); 
    } catch (e) {
      setError((e as Error).message);
      Alert.alert('Registration Error', (e as Error).message);
    }
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
    <View style={styles.container}>
      <Text style={styles.title}>Registrate</Text>
      <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}

        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      <TextInput
               style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}

        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
     
        <TouchableOpacity style={[styles.button,  styles.registerButton, {backgroundColor: colors.background, borderColor: colors.primary}]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    elevation: 3,
  },
  googleIcon: {
    marginRight: 10,
  },
  error: { 
    color: 'red', 
    marginBottom: 12 
  },
  registerButton: {
    borderWidth: 1,
  },
  registerButtonText: {
    color: '#007bff',
  },
  
});

export default RegisterScreen;
