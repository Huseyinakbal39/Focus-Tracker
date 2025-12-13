import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addSession } from '../storage/sessionStorage';

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

    const handleStart = () => {
        if(secondsLeft === 0){
            setSecondsLeft(durationMinutes *60);
        }
    };

    const handlePause = () =>{
        setIsRunning(false);
    };

    const handleReset = () =>{
        setIsRunning(false);
        setSecondsLeft(durationMinutes *60);
        setDistractionCount(0);
    }

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds/60)
         .toString()
         .padStart(2,'0');
        const s = (totalSeconds & 60).toString().padStart(2,'0');
        return `${m}:${s}`;
    };


    useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleSessionEnd(prev);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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

  const handleSessionEnd = async (remainingSeconds) => {
    const totalPlanned = durationMinutes * 60;
    const actualSeconds = totalPlanned - remainingSeconds;
    const actualMinutes = Math.max(1, Math.round(actualSeconds / 60));

    const summary = {
      durationMinutes: actualMinutes,
      category: selectedCategory,
      distractions: distractionCount,
      date: new Date().toISOString(),
    };

    setLastSummary(summary);

    await addSession({
      id: Date.now().toString(),
      date: summary.date,
      durationMinutes: summary.durationMinutes,
      category: summary.category,
      distractions: summary.distractions,
    });

    Alert.alert(
      'Seans Tamamlandı',
      `Kategori: ${summary.category}\nSüre: ${summary.durationMinutes} dk\nDikkat Dağınıklığı: ${summary.distractions}`
    );

    setDistractionCount(0);
    setSecondsLeft(durationMinutes * 60);
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
                    <Text style={styles.timerHint}>
                        Varsayılan süre: {durationMinutes} dakika
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    {
                        isRunning ? (
                            <TouchableOpacity
                                style={[styles.button,styles.pauseButton]}
                                onPress={handlePause}
                        
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
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    marginTop: 2,
  },
    
});