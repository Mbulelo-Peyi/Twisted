import { Platform } from 'react-native';
import  { FontAwesome, Ionicons } from '@expo/vector-icons/';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AuthNavigation from './AuthNavigation';
import CommunityNavigation from './CommunityNavigation';
import HomeNavigation from './HomeNavigation';
import SearchPage from '../screens/content/SearchPage';
import { ChatList } from '../screens/content';

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: Platform.OS === "ios"? 81:54,
        backgroundColor: '#000',
    }
}

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen 
            name='DrawerHome'
            component={HomeNavigation}
            options={{
                tabBarIcon: ({ focused, color }) =>{
                    return (
                        focused?<Ionicons size={24} name="home" color={color} />:<Ionicons size={24} name="home-outline" color={color} />
                    )
                }
            }}
            />
            <Tab.Screen 
            name='DrawerChat'
            component={ChatList}
            options={{
                tabBarIcon: ({ focused, color }) =>{
                    return (
                        focused?<Ionicons size={24} name="chatbubble" color={color} />:<Ionicons size={24} name="chatbubble-outline" color={color} />
                    )
                }
            }}
            />
            <Tab.Screen 
            name='SearchScreen'
            screenOptions={{
                headerShown:false,
            }}
            component={SearchPage}
            options={{
                tabBarIcon: ({ focused, color }) =>{
                    return (
                        !focused?<Ionicons size={24} name="search" color={color} />:<Ionicons size={24} name="search-outline" color={"#fff"} />
                    )
                }
            }}
            />
            <Tab.Screen 
            name='CommunityPath'
            component={CommunityNavigation}
            options={{
                tabBarIcon: ({ focused, color }) =>{
                    return (
                        focused?<FontAwesome size={24} name="group" color={color} />:<FontAwesome size={24} name="group" color={color} />
                    )
                }
            }}
            />
            <Tab.Screen 
            name='BottomAuth'
            component={AuthNavigation}
            options={{
                tabBarIcon: ({ focused, color }) =>{
                    return (
                        focused?<FontAwesome size={24} name="user" color={color} />:<FontAwesome size={24} name="user-circle-o" color={color} />
                    )
                }
            }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation