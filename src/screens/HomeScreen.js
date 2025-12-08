import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_MINUTES = 25;
export default function HomeScreen()
{
    const [selectedCategory, setSelectedCategory] = useState('Ders Çalışma');
    const [isRunning, setIsRunning] = useState(false);
    const [durationMinutes , setDurationMinutes] = useState(DEFAULT_MINUTES);
    const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES*60);
    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>


                <Text style={styles.appTitle}>Focus Tracker</Text>
                <Text style={styles.text}>Odaklanmaya başlayın</Text>

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


                {/*<View style={styles.timerWrapper}>
                    <View style={styles.timerCircle}>
                        <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                    </View>
                    <Text style={styles.timerHint}>
                        Varsayılan süre: {durationMinutes} dakika
                    </Text>
                </View>*/}


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
    
});