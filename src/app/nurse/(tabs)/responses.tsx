import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
import { RthCategoryColors, RthCategoryTextColors } from "@/constants/theme";
import { db } from "@/lib/firebase";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const MONTH_ABBR_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const DAY_NAMES_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

interface ResponseRecord {
  id: string;
  average: number;
  category: string;
  createdAt: Timestamp | null;
}

interface Section {
  label: string;
  items: ResponseRecord[];
}

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

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatGroupLabel(date: Date): string {
  const now = new Date();
  if (isSameLocalDay(date, now)) return "Hari ini";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameLocalDay(date, yesterday)) return "Kemarin";

  return `${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatItemTimestamp(date: Date): string {
  const dayName = DAY_NAMES_ID[date.getDay()];
  const month = MONTH_ABBR_ID[date.getMonth()];
  return `${dayName}, ${date.getDate()} ${month} · ${formatTime(date)}`;
}

function sortByDateDesc(records: ResponseRecord[]): ResponseRecord[] {
  return [...records].sort((a, b) => {
    const aTime = a.createdAt?.toMillis() ?? 0;
    const bTime = b.createdAt?.toMillis() ?? 0;
    return bTime - aTime;
  });
}

function buildSections(records: ResponseRecord[]): Section[] {
  const sections: Section[] = [];
  sortByDateDesc(records).forEach((record) => {
    if (!record.createdAt) return;
    const label = formatGroupLabel(record.createdAt.toDate());
    const lastSection = sections[sections.length - 1];
    if (lastSection && lastSection.label === label) {
      lastSection.items.push(record);
    } else {
      sections.push({ label, items: [record] });
    }
  });
  return sections;
}

function filterResponses(records: ResponseRecord[], query: string): ResponseRecord[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return records;

  const numericQuery = Number(trimmed);
  const isNumeric = trimmed !== "" && !Number.isNaN(numericQuery);

  return records.filter((record) => {
    if (record.category.toLowerCase().includes(trimmed)) return true;
    // Skor dicari sebagai rentang (mis. "4" cocok untuk semua average 4.x)
    if (isNumeric) return Math.floor(record.average) === Math.floor(numericQuery);
    return false;
  });
}

export default function Responses() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fetchResponses = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "responses"));
      setResponses(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ResponseRecord),
      );
      setErrorMessage(null);
    } catch {
      setErrorMessage("Gagal memuat data. Tarik ke bawah untuk mencoba lagi.");
    }
  }, []);

  useEffect(() => {
    fetchResponses().finally(() => setLoading(false));
  }, [fetchResponses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResponses();
    setRefreshing(false);
  };

  const sections = useMemo(
    () => buildSections(filterResponses(responses, query)),
    [responses, query],
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: theme.rthBackground }]}
        edges={["top"]}
      >
        <ActivityIndicator color={theme.rthPrimary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: isDark ? "#0B1410" : theme.rthPrimary }]}>
      <SafeAreaView
        edges={["top"]}
        style={isDark && { borderBottomWidth: 1, borderBottomColor: theme.rthBorder }}
      >
        <View style={styles.header}>
          <Text
            style={[styles.headerCount, { color: isDark ? theme.rthPrimary : theme.rthTextMuted }]}
          >
            {responses.length} total responden
          </Text>
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: isDark ? theme.text : "#FFFFFF" }]}>
              Responden
            </Text>
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
        </View>
      </SafeAreaView>

      <View style={[styles.body, { backgroundColor: theme.rthBackground }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.rthPrimary} />
          }
        >
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder },
            ]}
          >
            <Ionicons name="search" size={16} color={theme.rthTextCaption} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cari kategori atau skor..."
              placeholderTextColor={theme.rthTextCaption}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          {errorMessage ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
          ) : null}

          {sections.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {responses.length === 0 ? "Belum ada responden" : "Tidak ditemukan"}
            </Text>
          ) : (
            sections.map((section) => (
              <View key={section.label} style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.rthTextFaint }]}>
                  {section.label}
                </Text>
                <View style={styles.itemsGroup}>
                  {section.items.map((item) => {
                    const categoryKey = getCategoryKey(item.category);
                    const categoryColor = RthCategoryColors[categoryKey];
                    const categoryTextColor = isDark
                      ? RthCategoryTextColors.dark[categoryKey]
                      : RthCategoryTextColors.light[categoryKey];

                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.item,
                          { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder },
                        ]}
                      >
                        <View style={styles.itemMain}>
                          <Text
                            style={[
                              styles.itemScore,
                              { color: isDark ? theme.text : theme.rthPrimary },
                            ]}
                          >
                            {item.average.toFixed(1)}
                          </Text>
                          <Text style={[styles.itemTime, { color: theme.rthTextFaint }]}>
                            {item.createdAt ? formatItemTimestamp(item.createdAt.toDate()) : "-"}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: hexToRgba(categoryColor, isDark ? 0.12 : 0.1) },
                          ]}
                        >
                          <View style={[styles.badgeDot, { backgroundColor: categoryColor }]} />
                          <Text style={[styles.badgeText, { color: categoryTextColor }]}>
                            {item.category}
                          </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={15} color={theme.rthBorder} />
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerCount: {
    fontSize: 11,
    marginBottom: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
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
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },
  searchBar: {
    height: 44,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  errorText: {
    marginBottom: 12,
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 8,
  },
  itemsGroup: {
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemMain: {
    flex: 1,
  },
  itemScore: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  itemTime: {
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: "500",
  },
});
