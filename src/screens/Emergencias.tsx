import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { useTheme } from '../context/ThemeContext';
import AdBanner from '../components/AdBanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import EmergenciaCard from '../components/EmergenciaCard';
type Emergencia = {
  id: string;
  name: string;
  dir: string;
  tel: string;
  image: string;
  detail: string;
  gps: GeoPoint;
};



type EmergenciasNavigationProp = NavigationProp<RootStackParamList, 'Emergencias'>;

type Props = {
  navigation: EmergenciasNavigationProp;
};

const Emergencias: React.FC<Props> = () => {
  const navigation = useNavigation<EmergenciasNavigationProp>();
  const [emergencias, setEmergencias] = useState<Emergencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = firestore().collection('emergencias').onSnapshot(snapshot => {
      const emergenciaList: Emergencia[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          dir: data.dir || '',
          tel: data.tel || '',
          image: data.image || '',
          detail: data.detail || '',
          gps: data.gps || '',
        };
      });

      setEmergencias(emergenciaList);
      setLoading(false);
    }, error => {
      console.error("Error fetching emergencias: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handlePress = (item: Emergencia) => {
    navigation.navigate('DetailScreen', item);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
    <AdBanner size={BannerAdSize.FULL_BANNER} />
    <View style={styles.container}>
      <FlatList
        data={emergencias}
        renderItem={({ item }) => <EmergenciaCard item={item} onPress={handlePress} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        />
    </View>
        </>
  );
};

export default Emergencias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 20,
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
