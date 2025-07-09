// screens/Admin/QuestionManagement.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { readLocalData } from '../../database/localDatabase';
import { questions } from '../../data/questionsData';

const QuestionManagement = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const loadedQuestions = await readLocalData('@local/quiz_questions');
      setQuestions(loadedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    navigation.navigate('EditQuestion', { question });
  };

  const handleDeleteQuestion = (id) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa câu hỏi này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', onPress: () => deleteQuestion(id) },
      ]
    );
  };

  const deleteQuestion = async (id) => {
    try {
      const updatedQuestions = questions.filter(q => q.id !== id);
      await AsyncStorage.setItem('@local/quiz_questions', JSON.stringify(updatedQuestions));
      setQuestions(updatedQuestions);
      Alert.alert('Thành công', 'Câu hỏi đã được xóa');
    } catch (error) {
      console.error('Error deleting question:', error);
      Alert.alert('Lỗi', 'Không thể xóa câu hỏi');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.questionItem}>
      <Text style={styles.questionText}>{item.question}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditQuestion(item)}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteQuestion(item.id)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddQuestion')}
      >
        <Text style={styles.addButtonText}>+ Thêm câu hỏi mới</Text>
      </TouchableOpacity>
      
      <FlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
  },
  questionItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuestionManagement;