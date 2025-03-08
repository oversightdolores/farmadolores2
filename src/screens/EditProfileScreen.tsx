import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';

const EditProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }

    setLoading(true);

    try {
      await firestore().collection('users').doc(user.uid).update({
        displayName: name,
        email: email,
      });
      Alert.alert('Perfil actualizado', 'Los cambios se han guardado correctamente.');
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Hubo un problema al actualizar tu perfil. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Editar Perfil</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Nombre"
        placeholderTextColor={colors.text}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
      />
      <Button
            
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSave}
        color={colors.card}
        disabled={loading}
        accessibilityLabel="Guardar Cambios"
        
      />
    </View>
  );
};

export default EditProfileScreen;

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
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
