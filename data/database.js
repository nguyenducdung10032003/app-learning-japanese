import AsyncStorage from "@react-native-async-storage/async-storage";
import { matchingPairs } from "../data/matchingData";
import { vocabularyCards } from "../data/vocabularyData";
import { sentenceChallenges } from "../data/sentencesData";
import { questions, grammarData } from "../data/questionsData";

// Hàm khởi tạo: Xoá dữ liệu cũ
const initDatabase = async () => {
  try {
    await AsyncStorage.multiRemove([
      "@local/grammar_patterns",
      "@local/quiz_questions",
      "@local/grammar_points",
      "@local/sentence_challenges",
      "@local/vocabulary_cards",
    ]);
    console.log("Local database cleared.");
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};

// Hàm seed dữ liệu vào AsyncStorage
const seedDatabase = async () => {
  try {
    // 1. grammar_patterns
    const grammarPatternsData = matchingPairs.map((item) => ({
      ...item,
      level: item.id <= 10 ? "N5" : "N4",
    }));
    await AsyncStorage.setItem(
      "@local/grammar_patterns",
      JSON.stringify(grammarPatternsData)
    );

    // 2. quiz_questions
    const quizData = questions.map((q) => ({
      ...q,
      options: JSON.stringify(q.options),
    }));
    await AsyncStorage.setItem(
      "@local/quiz_questions",
      JSON.stringify(quizData)
    );

    // 3. grammar_points
    const allGrammarPoints = [
      ...grammarData.basic,
      ...grammarData.intermediate,
      ...grammarData.advanced,
    ];
    const grammarPointsData = allGrammarPoints.map((item) => ({
      ...item,
      examples: JSON.stringify(item.examples),
    }));
    await AsyncStorage.setItem(
      "@local/grammar_points",
      JSON.stringify(grammarPointsData)
    );

    // 4. sentence_challenges
    const sentenceData = sentenceChallenges.map((item) => ({
      ...item,
      words: JSON.stringify(item.words),
      correctOrder: JSON.stringify(item.correctOrder),
    }));
    await AsyncStorage.setItem(
      "@local/sentence_challenges",
      JSON.stringify(sentenceData)
    );

    // 5. vocabulary_cards
    await AsyncStorage.setItem(
      "@local/vocabulary_cards",
      JSON.stringify(vocabularyCards)
    );

    console.log("Local storage seeded successfully.");
  } catch (error) {
    console.error("Error seeding local storage:", error);
  }
};

// Hàm đọc dữ liệu (thay cho executeSql)
const readLocalData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error reading local data for key:", key, error);
    return [];
  }
};

export { initDatabase, seedDatabase, readLocalData };
