import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { QUESTIONS } from "@/constants/questions";
import { db } from "@/lib/firebase";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const SCALE_OPTIONS = [1, 2, 3, 4, 5];
const SWIPE_THRESHOLD = 60;
const DISABLED_BUTTON_BACKGROUND_LIGHT = "#D9EDD9";

function getCategory(average: number): string {
  if (average < 1.8) return "Sangat Rendah";
  if (average < 2.6) return "Rendah";
  if (average < 3.4) return "Sedang";
  if (average < 4.2) return "Tinggi";
  return "Sangat Tinggi";
}

export default function QuestionnaireForm() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(QUESTIONS.length).fill(0),
  );
  const [submitting, setSubmitting] = useState(false);

  const isLast = current === QUESTIONS.length - 1;
  const selected = answers[current];
  const isAnswered = selected > 0;
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  const selectAnswer = (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const submit = async () => {
    const total = answers.reduce((a, b) => a + b, 0);
    const average = total / QUESTIONS.length;
    const category = getCategory(average);

    setSubmitting(true);
    try {
      await addDoc(collection(db, "responses"), {
        answers,
        totalScore: total,
        average,
        category,
        createdAt: serverTimestamp(),
      });
    } catch {
      setSubmitting(false);
      Alert.alert(
        "Gagal menyimpan",
        "Jawaban Anda belum tersimpan. Periksa koneksi internet Anda dan coba lagi.",
      );
      return;
    }
    setSubmitting(false);

    router.push({
      pathname: "/questionnaire/result",
      params: {
        total: String(total),
        average: average.toFixed(2),
        category,
      },
    });
  };

  const goNext = () => {
    if (!isAnswered || submitting) return;
    if (isLast) {
      submit();
      return;
    }
    setCurrent((prev) => prev + 1);
  };

  const goBack = () => {
    if (current === 0) {
      router.back();
      return;
    }
    setCurrent((prev) => prev - 1);
  };

  const swipeBack = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      "worklet";
      if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(goNext)();
      } else if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(swipeBack)();
      }
    });

  const buttonColor = isAnswered
    ? scheme === "dark"
      ? theme.rthPrimaryMid
      : theme.rthPrimary
    : scheme === "dark"
      ? theme.rthCardBackground
      : DISABLED_BUTTON_BACKGROUND_LIGHT;
  const buttonTextColor = isAnswered ? "#FFFFFF" : theme.rthTextCaption;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.rthBackground }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={22} color={theme.rthPrimary} />
          </Pressable>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.rthBorder }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: theme.rthPrimary },
            ]}
          />
        </View>

        <Text style={[styles.progressLabel, { color: theme.rthTextFaint }]}>
          Pertanyaan {current + 1} dari {QUESTIONS.length}
        </Text>

        <GestureDetector gesture={pan}>
          <View style={styles.questionZone}>
            <Text style={[styles.question, { color: theme.text }]}>
              {QUESTIONS[current].text}
            </Text>
          </View>
        </GestureDetector>

        <View style={styles.scaleSection}>
          <View style={styles.optionsRow}>
            {SCALE_OPTIONS.map((value) => {
              const isSelected = selected === value;
              return (
                <Pressable
                  key={value}
                  style={[
                    styles.pill,
                    isSelected
                      ? {
                          backgroundColor:
                            scheme === "dark" ? theme.rthPrimaryMid : theme.rthPrimary,
                          borderColor: theme.rthPrimary,
                        }
                      : {
                          backgroundColor: theme.rthCardBackground,
                          borderColor: theme.rthBorder,
                        },
                  ]}
                  onPress={() => selectAnswer(value)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      {
                        color: isSelected ? "#FFFFFF" : theme.rthTextFaint,
                        fontWeight: isSelected ? "600" : "500",
                      },
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.captionRow}>
            <Text style={[styles.captionText, { color: theme.rthTextCaption }]}>
              Tidak nyaman
            </Text>
            <Text style={[styles.captionText, { color: theme.rthTextCaption }]}>
              Sangat nyaman
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            disabled={!isAnswered || submitting}
            style={[
              styles.primaryButton,
              { backgroundColor: buttonColor },
              !isAnswered &&
                scheme === "dark" && { borderWidth: 1.5, borderColor: theme.rthBorder },
            ]}
            onPress={goNext}
          >
            {submitting ? (
              <ActivityIndicator color={buttonTextColor} />
            ) : (
              <>
                <Text style={[styles.primaryButtonText, { color: buttonTextColor }]}>
                  {isLast ? "Submit" : "Lanjut"}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={buttonTextColor} />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    marginTop: 36,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  progressFill: {
    height: "100%",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    paddingHorizontal: 18,
    paddingTop: 9,
  },
  questionZone: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  question: {
    fontSize: 21,
    fontWeight: "500",
    lineHeight: 30,
  },
  scaleSection: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 7,
  },
  pill: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 16,
  },
  captionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  captionText: {
    fontSize: 9.5,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
  },
  primaryButton: {
    height: 54,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  primaryButtonText: {
    fontWeight: "500",
    fontSize: 16,
  },
});
