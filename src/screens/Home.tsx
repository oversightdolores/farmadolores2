import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Turno from '../components/Turno'
import Farmacias from './Farmacias'
import { useTheme } from '../context/ThemeContext'
import AdScreen from '../components/AdScreen'
import AdBanner from '../components/AdBanner'

const Home = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <>
    <AdBanner />
     <StatusBar 
        backgroundColor={colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Turno  />

    <AdScreen />
      
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',

  },
 

})