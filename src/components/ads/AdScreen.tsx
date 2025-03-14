import React, { useEffect } from 'react';
import { Alert, Button, View } from 'react-native';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = 'ca-app-pub-2226872749228128/2550937874';
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const showInterstitialAd = () => {
  interstitial.load();
  interstitial.show();
};

const AdScreen = () => {
    useEffect(() => {
        const ad = InterstitialAd.createForAdRequest(adUnitId);
    
        const handleAdLoaded = () => {
          console.log('Interstitial ad loaded');
          ad.show(); // Muestra el anuncio intersticial
        };
    
        const handleAdClosed = () => {
          console.log('Interstitial ad closed');
          // No es necesario destruir el anuncio, se liberará automáticamente
        };
    
        ad.addAdEventListener(AdEventType.LOADED, handleAdLoaded);
        ad.addAdEventListener(AdEventType.CLOSED, handleAdClosed);
    
        ad.load(); // Carga el anuncio intersticial
    
        return () => {
          ad.removeAllListeners(); // Limpia los listeners al desmontar el componente
        };
      }, []);
    
      return null;
    };

export default AdScreen;
