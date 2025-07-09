import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DateTime } from 'luxon';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList, Farmacia as FarmaciaType } from '../types/navigationTypes';
import { NavigationProp } from '@react-navigation/native';

type Status = 'Abierto' | 'CierraPronto' | 'Cerrado';

const ZONA = 'America/Argentina/Buenos_Aires';
const AVISO_MINUTOS = 30;
const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

function getHoyInfo(horarios: any) {
  const now = DateTime.local().setZone(ZONA);
  const diaIndex = now.weekday - 1; // 0 (lunes) - 6 (domingo)
  const diaNombre = DIAS[diaIndex];
  return {
    diaNombre,
    franjas: (horarios && horarios[diaNombre]) || [],
  };
}

function getStatus(horarios: any): Status {
  const now = DateTime.local().setZone(ZONA);
  const { franjas } = getHoyInfo(horarios);

  for (const franja of franjas) {
    if (!franja.abre || !franja.cierra) continue;
    const [ah, am] = franja.abre.split(':').map(Number);
    const [ch, cm] = franja.cierra.split(':').map(Number);

    let abre = now.set({ hour: ah, minute: am, second: 0, millisecond: 0 });
    let cierra = now.set({ hour: ch, minute: cm, second: 0, millisecond: 0 });

    // Si cierra después de las 00:00, sumarle un día
    if (cierra <= abre) cierra = cierra.plus({ days: 1 });

    if (now >= abre && now < cierra) {
      if (now >= cierra.minus({ minutes: AVISO_MINUTOS })) return "CierraPronto";
      return "Abierto";
    }
  }
  return "Cerrado";
}

function printFranjas(franjas: { abre: string, cierra: string }[]) {
  if (!franjas.length) return "Cerrado";
  return franjas.map(f =>
    `${f.abre} - ${f.cierra}`
  ).join(" / ");
}

type FarmaciaCardProps = {
  item: FarmaciaType & { horarios?: any };
  onPress?: (item: FarmaciaType) => void;
};

const statusStyles = StyleSheet.create({
  Abierto: { backgroundColor: '#28a745' },
  CierraPronto: { backgroundColor: '#ffc107' },
  Cerrado: { backgroundColor: '#dc3545' },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    margin: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
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

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const FarmaciaCard: React.FC<FarmaciaCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const { colors } = theme;
  const { name, dir, tel, detail, horarios } = item as any;

  const [status, setStatus] = useState<Status>('Cerrado');
  const [diaNombre, setDiaNombre] = useState('');
  const [hoyFranjas, setHoyFranjas] = useState<{ abre: string, cierra: string }[]>([]);

  useEffect(() => {
    const update = () => {
      setStatus(getStatus(horarios));
      const { diaNombre, franjas } = getHoyInfo(horarios);
      setDiaNombre(diaNombre);
      setHoyFranjas(franjas);
    };
    update();
    const intervalId = setInterval(update, 30 * 1000);
    return () => clearInterval(intervalId);
  }, [horarios]);

  return (
    <TouchableOpacity
      onPress={() =>  navigation.navigate('Detail', { farmacia: item })}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Image source={{ uri: detail }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Dirección: {dir}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Teléfono: {tel}</Text>
          <Text style={[styles.info, { color: colors.text }]}>
            <Text style={{ fontWeight: 'bold' }}>
              Horarios de {capitalize(diaNombre)}:
            </Text> {printFranjas(hoyFranjas)}
          </Text>
        </View>
        <View style={[styles.statusBadge, statusStyles[status]]}>
          <Text style={styles.statusText}>{status === 'CierraPronto' ? 'Cierra Pronto' : status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FarmaciaCard;
