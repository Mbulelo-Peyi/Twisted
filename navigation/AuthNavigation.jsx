import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    AccountSettings,
    Complaint,
    DeleteAccount,
    Faq,
    Login,
    PasswordChange,
    Profile,
    Register,
    ResetPassword,
    Settings,

} from '../screens/user';

const Stack = createNativeStackNavigator()

const AuthNavigation = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown:false,
        }}
        initialRouteName='Login'
        >
            <Stack.Screen 
            name='Login' 
            screenOptions={{
                headerShown:false,
            }}
            component={Login} />
            <Stack.Screen 
            name='Register' 
            screenOptions={{
                headerShown:false,
            }}
            component={Register} />
            <Stack.Screen 
            name='faq' 
            screenOptions={{
                headerShown:false,
            }}
            component={Faq} />
            <Stack.Screen 
            name='account-settings' 
            screenOptions={{
                headerShown:false,
            }}
            component={AccountSettings} />
            <Stack.Screen 
            name='complaint' 
            screenOptions={{
                headerShown:false,
            }}
            component={Complaint} />
            <Stack.Screen 
            name='delete-account' 
            screenOptions={{
                headerShown:false,
            }}
            component={DeleteAccount} />
            <Stack.Screen 
            name='profile' 
            screenOptions={{
                headerShown:false,
            }}
            component={Profile} />
            <Stack.Screen 
            name='password-change' 
            screenOptions={{
                headerShown:false,
            }}
            component={PasswordChange} />
            <Stack.Screen 
            name='password-reset' 
            screenOptions={{
                headerShown:false,
            }}
            component={ResetPassword} />
            <Stack.Screen 
            name='settings' 
            screenOptions={{
                headerShown:false,
            }}
            component={Settings} />
        </Stack.Navigator>
    )
}

export default AuthNavigation;