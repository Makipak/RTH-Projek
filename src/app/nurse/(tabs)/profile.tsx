import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

function getInitials(email: string | null | undefined): string {
  if (!email) return "??";
  const localPart = email.split("@")[0];
  return localPart.slice(0, 2).toUpperCase();
}

export default function Profile() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const email = auth.currentUser?.email;
  const initials = getInitials(email);

  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? "#0B1410" : theme.rthPrimary }]}>
      <SafeAreaView
        edges={["top"]}
        style={isDark && { borderBottomWidth: 1, borderBottomColor: theme.rthBorder }}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View
              style={[
                styles.bellButton,
                { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.1)" },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color={isDark ? theme.rthTextMuted : "#FFFFFF"}
              />
              <View style={styles.bellDot} />
            </View>
          </View>

          <View
            style={[
              styles.avatar,
              isDark
                ? { backgroundColor: "rgba(82,183,136,0.15)", borderColor: "rgba(82,183,136,0.3)" }
                : { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" },
            ]}
          >
            <Text style={[styles.avatarText, { color: isDark ? theme.rthPrimary : "#FFFFFF" }]}>
              {initials}
            </Text>
          </View>

          <Text style={[styles.email, { color: isDark ? theme.rthPrimary : theme.rthTextMuted }]}>
            {email ?? "-"}
          </Text>
        </View>
      </SafeAreaView>

      <View style={[styles.body, { backgroundColor: theme.rthBackground }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.rthTextSubtle, borderBottomColor: theme.rthBorder }]}>
              Info akun
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.rthTextCaption }]}>EMAIL</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{email ?? "-"}</Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.logoutButton,
              isDark
                ? { backgroundColor: "#1A0E0E", borderColor: "#7f1d1d" }
                : { backgroundColor: "#FFFBFB", borderColor: "#FCA5A5" },
            ]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={17} color={isDark ? "#f87171" : theme.error} />
            <Text style={[styles.logoutText, { color: isDark ? "#f87171" : theme.error }]}>
              Keluar
            </Text>
          </Pressable>

          <Text style={[styles.versionText, { color: theme.rthTextCaption }]}>v1.0.0</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 32,
    alignItems: "center",
  },
  headerTopRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 12,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 0.5,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
  },
  logoutButton: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "500",
  },
  versionText: {
    fontSize: 11,
    textAlign: "center",
    paddingVertical: 16,
  },
});
