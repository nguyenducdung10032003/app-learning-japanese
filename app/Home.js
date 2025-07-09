import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import GameDashboard from "../components/GameDashboard";
import Header from "../components/Header";

export default function 

() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <GameDashboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
});
