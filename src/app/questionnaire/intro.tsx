import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const ICON_WHITE = "#FFFFFF";

export default function QuestionnaireIntro() {
  const theme = useTheme();
  const scheme = useColorScheme();

  // Exception: layar intro pakai card sedikit beda dari card biasa
  // (#FFFFFF) di light mode — di dark mode ikut token card standar.
  const infoCardBackground = scheme === "dark" ? theme.rthCardBackground : "#F5F7F5";

  return (
    <View style={[styles.container, { backgroundColor: theme.rthBackground }]}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 19l-7-7 7-7"
            stroke={theme.rthPrimary}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <View style={styles.content}>
        <View
          style={[
            styles.iconMark,
            scheme === "dark"
              ? { backgroundColor: theme.rthCardBackground, borderWidth: 1, borderColor: theme.rthBorder }
              : { backgroundColor: theme.rthPrimary, shadowColor: theme.rthPrimary },
          ]}
        >
          <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <Rect
              x={6}
              y={4}
              width={20}
              height={24}
              rx={3}
              fill={scheme === "dark" ? "rgba(82,183,136,0.12)" : "rgba(255,255,255,0.15)"}
              stroke={scheme === "dark" ? theme.rthPrimary : "rgba(255,255,255,0.5)"}
              strokeWidth={1.5}
              opacity={scheme === "dark" ? 0.7 : 1}
            />
            <Path
              d="M11 11h10M11 16h10M11 21h6"
              stroke={scheme === "dark" ? theme.rthPrimary : ICON_WHITE}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <Text style={[styles.title, { color: scheme === "dark" ? theme.text : theme.rthPrimary }]}>
          Kuesioner Kenyamanan RTH
        </Text>

        <Text style={[styles.subtitle, { color: theme.rthTextSubtle }]}>
          Terima kasih telah bersedia meluangkan waktu. Jawaban Anda sangat
          berarti bagi kami.
        </Text>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: infoCardBackground, borderColor: theme.rthBorder },
          ]}
        >
          <View
            style={[
              styles.infoRow,
              styles.infoRowDivider,
              { borderBottomColor: theme.rthBorder },
            ]}
          >
            <View style={styles.infoRowLeft}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                  stroke={theme.rthTextSubtle}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
                <Rect
                  x={9}
                  y={3}
                  width={6}
                  height={4}
                  rx={1}
                  stroke={theme.rthTextSubtle}
                  strokeWidth={1.5}
                />
                <Path
                  d="M9 12h6M9 16h4"
                  stroke={theme.rthTextSubtle}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={[styles.infoRowLabel, { color: theme.rthTextSubtle }]}>
                Jumlah pertanyaan
              </Text>
            </View>
            <Text style={[styles.infoRowValue, { color: theme.rthPrimary }]}>15</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx={12}
                  cy={12}
                  r={9}
                  stroke={theme.rthTextSubtle}
                  strokeWidth={1.5}
                />
                <Path
                  d="M12 7v5l3 3"
                  stroke={theme.rthTextSubtle}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={[styles.infoRowLabel, { color: theme.rthTextSubtle }]}>
                Estimasi waktu
              </Text>
            </View>
            <Text style={[styles.infoRowValue, { color: theme.rthPrimary }]}>
              2–3 menit
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.ctaButton,
            {
              backgroundColor: scheme === "dark" ? theme.rthPrimaryMid : theme.rthPrimary,
              shadowColor: theme.rthPrimary,
            },
          ]}
          onPress={() => router.push("/questionnaire/form")}
        >
          <Text style={styles.ctaButtonText}>Mulai kuesioner</Text>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M3 8h10M9 4.5l3.5 3.5L9 11.5"
              stroke={ICON_WHITE}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 40,
    marginLeft: 4,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingBottom: 48,
  },
  iconMark: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
    maxWidth: 248,
  },
  infoCard: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 4,
    marginBottom: 36,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  infoRowDivider: {
    borderBottomWidth: 1,
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoRowLabel: {
    fontSize: 13.5,
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  ctaButton: {
    width: "100%",
    height: 54,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: ICON_WHITE,
  },
});
