import { StyleSheet, Text, View } from 'react-native';
export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Raporlar</Text>

      {/* Genel İstatistikler */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Bugün Toplam</Text>
          <Text style={styles.statValue}>{todayTotal} dk</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Tüm Zamanlar</Text>
          <Text style={styles.statValue}>{allTimeTotal} dk</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { flex: 1 }]}>
          <Text style={styles.statLabel}>Toplam Dikkat Dağınıklığı</Text>
          <Text style={styles.statValue}>{totalDistractions}</Text>
        </View>
      </View>

      {/* Son 7 Gün Bar Chart */}
      <Text style={styles.chartTitle}>Son 7 Gün Odaklanma Süresi (dk)</Text>
      <BarChart
        data={{
          labels: last7DaysData.labels,
          datasets: [{ data: last7DaysData.data }],
        }}
        width={screenWidth - 32}
        height={220}
        fromZero
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForBackgroundLines: {
            strokeDasharray: '', // düz çizgi
          },
        }}
        style={styles.chart}
      />

      {/* Kategoriye Göre Pie Chart */}
      <Text style={styles.chartTitle}>Kategorilere Göre Dağılım</Text>
      {categoryData.length > 0 ? (
        <PieChart
          data={categoryData.map((c) => ({
            name: c.name,
            population: c.minutes,
            color: c.color,
            legendFontColor: c.legendFontColor,
            legendFontSize: c.legendFontSize,
          }))}
          width={screenWidth - 32}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>
          Henüz kategori verisi yok. Önce birkaç seans başlat 🙂
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f3f7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  placeholderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 14,
    color: '#555',
  },
});