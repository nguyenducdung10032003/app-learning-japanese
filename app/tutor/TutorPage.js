import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AITutor } from '../../components/AITutor';
import Header from '../../components/Header';

import LinearGradient from 'react-native-linear-gradient';
import { useColorScheme } from 'react-native';

export default function TutorPage() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0f172a', '#111827'] : ['#ffffff', '#fff0f5']}
      style={styles.container}
    >
      <Header />
      <View style={styles.main}>
        <AITutor />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    padding: 16,
  },
});
