// screens/Admin/EditQuestion.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditQuestion = ({ route, navigation }) => {
  const { question: existingQuestion } = route.params || {};
  const [question, setQuestion] = useState(existingQuestion?.question || '');
  const [options, setOptions] = useState(
    existingQuestion ? JSON.parse(existingQuestion.options) : ['', '', '', '']
  );
  const [correctAnswer, setCorrectAnswer] = useState(existingQuestion?.correctAnswer || 0);
  const [explanation, setExplanation] = useState(existingQuestion?.explanation || '');

  const handleOptionChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!question || options.some(opt => !opt) || !explanation) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const currentQuestions = await readLocalData('@local/quiz_questions');
      let updatedQuestions;
      
      if (existingQuestion) {
        // Update existing question
        updatedQuestions = currentQuestions.map(q => 
          q.id === existingQuestion.id 
            ? { 
                ...q, 
                question, 
                options: JSON.stringify(options), 
                correctAnswer, 
                explanation 
              } 
            : q
        );
      } else {
        // Add new question
        const newId = currentQuestions.length > 0 
          ? Math.max(...currentQuestions.map(q => q.id)) + 1 
          : 1;
        
        const newQuestion = {
          id: newId,
          question,
          options: JSON.stringify(options),
          correctAnswer,
          explanation,
        };
        
        updatedQuestions = [...currentQuestions, newQuestion];
      }

      await AsyncStorage.setItem('@local/quiz_questions', JSON.stringify(updatedQuestions));
      Alert.alert('Thành công', existingQuestion ? 'Câu hỏi đã được cập nhật' : 'Câu hỏi đã được thêm');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving question:', error);
      Alert.alert('Lỗi', 'Không thể lưu câu hỏi');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Câu hỏi:</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Nhập câu hỏi"
      />

      <Text style={styles.label}>Các lựa chọn:</Text>
      {options.map((option, index) => (
        <View key={index} style={styles.optionContainer}>
          <TextInput
            style={styles.optionInput}
            value={option}
            onChangeText={(text) => handleOptionChange(text, index)}
            placeholder={`Lựa chọn ${index + 1}`}
          />
          <TouchableOpacity
            style={[
              styles.radioButton,
              correctAnswer === index && styles.radioButtonSelected
            ]}
            onPress={() => setCorrectAnswer(index)}
          >
            {correctAnswer === index && <View style={styles.radioButtonInner} />}
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>Giải thích:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={explanation}
        onChangeText={setExplanation}
        placeholder="Nhập giải thích"
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {existingQuestion ? 'Cập nhật' : 'Thêm mới'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2ecc71',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 4,
    marginTop: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditQuestion;