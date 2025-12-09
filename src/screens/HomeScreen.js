import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_MINUTES = 25;
export default function HomeScreen()
{
    const [selectedCategory, setSelectedCategory] = useState('Ders Çalışma');
    const [isRunning, setIsRunning] = useState(false);
    const [durationMinutes , setDurationMinutes] = useState(DEFAULT_MINUTES);
    const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES*60);
    const [distractionCount, setDistractionCount] = useState(0);

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
                    <TouchableOpacity
                        style={[styles.button,styles.startButton]}
                        onPress={handleStart}
                        
                    >
                        <Text style={styles.startButtonText}>Başlat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button,styles.pauseButton]}
                        onPress={handlePause}
                        
                    >
                        <Text style={styles.pauseButtonText}>Durdur</Text>
                    </TouchableOpacity>

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
    
});