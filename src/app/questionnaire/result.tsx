import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import {
  RthCategoryColors,
  RthCategoryTextColors,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const RING_RADIUS = 74;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_STROKE_WIDTH = 11;

const CATEGORY_MESSAGES: Record<string, string> = {
  "Sangat Rendah":
    "Kami turut prihatin. Mohon sampaikan kondisi Anda kepada perawat agar dapat segera ditindak lanjuti.",
  Rendah:
    "Kenyamanan Anda masih perlu ditingkatkan. Terima kasih atas masukan jujur Anda.",
  Sedang: "Kenyamanan Anda cukup baik. Terima kasih telah mengisi kuesioner ini.",
  Tinggi: "Senang mendengar Anda merasa nyaman di ruang terbuka hijau ini.",
  "Sangat Tinggi":
    "Luar biasa! Senang mengetahui Anda sangat nyaman di ruang terbuka hijau ini.",
};

function getCategoryKey(category: string): keyof typeof RthCategoryColors {
  switch (category) {
    case "Sangat Rendah":
      return "sangatRendah";
    case "Rendah":
      return "rendah";
    case "Tinggi":
      return "tinggi";
    case "Sangat Tinggi":
      return "sangatTinggi";
    default:
      return "sedang";
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "");
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ResultScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const { average, category } = useLocalSearchParams<{
    total?: string;
    average?: string;
    category?: string;
  }>();

  const categoryLabel = category ?? "Sedang";
  const categoryKey = getCategoryKey(categoryLabel);
  const categoryColor = RthCategoryColors[categoryKey];
  const categoryTextColor =
    scheme === "dark"
      ? RthCategoryTextColors.dark[categoryKey]
      : RthCategoryTextColors.light[categoryKey];
  const message = CATEGORY_MESSAGES[categoryLabel] ?? CATEGORY_MESSAGES.Sedang;

  const averageValue = Number(average ?? 0);
  const ringFilled = Math.max(
    0,
    Math.min(RING_CIRCUMFERENCE, (averageValue / 5) * RING_CIRCUMFERENCE),
  );
  const ringGap = RING_CIRCUMFERENCE - ringFilled;

  const isDark = scheme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: theme.rthBackground }]}>
      <View style={styles.hero}>
        <View
          style={[
            styles.checkCircle,
            {
              backgroundColor: isDark ? "#1A2C1E" : "#E8F5E0",
              borderColor: theme.rthBorder,
            },
          ]}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 12l5 5L20 7"
              stroke={theme.rthPrimary}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Svg width={180} height={180} viewBox="0 0 200 200">
          <Circle
            cx={100}
            cy={100}
            r={RING_RADIUS}
            fill="none"
            stroke={theme.rthBorder}
            strokeWidth={RING_STROKE_WIDTH}
          />
          <Circle
            cx={100}
            cy={100}
            r={RING_RADIUS}
            fill="none"
            stroke={categoryColor}
            strokeWidth={RING_STROKE_WIDTH}
            strokeDasharray={`${ringFilled} ${ringGap}`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <SvgText
            x={100}
            y={93}
            textAnchor="middle"
            fontSize={50}
            fontWeight="600"
            fill={theme.text}
          >
            {averageValue.toFixed(1)}
          </SvgText>
          <SvgText
            x={100}
            y={118}
            textAnchor="middle"
            fontSize={13}
            fill={theme.rthTextFaint}
          >
            dari 5
          </SvgText>
        </Svg>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: hexToRgba(categoryColor, isDark ? 0.12 : 0.1),
              borderColor: hexToRgba(categoryColor, isDark ? 0.22 : 0.25),
            },
          ]}
        >
          <View style={[styles.badgeDot, { backgroundColor: categoryColor }]} />
          <Text style={[styles.badgeText, { color: categoryTextColor }]}>
            {categoryLabel}
          </Text>
        </View>

        <Text style={[styles.message, { color: theme.rthTextFaint }]}>
          {message}
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDark ? theme.rthPrimaryMid : theme.rthPrimary },
          ]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Selesai</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  checkCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  badge: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 14,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  message: {
    marginTop: 12,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 240,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  button: {
    height: 54,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
