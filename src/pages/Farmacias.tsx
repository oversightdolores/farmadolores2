import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Text, Button } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import FarmaciaCard from '../components/FarmaciaCard'; // Asegúrate de ajustar la ruta de importación según sea necesario

type Farmacia = {
  id: string;
  name: string;
  dir: string;
  tel: string;
  horarioAperturaMañana: string;
  horarioCierreMañana: string;
  horarioAperturaTarde: string;
  horarioCierreTarde: string;
  image: string;
  detail: string;
  turn: FirebaseFirestoreTypes.Timestamp[];
};

// Función para verificar si un valor es Timestamp
const isTimestamp = (value: any): value is FirebaseFirestoreTypes.Timestamp => {
  return value instanceof firestore.Timestamp;
};

// Función para formatear el tiempo
const formatTime = (timestamp: FirebaseFirestoreTypes.Timestamp | string): string => {
  if (isTimestamp(timestamp)) {
    return timestamp.toDate().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }
  return timestamp;
};

const Farmacias: React.FC = () => {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmacias = async () => {
      try {
        const snapshot = await firestore().collection('farmacias').get();
        const fetchedFarmacias: Farmacia[] = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<Farmacia, 'id'> & { turn: FirebaseFirestoreTypes.Timestamp[] };
          return {
            ...data,
            id: doc.id,
            horarioAperturaMañana: formatTime(data.horarioAperturaMañana),
            horarioCierreMañana: formatTime(data.horarioCierreMañana),
            horarioAperturaTarde: formatTime(data.horarioAperturaTarde),
            horarioCierreTarde: formatTime(data.horarioCierreTarde),
          };
        });

        setFarmacias(fetchedFarmacias);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching farmacias: ", error);
        setError("Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchFarmacias();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={() => setError(null)} />
      </View>
    );
  }

  if (farmacias.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay farmacias disponibles en este momento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={farmacias}
        renderItem={({ item }) => <FarmaciaCard item={item} onPress={() => {}} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Farmacias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
