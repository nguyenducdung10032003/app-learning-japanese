import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage khi khởi động app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Đăng nhập giả lập
  const login = async (email, password) => {
    try {
      // Kiểm tra tài khoản hardcoded
      const defaultUser = {
        id: 1,
        email: "ndd789@gmail.com",
        password: "Dung123@",
        name: "Nguyen Dung",
        preferences: {
          difficulty: "adaptive",
          currentLevel: "n5",
        },
      };

      if (email === defaultUser.email && password === defaultUser.password) {
        await AsyncStorage.setItem("user", JSON.stringify(defaultUser));
        setUser(defaultUser);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // Đăng xuất
  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
