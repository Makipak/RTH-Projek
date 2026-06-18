import { QUESTIONS } from "@/constants/question";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OPTIONS = [
  { value: 1, label: "Sangat Tidak Setuju" },
  { value: 2, label: "Tidak Setuju" },
  { value: 3, label: "Netral" },
  { value: 4, label: "Setuju" },
  { value: 5, label: "Sangat Setuju" },
];

export default function QuestionScreen() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(QUESTIONS.length).fill(0),
  );

  const progress = useMemo(
    () => ((current + 1) / QUESTIONS.length) * 100,
    [current],
  );

  const selected = answers[current];

  const selectAnswer = (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent((prev) => prev + 1);
      return;
    }

    const total = answers.reduce((a, b) => a + b, 0);
    const average = total / QUESTIONS.length;

    let category = "Sedang";

    if (average <= 2) {
      category = "Rendah";
    } else if (average > 3.5) {
      category = "Tinggi";
    }

    router.push({
      pathname: "/questionnaire/result",
      params: {
        average: average.toFixed(2),
        category,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
      </Pressable>

      <Text style={styles.counter}>
        Pertanyaan {current + 1} dari {QUESTIONS.length}
      </Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.question}>{QUESTIONS[current]}</Text>
      </View>

      {OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.option,
            selected === option.value && styles.selectedOption,
          ]}
          onPress={() => selectAnswer(option.value)}
        >
          <Text>{option.label}</Text>
        </Pressable>
      ))}

      <View style={styles.actions}>
        <Pressable
          disabled={current === 0}
          style={[styles.secondaryButton, current === 0 && { opacity: 0.4 }]}
          onPress={() => setCurrent((prev) => prev - 1)}
        >
          <Text>Kembali</Text>
        </Pressable>

        <Pressable
          disabled={!selected}
          style={[styles.primaryButton, !selected && { opacity: 0.4 }]}
          onPress={nextQuestion}
        >
          <Text style={{ color: "#fff" }}>
            {current === QUESTIONS.length - 1 ? "Selesai" : "Lanjut"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 8,
  },
  counter: {
    marginBottom: 16,
    fontWeight: "600",
  },
  progressContainer: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.light.primary,
  },
  questionCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
  },
  option: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: Colors.light.primary,
    backgroundColor: "#E8F5E9",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
});
