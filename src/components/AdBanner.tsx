import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const AdBanner = () => {
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId="ca-app-pub-1460570234418559/3397663182"
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default AdBanner;
