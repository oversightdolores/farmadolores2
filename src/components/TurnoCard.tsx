import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList, Farmacia } from '../types/navigationTypes';
import { DateTime } from 'luxon';

function printFranjas(franjas: { abre: string, cierra: string }[]) {
  if (!franjas || !franjas.length) return "Cerrado";
  return franjas.map(f =>
    `${f.abre} - ${f.cierra}`
  ).join(" / ");
}

type TurnoCardProps = {
  item: Farmacia;
  onPress?: (item: Farmacia) => void;
};

const DIAS = [
  'domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'
];

const TurnoCard: React.FC<TurnoCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const { colors } = theme;

  // Día actual, ajustado a Argentina.
  const ahora = DateTime.local().setZone('America/Argentina/Buenos_Aires');
  const diaHoy = DIAS[ahora.weekday % 7]; // luxon: domingo=7

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Lógica para horarios nuevos (por día)
  let diaNombre = capitalize(diaHoy);
  let hoyFranjas: { abre: string, cierra: string }[] = [];
  if (item.horarios && typeof item.horarios === 'object' && item.horarios[diaHoy]) {
    hoyFranjas = item.horarios[diaHoy];
  }

  // Lógica para horarios viejos (Mañana/Tarde)
  const formatHora = (t: any) => {
    try {
      return t?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "-";
    }
  };

  const mostrarHorarios = () => {
    if (hoyFranjas && hoyFranjas.length) {
      return (
        <Text style={[styles.info, { color: colors.text }]}>
          <Text style={{ fontWeight: 'bold' }}>
            Horarios de {diaNombre}:
          </Text> {printFranjas(hoyFranjas)}
        </Text>
      );
    }
    // Si NO hay franjas nuevas, muestra los horarios viejos:
    return (
      <>
        <Text style={[styles.info, { color: colors.text }]}>
          <Text style={{ fontWeight: 'bold' }}>Mañana:</Text> {formatHora(item.horarioAperturaMañana)} - {formatHora(item.horarioCierreMañana)}
        </Text>
        <Text style={[styles.info, { color: colors.text }]}>
          <Text style={{ fontWeight: 'bold' }}>Tarde:</Text> {formatHora(item.horarioAperturaTarde)} - {formatHora(item.horarioCierreTarde)}
        </Text>
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={() =>  navigation.navigate('Detail', { farmacia: item })}
      activeOpacity={0.88}
    >
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor:'#000' }]}>
        <Image source={{ uri: item.detail || item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Dirección: {item.dir}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Teléfono: {item.tel}</Text>
          <Text style={[styles.subTitle, { color: colors.primary, marginTop: 7, marginBottom: 3 }]}>
            Horario de turno:
          </Text>
          {mostrarHorarios()}
        </View>
        <View style={[styles.turnoBadge, { backgroundColor: colors.success || '#28a745' }]}>
          <Text style={styles.turnoText}>De Turno</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TurnoCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    margin: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#e6e6e6',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  info: {
    fontSize: 15,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  turnoBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 2,
  },
  turnoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1.2,
  },
});
