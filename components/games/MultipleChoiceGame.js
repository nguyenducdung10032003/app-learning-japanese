import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { questions } from "../../data/questionsData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function MultipleChoiceGame({ onBack }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // useEffect(() => {
  //   setShuffledQuestions(shuffleArray(questions));
  // }, []);
  useEffect(() => {
    const randomTenQuestions = shuffleArray(questions).slice(0, 10);
    setShuffledQuestions(randomTenQuestions);
  }, []);

  const current = shuffledQuestions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  const handleAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === current.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      (async () => {
        const userId = await AsyncStorage.getItem("userId");
        await saveQuizHistory(userId, score, shuffledQuestions.length);
        setIsGameComplete(true);
      })();
    }
  };
  // Thêm sau khi người dùng hoàn thành quiz:
  const saveQuizHistory = async (userId, score, total) => {
    try {
      const newRecord = {
        id: Date.now(),
        title: "Completed Multiple Choice Game",
        description: `Score: ${score}/${total}`,
        time: new Date().toLocaleString(),
        icon: "BookOpen",
        score,
        total,
      };
      const key = `quizHistory_${userId}`;
      const existing = await AsyncStorage.getItem(key);
      const history = existing ? JSON.parse(existing) : [];

      const updatedHistory = [newRecord, ...history.slice(0, 19)]; // Giữ tối đa 20 bản ghi
      await AsyncStorage.setItem(key, JSON.stringify(updatedHistory));
    } catch (error) {
      console.log("Error saving history", error);
    }
  };

  if (isGameComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
            🎉 Quiz Completed!
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Your Score: {score}/{shuffledQuestions.length}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 24 }}>
            {score === shuffledQuestions.length
              ? "Excellent! 🏆"
              : score >= shuffledQuestions.length / 2
              ? "Good job! 👍"
              : "Keep practicing! 💪"}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShuffledQuestions(shuffleArray(questions));
              setIsGameComplete(false);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setScore(0);
            }}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { marginTop: 12, backgroundColor: "#6b7280" },
            ]}
            onPress={onBack}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!current) return null; // Avoid crash on first render

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#333" />
          <Text style={styles.backText}>Back to Games</Text>
        </TouchableOpacity>
        <Text style={styles.score}>
          Score: {score}/{shuffledQuestions.length}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.card}>
        <Text style={styles.questionTitle}>
          Question {currentQuestionIndex + 1}
        </Text>
        <Text style={styles.questionText}>{current.question}</Text>

        {current.options.map((option, index) => {
          const isCorrect = isAnswered && index === current.correctAnswer;
          const isWrong =
            isAnswered &&
            index === selectedOption &&
            selectedOption !== current.correctAnswer;

          return (
            <Pressable
              key={index}
              onPress={() => !isAnswered && setSelectedOption(index)}
              style={[
                styles.option,
                selectedOption === index &&
                  !isAnswered &&
                  styles.optionSelected,
                isCorrect && styles.correctOption,
                isWrong && styles.wrongOption,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
              {isCorrect && (
                <Ionicons name="checkmark-circle" size={20} color="green" />
              )}
              {isWrong && (
                <Ionicons name="close-circle" size={20} color="red" />
              )}
            </Pressable>
          );
        })}

        {isAnswered && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text>{current.explanation}</Text>
          </View>
        )}

        <View style={styles.footer}>
          {!isAnswered ? (
            <TouchableOpacity
              style={[
                styles.button,
                selectedOption === null && styles.buttonDisabled,
              ]}
              disabled={selectedOption === null}
              onPress={handleAnswer}
            >
              <Text style={styles.buttonText}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {currentQuestionIndex < shuffledQuestions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { marginLeft: 8, color: "#333", fontSize: 14 },
  score: { fontSize: 14, fontWeight: "bold" },
  progressContainer: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4ade80",
  },
  card: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  questionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  questionText: { fontSize: 16, marginBottom: 16 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  optionSelected: {
    borderColor: "#4f46e5",
    backgroundColor: "#eef2ff",
  },
  correctOption: {
    borderColor: "green",
    backgroundColor: "#dcfce7",
  },
  wrongOption: {
    borderColor: "red",
    backgroundColor: "#fee2e2",
  },
  optionText: { fontSize: 16 },
  explanationBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  explanationTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  footer: { marginTop: 20, alignItems: "center" },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#a5b4fc",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
