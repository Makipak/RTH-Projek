import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/theme";

export default function Reports() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
      <Text style={styles.title}>Laporan</Text>

      <View style={styles.card}>
        <Text>Total Respon: 152</Text>
        <Text>Rata-rata: 3.87</Text>
        <Text>Dominan: Sedang</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Export PDF</Text>
      </Pressable>
      </View>
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
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.light.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});