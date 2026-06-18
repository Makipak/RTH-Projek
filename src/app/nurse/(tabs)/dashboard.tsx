import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/theme";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartData = [
  {
    name: "Tinggi",
    population: 35,
    color: "#4CAF50",
    legendFontColor: Colors.light.text,
  },
  {
    name: "Sedang",
    population: 50,
    color: "#FFC107",
    legendFontColor: Colors.light.text,
  },
  {
    name: "Rendah",
    population: 15,
    color: "#F44336",
    legendFontColor: Colors.light.text,
  },
];

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Perawat</Text>
      <Text style={styles.subtitle}>RTH Questionnaire</Text>

      {/* STATS */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.value}>152</Text>
          <Text style={styles.label}>Total Respon</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.value}>3.87</Text>
          <Text style={styles.label}>Rata-rata</Text>
        </View>
      </View>

      {/* PIE CHART */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategori Responden</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* INSIGHT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insight</Text>
        <Text>
          Mayoritas pasien berada pada kategori SEDANG
        </Text>
      </View>
      </ScrollView>
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
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 16,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  label: {
    color: Colors.light.textSecondary,
  },
  section: {
    marginTop: 16,
    backgroundColor: Colors.light.backgroundElement,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
});