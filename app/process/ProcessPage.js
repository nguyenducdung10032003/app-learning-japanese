import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { BookOpen, BarChart, Award, Clock } from "lucide-react-native";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";

const PAGE_SIZE = 10;

// JLPT levels (Beginner to Proficient)
const initialJlpt = [
  { level: "N1", name: "Proficient Level", progress: 0, color: "#bfdbfe" },
  { level: "N2", name: "Advanced Level", progress: 0, color: "#bbf7d0" },
  { level: "N3", name: "Intermediate Level", progress: 0, color: "#fef08a" },
  { level: "N4", name: "Basic Level", progress: 0, color: "#fed7aa" },
  { level: "N5", name: "Beginner Level", progress: 0, color: "#fecaca" },
];

const ProgressBar = ({ progress, color }) => (
  <View style={styles.progressBarContainer}>
    <View
      style={[
        styles.progressBar,
        { width: `${progress}%`, backgroundColor: color },
      ]}
    />
  </View>
);

const StatCard = ({ title, value, description, Icon }) => (
  <View style={styles.statCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardValue}>{value}</Text>
      <Icon size={24} color="#6b7280" />
    </View>
  </View>
);

const ActivityItem = ({ item }) => {
  const Icon = item.icon === "BookOpen" ? BookOpen : Award;
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Icon size={20} color="#3b82f6" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDesc}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );
};

export default function ProgressPage() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("progress");
  const [quizHistory, setQuizHistory] = useState([]);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    grammarPoints: 0,
    achievements: 0,
    studyTime: 0,
  });
  const [jlptProgress, setJlptProgress] = useState(initialJlpt);
  const [currentPage, setCurrentPage] = useState(1);

  const loadHistory = useCallback(async () => {
    try {
      const key = `quizHistory_${user.id}`;
      const raw = await AsyncStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      setQuizHistory(parsed);

      const games = parsed.length;
      const points = parsed.reduce((sum, q) => sum + (q.score || 0), 0);
      const time = parseFloat((games * 0.3).toFixed(1));
      const achievementsCount = [
        games >= 1,
        points >= 20,
        games >= 5,
        time >= 5,
        parsed.some((q) => q.score === q.total),
      ].filter(Boolean).length;
      setStats({
        gamesPlayed: games,
        grammarPoints: points,
        achievements: achievementsCount,
        studyTime: time,
      });

      const counts = { N1: 0, N2: 0, N3: 0, N4: 0, N5: 0 };
      parsed.forEach((q) => {
        const ratio = q.score / q.total;
        if (ratio >= 1) counts.N5++;
        else if (ratio >= 0.8) counts.N4++;
        else if (ratio >= 0.6) counts.N3++;
        else if (ratio >= 0.4) counts.N2++;
        else counts.N1++;
      });
      setJlptProgress(
        initialJlpt.map((l) => ({
          ...l,
          progress: parsed.length
            ? Math.round((counts[l.level] / parsed.length) * 100)
            : 0,
        }))
      );
    } catch (error) {
      console.error("Failed to load quiz history", error);
    }
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const totalPages = Math.ceil(quizHistory.length / PAGE_SIZE);
  const currentItems = quizHistory.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>学習の進捗</Text>
          <Text style={styles.headerSubtitle}>
            Track your Japanese grammar learning progress
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Games Played"
            value={stats.gamesPlayed}
            description="Total games completed"
            Icon={BookOpen}
          />
          <StatCard
            title="Grammar Points"
            value={stats.grammarPoints}
            description="Patterns learned"
            Icon={BarChart}
          />
          <StatCard
            title="Achievements"
            value={stats.achievements}
            description="Badges earned"
            Icon={Award}
          />
          <StatCard
            title="Study Time"
            value={stats.studyTime}
            description="Hours learning"
            Icon={Clock}
          />
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            {["progress", "achievements"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab === "progress" ? "Learning Progress" : "Achievements"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "progress" ? (
            <View style={styles.tabContent}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Grammar Level Progress</Text>
                <Text style={styles.sectionSubtitle}>
                  Your progress through JLPT levels
                </Text>
                <View style={styles.progressList}>
                  {jlptProgress.map((item, i) => (
                    <View key={i} style={styles.progressItem}>
                      <View style={styles.progressHeader}>
                        <View style={styles.levelBadge}>
                          <Text
                            style={[styles.levelText, { color: item.color }]}
                          >
                            {item.level}
                          </Text>
                        </View>
                        <Text style={styles.levelName}>{item.name}</Text>
                        <Text style={styles.progressPercent}>
                          {item.progress}%
                        </Text>
                      </View>
                      <ProgressBar
                        progress={item.progress}
                        color={item.color}
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <Text style={styles.sectionSubtitle}>
                  Latest learning activities
                </Text>
                <FlatList
                  data={currentItems}
                  keyExtractor={(i) => i.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => <ActivityItem item={item} />}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 12,
                  }}
                >
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        backgroundColor:
                          i + 1 === currentPage ? "#3b82f6" : "#e5e7eb",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 6,
                        marginHorizontal: 4,
                      }}
                      onPress={() => setCurrentPage(i + 1)}
                    >
                      <Text
                        style={{
                          color: i + 1 === currentPage ? "white" : "#111827",
                        }}
                      >
                        {i + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <Text style={styles.sectionSubtitle}>
                  Badges and rewards earned
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scrollContainer: { padding: 16 },
  header: { alignItems: "center", marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  headerSubtitle: { fontSize: 16, color: "#6b7280", textAlign: "center" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cardHeader: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  cardDescription: { fontSize: 12, color: "#6b7280" },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardValue: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  tabsContainer: { marginBottom: 24 },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: "center" },
  activeTab: { backgroundColor: "#fff", elevation: 2 },
  tabText: { fontSize: 14, fontWeight: "500", color: "#6b7280" },
  activeTabText: { color: "#111827" },
  tabContent: { gap: 16 },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 14, color: "#6b7280", marginBottom: 12 },
  progressList: { gap: 16 },
  progressItem: { marginBottom: 12 },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  levelText: { fontSize: 12, fontWeight: "600" },
  levelName: { flex: 1, fontSize: 14, color: "#374151" },
  progressPercent: { fontSize: 12, color: "#6b7280" },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 2 },
  activityItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  activityDesc: { fontSize: 12, color: "#6b7280" },
  activityTime: { fontSize: 11, color: "#9ca3af" },
});
