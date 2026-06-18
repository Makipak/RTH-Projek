import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Colors } from "@/constants/theme";

export default function ResultScreen() {
  const { average, category } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hasil Penilaian</Text>

      <View style={styles.card}>
        <Text style={styles.score}>{average}</Text>

        <Text style={styles.label}>Kategori</Text>

        <Text style={styles.category}>
          {String(category).toUpperCase()}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>
          Kembali ke Beranda
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  score: {
    fontSize: 42,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  label: {
    marginTop: 12,
    color: Colors.light.textSecondary,
  },
  category: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  button: {
    marginTop: 24,
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