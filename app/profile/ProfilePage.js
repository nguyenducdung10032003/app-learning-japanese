// screens/ProfilePage.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserPassword } from "../../utils/storage";


const ProfilePage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [difficulty, setDifficulty] = useState("adaptive");
  const [currentLevel, setCurrentLevel] = useState("n5");
  const [learningGoal, setLearningGoal] = useState("daily");
  const [soundEffects, setSoundEffects] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [achievementNotifs, setAchievementNotifs] = useState(true);
  const [contentAlerts, setContentAlerts] = useState(true);
  const { user, setUser, db } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Cập nhật context
        setName(parsedUser.name || "");
        setUsername(parsedUser.username || "");
        setEmail(parsedUser.email || "");
        setBio(parsedUser.bio || "");

        if (parsedUser.preferences) {
          const prefs = parsedUser.preferences;
          setDifficulty(prefs.difficulty || "adaptive");
          setCurrentLevel(prefs.currentLevel || "n5");
          setLearningGoal(prefs.learningGoal || "daily");
          setSoundEffects(prefs.soundEffects ?? true);
          setShowRomaji(prefs.showRomaji ?? true);
          setShowTranslations(prefs.showTranslations ?? true);
          setDailyReminders(prefs.dailyReminders ?? true);
          setAchievementNotifs(prefs.achievementNotifs ?? true);
          setContentAlerts(prefs.contentAlerts ?? true);
        }
      }
    };

    loadUser();
  }, []);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const storedUser = JSON.parse(await AsyncStorage.getItem("user"));

      if (storedUser?.password !== currentPassword) {
        Alert.alert("Lỗi", "Mật khẩu hiện tại không đúng");
        setIsUpdatingPassword(false);
        return;
      }

      const updatedUser = { ...storedUser, password: newPassword };

      await updateUserPassword(storedUser.id, newPassword);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(updatedUser);
      Alert.alert("Thành công", "Cập nhật mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Failed to update password:", error);
      Alert.alert("Lỗi", "Đổi mật khẩu thất bại");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = {
        ...user,
        name,
        username,
        email,
        bio,
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleSavePreferences = async () => {
    try {
      const updatedUser = {
        ...user,
        preferences: {
          difficulty,
          currentLevel,
          learningGoal,
          soundEffects,
          showRomaji,
          showTranslations,
          dailyReminders,
          achievementNotifs,
          contentAlerts,
        },
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      Alert.alert("Success", "Preferences updated successfully");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      Alert.alert("Error", "Failed to update preferences");
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>プロフィール</Text>
          <Text style={styles.headerSubtitle}>
            Manage your profile and preferences
          </Text>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "profile" && styles.activeTab]}
              onPress={() => setActiveTab("profile")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "profile" && styles.activeTabText,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "preferences" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("preferences")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "preferences" && styles.activeTabText,
                ]}
              >
                Preferences
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "profile" && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Profile Information</Text>
                <Text style={styles.cardDescription}>
                  Update your personal information
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your username"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your email"
                    value={email || user?.email || ""}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Bio</Text>
                  <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Tell us about yourself"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Account Settings</Text>
                <Text style={styles.cardDescription}>
                  Manage your account details
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Current Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    isUpdatingPassword && styles.disabledButton,
                  ]}
                  onPress={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                >
                  <Text style={styles.buttonText}>
                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === "preferences" && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Game Preferences</Text>
                <Text style={styles.cardDescription}>
                  Customize your learning experience
                </Text>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Game Difficulty</Text>
                    <Text style={styles.switchDescription}>
                      Adjust the difficulty of games
                    </Text>
                  </View>
                  <View style={styles.picker}>
                    <Text style={styles.pickerText}>
                      {difficulty === "easy"
                        ? "Easy"
                        : difficulty === "medium"
                        ? "Medium"
                        : difficulty === "hard"
                        ? "Hard"
                        : "Adaptive"}
                    </Text>
                    <View style={styles.pickerOptions}>
                      <TouchableOpacity
                        onPress={() => setDifficulty("easy")}
                        style={difficulty === "easy" && styles.selectedOption}
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            difficulty === "easy" && styles.selectedOptionText,
                          ]}
                        >
                          Easy
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setDifficulty("medium")}
                        style={difficulty === "medium" && styles.selectedOption}
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            difficulty === "medium" &&
                              styles.selectedOptionText,
                          ]}
                        >
                          Medium
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setDifficulty("hard")}
                        style={difficulty === "hard" && styles.selectedOption}
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            difficulty === "hard" && styles.selectedOptionText,
                          ]}
                        >
                          Hard
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setDifficulty("adaptive")}
                        style={
                          difficulty === "adaptive" && styles.selectedOption
                        }
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            difficulty === "adaptive" &&
                              styles.selectedOptionText,
                          ]}
                        >
                          Adaptive
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Current Level</Text>
                    <Text style={styles.switchDescription}>
                      Set your current Japanese proficiency level
                    </Text>
                  </View>
                  <View style={styles.picker}>
                    <Text style={styles.pickerText}>
                      {currentLevel.toUpperCase()}
                    </Text>
                    <View style={styles.pickerOptions}>
                      {["n5", "n4", "n3", "n2", "n1"].map((level) => (
                        <TouchableOpacity
                          key={level}
                          onPress={() => setCurrentLevel(level)}
                          style={
                            currentLevel === level && styles.selectedOption
                          }
                        >
                          <Text
                            style={[
                              styles.pickerOption,
                              currentLevel === level &&
                                styles.selectedOptionText,
                            ]}
                          >
                            {level.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Learning Goal</Text>
                    <Text style={styles.switchDescription}>
                      Set your daily learning goal
                    </Text>
                  </View>
                  <View style={styles.picker}>
                    <Text style={styles.pickerText}>
                      {learningGoal === "casual"
                        ? "Casual"
                        : learningGoal === "regular"
                        ? "Regular"
                        : "Daily"}
                    </Text>
                    <View style={styles.pickerOptions}>
                      <TouchableOpacity
                        onPress={() => setLearningGoal("casual")}
                        style={
                          learningGoal === "casual" && styles.selectedOption
                        }
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            learningGoal === "casual" &&
                              styles.selectedOptionText,
                          ]}
                        >
                          Casual
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setLearningGoal("regular")}
                        style={
                          learningGoal === "regular" && styles.selectedOption
                        }
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            learningGoal === "regular" &&
                              styles.selectedOptionText,
                          ]}
                        >
                          Regular
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setLearningGoal("daily")}
                        style={
                          learningGoal === "daily" && styles.selectedOption
                        }
                      >
                        <Text
                          style={[
                            styles.pickerOption,
                            learningGoal === "daily" &&
                              styles.selectedOptionText,
                          ]}
                        >
                          Daily
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Sound Effects</Text>
                    <Text style={styles.switchDescription}>
                      Enable sound effects in games
                    </Text>
                  </View>
                  <Switch
                    value={soundEffects}
                    onValueChange={setSoundEffects}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Show Romaji</Text>
                    <Text style={styles.switchDescription}>
                      Display romaji alongside Japanese text
                    </Text>
                  </View>
                  <Switch value={showRomaji} onValueChange={setShowRomaji} />
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Show English Translations</Text>
                    <Text style={styles.switchDescription}>
                      Display English translations
                    </Text>
                  </View>
                  <Switch
                    value={showTranslations}
                    onValueChange={setShowTranslations}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSavePreferences}
                >
                  <Text style={styles.buttonText}>Save Preferences</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Notification Settings</Text>
                <Text style={styles.cardDescription}>
                  Manage your notification preferences
                </Text>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Daily Reminders</Text>
                    <Text style={styles.switchDescription}>
                      Receive daily study reminders
                    </Text>
                  </View>
                  <Switch
                    value={dailyReminders}
                    onValueChange={setDailyReminders}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Achievement Notifications</Text>
                    <Text style={styles.switchDescription}>
                      Get notified when you earn achievements
                    </Text>
                  </View>
                  <Switch
                    value={achievementNotifs}
                    onValueChange={setAchievementNotifs}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>New Content Alerts</Text>
                    <Text style={styles.switchDescription}>
                      Get notified about new games and lessons
                    </Text>
                  </View>
                  <Switch
                    value={contentAlerts}
                    onValueChange={setContentAlerts}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSavePreferences}
                >
                  <Text style={styles.buttonText}>
                    Save Notification Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4a90e2",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4a90e2",
    fontWeight: "bold",
  },
  tabContent: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#4a90e2",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    minWidth: 80,
  },
  outlineButtonText: {
    color: "#4a90e2",
    fontSize: 14,
    fontWeight: "500",
  },
  destructiveButton: {
    backgroundColor: "#ff4444",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  destructiveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  destructiveText: {
    color: "#ff4444",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  dataOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  picker: {
    alignItems: "flex-end",
  },
  pickerText: {
    fontSize: 16,
    color: "#4a90e2",
    fontWeight: "500",
    marginBottom: 8,
  },
  pickerOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: 250,
  },
  pickerOption: {
    padding: 8,
    marginLeft: 8,
    marginBottom: 8,
    color: "#666",
  },
  selectedOption: {
    backgroundColor: "#4a90e2",
    borderRadius: 6,
  },
  selectedOptionText: {
    color: "#fff",
  },
});
export default ProfilePage;
