import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, FlatList, ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PickerTurno from '../components/PikerTurno'; // Cambia ruta si es necesario
import { useTheme } from '../context/ThemeContext';

interface Farmacia {
  id: string;
  name: string;
  turn?: Date[] | null;
}

const AdminCambiarTurnoFarmacia: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState<Farmacia | null>(null);
  const [turnos, setTurnos] = useState<(Date | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const {theme} = useTheme()
  const colors = theme

  // Buscar farmacias por nombre (mayúscula)
  const buscarFarmaciasPorNombre = async (nombre: string) => {
    setFarmaciaSeleccionada(null);
    setTurnos([]);
    setFarmacias([]);
    if (nombre.length < 2) return;
    setLoading(true);
    try {
      const inicio = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      const fin = inicio + '\uf8ff';
      const snap = await firestore()
        .collection('farmacias')
        .where('name', '>=', inicio)
        .where('name', '<=', fin)
        .limit(8)
        .get();
      const results: Farmacia[] = snap.docs.map(doc => {
        const data = doc.data();
        // Convierte los turnos a array de Date o null
        let turnArr: (Date | null)[] = [];
        if (Array.isArray(data.turn)) {
          turnArr = data.turn.map((t: any) =>
            t && typeof t.toDate === 'function'
              ? t.toDate()
              : (t instanceof Date ? t : null)
          );
        }
        return {
          id: doc.id,
          name: data.name,
          turn: turnArr
        };
      });
      setFarmacias(results);
    } catch (e) {
      setFarmacias([]);
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar una farmacia y cargar los turnos
  const handleSelectFarmacia = (farmacia: Farmacia) => {
    setFarmaciaSeleccionada(farmacia);
    setTurnos(farmacia.turn && farmacia.turn.length > 0 ? farmacia.turn : []);
  };

  // Acciones sobre turnos
  const addTurno = () => setTurnos(prev => [...prev, null]);
  const setTurno = (idx: number, fecha: Date) =>
    setTurnos(prev => prev.map((t, i) => i === idx ? fecha : t));
  const removeTurno = (idx: number) =>
    setTurnos(prev => prev.filter((_, i) => i !== idx));

  // Guardar todos los turnos en Firebase
  const guardarTurnos = async () => {
    if (!farmaciaSeleccionada) {
      Alert.alert('Selecciona una farmacia');
      return;
    }
    if (turnos.some(t => !t)) {
      Alert.alert('Error', 'Todos los turnos deben tener fecha y hora.');
      return;
    }
    setLoading(true);
    try {
      await firestore()
        .collection('farmacias')
        .doc(farmaciaSeleccionada.id)
        .update({ turn: turnos }); // Firebase convierte Date[] a Timestamp[]
      Alert.alert('¡Listo!', `Turnos actualizados para "${farmaciaSeleccionada.name}"`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[{backgroundColor: colors.background},styles.scrollContainer]}>
      <View style={styles.form}>
        <Text style={styles.titulo}>Editar turnos de una farmacia</Text>
        <TextInput
          style={styles.inputId}
          placeholder="Buscar farmacia por nombre"
          value={busqueda}
          onChangeText={text => {
            setBusqueda(text);
            buscarFarmaciasPorNombre(text);
          }}
          autoCapitalize="words"
        />
        {!loading && farmacias.length > 0 && (
          <FlatList
            data={farmacias}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.suggestionItem,
                  farmaciaSeleccionada?.id === item.id && styles.suggestionItemActive
                ]}
                onPress={() => handleSelectFarmacia(item)}
              >
                <Text style={{
                  color: farmaciaSeleccionada?.id === item.id ? '#fff' : '#333'
                }}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 140, marginBottom: 12 }}
          />
        )}
        {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}
        {farmaciaSeleccionada && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              color: '#28a745', fontWeight: 'bold', fontSize: 16, marginBottom: 8
            }}>
              Farmacia seleccionada: {farmaciaSeleccionada.name.charAt(0).toUpperCase() + farmaciaSeleccionada.name.slice(1)}
            </Text>
            <Text style={{ marginBottom: 4, color: '#2d6cdf', fontWeight: 'bold' }}>
              Turnos:
            </Text>
            {turnos.map((fecha, idx) => (
              <View key={idx} style={styles.turnoRow}>
                <PickerTurno
                  value={fecha}
                  onChange={date => setTurno(idx, date)}
                  label="Seleccionar fecha y hora"
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeTurno(idx)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>🗑</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={addTurno}>
              <Text style={{ color: '#2d6cdf', fontWeight: 'bold' }}>+ Agregar turno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={guardarTurnos}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Guardar turnos</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 32 },
  form: {
    //backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  inputId: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 16,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  suggestionItemActive: {
    backgroundColor: '#2d6cdf',
  },
  turnoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    padding: 6,
    marginLeft: 4,
  },
  addBtn: {
    marginVertical: 8,
    alignSelf: 'flex-start'
  },
  button: {
    backgroundColor: '#2d6cdf',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    minWidth: 120,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default AdminCambiarTurnoFarmacia;
