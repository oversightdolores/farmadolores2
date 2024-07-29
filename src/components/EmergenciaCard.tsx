import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

type Emergencia = {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  imagen: string;
  descripcion: string;
};

type EmergenciaCardProps = {
  item: Emergencia;
  onPress: (item: Emergencia) => void;
};

const EmergenciaCard: React.FC<EmergenciaCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const { colors } = theme;
  const { nombre, direccion, telefono, imagen, descripcion } = item;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { emergencia: item })}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Image source={{ uri: imagen }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{nombre}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Dirección: {direccion}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Teléfono: {telefono}</Text>
          <Text style={[styles.info, { color: colors.text }]}>Descripción: {descripcion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
});

export default EmergenciaCard;
