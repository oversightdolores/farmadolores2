import React from 'react';
import { StyleSheet, View, FlatList, Text, Button } from 'react-native';
import FarmaciaCard from '../components/FarmaciaCard'; // Asegúrate de ajustar la ruta de importación según sea necesario
import AdBanner from '../components/AdBanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import SkeletonCard from '../skeleton/SkeletonCard'; // Asegúrate de ajustar la ruta de importación según sea necesario
import { usePharmacies } from '../context/PharmacyContext';

const Farmacias: React.FC = () => {
  const { farmacias, loading } = usePharmacies();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <FlatList
          data={Array(5).fill({})} // Array de 5 elementos vacíos para mostrar los SkeletonCard
          renderItem={() => <SkeletonCard />}
          keyExtractor={(_, index) => index.toString()}
        />
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
    <>
      <AdBanner size={BannerAdSize.FULL_BANNER} />
      <View style={styles.container}>
        <FlatList
          data={farmacias}
          renderItem={({ item }) => <FarmaciaCard item={item} onPress={() => {}} />}
          keyExtractor={item => item.id}
        />
      </View>
    </>
  );
};

export default Farmacias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
