import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "users";
const PREFS_KEY = "preferences";

export const getAllUsers = async () => {
  const users = await AsyncStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = async (users) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getPreferences = async () => {
  const prefs = await AsyncStorage.getItem(PREFS_KEY);
  return prefs ? JSON.parse(prefs) : [];
};

export const savePreferences = async (prefs) => {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
};

export const addUser = async (email, password) => {
  const users = await getAllUsers();
  const newUser = {
    id: Date.now(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};

export const addPreferences = async (userId) => {
  const prefs = await getPreferences();
  const newPref = {
    userId,
    difficulty: "adaptive",
    currentLevel: "n5",
    learningGoal: "daily",
    soundEffects: true,
    showRomaji: true,
    showTranslations: true,
    dailyReminders: true,
    achievementNotifs: true,
    contentAlerts: true,
  };
  prefs.push(newPref);
  await savePreferences(prefs);
  return newPref;
};

export const getUserByEmailPassword = async (email, password) => {
  const usersJson = await AsyncStorage.getItem("users");
  const users = usersJson ? JSON.parse(usersJson) : [];
  return users.find(
    (u) =>
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );
};

export const getUserPreferences = async (userId) => {
  const prefs = await getPreferences();
  return prefs.find((p) => p.userId === userId);
};

export const checkEmailExists = async (email) => {
  const users = await getAllUsers();
  return users.some((u) => u.email === email);
};

export const updateUserPassword = async (userId, newPassword) => {
  const users = await getAllUsers();
  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      return { ...user, password: newPassword };
    }
    return user;
  });

  await saveUsers(updatedUsers);
};
