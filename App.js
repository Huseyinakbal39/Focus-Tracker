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
            <Tab.Navigator>
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