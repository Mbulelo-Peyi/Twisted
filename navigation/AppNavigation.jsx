import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';
import { AuthProvider } from '../context/AuthContext';
import ToastProvider from '../context/toast/ToastProvider';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <AuthProvider>
                <ToastProvider>
                    <Stack.Navigator
                    screenOptions={{headerShown:false}}
                    initialRouteName='Main'
                    >
                        <Stack.Screen name="Main" component={DrawerNavigation} />
                    </Stack.Navigator>
                </ToastProvider>
            </AuthProvider>
        </NavigationContainer>
    )
}

export default AppNavigation