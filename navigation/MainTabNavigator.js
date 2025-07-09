import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfilePage from "../app/profile/ProfilePage";
import { StyleSheet, View } from "react-native";
import Home from "../app/Home";
import StudyPage from "../app/study/StudyPage";
import { AITutor } from "../components/AITutor";
import ProcessPage from "../app/process/ProcessPage";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        unmountOnBlur: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }
          else if (route.name === "Study") {
            iconName = focused ? "book" : "book-outline";
          }
          else if (route.name === "Progress") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "AI Tutor") {
            iconName = focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={iconName}
                size={20}
                color={color}
                style={styles.icon}
              />
            </View>
          );
        },
        tabBarActiveTintColor: "#0078d7",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 9, marginTop: 0 },
        tabBarStyle: { height: 50, paddingVertical: 8 },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="Study" component={StudyPage} options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="Progress" component={ProcessPage} options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="AI Tutor" component={AITutor} options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="Profile" component={ProfilePage} options={{ unmountOnBlur: true }}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIcon: {
    backgroundColor: "#e6f2ff",
  },
});
