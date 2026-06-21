import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import Svg, { Circle, Ellipse, Rect } from "react-native-svg";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

export default function HomeScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: theme.rthBackground }]}>
      <View
        style={[
          styles.brandMark,
          isDark
            ? { backgroundColor: theme.rthCardBackground, borderWidth: 1, borderColor: theme.rthBorder }
            : { backgroundColor: theme.rthPrimary, shadowColor: theme.rthPrimary },
        ]}
      >
        <Svg width={34} height={34} viewBox="0 0 34 34" fill="none">
          <Ellipse
            cx={20}
            cy={15.5}
            rx={7}
            ry={12}
            fill={isDark ? theme.rthPrimary : "rgba(255,255,255,0.9)"}
            opacity={isDark ? 0.9 : 1}
            transform="rotate(22 20 15.5)"
          />
          <Ellipse
            cx={14}
            cy={15.5}
            rx={7}
            ry={12}
            fill={isDark ? theme.rthTextMuted : "rgba(255,255,255,0.6)"}
            opacity={isDark ? 0.55 : 1}
            transform="rotate(-22 14 15.5)"
          />
          <Rect
            x={16}
            y={24}
            width={2.5}
            height={7}
            rx={1.25}
            fill={isDark ? theme.rthPrimary : "rgba(255,255,255,0.75)"}
            opacity={isDark ? 0.7 : 1}
          />
        </Svg>
      </View>

      <Text style={[styles.title, { color: isDark ? theme.text : theme.rthPrimary }]}>
        RTH Monitor
      </Text>
      <Text style={[styles.subtitle, { color: theme.rthTextSubtle }]}>
        Monitoring kenyamanan pasien di ruang terbuka hijau
      </Text>

      <View style={styles.hero}>
        <Svg width={172} height={172} viewBox="0 0 200 200">
          <Circle cx={100} cy={100} r={96} fill={isDark ? "#182B1C" : "#CBE8CB"} />
          <Circle cx={152} cy={44} r={20} fill={isDark ? "#1F3624" : "#B0D8B0"} />
          <Circle cx={164} cy={36} r={10} fill={isDark ? "#243C28" : "#C0E0C0"} />
          <Rect x={4} y={135} width={192} height={61} rx={96} fill={isDark ? "#0E1A10" : "#2D6A4F"} />
          <Rect
            x={85}
            y={135}
            width={30}
            height={61}
            rx={15}
            fill={isDark ? "#172619" : "#3A8060"}
            opacity={isDark ? 0.8 : 0.45}
          />

          {/* Tree left */}
          <Rect x={33} y={115} width={11} height={24} rx={5.5} fill={isDark ? "#2D6A4F" : "#1B4332"} />
          <Circle cx={38.5} cy={97} r={21} fill={isDark ? "#2D6A4F" : "#1B4332"} />
          <Circle cx={31} cy={89} r={12} fill={isDark ? "#3A8060" : "#2D6A4F"} />

          {/* Tree center */}
          <Rect x={92.5} y={104} width={15} height={34} rx={7.5} fill={isDark ? "#2D6A4F" : "#1B4332"} />
          <Circle cx={100} cy={73} r={33} fill={isDark ? "#2D6A4F" : "#1B4332"} />
          <Circle cx={86} cy={58} r={18} fill={isDark ? "#3A8060" : "#2D6A4F"} />
          <Circle cx={115} cy={67} r={12} fill={isDark ? "#52B788" : "#2D6A4F"} opacity={isDark ? 0.5 : 1} />

          {/* Tree right */}
          <Rect x={152} y={111} width={11} height={26} rx={5.5} fill={isDark ? "#2D6A4F" : "#1B4332"} />
          <Circle cx={157.5} cy={93} r={22} fill={isDark ? "#2D6A4F" : "#1B4332"} />
          <Circle cx={164} cy={84} r={11} fill={isDark ? "#3A8060" : "#2D6A4F"} />

          {/* Flowers */}
          <Circle cx={62} cy={141} r={4.5} fill="#52B788" opacity={isDark ? 0.65 : undefined} />
          <Circle cx={74} cy={145} r={2.5} fill="#52B788" opacity={isDark ? 0.45 : undefined} />
          <Circle cx={127} cy={141} r={3.5} fill="#52B788" opacity={isDark ? 0.55 : undefined} />
          <Circle cx={139} cy={145} r={2} fill="#52B788" opacity={isDark ? 0.35 : undefined} />
        </Svg>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDark ? theme.rthPrimaryMid : theme.rthPrimary, shadowColor: theme.rthPrimary },
          ]}
          onPress={() => router.push("/questionnaire/intro")}
        >
          <Text style={styles.buttonText}>Pasien</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            styles.buttonOutline,
            {
              backgroundColor: isDark ? "transparent" : theme.rthCardBackground,
              borderColor: isDark ? theme.rthPrimary : theme.rthPrimaryMid,
            },
          ]}
          onPress={() => router.push("/nurse/login")}
        >
          <Text style={[styles.buttonOutlineText, { color: theme.rthPrimary }]}>
            Perawat
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 36,
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 7,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 220,
  },
  hero: {
    marginVertical: 32,
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    height: 54,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  buttonOutline: {
    borderWidth: 1.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
