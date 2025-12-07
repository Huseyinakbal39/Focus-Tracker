import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Raporlar</Text>
        <Text style={styles.subtitle}>
          Odaklanma istatistiklerin burada görünecek. 📊
        </Text>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>Henüz veri yok</Text>
          <Text style={styles.placeholderText}>
            Ana ekrandan bir odaklanma seansı başlat, tamamlandığında burada
            grafikler ve istatistikler oluşmaya başlayacak.
          </Text>
        </View>
      </View>
    </SafeAreaView>
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