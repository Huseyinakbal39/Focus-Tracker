import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Tab = createBottomTabNavigator();

export default function App()
{
    return(
        <NavigationContainer>
            <StatusBar style="auto"/>
            <Tab.Navigator
                screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {

            // ikon belirleme
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'timer' : 'timer-outline'; // Home ikonu
            } 
            else if (route.name === 'Reports') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline'; // Raporlar ikonu
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // ikon renkleri
          tabBarActiveTintColor: '#007AFF', 
          tabBarInactiveTintColor: 'gray',

          // tab bar style
          tabBarStyle: {
            height: 60,
            paddingBottom: 6,
            paddingTop: 6,
          },

          headerShown: false,
        })}
            >
                <Tab.Screen 
                name = "Home"
                component={HomeScreen}
                options={{title: 'Zamanlayıcı'}}
                />
                <Tab.Screen 
                name = "Reports"
                component={ReportsScreen}
                options={{title: 'Raporlar'}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}