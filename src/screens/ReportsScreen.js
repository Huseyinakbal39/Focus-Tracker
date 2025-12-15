import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllSessions } from '../screens/db/sessionRepo';

export default function ReportsScreen() {
  const [sessions, setSessions] = useState([]);

  const load = async () => {
    const rows = await getAllSessions();
    setSessions(rows);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );
  const screenWidth = Dimensions.get('window').width - 32;
  const stats = useMemo(() => {
  const todayStr = new Date().toISOString().slice(0, 10);

  let todayTotal = 0;
  let allTimeTotal = 0;
  let totalDistractions = 0;

  // --- Son 7 gün listesi (bugün dahil)
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);   // YYYY-MM-DD
    const label = key.slice(5);                 // MM-DD (kısa label)
    days.push({ key, label });
  }

  // Günlük toplamlar
  const dayTotals = {};
  for (const d of days) dayTotals[d.key] = 0;

  // Kategori toplamları (pie için)
  const categoryTotals = {};

  for (const s of sessions) {
    const mins = s.duration_minutes;
    const distractions = s.distractions;
    const day = s.ended_at.slice(0, 10);

    // genel stats
    allTimeTotal += mins;
    totalDistractions += distractions;
    if (day === todayStr) todayTotal += mins;

    // bar: son 7 gün içindeyse
    if (dayTotals[day] !== undefined) {
      dayTotals[day] += mins;
    }

    // pie: kategori bazlı
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + mins;
  }

  const bar = {
    labels: days.map((d) => d.label),
    values: days.map((d) => dayTotals[d.key]),
  };

  const baseColors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30'];

  const pie = Object.entries(categoryTotals).map(([category, minutes], idx) => ({
    name: category,
    minutes,
    color: baseColors[idx % baseColors.length],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  return { todayTotal, allTimeTotal, totalDistractions, bar, pie };
}, [sessions]);

  return (
    <SafeAreaView style={styles.safeArea}>
     <ScrollView
     style={{flex:1}} 
     contentContainerStyle={styles.scrollContent}
     showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Raporlar</Text>

        <View style={styles.statsCard}>
          <Text style={styles.stat}>Bugün Toplam: {stats.todayTotal} dk</Text>
          <Text style={styles.stat}>Tüm Zamanlar: {stats.allTimeTotal} dk</Text>
          <Text style={styles.stat}>Toplam Dikkat Dağınıklığı: {stats.totalDistractions}</Text>
        </View>

        <Text style={styles.sectionTitle}>Seans Geçmişi</Text>

        {sessions.length === 0 ? (
          <Text style={styles.empty}>Henüz kayıt yok. Bir seans başlat</Text>
        ) : (
          sessions.map((item) => (
            <View style={styles.item} key={String(item.id)}>
              <Text style={styles.itemTitle}>{item.category}</Text>
              <Text style={styles.itemSub}>
                Süre: {item.duration_minutes} dk • Dikkat: {item.distractions}
              </Text>
              <Text style={styles.itemDate}>{new Date(item.ended_at).toLocaleString()}</Text>
            </View>
          ))
        )}
        <Text style={styles.sectionTitle}>Son 7 Gün</Text>

        <BarChart
          data={{
            labels: stats.bar.labels,
            datasets: [{ data: stats.bar.values }],
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisSuffix="dk"
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: () => '#666',
            propsForBackgroundLines: { stroke: '#eee' },
          }}
          style={styles.barChart}
        />

        <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>

        {stats.pie.length === 0 ? (
          <Text style={styles.empty}>Henüz veri yok.</Text>
        ) : (
          <PieChart
            data={stats.pie.map((p) => ({
              name: p.name,
              population: p.minutes,
              color: p.color,
              legendFontColor: p.legendFontColor,
              legendFontSize: p.legendFontSize,
            }))}
            width={screenWidth}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            chartConfig={{
              color: () => '#000',
              labelColor: () => '#666',
            }}
            style={styles.pieChart}
          />
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 safeArea: {
  flex: 1,
  backgroundColor: '#f4f4f4' 
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
  fontSize: 22,
  fontWeight: '700',
  marginBottom: 12,
  textAlign: 'center' 
  },
  statsCard: {
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 10,
  marginBottom: 16 
  },
  stat: {
  fontSize: 15,
  fontWeight: '600',
  marginBottom: 4
  },
  sectionTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 8,
  marginTop: 8 
  },
  empty: {
  color: '#666',
  marginTop: 10 
  },
  item: { 
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 10,
  marginBottom: 10 
  },
  itemTitle: {
  fontSize: 16,
  fontWeight: '700' 
  },
  itemSub: { 
  marginTop: 4,
  color: '#444'
  },
  itemDate: {
  marginTop: 4,
  color: '#777',
  fontSize: 12
  },
  barChart: {
  borderRadius: 12,
  marginBottom: 18
  },
  pieChart: {
  borderRadius: 12
  }
});
