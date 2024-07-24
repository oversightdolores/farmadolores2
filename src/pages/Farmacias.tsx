import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Button } from 'react-native';
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
        setLoading(false);
      }
    };

    fetchFarmacias();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
});
