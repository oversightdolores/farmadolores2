import React from 'react';
import { StyleSheet, Text, View, Image, Button, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { useTheme } from '../context/ThemeContext';
import AdBanner from '../components/ads/AdBanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';

type LocalDetailScreenRouteProp = RouteProp<RootStackParamList, 'LocalDetail'>;

const LocalDetailScreen: React.FC = () => {
  const route = useRoute<LocalDetailScreenRouteProp>();
  const { local } = route.params;
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: local.image }} style={styles.image} />
      <Text style={[styles.name, { color: colors.text }]}>{local.name}</Text>
      <Text style={[styles.descrip, { color: colors.text }]}>{local.descrip}</Text>
      <Text style={[styles.direccion, { color: colors.text }]}>{local.direccion}</Text>
      <Text style={[styles.tel, { color: colors.text }]}>{local.tel}</Text>
      <Button title="Visitar" color={colors.primary} onPress={() => Linking.openURL(local.url)} />
    </View>
    <AdBanner size={BannerAdSize.FULL_BANNER} />
    </>
  );
};

export default LocalDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  descrip: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  direccion: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  tel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
