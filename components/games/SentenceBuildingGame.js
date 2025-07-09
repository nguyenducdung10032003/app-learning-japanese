import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sentenceChallenges } from "../../data/sentencesData";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SentenceBuildingGame({ onBack }) {
  const [shuffledChallenges, setShuffledChallenges] = useState([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const saveGameResult = async () => {
    try {
      const newRecord = {
        id: Date.now(),
        type: "SentenceBuilding",
        score: score,
        total: shuffledChallenges.length,
        date: new Date().toISOString(),
        title: "Completed Sentence Building Game",
        description: `Score: ${score}/${shuffledChallenges.length}`,
        time: new Date().toLocaleString(),
        icon: "BookOpen",
      };
      const userId = await AsyncStorage.getItem("userId");
      const key = `quizHistory_${userId}`;
      const existing = await AsyncStorage.getItem(key);
      const history = existing ? JSON.parse(existing) : [];

      const updated = [newRecord, ...history];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save game result:", err);
    }
  };

  useEffect(() => {
    const shuffled = [...sentenceChallenges]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setShuffledChallenges(shuffled);

    setShuffledChallenges(shuffled);
    setCurrentChallengeIndex(0);
    if (isGameComplete) {
      saveGameResult();
    }
  }, [isGameComplete]);

  useEffect(() => {
    if (shuffledChallenges.length === 0) return;
    const current = shuffledChallenges[currentChallengeIndex];
    if (!current) return;
    const shuffledWords = [...current.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffledWords);
    setSelectedWords([]);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentChallengeIndex, shuffledChallenges]);

  if (shuffledChallenges.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const currentChallenge = shuffledChallenges[currentChallengeIndex];
  const progress =
    ((currentChallengeIndex + 1) / shuffledChallenges.length) * 100;

  const handleSelectWord = (word, index) => {
    if (isAnswered) return;
    const newAvailableWords = [...availableWords];
    newAvailableWords.splice(index, 1);
    setAvailableWords(newAvailableWords);
    setSelectedWords([...selectedWords, word]);
  };

  const handleRemoveWord = (index) => {
    if (isAnswered) return;
    const newSelectedWords = [...selectedWords];
    const removed = newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
    setAvailableWords([...availableWords, ...removed]);
  };

  const handleReset = () => {
    setAvailableWords(
      [...currentChallenge.words].sort(() => Math.random() - 0.5)
    );
    setSelectedWords([]);
  };

  const handleCheck = () => {
    if (selectedWords.length !== currentChallenge.words.length) {
      Alert.alert(
        "Incomplete",
        "Please select all words to build your sentence."
      );
      return;
    }
    setIsAnswered(true);
    const isAnswerCorrect = currentChallenge.correctOrder.every(
      (correctIndex, i) =>
        selectedWords[i] === currentChallenge.words[correctIndex]
    );
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentChallengeIndex < shuffledChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    } else {
      setIsGameComplete(true);
    }
  };

  const restartGame = () => {
    const reshuffled = [...sentenceChallenges].sort(() => Math.random() - 0.5);
    setShuffledChallenges(reshuffled);
    setCurrentChallengeIndex(0);
    setScore(0);
    setIsGameComplete(false);
    setSelectedWords([]);
    setAvailableWords([]);
    setIsAnswered(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#333" />
          <Text style={styles.backButtonText}>Back to Games</Text>
        </TouchableOpacity>
        <Text style={styles.score}>
          Score: {score}/{shuffledChallenges.length}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Sentence Building</Text>
        <Text style={styles.description}>
          Arrange the words to form a correct Japanese sentence
        </Text>

        <View style={styles.content}>
          <Text style={styles.englishLabel}>English:</Text>
          <Text style={styles.englishText}>{currentChallenge.english}</Text>

          <View style={styles.sentenceBuilder}>
            {selectedWords.length === 0 ? (
              <Text style={styles.placeholderText}>
                Select words to build your sentence
              </Text>
            ) : (
              <View style={styles.selectedWordsContainer}>
                {selectedWords.map((word, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.wordBadge}
                    onPress={() => handleRemoveWord(index)}
                  >
                    <Text style={styles.wordText}>{word}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.availableWordsContainer}>
            {availableWords.map((word, index) => (
              <TouchableOpacity
                key={index}
                style={styles.availableWordBadge}
                onPress={() => handleSelectWord(word, index)}
              >
                <Text style={styles.availableWordText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {isAnswered && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Result:</Text>
                {isCorrect ? (
                  <View style={styles.correctContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10b981"
                    />
                    <Text style={styles.correctText}>Correct!</Text>
                  </View>
                ) : (
                  <View style={styles.incorrectContainer}>
                    <Ionicons name="close-circle" size={16} color="#ef4444" />
                    <Text style={styles.incorrectText}>Incorrect</Text>
                  </View>
                )}
              </View>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>
                {currentChallenge.explanation}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            disabled={isAnswered}
          >
            <Ionicons name="refresh" size={16} color="#3b82f6" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          {!isAnswered ? (
            <TouchableOpacity
              style={[
                styles.checkButton,
                selectedWords.length !== currentChallenge.words.length &&
                  styles.disabledButton,
              ]}
              onPress={handleCheck}
              disabled={selectedWords.length !== currentChallenge.words.length}
            >
              <Text style={styles.checkButtonText}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentChallengeIndex < shuffledChallenges.length - 1
                  ? "Next Challenge"
                  : "Finish"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Modal
          visible={isGameComplete}
          transparent={true}
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Game Complete! Your score is {score}/{shuffledChallenges.length}
              </Text>
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    restartGame();
                    onBack();
                  }}
                >
                  <Text style={styles.primaryButtonText}>GO TO HOME</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={restartGame}
                >
                  <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 8,
    color: "#3b82f6",
    fontSize: 16,
  },
  score: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e293b",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  englishLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  englishText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    color: "#1e293b",
  },
  sentenceBuilder: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    justifyContent: "center",
  },
  placeholderText: {
    color: "#94a3b8",
    textAlign: "center",
  },
  selectedWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wordText: {
    color: "white",
    fontSize: 16,
  },
  availableWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  availableWordBadge: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableWordText: {
    color: "#1e293b",
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultTitle: {
    fontWeight: "600",
    marginRight: 8,
    color: "#1e293b",
  },
  correctContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  correctText: {
    color: "#10b981",
    marginLeft: 4,
  },
  incorrectContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  incorrectText: {
    color: "#ef4444",
    marginLeft: 4,
  },
  explationTitle: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#1e293b",
  },
  explanationText: {
    color: "#334155",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
  },
  resetButtonText: {
    marginLeft: 8,
    color: "#3b82f6",
  },
  checkButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkButtonText: {
    color: "white",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
