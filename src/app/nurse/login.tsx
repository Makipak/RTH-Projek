import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/theme";

export default function NurseLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (
      username.trim().toLowerCase() === "perawat" &&
      password === "123456"
    ) {
      router.replace("/nurse/dashboard");
      return;
    }

    Alert.alert(
      "Login Gagal",
      "Username atau password yang Anda masukkan salah."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login Perawat</Text>

        <Text style={styles.subtitle}>
          Silakan masuk untuk melihat dashboard dan laporan hasil kuesioner.
        </Text>

        <TextInput
          placeholder="Masukkan Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Masukkan Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Masuk</Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            Kembali ke Halaman Utama
          </Text>
        </Pressable>

        {/* Hapus bagian ini nanti jika sudah pakai Firebase */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Akun Demo</Text>
          <Text style={styles.demoText}>
            Username: perawat
          </Text>
          <Text style={styles.demoText}>
            Password: 123456
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 24,
    borderRadius: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.light.primary,
  },

  subtitle: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },

  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  backButton: {
    marginTop: 16,
    alignItems: "center",
  },

  backText: {
    color: Colors.light.textSecondary,
  },

  demoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#E8F5E9",
  },

  demoTitle: {
    fontWeight: "700",
    color: Colors.light.primary,
    marginBottom: 8,
  },

  demoText: {
    color: Colors.light.text,
  },
});