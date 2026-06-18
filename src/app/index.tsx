import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RTH Questionnaire</Text>

        <Text style={styles.subtitle}>
          Analisis Monitoring Tingkat Hospitalisasi Pasien
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Pilih Peran</Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/questionnaire")}
      >
        <Ionicons
          name="person"
          size={40}
          color={Colors.light.primary}
        />

        <Text style={styles.cardTitle}>Pasien</Text>

        <Text style={styles.cardDescription}>
          Isi kuesioner untuk membantu penelitian.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/nurse/login")}
      >
        <Ionicons
          name="medical"
          size={40}
          color={Colors.light.primary}
        />

        <Text style={styles.cardTitle}>Perawat</Text>

        <Text style={styles.cardDescription}>
          Login untuk melihat dashboard dan laporan.
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 24,
    justifyContent: "center",
  },

  header: {
    marginBottom: 40,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.light.primary,
  },

  subtitle: {
    marginTop: 8,
    textAlign: "center",
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  cardTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
  },

  cardDescription: {
    marginTop: 8,
    textAlign: "center",
    color: Colors.light.textSecondary,
  },
});