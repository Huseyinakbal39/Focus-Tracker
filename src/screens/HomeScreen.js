import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { insertSession } from '../screens/db/sessionRepo';

const DEFAULT_MINUTES = 25;
export default function HomeScreen()
{
  const [selectedCategory, setSelectedCategory] = useState('Ders Çalışma');
  const [isRunning, setIsRunning] = useState(false);
  const [durationMinutes , setDurationMinutes] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES*60);
  const [distractionCount, setDistractionCount] = useState(0);
  const [lastSummary, setLastSummary] = useState(null);

  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const sessionStartIsoRef = useRef(null);
  const handleStart = () => {
  if (isRunning) return; // zaten çalışıyorsa tekrar başlatma
  if (secondsLeft <= 0) setSecondsLeft(durationMinutes * 60);

  if (!sessionStartIsoRef.current) {
      sessionStartIsoRef.current = new Date().toISOString();
    }

    setIsRunning(true);
  };


    const handleStop = async() => {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      await handleSessionEnd(secondsLeft,false);
    };


        const handleReset = () => {
      // Sayaç çalışıyorsa durdur
      setIsRunning(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Seans iptal edildi → DB'ye kayıt YOK
      setSecondsLeft(durationMinutes * 60);
      setDistractionCount(0);
      sessionStartIsoRef.current = null;

      setLastSummary(null);
    };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0'); // ✅ % olmalı
    return `${m}:${s}`;
  };


  useEffect(() => {
  if (!isRunning) return;

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  intervalRef.current = setInterval(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        handleSessionEnd(0);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [isRunning]);


    // AppState ile dikkat dağınıklığı takibi
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/background|inactive/) &&
        isRunning
      ) {
        // Odaklanma sırasında arka plana geçti → dikkat dağınıklığı
        setDistractionCount((prev) => prev + 1);
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        Alert.alert(
          'Dikkat Dağınıklığı',
          'Uygulamadan çıktığın için sayaç duraklatıldı.'
        );
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning]);

  const handleSessionEnd = async (remainingSeconds, resetAfterSave = true) => {
  const plannedSeconds = durationMinutes * 60;
  const actualSeconds = plannedSeconds - remainingSeconds;
  const actualMinutes = Math.max(1, Math.round(actualSeconds / 60));

  const startedAt = sessionStartIsoRef.current ?? new Date().toISOString();
  const endedAt = new Date().toISOString();

  const summary = {
    durationMinutes: actualMinutes,
    category: selectedCategory,
    distractions: distractionCount,
    startedAt,
    endedAt,
  };

  setLastSummary(summary);

    try {
      await insertSession({
        startedAt,
        endedAt,
        durationMinutes: actualMinutes,
        category: selectedCategory,
        distractions: distractionCount,
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Hata', 'Seans veritabanına kaydedilemedi.');
    }

      if (resetAfterSave) {
        setDistractionCount(0);
        setSecondsLeft(durationMinutes * 60);
        sessionStartIsoRef.current = null;
      }
    };

    const changeDuration = (delta) => {
      if (isRunning) return; // çalışırken değiştirmeyelim

      setDurationMinutes((prev) => {
        const next = Math.min(60, Math.max(1, prev + delta)); // 1-60 dk arası
        // eğer seans başlamamışsa / duruyorsa ekranı da güncelle
        setSecondsLeft(next * 60);
        return next;
      });
    };

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <Text style={styles.appTitle}>Focus Tracker</Text>
                <Text style={styles.text}>Odaklanmaya başlayın</Text>

                {/* Category Card */}
                <View style={styles.card}>
                    <Text style={styles.pickerTitle}>Kategori seçiniz</Text>
                    <View style={styles.pickerView}>
                        <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(value) =>setSelectedCategory(value)}
                        >
                            <Picker.Item label = "Ders Çalışma" value="Ders Çalışma" />
                            <Picker.Item label = "Kitap" value="Kitap" />
                            <Picker.Item label = "Spor" value="Spor" />
                        </Picker>
                    </View>
                </View>

                {/* Timer */}
                <View style={styles.timerWrapper}>
                    <View style={styles.timerCircle}>
                        <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                    </View>
                    <View style={styles.durationRow}>
                      <TouchableOpacity
                        style={[styles.durationBtn, isRunning && styles.durationBtnDisabled]}
                        onPress={() => changeDuration(-1)}
                        disabled={isRunning}
                      >
                        <Text style={styles.durationBtnText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.durationText}>{durationMinutes} dk</Text>

                      <TouchableOpacity
                        style={[styles.durationBtn, isRunning && styles.durationBtnDisabled]}
                        onPress={() => changeDuration(+1)}
                        disabled={isRunning}
                      >
                        <Text style={styles.durationBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.timerHint}>Süre ayarlanabilir (1–60 dk)</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    {
                        isRunning ? (
                            <TouchableOpacity
                                style={[styles.button,styles.pauseButton]}
                                onPress={handleStop}
                        
                            >
                                <Text style={styles.pauseButtonText}>Durdur</Text>
                            </TouchableOpacity>

                        ) : (
                            <TouchableOpacity
                                style={[styles.button,styles.startButton]}
                                onPress={handleStart}
                        
                            >
                            <Text style={styles.startButtonText}>Başlat</Text>
                            </TouchableOpacity>
                        )
                    }
                    

                    <TouchableOpacity
                        style={[styles.button,styles.resetButton]}
                        onPress={handleReset}
                        
                    >
                        <Text style={styles.resetButtonText}>Sıfırla</Text>
                    </TouchableOpacity>
                </View>
                  {/* Özet */}
                {lastSummary && (
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Seans Özeti</Text>

                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Kategori</Text>
                      <Text style={styles.summaryValue}>{lastSummary.category}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Süre</Text>
                      <Text style={styles.summaryValue}>{lastSummary.durationMinutes} dk</Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Dikkat Dağınıklığı</Text>
                      <Text style={styles.summaryValue}>{lastSummary.distractions}</Text>
                    </View>
                  </View>
                )}



            </View>
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
    },
    text:{
        fontSize:15,
        fontWeight: '600',
    },
    appTitle:{
        fontSize:26,
        fontWeight:'700',
        textAlign:'center',
        marginBottom:4,
    },
    safeArea:{
        flex:1,
        backgroundColor: '#f2f3f7',
    },
    card:{

    },
    pickerTitle:{

    },
    pickerView:{
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        overflow: 'hidden',
    },
    timerWrapper:{
        alignItems: 'center',
        marginVertical: 8,
    },
    timerCircle:{
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 6,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    timerText:{
        fontSize: 42,
        fontWeight: '700',
    },
    timerHint:{
        marginTop: 8,
        fontSize: 12,
        color: '#666',
    },
    buttonRow:{
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 8,
    },
    button:{
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 10,
        alignItems: 'center',
    },
    startButton:{
        backgroundColor: '#007AFF',
    },
    startButtonText:{
        color: '#fff',
        fontWeight: '600',
    },
    pauseButton:{
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    pauseButtonText:{
        color: '#007AFF',
        fontWeight: '600',
    },
    resetButton:{
        backgroundColor: '#f2f3f7',
    },
    resetButtonText:{
        color: '#333',
        fontWeight: '500',
    },
    infoLabel: {
    fontSize: 12,
    color: '#777',
  },
  infoValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryCard: {
  marginTop: 16,
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 14,
  borderWidth: 1,
  borderColor: '#eee',
},
summaryTitle: {
  fontSize: 16,
  fontWeight: '800',
  marginBottom: 10,
},
summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 6,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
},
summaryLabel: {
  color: '#666',
  fontWeight: '600',
},
summaryValue: {
  fontWeight: '800',
  color: '#111',
},
  durationRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginTop: 10,
},
durationBtn: {
  width: 44,
  height: 44,
  borderRadius: 12,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#ddd',
},
durationBtnDisabled: {
  opacity: 0.5,
},
durationBtnText: {
  fontSize: 22,
  fontWeight: '800',
},
durationText: {
  fontSize: 16,
  fontWeight: '800',
},
});