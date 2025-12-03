import { StyleSheet, Text, View } from 'react-native';


export default function HomeScreen()
{
    return(
        <View styles={styles.container}>
            <Text style={styles.text}>Home Screen çalışıyor</Text>
        </View>
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
        fontSize:20,
        fontWeight: '600',
    },
    
});