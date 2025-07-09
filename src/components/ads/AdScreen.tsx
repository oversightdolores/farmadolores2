// src/components/AdScreen.js
import React, { useEffect } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Reemplaza por tu ID de interstitial real
const adUnitId = 'ca-app-pub-2226872749228128/7318943549';

const AdScreen = () => {
  useEffect(() => {
    // Creamos el anuncio. Google decide qué mostrar según usuario, sin que vos tengas que hacer nada.
    const ad = InterstitialAd.createForAdRequest(adUnitId);

    // Manejamos evento de "cargado"
    const handleAdLoaded = () => {
      ad.show();
    };

    ad.addAdEventListener(AdEventType.LOADED, handleAdLoaded);

    // Cargamos el anuncio (solo una vez)
    ad.load();

    // Limpiamos listeners cuando desmonta
    return () => {
      ad.removeAllListeners();
    };
  }, []);

  return null; // Este componente no muestra nada visual, solo lanza el interstitial
};

export default AdScreen;
