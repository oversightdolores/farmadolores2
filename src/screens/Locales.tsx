import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Local } from '../types/navigationTypes';
import { useTheme } from '../context/ThemeContext';
import AdBanner from '../components/ads/AdBanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';

type LocalesListScreenNavigationProp = NavigationProp<RootStackParamList, 'LocalDetail'>;


const LocalesListScreen: React.FC = () => {
  const [locales, setLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<LocalesListScreenNavigationProp>();
  const { theme } = useTheme();
  const { colors } = theme;

  useEffect(() => {
    const snapshot = firestore().collection('publi').onSnapshot((querySnapshot) => {
      const localesData: Local[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Local;
        return {
          id: doc.id,
          name: data.name || '',
          descrip: data.descrip || '',
          image: data.image,
          direccion: data.direccion || '',
          tel: data.tel || '',
          url: data.url || '',
        };
      });
      setLocales(localesData);
      setLoading(false);
    })

    return () => snapshot();
  }, []);

  const renderItem = ({ item }: { item: Local }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('LocalDetail', { local: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.descrip, { color: colors.text }]}>{item.descrip}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <>
    <FlatList
      data={locales}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      />
       <AdBanner size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </>
  );
};

export default LocalesListScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descrip: {
    fontSize: 14,
  },
});
