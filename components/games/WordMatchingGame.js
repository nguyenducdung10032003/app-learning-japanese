import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ArrowLeft, CheckCircle, RefreshCw } from "lucide-react-native";
import { matchingPairs } from "../../data/matchingData";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WordMatchingGame({ onBack }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  const totalRounds = 2;
  const progress = (round / totalRounds) * 100;
  const questionsPerRound = 5;
  const totalQuestions = questionsPerRound * totalRounds;

  const saveGameResult = async () => {
    try {
      const newRecord = {
        id: Date.now(),
        type: "WordMatching",
        score: score,
        total: totalQuestions,
        date: new Date().toISOString(),
        title: "Completed Word Matching Game",
        description: `Score: ${score}/${totalQuestions}`,
        time: new Date().toLocaleString(),
        icon: "LayoutGrid",
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

  // useEffect(() => {
  //   if (isRoundComplete && round >= totalRounds) {
  //     saveGameResult();
  //   }
  // }, [isRoundComplete, round]);

  const startNewRound = () => {
    const pairsForRound = [...matchingPairs]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsPerRound);

    const shuffledLeft = [...pairsForRound].sort(() => Math.random() - 0.5);
    const shuffledRight = [...pairsForRound].sort(() => Math.random() - 0.5);

    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setIsRoundComplete(false);
  };

  const handleLeftSelect = (id) => {
    if (Object.values(matches).includes(id)) return;
    setSelectedLeft(id);

    if (selectedRight !== null) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightSelect = (id) => {
    if (Object.keys(matches).map(Number).includes(id)) return;
    setSelectedRight(id);

    if (selectedLeft !== null) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId, rightId) => {
    const leftItem = leftItems.find((item) => item.id === leftId);
    const rightItem = rightItems.find((item) => item.id === rightId);

    if (leftItem && rightItem && leftItem.id === rightItem.id) {
      const newMatches = { ...matches, [rightId]: leftId };
      setMatches(newMatches);
      setScore(score + 1);

      if (Object.keys(newMatches).length === leftItems.length) {
        setIsRoundComplete(true);
      }
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleNextRound = () => {
    if (round < totalRounds) {
      setRound(round + 1);
      startNewRound();
    }
  };
  useEffect(() => {
    startNewRound();
  }, []);

  const isMatchedLeft = (id) => Object.values(matches).includes(id);
  const isMatchedRight = (id) => Object.keys(matches).map(Number).includes(id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#000" />
          <Text style={styles.backButtonText}>Back to Games</Text>
        </TouchableOpacity>
        <Text style={styles.score}>
          Score: {score}/{totalQuestions}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Word Matching Game</Text>
        <Text style={styles.subtitle}>
          Match the grammar pattern with its correct example
        </Text>

        <ScrollView>
          <View style={styles.gameContainer}>
            <View style={styles.column}>
              <Text style={styles.columnTitle}>Grammar Patterns</Text>
              {leftItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.item,
                    selectedLeft === item.id && styles.selectedItem,
                    isMatchedLeft(item.id) && styles.matchedItem,
                  ]}
                  onPress={() => handleLeftSelect(item.id)}
                  disabled={isMatchedLeft(item.id)}
                >
                  <Text style={styles.itemText}>{item.grammar}</Text>
                  {isMatchedLeft(item.id) && (
                    <CheckCircle size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.column}>
              <Text style={styles.columnTitle}>Examples</Text>
              {rightItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.item,
                    selectedRight === item.id && styles.selectedItem,
                    isMatchedRight(item.id) && styles.matchedItem,
                  ]}
                  onPress={() => handleRightSelect(item.id)}
                  disabled={isMatchedRight(item.id)}
                >
                  <Text style={styles.itemText}>{item.example}</Text>
                  <Text style={styles.translation}>{item.translation}</Text>
                  {isMatchedRight(item.id) && (
                    <CheckCircle size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {isRoundComplete && (
          <View style={styles.completeMessage}>
            <Text style={styles.completeTitle}>Round Complete!</Text>
            <Text>You've successfully matched all the pairs.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={startNewRound}>
            <RefreshCw size={20} color="#000" />
            <Text style={styles.buttonText}>Reset Round</Text>
          </TouchableOpacity>

          {isRoundComplete && round < totalRounds && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextRound}
            >
              <Text style={styles.buttonText}>Next Round</Text>
            </TouchableOpacity>
          )}

          {isRoundComplete && round >= totalRounds && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={async () => {
                await saveGameResult();
                setTimeout(() => {
                  onBack();
                }, 300);
              }}
            >
              <Text style={styles.buttonText}>Finish Game</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
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
  },
  score: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  gameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 12,
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedItem: {
    backgroundColor: "#f5f5f5",
    borderColor: "#000",
  },
  matchedItem: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4CAF50",
  },
  itemText: {
    fontSize: 14,
    color: "#000",
  },
  selectedItemText: {
    color: "#fff",
  },
  translation: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  completeMessage: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: "center",
  },
  completeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 4,
    backgroundColor: "#E8F5E9",
  },
  nextButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  buttonText: {
    marginLeft: 8,
    color: "#000",
  },
  nextButtonText: {
    color: "#FFF",
  },
});
