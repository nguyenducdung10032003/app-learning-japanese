import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import Feather from "react-native-vector-icons/Feather"
import MultipleChoiceGame from "./games/MultipleChoiceGame"
import SentenceBuildingGame from "./games/SentenceBuildingGame"
import WordMatchingGame from "./games/WordMatchingGame"
import { VocabularyGame } from "./games/VocabularyGame"


const iconMap = {
  Brain: "cpu",
  FileText: "file-text",
  Puzzle: "layers",
  MessageSquare: "message-circle",
  BookOpen: "book-open",
  PenTool: "edit-3",
  Calendar: "calendar",
}

function GameCard({ title, description, difficulty, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Feather name={iconMap[icon]} size={30} color="#1E90FF" />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{description}</Text>
          <Text style={styles.cardLevel}>{difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const gameList = [
  {
    id: "multiple-choice",
    title: "Multiple Choice",
    description: "Test your knowledge of Japanese grammar with multiple choice questions",
    difficulty: "Beginner",
    icon: "Brain",
  },
  {
    id: "sentence-building",
    title: "Sentence Building",
    description: "Build correct Japanese sentences by arranging words in the right order",
    difficulty: "Intermediate",
    icon: "FileText",
  },
  {
    id: "word-matching",
    title: "Word Matching",
    description: "Match Japanese grammar patterns with their correct usage",
    difficulty: "Beginner",
    icon: "Puzzle",
  },
  {
    id: "vocabulary",
    title: "Vocabulary Cards",
    description: "Learn Japanese vocabulary with interactive flashcards",
    difficulty: "Beginner",
    icon: "BookOpen",
  },
    {
    id: "writing-practice",
    title: "Writing Practice",
    description: "Practice writing hiragana, katakana, and kanji characters",
    difficulty: "Intermediate",
    icon: "PenTool",
  },
  {
    id: "daily-challenge",
    title: "Daily Challenge",
    description: "Complete daily and weekly challenges to earn points",
    difficulty: "Advanced",
    icon: "Calendar",
  },
    {
    id: "ai-conversation",
    title: "AI Conversation",
    description: "Practice Japanese grammar through AI-powered conversations",
    difficulty: "Advanced",
    icon: "MessageSquare",
  },
]

export default function GameDashboard() {
  const [selectedGame, setSelectedGame] = useState(null)

  const renderSelectedGame = () => {
    switch (selectedGame) {
      case "multiple-choice":
        return <MultipleChoiceGame onBack={() => setSelectedGame(null)} />
      case "sentence-building":
        return <SentenceBuildingGame onBack={() => setSelectedGame(null)} />
      case "word-matching":
        return <WordMatchingGame onBack={() => setSelectedGame(null)} />
      case "vocabulary":
        return <VocabularyGame onBack={() => setSelectedGame(null)} />
      default:
        return (
          <FlatList
            data={gameList}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <GameCard
                title={item.title}
                description={item.description}
                difficulty={item.difficulty}
                icon={item.icon}
                onPress={() => setSelectedGame(item.id)}
              />
            )}
          />
        )
    }
  }

  return <View style={styles.container}>{renderSelectedGame()}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  cardLevel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E90FF",
  },
})