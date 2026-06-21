import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { db } from "@/lib/firebase";
import { QUESTIONS } from "@/constants/questions";
import { RthCategoryColors, RthCategoryTextColors } from "@/constants/theme";
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
const WEEKDAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

interface ResponseRecord {
  id: string;
  answers: number[];
  totalScore: number;
  average: number;
  category: string;
  createdAt: Timestamp | null;
}

type PickerTarget = "from" | "to" | null;

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

function getCategory(averageScore: number): string {
  if (averageScore < 1.8) return "Sangat Rendah";
  if (averageScore < 2.6) return "Rendah";
  if (averageScore < 3.4) return "Sedang";
  if (averageScore < 4.2) return "Tinggi";
  return "Sangat Tinggi";
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isWithinRange(date: Date, from: Date, to: Date): boolean {
  const d = stripTime(date).getTime();
  return d >= stripTime(from).getTime() && d <= stripTime(to).getTime();
}

function formatShortDate(date: Date): string {
  return `${date.getDate()} ${MONTH_ABBR_ID[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatDateForCsv(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function escapeCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsv(records: ResponseRecord[]): string {
  const header = [
    "Tanggal", "Waktu", "Total Skor", "Rata-rata", "Kategori",
    ...QUESTIONS.map((_, index) => `Q${index + 1}`),
  ];
  const rows = records.map((record) => {
    const date = record.createdAt?.toDate() ?? null;
    return [
      date ? formatDateForCsv(date) : "",
      date ? formatTime(date) : "",
      String(record.totalScore),
      record.average.toFixed(2),
      record.category,
      ...record.answers.map(String),
    ];
  });
  return [header, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
}

function buildReportHtml(periodLabel: string, totalPengisian: number, rataRata: number, tertinggi: number, terendah: number): string {
  return `
    <html>
      <body style="font-family: -apple-system, Helvetica, sans-serif; padding: 32px; color: #132213;">
        <h1 style="color: #1B4332; font-size: 22px; margin-bottom: 4px;">RTH Monitor — Laporan Kuesioner</h1>
        <p style="color: #6B8F6B; font-size: 13px; margin-top: 0;">Periode: ${periodLabel}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #CDE5CD;">Total Pengisian</td>
            <td style="padding: 10px; border: 1px solid #CDE5CD; font-weight: 600;">${totalPengisian}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #CDE5CD;">Rata-rata Skor</td>
            <td style="padding: 10px; border: 1px solid #CDE5CD; font-weight: 600;">${rataRata.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #CDE5CD;">Skor Tertinggi</td>
            <td style="padding: 10px; border: 1px solid #CDE5CD; font-weight: 600;">${tertinggi.toFixed(1)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #CDE5CD;">Skor Terendah</td>
            <td style="padding: 10px; border: 1px solid #CDE5CD; font-weight: 600;">${terendah.toFixed(1)}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function getMonthMatrix(monthDate: Date): (Date | null)[][] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

interface SummaryCellProps {
  label: string;
  value: string;
  valueColor: string;
  suffix?: string;
  suffixColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

function SummaryCell({ label, value, valueColor, suffix, suffixColor, icon, style }: SummaryCellProps) {
  const theme = useTheme();
  return (
    <View style={[styles.summaryCell, style]}>
      <Text style={[styles.summaryLabel, { color: theme.rthTextSubtle }]}>{label}</Text>
      <View style={styles.summaryValueRow}>
        <Text style={[styles.summaryValue, { color: valueColor }]}>{value}</Text>
        {icon ? <Ionicons name={icon} size={14} color={valueColor} /> : null}
        {suffix ? (
          <Text style={[styles.summarySuffix, { color: suffixColor ?? valueColor }]}>{suffix}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default function Reports() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const today = useMemo(() => stripTime(new Date()), []);
  const [dateFrom, setDateFrom] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return stripTime(d);
  });
  const [dateTo, setDateTo] = useState<Date>(today);

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(today);

  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

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

  const filtered = useMemo(
    () =>
      responses.filter(
        (record) => record.createdAt && isWithinRange(record.createdAt.toDate(), dateFrom, dateTo),
      ),
    [responses, dateFrom, dateTo],
  );

  const totalPengisian = filtered.length;
  const averages = filtered.map((record) => record.average);
  const rataRata = average(averages);
  const skorTertinggi = averages.length ? Math.max(...averages) : 0;
  const skorTerendah = averages.length ? Math.min(...averages) : 0;
  const rataRataCategoryKey = getCategoryKey(getCategory(rataRata));
  const hasData = totalPengisian > 0;

  const openPicker = (target: "from" | "to") => {
    setCalendarMonth(target === "from" ? dateFrom : dateTo);
    setPickerTarget(target);
  };

  const shiftMonth = (delta: number) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const selectDay = (day: Date) => {
    if (pickerTarget === "from") {
      setDateFrom(day);
      if (day.getTime() > dateTo.getTime()) setDateTo(day);
    } else if (pickerTarget === "to") {
      setDateTo(day);
      if (day.getTime() < dateFrom.getTime()) setDateFrom(day);
    }
    setPickerTarget(null);
  };

  const exportPdf = async () => {
    if (!hasData || exportingPdf) return;
    setExportingPdf(true);
    try {
      const periodLabel = `${formatShortDate(dateFrom)} – ${formatShortDate(dateTo)}`;
      const html = buildReportHtml(periodLabel, totalPengisian, rataRata, skorTertinggi, skorTerendah);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch {
      setErrorMessage("Gagal membuat PDF. Coba lagi.");
    } finally {
      setExportingPdf(false);
    }
  };

  const exportExcel = async () => {
    if (!hasData || exportingExcel) return;
    setExportingExcel(true);
    try {
      const csv = buildCsv(filtered);
      const fileUri = `${FileSystem.cacheDirectory}laporan-rth-monitor.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch {
      setErrorMessage("Gagal membuat file Excel. Coba lagi.");
    } finally {
      setExportingExcel(false);
    }
  };

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

  const now = new Date();
  const monthYearLabel = `${MONTH_NAMES_ID[now.getMonth()]} ${now.getFullYear()}`;
  const weeks = getMonthMatrix(calendarMonth);
  const selectedDay = pickerTarget === "from" ? dateFrom : dateTo;

  return (
    <View style={[styles.root, { backgroundColor: isDark ? "#0B1410" : theme.rthPrimary }]}>
      <SafeAreaView
        edges={["top"]}
        style={isDark && { borderBottomWidth: 1, borderBottomColor: theme.rthBorder }}
      >
        <View style={styles.header}>
          <Text style={[styles.headerCaption, { color: isDark ? theme.rthPrimary : theme.rthTextMuted }]}>
            {monthYearLabel}
          </Text>
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: isDark ? theme.text : "#FFFFFF" }]}>
              Laporan
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
          {errorMessage ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
          ) : null}

          {/* CARD: PERIODE */}
          <View
            style={[styles.card, { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder }]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Periode</Text>
            <View style={styles.periodRow}>
              <Pressable
                style={[styles.periodBox, { backgroundColor: theme.rthBackground, borderColor: theme.rthBorder }]}
                onPress={() => openPicker("from")}
              >
                <View>
                  <Text style={[styles.periodLabel, { color: theme.rthTextSubtle }]}>DARI</Text>
                  <Text style={[styles.periodValue, { color: theme.text }]}>
                    {formatShortDate(dateFrom)}
                  </Text>
                </View>
                <Ionicons name="calendar-outline" size={14} color={theme.rthTextFaint} />
              </Pressable>

              <Ionicons name="arrow-forward" size={16} color={theme.rthTextFaint} />

              <Pressable
                style={[styles.periodBox, { backgroundColor: theme.rthBackground, borderColor: theme.rthBorder }]}
                onPress={() => openPicker("to")}
              >
                <View>
                  <Text style={[styles.periodLabel, { color: theme.rthTextSubtle }]}>SAMPAI</Text>
                  <Text style={[styles.periodValue, { color: theme.text }]}>
                    {formatShortDate(dateTo)}
                  </Text>
                </View>
                <Ionicons name="calendar-outline" size={14} color={theme.rthTextFaint} />
              </Pressable>
            </View>
          </View>

          {/* CARD: RINGKASAN */}
          <View
            style={[styles.card, { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder }]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Ringkasan</Text>
            <View style={[styles.summaryGrid, { backgroundColor: theme.rthBorder }]}>
              <View style={styles.summaryRow}>
                <SummaryCell
                  label="Total pengisian"
                  value={String(totalPengisian)}
                  valueColor={isDark ? theme.text : theme.rthPrimary}
                  style={[styles.summaryCellRight, { backgroundColor: theme.rthCardBackground }]}
                />
                <SummaryCell
                  label="Rata-rata skor"
                  value={rataRata.toFixed(2)}
                  valueColor={RthCategoryColors[rataRataCategoryKey]}
                  suffix={hasData ? getCategory(rataRata) : undefined}
                  suffixColor={
                    isDark
                      ? RthCategoryTextColors.dark[rataRataCategoryKey]
                      : RthCategoryTextColors.light[rataRataCategoryKey]
                  }
                  style={{ backgroundColor: theme.rthCardBackground }}
                />
              </View>
              <View style={styles.summaryRow}>
                <SummaryCell
                  label="Skor tertinggi"
                  value={skorTertinggi.toFixed(1)}
                  icon="caret-up"
                  valueColor={
                    isDark ? RthCategoryTextColors.dark.sangatTinggi : RthCategoryColors.sangatTinggi
                  }
                  style={[
                    styles.summaryCellRight,
                    styles.summaryCellBottom,
                    { backgroundColor: theme.rthCardBackground },
                  ]}
                />
                <SummaryCell
                  label="Skor terendah"
                  value={skorTerendah.toFixed(1)}
                  icon="caret-down"
                  valueColor={
                    isDark ? RthCategoryTextColors.dark.sangatRendah : RthCategoryColors.sangatRendah
                  }
                  style={[styles.summaryCellBottom, { backgroundColor: theme.rthCardBackground }]}
                />
              </View>
            </View>
          </View>

          {/* CARD: EKSPOR */}
          <View
            style={[
              styles.card,
              styles.exportCard,
              { backgroundColor: theme.rthCardBackground, borderColor: theme.rthBorder },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Ekspor data</Text>

            <Pressable
              disabled={!hasData || exportingPdf}
              style={[
                styles.pdfButton,
                { backgroundColor: isDark ? theme.rthPrimaryMid : theme.rthPrimary },
                (!hasData || exportingPdf) && styles.buttonDisabled,
              ]}
              onPress={exportPdf}
            >
              {exportingPdf ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.pdfButtonText}>Ekspor PDF</Text>
                </>
              )}
            </Pressable>

            <Pressable
              disabled={!hasData || exportingExcel}
              style={[
                styles.excelButton,
                { borderColor: theme.rthPrimaryMid },
                (!hasData || exportingExcel) && styles.buttonDisabled,
              ]}
              onPress={exportExcel}
            >
              {exportingExcel ? (
                <ActivityIndicator color={theme.rthPrimaryMid} />
              ) : (
                <>
                  <Ionicons name="grid-outline" size={18} color={theme.rthPrimaryMid} />
                  <Text style={[styles.excelButtonText, { color: theme.rthPrimaryMid }]}>
                    Ekspor Excel
                  </Text>
                </>
              )}
            </Pressable>

            {!hasData ? (
              <Text style={[styles.exportHint, { color: theme.rthTextSubtle }]}>
                Tidak ada data untuk diekspor
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </View>

      {/* BOTTOM SHEET: DATE PICKER */}
      <Modal
        visible={pickerTarget !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerTarget(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerTarget(null)} />
        <View style={[styles.sheet, { backgroundColor: theme.rthCardBackground }]}>
          <View style={[styles.sheetHandle, { backgroundColor: theme.rthBorder }]} />
          <Text style={[styles.sheetTitle, { color: theme.text }]}>
            Pilih tanggal {pickerTarget === "from" ? "mulai" : "akhir"}
          </Text>

          <View style={styles.monthNav}>
            <Pressable onPress={() => shiftMonth(-1)} style={styles.monthNavButton}>
              <Ionicons name="chevron-back" size={18} color={theme.rthPrimary} />
            </Pressable>
            <Text style={[styles.monthNavLabel, { color: theme.text }]}>
              {MONTH_NAMES_ID[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
            </Text>
            <Pressable onPress={() => shiftMonth(1)} style={styles.monthNavButton}>
              <Ionicons name="chevron-forward" size={18} color={theme.rthPrimary} />
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label) => (
              <Text key={label} style={[styles.weekdayLabel, { color: theme.rthTextFaint }]}>
                {label}
              </Text>
            ))}
          </View>

          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <View key={dayIndex} style={styles.dayCell} />;
                }
                const isFuture = day.getTime() > today.getTime();
                const isSelected = day.getTime() === selectedDay.getTime();
                return (
                  <Pressable
                    key={dayIndex}
                    disabled={isFuture}
                    onPress={() => selectDay(day)}
                    style={[
                      styles.dayCell,
                      styles.dayCellButton,
                      isSelected && { backgroundColor: theme.rthPrimary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCellText,
                        {
                          color: isSelected
                            ? "#FFFFFF"
                            : isFuture
                              ? theme.rthTextCaption
                              : theme.text,
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </Modal>
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
  headerCaption: {
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
    gap: 10,
  },
  errorText: {
    fontSize: 13,
  },
  card: {
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  exportCard: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "500",
    marginBottom: 12,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  periodBox: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  periodLabel: {
    fontSize: 9.5,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryGrid: {
    borderRadius: 8,
    overflow: "hidden",
    gap: 1,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 1,
  },
  summaryCell: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  summaryCellRight: {},
  summaryCellBottom: {},
  summaryLabel: {
    fontSize: 9.5,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  summaryValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.6,
    lineHeight: 28,
  },
  summarySuffix: {
    fontSize: 10.5,
    fontWeight: "500",
    marginBottom: 3,
  },
  pdfButton: {
    height: 52,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginBottom: 10,
  },
  pdfButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  excelButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  excelButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  exportHint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 28,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthNavButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellButton: {
    borderRadius: 999,
  },
  dayCellText: {
    fontSize: 13,
  },
});
