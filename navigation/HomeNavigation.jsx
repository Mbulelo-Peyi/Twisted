import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    Chat, 
    ChatList, 
    FriendsList, 
    FollowersList, 
    Homepage, 
    PostDetail, 
    SearchPage, 

} from '../screens/content';

const Stack = createNativeStackNavigator()

const HomeNavigation = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown:false,
        }}
        initialRouteName='home'
        >
            
            <Stack.Screen 
            name='home' 
            screenOptions={{
                headerShown:false,
            }}
            component={Homepage} />
            <Stack.Screen 
            name='chat' 
            screenOptions={{
                headerShown:false,
            }}
            component={Chat} />
            <Stack.Screen 
            name='chats' 
            screenOptions={{
                headerShown:false,
            }}
            component={ChatList} />
            <Stack.Screen 
            name='post' 
            screenOptions={{
                headerShown:false,
            }}
            component={PostDetail} />
            <Stack.Screen 
            name='friends' 
            screenOptions={{
                headerShown:false,
            }}
            component={FriendsList} />
            <Stack.Screen 
            name='followers' 
            screenOptions={{
                headerShown:false,
            }}
            component={FollowersList} />
            <Stack.Screen 
            name='search' 
            screenOptions={{
                headerShown:false,
            }}
            component={SearchPage} />
        </Stack.Navigator>
    )
}

export default HomeNavigation;