import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Button,
} from "react-native";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { grammarData } from "../../data/questionsData";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { AuthContext } from "../../context/AuthContext";

const StudyPage = () => {
  const [activeTab, setActiveTab] = useState("dictionary");
  const [searchTerm, setSearchTerm] = useState("");
  const [dictionaryResults, setDictionaryResults] = useState([]);
  const [kanjiResults, setKanjiResults] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [selectedKanji, setSelectedKanji] = useState(null);
  const { user } = useContext(AuthContext);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sentences, setSentences] = useState([
    {
      japanese: "こんにちは、私は日本語を勉強しています。",
      romaji: "Konnichiwa, watashi wa nihongo o benkyou shite imasu.",
      english: "Hello, I am studying Japanese.",
    },
    {
      japanese: "今日はいい天気ですね。",
      romaji: "Kyou wa ii tenki desu ne.",
      english: "It's nice weather today, isn't it?",
    },
    {
      japanese: "どこに行きたいですか？",
      romaji: "Doko ni ikitai desu ka?",
      english: "Where do you want to go?",
    },
    {
      japanese: "これはいくらですか？",
      romaji: "Kore wa ikura desu ka?",
      english: "How much is this?",
    },
    {
      japanese: "お名前は何ですか？",
      romaji: "O-namae wa nan desu ka?",
      english: "What is your name?",
    },
  ]);
  useEffect(() => {
    // Kiểm tra ngôn ngữ có sẵn khi component mount
    const checkTTS = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        const hasJapanese = voices.some((v) => v.language.includes("ja"));

        if (!hasJapanese) {
          Alert.alert(
            "Notice",
            "Japanese voice may not be available on your device. Please install Japanese TTS engine in your device settings.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("TTS check error:", error);
      }
    };

    checkTTS();

    return () => {
      // Dọn dẹp khi component unmount
      Speech.stop();
    };
  }, []);
  const nextSentence = () => {
    setPronunciationScore(null); // Reset điểm khi chuyển câu mới
    setCurrentSentenceIndex((prev) =>
      prev >= sentences.length - 1 ? 0 : prev + 1
    );
  };
  // Dictionary API
  const searchDictionary = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      setDictionaryResults(data.data.slice(0, 5));
    } catch (error) {
      console.error("Dictionary search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kanji API
  const searchKanji = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // Kiểm tra nếu searchTerm là 1 ký tự Kanji duy nhất
      if (searchTerm.length !== 1 || !/[一-龯]/.test(searchTerm)) {
        setKanjiResults([]);
        return;
      }

      // Sử dụng proxy nếu gặp vấn đề CORS
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = `https://kanjiapi.dev/v1/kanji/${encodeURIComponent(
        searchTerm
      )}`;

      const response = await fetch(proxyUrl + apiUrl, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Kiểm tra dữ liệu trả về
      if (!data.kanji || !data.meanings) {
        throw new Error("Invalid kanji data format");
      }

      // Format data phù hợp với UI
      const formattedData = {
        kanji: {
          character: data.kanji,
          meaning: {
            english: data.meanings.join(", ") || "No meaning available",
          },
          onyomi: {
            katakana: data.on_readings?.join(", ") || "N/A",
          },
          kunyomi: {
            hiragana: data.kun_readings?.join(", ") || "N/A",
          },
          stroke: {
            gif: data.kanji
              ? `https://kanjiapi.dev/v1/kanji/${data.kanji}/stroke-order`
              : null,
          },
        },
        examples: (data.kun_readings || [])
          .slice(0, 3)
          .map((reading, index) => ({
            japanese: `${data.kanji}${index + 1}`,
            reading: reading,
            meaning: { english: `Example ${index + 1}` },
          })),
      };

      setKanjiResults([formattedData]);
    } catch (error) {
      console.error("Kanji search error:", error);
      // Fallback data với thông báo lỗi
      setKanjiResults([
        {
          kanji: {
            character: searchTerm,
            meaning: { english: "Error loading kanji data" },
            onyomi: { katakana: "N/A" },
            kunyomi: { hiragana: "N/A" },
            stroke: { gif: null },
          },
          examples: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // News API (Listening)
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // Sử dụng API thay thế - NewsAPI (cần đăng ký key miễn phí)
      const apiKey = "001ef148c8c94cd0b4143576a9d005ea"; // Đăng ký tại newsapi.org
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=japan&language=en&pageSize=5&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const formattedNews = data.articles.map((article) => ({
        title: article.title,
        date: article.publishedAt,
        summary: article.description || "No description available",
        image_url: article.urlToImage || "https://via.placeholder.com/300",
        audio_url: null,
      }));

      setNewsResults(formattedNews);
    } catch (error) {
      console.error("News fetch error:", error);
      // Fallback data
      setNewsResults([
        {
          title: "Japanese Language Study Tips",
          date: new Date().toISOString(),
          summary: "Discover effective methods to learn Japanese faster.",
          image_url: "https://via.placeholder.com/300",
          audio_url: null,
        },
        {
          title: "Japanese Culture Update",
          date: new Date().toISOString(),
          summary: "Latest news about Japanese traditional festivals.",
          image_url: "https://via.placeholder.com/300",
          audio_url: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speaking - Play audio
  const playAudio = async (url) => {
    if (!url) {
      Alert.alert("Error", "No audio available for this news item");
      return;
    }

    try {
      // Dừng audio hiện tại nếu có
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      console.log("Attempting to play:", url);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Audio playback failed:", error);
      Alert.alert(
        "Playback Error",
        "Cannot play audio. The file may be corrupted or unavailable.",
        [{ text: "OK" }]
      );
    }
  };
  const playContent = async (newsItem) => {
    if (!newsItem.audio_url) {
      // Sử dụng text-to-speech nếu không có audio URL
      await playTextToSpeech(`${newsItem.title}. ${newsItem.summary}`);
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: newsItem.audio_url },
        { shouldPlay: true }
      );

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Audio playback failed:", error);
      // Fallback to text-to-speech nếu phát audio thất bại
      await playTextToSpeech(`${newsItem.title}. ${newsItem.summary}`);
    }
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const playTextToSpeech = async (text) => {
    try {
      // Dừng phát âm thanh hiện tại nếu có
      if (sound) {
        await sound.stopAsync();
      }

      // Dừng TTS hiện tại nếu có
      await Speech.stop();

      setIsSpeaking(true);

      await Speech.speak(text, {
        language: "ja-JP",
        rate: 0.9,
        pitch: 1.0,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("TTS Error:", error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
      Alert.alert("Speech Error", "Could not start text-to-speech", [
        { text: "OK" },
      ]);
    }
  };

  const stopPlayback = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error("Stop playback error:", error);
    }
  };
  // Speaking - Record audio
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const mockScore = Math.floor(Math.random() * 100);
    setPronunciationScore(mockScore);

    // Lưu điểm theo câu hiện tại
    setScores((prev) => ({
      ...prev,
      [currentSentenceIndex]: mockScore,
    }));
  };

  // Save word to notebook
  const saveToNotebook = (wordData) => {
    // Implement saving to user's notebook
    alert(`Saved "${wordData.japanese[0].word}" to your notebook`);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [sound, recording]);

  useEffect(() => {
    if (activeTab === "listening") {
      fetchNews();
    }
  }, [activeTab]);

  const renderDictionaryTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search word or kanji..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={searchDictionary}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchDictionary}
        >
          <MaterialIcons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : dictionaryResults.length > 0 ? (
        <ScrollView style={styles.resultsContainer}>
          {dictionaryResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.word}>
                  {result.japanese[0].word || searchTerm}
                </Text>
                <Text style={styles.reading}>{result.japanese[0].reading}</Text>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => saveToNotebook(result)}
                >
                  <FontAwesome name="bookmark" size={20} color="#4a86e8" />
                </TouchableOpacity>
              </View>

              <View style={styles.meaningContainer}>
                <Text style={styles.meaningTitle}>Meaning:</Text>
                {result.senses.map((sense, senseIndex) => (
                  <View key={senseIndex} style={styles.meaningItem}>
                    <Text style={styles.meaningText}>
                      {sense.english_definitions.join(", ")}
                    </Text>
                    {sense.parts_of_speech.length > 0 && (
                      <Text style={styles.partOfSpeech}>
                        {sense.parts_of_speech[0]}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResults}>No results found</Text>
      )}
    </View>
  );

  // const renderKanjiTab = () => (
  //   <View style={styles.tabContent}>
  //     <View style={styles.searchContainer}>
  //       <TextInput
  //         style={styles.searchInput}
  //         placeholder="Search kanji (1 character only)..."
  //         value={searchTerm}
  //         onChangeText={setSearchTerm}
  //         onSubmitEditing={searchKanji}
  //         maxLength={1}
  //       />
  //       <TouchableOpacity
  //         style={styles.searchButton}
  //         onPress={searchKanji}
  //         disabled={isLoading}
  //       >
  //         {isLoading ? (
  //           <ActivityIndicator size="small" color="white" />
  //         ) : (
  //           <MaterialIcons name="search" size={24} color="white" />
  //         )}
  //       </TouchableOpacity>
  //     </View>

  //     {isLoading ? (
  //       <ActivityIndicator size="large" style={styles.loader} />
  //     ) : kanjiResults && kanjiResults.length > 0 ? (
  //       <ScrollView style={styles.resultsContainer}>
  //         {kanjiResults.map((kanji, index) => {
  //           // Kiểm tra nếu có thông báo lỗi
  //           if (kanji.kanji.meaning.english.includes("Error")) {
  //             return (
  //               <View key={index} style={styles.errorCard}>
  //                 <Text style={styles.errorText}>
  //                   {kanji.kanji.meaning.english}
  //                 </Text>
  //                 <Text style={styles.errorHelpText}>
  //                   Please try again later or check your internet connection
  //                 </Text>
  //               </View>
  //             );
  //           }

  //           return (
  //             <TouchableOpacity
  //               key={index}
  //               style={styles.kanjiCard}
  //               onPress={() => setSelectedKanji(kanji)}
  //             >
  //               <Text style={styles.kanjiCharacter}>
  //                 {kanji.kanji.character || "N/A"}
  //               </Text>
  //               <View style={styles.kanjiInfo}>
  //                 <Text style={styles.kanjiMeaning}>
  //                   {kanji.kanji.meaning.english}
  //                 </Text>
  //                 <Text style={styles.kanjiReading}>
  //                   On: {kanji.kanji.onyomi.katakana}
  //                 </Text>
  //                 <Text style={styles.kanjiReading}>
  //                   Kun: {kanji.kanji.kunyomi.hiragana}
  //                 </Text>
  //               </View>
  //             </TouchableOpacity>
  //           );
  //         })}
  //       </ScrollView>
  //     ) : (
  //       <Text style={styles.noResults}>
  //         {searchTerm
  //           ? searchTerm.length > 1
  //             ? "Please enter only one kanji character"
  //             : "No kanji found or API error"
  //           : "Search for a kanji character"}
  //       </Text>
  //     )}
  //   </View>
  // );

  const renderListeningTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Japanese News</Text>
      <Text style={styles.tabSubtitle}>
        Read news and practice listening with Text-to-Speech
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : newsResults.length > 0 ? (
        <ScrollView style={styles.resultsContainer}>
          {newsResults.map((newsItem, index) => (
            <View key={index} style={styles.newsCard}>
              <Text style={styles.newsTitle}>{newsItem.title}</Text>
              <Text style={styles.newsDate}>
                {new Date(newsItem.date).toLocaleDateString()}
              </Text>

              {newsItem.image_url && (
                <Image
                  source={{ uri: newsItem.image_url }}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
              )}

              <Text style={styles.newsSummary}>{newsItem.summary}</Text>

              <View style={styles.audioControls}>
                {isSpeaking ? (
                  <TouchableOpacity
                    style={[styles.playButton, styles.stopButton]}
                    onPress={stopPlayback}
                  >
                    <Ionicons name="stop-circle" size={36} color="#ff4444" />
                    <Text style={styles.playText}>Stop</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() =>
                      playTextToSpeech(`${newsItem.title}. ${newsItem.summary}`)
                    }
                  >
                    <Ionicons name="play-circle" size={36} color="#4a86e8" />
                    <Text style={styles.playText}>Listen (TTS)</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResults}>No news available</Text>
      )}
    </View>
  );

  const renderScoreHistory = () => (
    <View style={styles.scoreHistory}>
      <Text style={styles.scoreHistoryTitle}>Your Progress:</Text>
      {sentences.map((_, index) => (
        <View key={index} style={styles.scoreItem}>
          <Text>Sentence {index + 1}:</Text>
          {scores[index] !== undefined ? (
            <Text style={styles.scoreValue}>{scores[index]}%</Text>
          ) : (
            <Text style={styles.notAttempted}>Not attempted</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderSpeakingTab = () => {
    const currentSentence = sentences[currentSentenceIndex];

    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>Pronunciation Practice</Text>
        <Text style={styles.tabSubtitle}>
          Record your voice and get feedback on your pronunciation
        </Text>

        <View style={styles.speakingContainer}>
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>
              Read the following sentence aloud:
            </Text>
            <Text style={styles.sentenceJapanese}>
              {currentSentence.japanese}
            </Text>
            <Text style={styles.sentenceRomaji}>{currentSentence.romaji}</Text>
            <Text style={styles.sentenceEnglish}>
              {currentSentence.english}
            </Text>

            <TouchableOpacity style={styles.nextButton} onPress={nextSentence}>
              <Text style={styles.nextButtonText}>Next Sentence</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recordingControls}>
            {recording ? (
              <TouchableOpacity
                style={[styles.recordButton, styles.stopButton]}
                onPress={stopRecording}
              >
                <MaterialIcons name="stop" size={24} color="white" />
                <Text style={styles.recordButtonText}>Stop Recording</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.recordButton}
                onPress={startRecording}
              >
                <FontAwesome name="microphone" size={24} color="white" />
                <Text style={styles.recordButtonText}>Start Recording</Text>
              </TouchableOpacity>
            )}

            {pronunciationScore !== null && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>Your Pronunciation Score:</Text>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{pronunciationScore}</Text>
                </View>
                <Text style={styles.feedbackText}>
                  {pronunciationScore > 80
                    ? "Excellent! Almost native-like!"
                    : pronunciationScore > 60
                    ? "Good job! Keep practicing!"
                    : "Needs more practice. Try again!"}
                </Text>

                <View style={styles.feedbackDetails}>
                  <View style={styles.feedbackItem}>
                    <Text style={styles.feedbackLabel}>Pitch Accent:</Text>
                    <Text style={styles.feedbackValue}>
                      {pronunciationScore > 70 ? "✓ Good" : "✗ Needs work"}
                    </Text>
                  </View>
                  <View style={styles.feedbackItem}>
                    <Text style={styles.feedbackLabel}>Vowel Length:</Text>
                    <Text style={styles.feedbackValue}>
                      {pronunciationScore > 65 ? "✓ Good" : "✗ Needs work"}
                    </Text>
                  </View>
                  <View style={styles.feedbackItem}>
                    <Text style={styles.feedbackLabel}>Intonation:</Text>
                    <Text style={styles.feedbackValue}>
                      {pronunciationScore > 75 ? "✓ Good" : "✗ Needs work"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Add score history display */}
          {renderScoreHistory()}
        </View>
      </View>
    );
  };
  const renderCategorySelector = () => (
    <View style={styles.categorySelector}>
      <Text style={styles.selectorTitle}>Choose by:</Text>
      <View style={styles.selectorButtons}>
        <Button
          title="Level (N5-N1)"
          onPress={() => setSelectedCategory(null)}
        />
        <Button
          title="Basic (N5-N4)"
          onPress={() => setSelectedCategory("basic")}
        />
        <Button
          title="Intermediate (N3-N2)"
          onPress={() => setSelectedCategory("intermediate")}
        />
        <Button
          title="Advanced (N1)"
          onPress={() => setSelectedCategory("advanced")}
        />
      </View>
    </View>
  );
  const renderGrammarTab = () => {
    const userLevel = user?.preferences?.currentLevel || "N5";

    let category;
    let grammarItems = [];

    if (selectedCategory) {
      // Nếu người dùng đã chọn category cụ thể
      category = selectedCategory;
      grammarItems = grammarData[category] || [];
    } else {
      // Logic cũ tự động chọn theo level
      if (["N5", "N4"].includes(userLevel)) {
        category = "basic";
      } else if (["N3", "N2"].includes(userLevel)) {
        category = "intermediate";
      } else {
        category = "advanced";
      }
      grammarItems =
        grammarData[category]?.filter((item) => item.level === userLevel) || [];
    }

    return (
      <View style={styles.tabContent}>
        {renderCategorySelector()}
        <View style={styles.header}>
          <Text style={styles.title}>Japanese Grammar</Text>
          <Text style={styles.subtitle}>
            Study Japanese grammar patterns and structures
          </Text>
        </View>

        <View style={styles.grammarContentContainer}>
          {grammarItems.map((item, index) => (
            <View key={`${item.title}-${index}`} style={styles.grammarItem}>
              <View style={styles.grammarHeader}>
                <Text style={styles.grammarTitle}>{item.title}</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getLevelColor(item.level).bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: getLevelColor(item.level).text },
                    ]}
                  >
                    {item.level}
                  </Text>
                </View>
              </View>
              <Text style={styles.grammarDescription}>{item.description}</Text>

              {item.examples.map((example, idx) => (
                <View key={idx} style={styles.exampleContainer}>
                  <Text style={styles.exampleJapanese}>{example.japanese}</Text>
                  <Text style={styles.exampleRomaji}>{example.romaji}</Text>
                  <Text style={styles.exampleEnglish}>{example.english}</Text>
                  {example.note && (
                    <Text style={styles.exampleNote}>{example.note}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "N5":
        return { bg: "#e6f7e6", text: "#2e7d32" };
      case "N4":
        return { bg: "#e6f3f7", text: "#1565c0" };
      case "N3":
        return { bg: "#fff8e6", text: "#ff8f00" };
      case "N2":
        return { bg: "#fff1e6", text: "#ef6c00" };
      case "N1":
        return { bg: "#ffebee", text: "#c62828" };
      default:
        return { bg: "#f5f5f5", text: "#424242" };
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "dictionary" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("dictionary")}
        >
          <MaterialIcons
            name="menu-book"
            size={24}
            color={activeTab === "dictionary" ? "#4a86e8" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "dictionary" && styles.activeTabText,
            ]}
          >
            Dictionary
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.tabButton, activeTab === "kanji" && styles.activeTab]}
          onPress={() => setActiveTab("kanji")}
        >
          <MaterialIcons
            name="translate"
            size={24}
            color={activeTab === "kanji" ? "#4a86e8" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "kanji" && styles.activeTabText,
            ]}
          >
            Kanji
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "listening" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("listening")}
        >
          <MaterialIcons
            name="hearing"
            size={24}
            color={activeTab === "listening" ? "#4a86e8" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "listening" && styles.activeTabText,
            ]}
          >
            Listening
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "speaking" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("speaking")}
        >
          <MaterialIcons
            name="mic"
            size={24}
            color={activeTab === "speaking" ? "#4a86e8" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "speaking" && styles.activeTabText,
            ]}
          >
            Speaking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "grammar" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("grammar")}
        >
          <MaterialIcons
            name="library-books"
            size={24}
            color={activeTab === "grammar" ? "#4a86e8" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "grammar" && styles.activeTabText,
            ]}
          >
            Grammar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {activeTab === "dictionary" && renderDictionaryTab()}
        {/* {activeTab === "kanji" && renderKanjiTab()} */}
        {activeTab === "listening" && renderListeningTab()}
        {activeTab === "speaking" && renderSpeakingTab()}
        {activeTab === "grammar" && renderGrammarTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stopButton: {
    backgroundColor: "#ffebee",
    borderColor: "#ff4444",
  },
  audioControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  activeTabText: {
    color: "#4a86e8",
    fontWeight: "600",
  },
  tabContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#4a86e8",
    borderRadius: 8,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginTop: 40,
  },
  resultsContainer: {
    marginTop: 8,
  },
  noResults: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  word: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  reading: {
    fontSize: 16,
    color: "#4a86e8",
    fontStyle: "italic",
  },
  saveButton: {
    marginLeft: 8,
  },
  meaningContainer: {
    marginTop: 8,
  },
  meaningTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  meaningItem: {
    marginBottom: 8,
  },
  meaningText: {
    fontSize: 15,
  },
  partOfSpeech: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
  kanjiCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  kanjiCharacter: {
    fontSize: 40,
    marginRight: 16,
    color: "#333",
  },
  kanjiInfo: {
    flex: 1,
  },
  kanjiMeaning: {
    fontSize: 16,
    marginBottom: 4,
  },
  kanjiReading: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  kanjiLevel: {
    fontSize: 14,
    color: "#4a86e8",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  modalKanji: {
    fontSize: 80,
    textAlign: "center",
    marginVertical: 20,
  },
  modalMeaning: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  modalSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4a86e8",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  strokeImage: {
    width: "100%",
    height: 150,
    marginTop: 10,
  },
  exampleItem: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  exampleJapanese: {
    fontSize: 16,
    fontWeight: "bold",
  },
  exampleReading: {
    fontSize: 14,
    color: "#666",
  },
  exampleMeaning: {
    fontSize: 14,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  tabSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  newsImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  newsSummary: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  audioControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  playText: {
    marginLeft: 8,
    color: "#4a86e8",
  },
  speedControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  speedText: {
    marginRight: 8,
    color: "#666",
  },
  speedButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginLeft: 4,
  },
  speakingContainer: {
    marginTop: 20,
  },
  promptCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promptText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  sentenceJapanese: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sentenceRomaji: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  sentenceEnglish: {
    fontSize: 14,
    color: "#333",
  },
  recordingControls: {
    alignItems: "center",
  },
  recordButton: {
    backgroundColor: "#4a86e8",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: "#e74c3c",
  },
  recordButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
  },
  scoreContainer: {
    alignItems: "center",
    width: "100%",
  },
  scoreTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4a86e8",
  },
  feedbackText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  feedbackDetails: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
  },
  feedbackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feedbackLabel: {
    fontWeight: "bold",
  },
  feedbackValue: {
    color: "#666",
  },
  grammarContentContainer: {
    marginTop: 16,
  },
  grammarItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  grammarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  grammarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  grammarDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exampleJapanese: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  exampleRomaji: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },
  exampleEnglish: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  exampleNote: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
  nextButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#4a86e8",
    borderRadius: 5,
    alignSelf: "center",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  scoreHistory: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  scoreHistoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  scoreValue: {
    fontWeight: "bold",
    color: "#4a86e8",
  },
  notAttempted: {
    color: "#999",
    fontStyle: "italic",
  },
});

export default StudyPage;
