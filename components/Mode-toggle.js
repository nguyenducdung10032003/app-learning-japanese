import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
 // Đảm bảo bạn đã có component Button tương thích RN

export default function ModeToggle() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light');
  const [modalVisible, setModalVisible] = useState(false);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setModalVisible(false);
    // Ở đây bạn có thể lưu theme preference vào AsyncStorage nếu cần
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={styles.toggleButton}
      >
        {theme === 'dark' ? (
          <Moon size={20} color="white" />
        ) : (
          <Sun size={20} color="black" />
        )}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Pressable 
              style={styles.menuItem}
              onPress={() => handleThemeChange('light')}
            >
              <Sun size={16} style={styles.icon} />
              <Text style={styles.menuText}>Light</Text>
            </Pressable>
            <Pressable 
              style={styles.menuItem}
              onPress={() => handleThemeChange('dark')}
            >
              <Moon size={16} style={styles.icon} />
              <Text style={styles.menuText}>Dark</Text>
            </Pressable>
            <Pressable 
              style={styles.menuItem}
              onPress={() => handleThemeChange(systemTheme)}
            >
              <Text style={styles.menuText}>System</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});