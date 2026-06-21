import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/lib/firebase";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const INPUT_BACKGROUND_LIGHT = "#FAFCFA";
const ERROR_BACKGROUND_LIGHT = "#FFF8F8";
const ERROR_BACKGROUND_DARK = "#1A0E0E";
const ERROR_COLOR_DARK = "#f87171";
const ERROR_MESSAGE = "Email atau password salah.";

export default function NurseLoginScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;
  const errorColor = isDark ? ERROR_COLOR_DARK : theme.error;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setHasError(false);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/nurse/dashboard");
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputBoxStyle = [
    styles.inputBox,
    {
      borderColor: hasError ? errorColor : theme.rthBorder,
      backgroundColor: hasError
        ? isDark
          ? ERROR_BACKGROUND_DARK
          : ERROR_BACKGROUND_LIGHT
        : isDark
          ? theme.rthBackground
          : INPUT_BACKGROUND_LIGHT,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.rthBackground }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.header,
          isDark
            ? {
                backgroundColor: "#0B1410",
                borderBottomWidth: 1,
                borderBottomColor: theme.rthBorder,
              }
            : { backgroundColor: theme.rthPrimary },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? theme.rthPrimary : theme.rthTextMuted}
          />
        </Pressable>

        <View style={styles.logoWrap}>
          <View
            style={[
              styles.logoBadge,
              isDark
                ? { backgroundColor: "rgba(255,255,255,0.06)", borderColor: theme.rthBorder }
                : {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(255,255,255,0.15)",
                  },
            ]}
          >
            <Ionicons name="leaf" size={28} color={isDark ? theme.rthPrimary : "#FFFFFF"} />
          </View>
          <Text style={[styles.logoTitle, { color: isDark ? theme.text : "#FFFFFF" }]}>
            RTH Monitor
          </Text>
          <Text
            style={[
              styles.logoSubtitle,
              { color: isDark ? theme.rthPrimary : theme.rthTextMuted },
            ]}
          >
            Portal perawat
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.rthCardBackground }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Masuk ke akun</Text>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: theme.rthTextSubtle }]}>EMAIL</Text>
          <View style={inputBoxStyle}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="nama@rumahsakit.com"
              placeholderTextColor={theme.rthTextCaption}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              style={[styles.input, { color: theme.text }]}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: theme.rthTextSubtle }]}>PASSWORD</Text>
          <View style={inputBoxStyle}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={theme.rthTextCaption}
              secureTextEntry={!showPassword}
              editable={!loading}
              style={[styles.input, { color: theme.text }]}
            />
            <Pressable onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={hasError ? errorColor : theme.rthTextCaption}
              />
            </Pressable>
          </View>
        </View>

        {hasError ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={13} color={errorColor} />
            <Text style={[styles.errorText, { color: errorColor }]}>{ERROR_MESSAGE}</Text>
          </View>
        ) : null}

        <Pressable
          disabled={!canSubmit}
          style={[
            styles.button,
            { backgroundColor: isDark ? theme.rthPrimaryMid : theme.rthPrimary },
            !canSubmit && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 14,
    paddingBottom: 54,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoWrap: {
    alignItems: "center",
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  logoSubtitle: {
    fontSize: 11.5,
  },
  card: {
    flex: 1,
    marginTop: -22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 26,
    paddingTop: 26,
    paddingBottom: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 22,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  inputBox: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
  },
  button: {
    height: 54,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
