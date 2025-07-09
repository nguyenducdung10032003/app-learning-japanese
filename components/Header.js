import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setUser(null);
    Alert.alert("Đã đăng xuất", "Bạn đã được đăng xuất.");
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Japanese Grammar</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f7f9fc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logout: {
    fontSize: 14,
    color: "#ef4444",
  },
});
