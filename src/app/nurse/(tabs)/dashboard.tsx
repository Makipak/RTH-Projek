import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
import { RthCategoryColors } from "@/constants/theme";
import { db } from "@/lib/firebase";
import { useTheme } from "@/hooks/use-theme";

const screenWidth = Dimensions.get("window").width;
const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

interface ResponseRecord {
  average: number;
  category: string;
  createdAt: Timestamp | null;
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

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function buildLast7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    days.push(day);
  }
  return days;
}

export default function Dashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchResponses = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "responses"));
      setResponses(snapshot.docs.map((doc) => doc.data() as ResponseRecord));
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

  const totalResponden = responses.length;
  const averageScore = average(responses.map((response) => response.average));

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    responses.forEach((response) => {
      counts[response.category] = (counts[response.category] ?? 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({
      value: count,
      color: RthCategoryColors[getCategoryKey(category)],
      text: category,
    }));
  }, [responses]);

  const trendData = useMemo(() => {
    const days = buildLast7Days();
    return days.map((day) => {
      const key = dateKey(day);
      const count = responses.filter(
        (response) => response.createdAt && dateKey(response.createdAt.toDate()) === key,
      ).length;
      return {
        value: count,
        label: DAY_LABELS[day.getDay()],
        frontColor: theme.rthPrimary,
        labelTextStyle: { color: theme.textSecondary, fontSize: 10 },
      };
    });
  }, [responses, theme.rthPrimary, theme.textSecondary]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, styles.loadingContainer, { backgroundColor: theme.rthBackground }]}
        edges={["top"]}
      >
        <ActivityIndicator color={theme.rthPrimary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.rthBackground }]} edges={["top"]}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.rthPrimary} />
        }
      >
        <Text style={[styles.title, { color: theme.rthPrimary }]}>Dashboard Perawat</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>RTH Questionnaire</Text>

        {errorMessage ? (
          <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
        ) : null}

        {/* STATS */}
        <View style={styles.row}>
          <View style={[styles.card, { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder }]}>
            <Text style={[styles.value, { color: theme.rthPrimary }]}>{totalResponden}</Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Total Responden</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder }]}>
            <Text style={[styles.value, { color: theme.rthPrimary }]}>{averageScore.toFixed(2)}</Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Rata-rata Skor</Text>
          </View>
        </View>

        {/* DONUT CHART */}
        <View style={[styles.section, { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Kategori Responden</Text>
          {categoryData.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Belum ada data.</Text>
          ) : (
            <>
              <View style={styles.chartCenter}>
                <PieChart
                  data={categoryData}
                  donut
                  radius={80}
                  innerRadius={50}
                  innerCircleColor={theme.rthCardBackground}
                  centerLabelComponent={() => (
                    <Text style={[styles.donutCenterText, { color: theme.rthPrimary }]}>
                      {totalResponden}
                    </Text>
                  )}
                />
              </View>
              <View style={styles.legend}>
                {categoryData.map((item) => (
                  <View key={item.text} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.legendText, { color: theme.text }]}>
                      {item.text} ({item.value})
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* BAR CHART */}
        <View style={[styles.section, { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Tren 7 Hari Terakhir</Text>
          <BarChart
            data={trendData}
            width={screenWidth - 96}
            height={160}
            barWidth={22}
            spacing={18}
            barBorderRadius={4}
            yAxisThickness={0}
            xAxisColor={theme.rthBorder}
            noOfSections={4}
            yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 12,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {},
  section: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
  },
  chartCenter: {
    alignItems: "center",
    marginVertical: 8,
  },
  donutCenterText: {
    fontSize: 20,
    fontWeight: "700",
  },
  legend: {
    marginTop: 12,
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
  },
});
