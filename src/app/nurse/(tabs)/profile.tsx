import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Profile() {
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            router.replace("/nurse/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={Colors.light.primary} />
          </View>
          <Text style={styles.name}>Perawat</Text>
          <Text style={styles.email}>perawat@hospital.com</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={20} color={Colors.light.textSecondary} />
            <Text style={styles.infoText}>Perawat</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.light.textSecondary} />
            <Text style={styles.infoText}>Bergabung sejak 2024</Text>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
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
    marginBottom: 20,
    color: Colors.light.primary,
  },
  profileCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  email: {
    color: Colors.light.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    color: Colors.light.text,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#F44336",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
