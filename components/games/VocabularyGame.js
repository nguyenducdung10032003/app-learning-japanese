import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { ArrowLeft, Volume2, Eye, EyeOff, RotateCw } from "lucide-react-native";
import { ProgressBar } from "react-native-paper";
import { vocabularyCards } from "../../data/vocabularyData";
import * as Speech from "expo-speech";

export function VocabularyGame({ onBack }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHiragana, setShowHiragana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [knownCards, setKnownCards] = useState([]);
  const [studyingCards, setStudyingCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);

  const progress = ((currentCardIndex + 1) / (shuffledCards.length || 1)) * 100;
  const currentCard = shuffledCards[currentCardIndex];

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...vocabularyCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setStudyingCards([]);
  };

  const resetSession = () => {
    shuffleCards();
  };

  const handleKnown = () => {
    if (currentCard && !knownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id]);
    }
    nextCard();
  };

  const handleStudying = () => {
    if (currentCard && !studyingCards.includes(currentCard.id)) {
      setStudyingCards([...studyingCards, currentCard.id]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // const resetSession = () => {
  //   setCurrentCardIndex(0);
  //   setIsFlipped(false);
  //   setKnownCards([]);
  //   setStudyingCards([]);
  //   const shuffled = [...vocabularyCards].sort(() => Math.random() - 0.5);
  //   setShuffledCards(shuffled);
  // };

  const speakWord = () => {
    if (!currentCard) return;

    if (Platform.OS === "web") {
      const utterance = new SpeechSynthesisUtterance(currentCard.hiragana);
      utterance.lang = "ja-JP";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      // Cho mobile (Android, iOS)
      Speech.speak(currentCard.hiragana, {
        language: "ja-JP",
        rate: 0.8,
      });
    }
  };

  if (!currentCard) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "N5":
        return { backgroundColor: "#e6f7e6", color: "#2e7d32" };
      case "N4":
        return { backgroundColor: "#e6f3f7", color: "#1565c0" };
      case "N3":
        return { backgroundColor: "#fff8e6", color: "#ff8f00" };
      case "N2":
        return { backgroundColor: "#fff1e6", color: "#ef6c00" };
      case "N1":
        return { backgroundColor: "#ffebee", color: "#c62828" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#424242" };
    }
  };

  const levelStyle = getLevelColor(currentCard.level);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color="#4a86e8" />
            <Text style={styles.backButtonText}>Back to Games</Text>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Known: {knownCards.length} | Studying: {studyingCards.length}
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetSession}>
              <RotateCw size={16} color="#4a86e8" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showHiragana
                ? styles.toggleButtonActive
                : styles.toggleButtonInactive,
            ]}
            onPress={() => setShowHiragana(!showHiragana)}
          >
            {showHiragana ? (
              <Eye size={16} color="#4a86e8" />
            ) : (
              <EyeOff size={16} color="#666" />
            )}
            <Text
              style={[
                styles.toggleButtonText,
                showHiragana && styles.toggleButtonTextActive,
              ]}
            >
              Hiragana
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              showRomaji
                ? styles.toggleButtonActive
                : styles.toggleButtonInactive,
            ]}
            onPress={() => setShowRomaji(!showRomaji)}
          >
            {showRomaji ? (
              <Eye size={16} color="#4a86e8" />
            ) : (
              <EyeOff size={16} color="#666" />
            )}
            <Text
              style={[
                styles.toggleButtonText,
                showRomaji && styles.toggleButtonTextActive,
              ]}
            >
              Romaji
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Vocabulary Flashcards</Text>
            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: levelStyle.backgroundColor },
                ]}
              >
                <Text
                  style={[styles.levelBadgeText, { color: levelStyle.color }]}
                >
                  {currentCard.level}
                </Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {currentCard.category}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.cardCounter}>
            Card {currentCardIndex + 1} of {shuffledCards.length}
          </Text>

          <TouchableOpacity
            style={styles.flashcard}
            onPress={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              <View style={styles.flashcardFront}>
                <Text style={styles.kanji}>{currentCard.kanji}</Text>
                {showHiragana && (
                  <Text style={styles.hiragana}>{currentCard.hiragana}</Text>
                )}
                {showRomaji && (
                  <Text style={styles.romaji}>{currentCard.romaji}</Text>
                )}
                <TouchableOpacity
                  style={styles.pronounceButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    speakWord();
                  }}
                >
                  <Volume2 size={20} color="#4a86e8" />
                  <Text style={styles.pronounceButtonText}>Pronounce</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.flashcardBack}>
                <Text style={styles.english}>{currentCard.english}</Text>
                <View style={styles.exampleContainer}>
                  <Text style={styles.example}>{currentCard.example}</Text>
                  <Text style={styles.exampleTranslation}>
                    {currentCard.exampleTranslation}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.flipHint}>Click the card to flip it</Text>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentCardIndex === 0 && styles.disabledButton,
            ]}
            onPress={previousCard}
            disabled={currentCardIndex === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentCardIndex === shuffledCards.length - 1 &&
                styles.disabledButton,
            ]}
            onPress={nextCard}
            disabled={currentCardIndex === shuffledCards.length - 1}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {isFlipped && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.studyingButton}
              onPress={handleStudying}
            >
              <Text style={styles.studyingButtonText}>Still Learning</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.knownButton} onPress={handleKnown}>
              <Text style={styles.knownButtonText}>I Know This</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Thêm các thuộc tính sau để ghi đè
    height: undefined, // Xóa height cũ
    minHeight: "100%", // Ngăn không cho chiều cao tối thiểu tạo khoảng trống
    maxHeight: "100%", // Giới hạn chiều cao tối đa
  },
  content: {
    flexGrow: 1, // Cho phép nội dung co giãn hợp lý
    flexShrink: 1, // Cho phép thu nhỏ khi cần
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 8,
    color: "#4a86e8",
    fontSize: 16,
  },
  statsContainer: {
    alignItems: "flex-end",
  },
  statsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  resetButtonText: {
    marginLeft: 4,
    color: "#4a86e8",
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    marginBottom: 16,
    backgroundColor: "#e0e0e0",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleButtonActive: {
    borderColor: "#4a86e8",
    backgroundColor: "#ebf4ff",
  },
  toggleButtonInactive: {
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  toggleButtonText: {
    marginLeft: 8,
    color: "#666",
  },
  toggleButtonTextActive: {
    color: "#4a86e8",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  levelBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  cardCounter: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  flashcard: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  flashcardFront: {
    alignItems: "center",
    justifyContent: "center",
  },
  kanji: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 16,
  },
  hiragana: {
    fontSize: 24,
    color: "#666",
    marginBottom: 8,
  },
  romaji: {
    fontSize: 18,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  pronounceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pronounceButtonText: {
    marginLeft: 8,
    color: "#4a86e8",
  },
  flashcardBack: {
    alignItems: "center",
    justifyContent: "center",
  },
  english: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4a86e8",
    marginBottom: 24,
  },
  exampleContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 16,
    alignItems: "center",
  },
  example: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  exampleTranslation: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  flipHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  navButtonText: {
    color: "#333",
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  studyingButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffc107",
    backgroundColor: "#fff8e1",
  },
  studyingButtonText: {
    color: "#ff8f00",
    fontWeight: "500",
  },
  knownButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#4caf50",
  },
  knownButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});
