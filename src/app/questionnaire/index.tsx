import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/theme";

export default function QuestionnaireIntro() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RTH Questionnaire</Text>

      <Text style={styles.description}>
        Terima kasih telah berpartisipasi dalam penelitian ini.
      </Text>

      <View style={styles.card}>
        <Text>Jumlah Pertanyaan : 15</Text>
        <Text>Estimasi Waktu : 2-3 Menit</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/questionnaire/question")}
      >
        <Text style={styles.buttonText}>Mulai Kuesioner</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.light.primary,
  },
  description: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});