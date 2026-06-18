import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/theme";

const data = [
  { date: "17 Juni 2026", score: 4.1, category: "Tinggi" },
  { date: "16 Juni 2026", score: 2.9, category: "Sedang" },
  { date: "15 Juni 2026", score: 3.5, category: "Sedang" },
];

export default function Responses() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Data Respon</Text>

      {data.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.date}>{item.date}</Text>
          <Text>Skor: {item.score}</Text>
          <Text>Kategori: {item.category}</Text>
        </View>
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.light.primary,
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  date: {
    fontWeight: "700",
    marginBottom: 4,
  },
});