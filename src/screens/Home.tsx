import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Turno from '../components/Turno';
import AdScreen from '../components/ads/AdScreen';
import AdBanner from '../components/ads/AdBanner';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes'; // Asegúrate de que la ruta sea correcta
import { BannerAdSize } from 'react-native-google-mobile-ads';
import SkeletonCard from '../skeleton/SkeletonCard';
import { usePharmacies } from '../context/PharmacyContext';


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
 const { loading } = usePharmacies();
  const { theme } = useTheme();
  const { colors } = theme;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handlePress = () => {
    navigation.navigate('PrimeroAuxilios'); // Asegúrate de que 'PrimerosAuxilios' sea el nombre correcto de tu pantalla en la navegación
  };
  const localesPress = () => {
    navigation.navigate('Local'); // Asegúrate de que 'Locales' sea el nombre correcto de tu pantalla en la navegación
  };
 

  return (
    <>
      <AdBanner size={BannerAdSize.FULL_BANNER} />
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
    { loading ? (
      <SkeletonCard />
    ) : (
        <>
      <Turno />

        </>
      )}
      <View style={styles.container}>
      <TouchableOpacity
          style={[styles.button, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={handlePress}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Ver Primeros Auxilios
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={localesPress}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Ver Locales
          </Text>
        </TouchableOpacity>
      </View>
      <AdScreen /> 
      </>

);
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: '90%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
