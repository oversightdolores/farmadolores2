import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { useTheme } from '../context/ThemeContext';


const AdminPanelScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {theme} = useTheme()
  const colors = theme.colors
  return (
    <View style={[{backgroundColor: colors.background},styles.container]}>
      <Text style={styles.title}>Panel de Administración</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ActualizarHorarios')}
      >
        <Text style={styles.buttonText}>Actualizar Horarios</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ActualizarTurnos')}
      >
        <Text style={styles.buttonText}>Actualizar Turnos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminPanelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f8f9fa',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#2d6cdf'
  },
  button: {
    backgroundColor: '#2d6cdf',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 12,
    minWidth: 220,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
