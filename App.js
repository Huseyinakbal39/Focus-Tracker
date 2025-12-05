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
            
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'timer' : 'timer-outline'; // Timer ikon
            } 
            else if (route.name === 'Reports') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline'; // Graf ikon
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 4,
            height: 60,
          }
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