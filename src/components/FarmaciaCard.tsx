import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { DateTime } from 'luxon';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { NavigationProp } from '@react-navigation/native';

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
  turn: any; // Puede ajustar esto según sea necesario
};

type Status = 'Abierto' | 'Cierra Pronto' | 'Cerrado';

type FarmaciaCardProps = {
  item: Farmacia;
  onPress: (item: Farmacia) => void;
};

const FarmaciaCard: React.FC<FarmaciaCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { name, dir, tel, horarioAperturaMañana, horarioCierreMañana, horarioAperturaTarde, horarioCierreTarde, detail } = item;
  const [status, setStatus] = useState<Status>('Cerrado');

  const getCurrentStatus = () => {
    if (
      !horarioAperturaMañana ||
      !horarioCierreMañana ||
      !horarioAperturaTarde ||
      !horarioCierreTarde
    ) {
      return 'Cerrado';
    }

    const now = DateTime.local().setZone('America/Argentina/Buenos_Aires');

    const aperturaMañana = DateTime.fromFormat(horarioAperturaMañana, 'HH:mm', { zone: 'America/Argentina/Buenos_Aires' });
    const cierreMañana = DateTime.fromFormat(horarioCierreMañana, 'HH:mm', { zone: 'America/Argentina/Buenos_Aires' });
    const aperturaTarde = DateTime.fromFormat(horarioAperturaTarde, 'HH:mm', { zone: 'America/Argentina/Buenos_Aires' });
    const cierreTarde = DateTime.fromFormat(horarioCierreTarde, 'HH:mm', { zone: 'America/Argentina/Buenos_Aires' });

    const minutosAntesDeCerrar = 30;
    const cierraProntoMañana = cierreMañana.minus({ minutes: minutosAntesDeCerrar });
    const cierraProntoTarde = cierreTarde.minus({ minutes: minutosAntesDeCerrar });

    if ((now >= aperturaMañana && now < cierraProntoMañana) || (now >= aperturaTarde && now < cierraProntoTarde)) {
      return 'Abierto';
    } else if ((now >= cierraProntoMañana && now < cierreMañana) || (now >= cierraProntoTarde && now < cierreTarde)) {
      return 'Cierra Pronto';
    } else {
      return 'Cerrado';
    }
  };

  useEffect(() => {
    setStatus(getCurrentStatus());
    const intervalId = setInterval(() => {
      setStatus(getCurrentStatus());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [horarioAperturaMañana, horarioCierreMañana, horarioAperturaTarde, horarioCierreTarde]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { farmacia: item })}>
      <View style={styles.card}>
        <Image source={{ uri: detail }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>Dirección: {dir}</Text>
          <Text style={styles.info}>Teléfono: {tel}</Text>
          <Text style={styles.info}>Horario Mañana: {horarioAperturaMañana} - {horarioCierreMañana}</Text>
          <Text style={styles.info}>Horario Tarde: {horarioAperturaTarde} - {horarioCierreTarde}</Text>
        </View>
        <View style={[styles.statusBadge, statusStyles[status]]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FarmaciaCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    margin: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const statusStyles = StyleSheet.create({
  Abierto: {
    backgroundColor: '#28a745',
  },
  'Cierra Pronto': {
    backgroundColor: '#ffc107',
  },
  Cerrado: {
    backgroundColor: '#dc3545',
  },
});
