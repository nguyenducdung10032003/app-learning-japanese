import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
// Tạm định nghĩa setImmediate nếu chưa có
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => {
    return setTimeout(fn, 0, ...args);
  };
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
const styles = StyleSheet.create({});
